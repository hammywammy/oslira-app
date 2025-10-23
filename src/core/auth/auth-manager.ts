// src/core/auth/auth-manager.ts

/**
 * AUTH MANAGER (Singleton)
 * 
 * Central source of truth for authentication state
 * Lives outside React - survives re-renders
 * 
 * Features:
 * - Token storage in localStorage
 * - Auto-refresh expired access tokens
 * - Race-condition safe (promise lock)
 * - Provides getAccessToken() to HTTP client
 * 
 * Flow:
 * 1. Initialize on app load (load from localStorage)
 * 2. HTTP client calls getAccessToken() before each request
 * 3. If token expired → auto-refresh → return new token
 * 4. If refresh fails → clear auth → return null
 */

import { env } from './environment';

// =============================================================================
// TYPES
// =============================================================================

interface UserData {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  onboarding_completed: boolean;
}

interface AccountData {
  id: string;
  name: string;
  credit_balance: number;
}

// =============================================================================
// STORAGE KEYS
// =============================================================================

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'oslira_access_token',
  REFRESH_TOKEN: 'oslira_refresh_token',
  EXPIRES_AT: 'oslira_expires_at',
  USER: 'oslira_user',
  ACCOUNT: 'oslira_account',
} as const;

// =============================================================================
// AUTH MANAGER
// =============================================================================

class AuthManager {
  private static instance: AuthManager;

  // Token state
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private expiresAt: number | null = null;

  // User state
  private user: UserData | null = null;
  private account: AccountData | null = null;

  // Race-condition protection
  private refreshPromise: Promise<boolean> | null = null;

  // Event listeners for auth state changes
  private listeners: Set<() => void> = new Set();

  private constructor() {
    this.loadFromStorage();
  }

  /**
   * Get singleton instance
   */
  static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager();
    }
    return AuthManager.instance;
  }

  // ===========================================================================
  // INITIALIZATION
  // ===========================================================================

  /**
   * Load tokens and user data from localStorage
   */
  private loadFromStorage(): void {
    try {
      this.accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      this.refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

      const expiresAtStr = localStorage.getItem(STORAGE_KEYS.EXPIRES_AT);
      this.expiresAt = expiresAtStr ? parseInt(expiresAtStr, 10) : null;

      const userStr = localStorage.getItem(STORAGE_KEYS.USER);
      this.user = userStr ? JSON.parse(userStr) : null;

      const accountStr = localStorage.getItem(STORAGE_KEYS.ACCOUNT);
      this.account = accountStr ? JSON.parse(accountStr) : null;
    } catch (error) {
      console.error('[AuthManager] Failed to load from storage:', error);
      this.clear();
    }
  }

  // ===========================================================================
  // TOKEN MANAGEMENT
  // ===========================================================================

  /**
   * Get valid access token (auto-refreshes if expired)
   * This is the primary method called by HTTP client
   */
  async getAccessToken(): Promise<string | null> {
    // No refresh token = not authenticated
    if (!this.refreshToken) {
      return null;
    }

    // Token still valid? Return it
    if (this.accessToken && this.expiresAt && Date.now() < this.expiresAt) {
      return this.accessToken;
    }

    // Token expired - refresh it
    const refreshed = await this.refresh();
    return refreshed ? this.accessToken : null;
  }

  /**
   * Refresh access token (race-condition safe)
   */
  private async refresh(): Promise<boolean> {
    // If refresh already in progress, wait for it
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    // Start new refresh
    this.refreshPromise = this._doRefresh();
    const result = await this.refreshPromise;
    this.refreshPromise = null; // Reset lock

    return result;
  }

  /**
   * Actually perform the refresh API call
   */
  private async _doRefresh(): Promise<boolean> {
    if (!this.refreshToken) {
      return false;
    }

    try {
      const response = await fetch(`${env.apiUrl}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });

      if (!response.ok) {
        console.warn('[AuthManager] Refresh failed:', response.status);
        this.clear();
        return false;
      }

      const data = await response.json();

      // Store new tokens
      this.setTokens(
        data.accessToken,
        data.refreshToken,
        data.expiresAt
      );

      return true;
    } catch (error) {
      console.error('[AuthManager] Refresh error:', error);
      this.clear();
      return false;
    }
  }

  /**
   * Store tokens after login or refresh
   */
  setTokens(accessToken: string, refreshToken: string, expiresAt: number): void {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.expiresAt = expiresAt;

    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    localStorage.setItem(STORAGE_KEYS.EXPIRES_AT, expiresAt.toString());

    this.notifyListeners();
  }

  // ===========================================================================
  // USER MANAGEMENT
  // ===========================================================================

  /**
   * Store user and account data after login
   */
  setUser(user: UserData, account: AccountData): void {
    this.user = user;
    this.account = account;

    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEYS.ACCOUNT, JSON.stringify(account));

    this.notifyListeners();
  }

  /**
   * Update onboarding completion status
   */
  updateOnboardingStatus(completed: boolean): void {
    if (this.user) {
      this.user.onboarding_completed = completed;
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(this.user));
      this.notifyListeners();
    }
  }

  /**
   * Get current user
   */
  getUser(): UserData | null {
    return this.user;
  }

  /**
   * Get current account
   */
  getAccount(): AccountData | null {
    return this.account;
  }

  // ===========================================================================
  // AUTH STATE
  // ===========================================================================

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.refreshToken;
  }

  /**
   * Check if onboarding is completed
   */
  isOnboardingCompleted(): boolean {
    return this.user?.onboarding_completed ?? false;
  }

  // ===========================================================================
  // LOGOUT
  // ===========================================================================

  /**
   * Clear all auth data (logout)
   */
  clear(): void {
    this.accessToken = null;
    this.refreshToken = null;
    this.expiresAt = null;
    this.user = null;
    this.account = null;

    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.EXPIRES_AT);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.ACCOUNT);

    this.notifyListeners();
  }

  /**
   * Logout (call backend + clear local state)
   */
  async logout(): Promise<void> {
    if (this.refreshToken) {
      try {
        await fetch(`${env.apiUrl}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken: this.refreshToken }),
        });
      } catch (error) {
        console.error('[AuthManager] Logout error:', error);
      }
    }

    this.clear();
  }

  // ===========================================================================
  // EVENT LISTENERS (for React re-renders)
  // ===========================================================================

  /**
   * Subscribe to auth state changes
   */
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);

    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Notify all listeners of state change
   */
  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener());
  }
}

// Export singleton instance
export const authManager = AuthManager.getInstance();
