// src/core/auth/auth-manager.ts

/**
 * AUTH MANAGER (Singleton) - INDUSTRY STANDARD (2025)
 * 
 * ARCHITECTURE:
 * Central source of truth for authentication state
 * Lives outside React - survives re-renders and page refreshes
 * 
 * RESPONSIBILITIES:
 * - Token storage in localStorage
 * - Auto-refresh expired access tokens
 * - Provide getAccessToken() to HTTP client
 * - Manage user/account data cache
 * - Emit state changes to React (via subscribers)
 * 
 * TOKEN REFRESH FLOW:
 * 1. HTTP client calls getAccessToken()
 * 2. Check if access token is expired
 * 3. If expired → call /api/auth/refresh with refresh token
 * 4. Store new tokens from response
 * 5. Return new access token to HTTP client
 * 
 * RACE CONDITION PROTECTION:
 * - Uses promise lock to prevent multiple simultaneous refreshes
 * - If refresh in progress, subsequent calls wait for same promise
 * - Ensures only one /refresh call happens at a time
 * 
 * INITIALIZATION:
 * - Loads tokens from localStorage on creation
 * - AuthProvider calls /refresh to rehydrate session on app load
 * - This pattern matches Auth0, Clerk, WorkOS
 * 
 * REFERENCES:
 * - Auth0 SDK: Similar singleton pattern
 * - Clerk SDK: Similar token management
 * - OWASP 2025: localStorage acceptable for SPA tokens
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

interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
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
   * Called on instantiation (app load)
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

      console.log('[AuthManager] Loaded from storage:', {
        hasAccessToken: !!this.accessToken,
        hasRefreshToken: !!this.refreshToken,
        hasUser: !!this.user,
        expiresAt: this.expiresAt ? new Date(this.expiresAt).toISOString() : null
      });
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
   * 
   * This is the primary method called by HTTP client before each request
   * 
   * FLOW:
   * 1. Check if we have a refresh token (if not, user not authenticated)
   * 2. Check if access token is still valid (compare timestamp)
   * 3. If valid → return it
   * 4. If expired → call refresh() → return new token
   * 5. If refresh fails → return null (HTTP client will redirect to login)
   */
  async getAccessToken(): Promise<string | null> {
    // No refresh token = not authenticated
    if (!this.refreshToken) {
      console.log('[AuthManager] No refresh token, user not authenticated');
      return null;
    }

    // Token still valid? Return it
    if (this.accessToken && this.expiresAt && Date.now() < this.expiresAt) {
      return this.accessToken;
    }

    console.log('[AuthManager] Access token expired, attempting refresh');

    // Token expired - refresh it
    const refreshed = await this.refresh();
    return refreshed ? this.accessToken : null;
  }

  /**
   * Get current tokens (for AuthProvider initialization)
   * Used to check if user has existing session on app load
   */
  getTokens(): TokenData | null {
    if (!this.accessToken || !this.refreshToken || !this.expiresAt) {
      return null;
    }

    return {
      accessToken: this.accessToken,
      refreshToken: this.refreshToken,
      expiresAt: this.expiresAt,
    };
  }

  /**
   * Force token refresh (called by HTTP client on 401)
   * 
   * Similar to refresh() but always attempts refresh even if token appears valid
   * Used when HTTP client gets 401 - might indicate server-side token revocation
   */
  async forceRefresh(): Promise<string | null> {
    console.log('[AuthManager] Force refresh requested');
    const refreshed = await this.refresh();
    return refreshed ? this.accessToken : null;
  }

  /**
   * Refresh access token (race-condition safe)
   * 
   * RACE CONDITION PROTECTION:
   * - If refresh already in progress, wait for existing promise
   * - Prevents multiple simultaneous /refresh calls
   * - All callers get result of single refresh operation
   */
  private async refresh(): Promise<boolean> {
    // If refresh already in progress, wait for it
    if (this.refreshPromise) {
      console.log('[AuthManager] Refresh already in progress, waiting...');
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
   * 
   * Calls /api/auth/refresh with refresh token in body
   * This is the industry-standard pattern (Auth0, Clerk, WorkOS)
   */
  private async _doRefresh(): Promise<boolean> {
    if (!this.refreshToken) {
      return false;
    }

    try {
      console.log('[AuthManager] Calling /refresh endpoint');

      const response = await fetch(`${env.apiUrl}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken: this.refreshToken,
        }),
      });

      if (!response.ok) {
        console.warn('[AuthManager] Refresh failed:', response.status);
        return false;
      }

      const data: RefreshResponse = await response.json();

      console.log('[AuthManager] Refresh successful, storing new tokens');

      // Store new tokens
      this.setTokens(data.accessToken, data.refreshToken, data.expiresAt);

      return true;
    } catch (error) {
      console.error('[AuthManager] Refresh error:', error);
      return false;
    }
  }

  /**
   * Store tokens (called after login or refresh)
   */
  setTokens(accessToken: string, refreshToken: string, expiresAt: number): void {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.expiresAt = expiresAt;

    // Persist to localStorage
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    localStorage.setItem(STORAGE_KEYS.EXPIRES_AT, expiresAt.toString());

    console.log('[AuthManager] Tokens stored', {
      expiresAt: new Date(expiresAt).toISOString()
    });

    this.notifyListeners();
  }

  // ===========================================================================
  // USER MANAGEMENT
  // ===========================================================================

  /**
   * Store user and account data
   */
  setUser(user: UserData, account: AccountData): void {
    this.user = user;
    this.account = account;

    // Persist to localStorage
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEYS.ACCOUNT, JSON.stringify(account));

    console.log('[AuthManager] User data stored:', {
      userId: user.id,
      onboardingCompleted: user.onboarding_completed
    });

    this.notifyListeners();
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

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.refreshToken && !!this.user;
  }

  /**
   * Update onboarding status
   */
  updateOnboardingStatus(completed: boolean): void {
    if (this.user) {
      this.user.onboarding_completed = completed;
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(this.user));

      console.log('[AuthManager] Onboarding status updated:', completed);
      this.notifyListeners();
    }
  }

  // ===========================================================================
  // LOGOUT
  // ===========================================================================

  /**
   * Logout (revoke refresh token and clear local state)
   * 
   * FLOW:
   * 1. Call /api/auth/logout to revoke refresh token in DB
   * 2. Clear all local storage
   * 3. Clear memory state
   * 4. Notify listeners (React updates)
   */
  async logout(): Promise<void> {
    console.log('[AuthManager] Logout initiated');

    // Revoke refresh token on backend
    if (this.refreshToken) {
      try {
        await fetch(`${env.apiUrl}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            refreshToken: this.refreshToken,
          }),
        });
        console.log('[AuthManager] Refresh token revoked on backend');
      } catch (error) {
        console.error('[AuthManager] Logout API call failed:', error);
        // Continue with local cleanup even if API call fails
      }
    }

    // Clear local state
    this.clear();
  }

  /**
   * Clear all auth state (memory + localStorage)
   */
  clear(): void {
    // Clear memory
    this.accessToken = null;
    this.refreshToken = null;
    this.expiresAt = null;
    this.user = null;
    this.account = null;

    // Clear localStorage
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });

    console.log('[AuthManager] Auth state cleared');
    this.notifyListeners();
  }

  // ===========================================================================
  // EVENT SYSTEM (for React state sync)
  // ===========================================================================

  /**
   * Subscribe to auth state changes
   * Used by AuthProvider to sync React state
   */
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Notify all listeners of state change
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }
}

// Export singleton instance
export const authManager = AuthManager.getInstance();
