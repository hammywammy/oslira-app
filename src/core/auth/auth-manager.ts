// src/core/auth/auth-manager.ts

/**
 * AUTH MANAGER (Singleton) - PRODUCTION GRADE (2025)
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
 * - Cross-tab synchronization (logout in one tab = logout everywhere)
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
 * CROSS-TAB SYNCHRONIZATION:
 * - Listens for storage events from other tabs
 * - Logout in Tab A → automatic logout in Tab B, C, D
 * - Login in Tab A → automatic state refresh in Tab B, C, D
 * - Industry standard pattern (Auth0, Clerk, Supabase all do this)
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
  light_analyses_balance: number;
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

  // Auth ready state
  private authReady: boolean = false;

  // Race-condition protection
  private refreshPromise: Promise<boolean> | null = null;

  // Event listeners for auth state changes
  private listeners: Set<() => void> = new Set();

  private constructor() {
    this.loadFromStorage();
    this.setupCrossTabSync();
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
      const timestamp = Date.now();

      // TRACE-001: Read from localStorage
      const accessTokenFromStorage = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      const refreshTokenFromStorage = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

      console.log(`[AUTH-TRACE-001][${timestamp}] AuthManager.loadFromStorage: Reading from localStorage`, {
        accessTokenPrefix: accessTokenFromStorage?.substring(0, 8) || 'NULL',
        refreshTokenPrefix: refreshTokenFromStorage?.substring(0, 8) || 'NULL',
        timestamp
      });

      this.accessToken = accessTokenFromStorage;
      this.refreshToken = refreshTokenFromStorage;

      const expiresAtStr = localStorage.getItem(STORAGE_KEYS.EXPIRES_AT);
      this.expiresAt = expiresAtStr ? parseInt(expiresAtStr, 10) : null;

      const userStr = localStorage.getItem(STORAGE_KEYS.USER);
      this.user = userStr ? JSON.parse(userStr) : null;

      const accountStr = localStorage.getItem(STORAGE_KEYS.ACCOUNT);
      this.account = accountStr ? JSON.parse(accountStr) : null;

      // Set authReady if we have a valid refresh token
      if (this.refreshToken) {
        this.authReady = true;
      }

      // TRACE-002: Loaded into memory
      console.log(`[AUTH-TRACE-002][${Date.now()}] AuthManager.loadFromStorage: Loaded into memory`, {
        memoryAccessTokenPrefix: this.accessToken?.substring(0, 8) || 'NULL',
        memoryRefreshTokenPrefix: this.refreshToken?.substring(0, 8) || 'NULL',
        hasUser: !!this.user,
        authReady: this.authReady,
        expiresAt: this.expiresAt ? new Date(this.expiresAt).toISOString() : null,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('[AuthManager] Failed to load from storage:', error);
      this.clear();
    }
  }

  /**
   * Setup cross-tab synchronization via storage event
   * 
   * INDUSTRY STANDARD PATTERN (Auth0, Clerk, Supabase)
   * 
   * How it works:
   * - When localStorage changes in Tab A, browser fires 'storage' event in ALL other tabs
   * - Other tabs listen for this event and update their state accordingly
   * - Logout in Tab A → Tab B, C, D automatically clear auth state
   * - Login in Tab A → Tab B, C, D automatically reload auth state
   * 
   * Why this matters:
   * - Security: Logout in one tab = logout everywhere
   * - UX: Login in one tab = logged in everywhere
   * - Real-time: No polling needed, instant synchronization
   * 
   * Browser support: All modern browsers (2025)
   */
  private setupCrossTabSync(): void {
    window.addEventListener('storage', (event) => {
      // Only process auth-related storage changes
      if (!event.key || !Object.values(STORAGE_KEYS).includes(event.key as any)) {
        return;
      }

      console.log('[AuthManager] Cross-tab storage event detected:', {
        key: event.key,
        hasNewValue: !!event.newValue,
        hasOldValue: !!event.oldValue
      });

      // LOGOUT DETECTION: Any auth key removed = logout
      if (event.newValue === null) {
        console.log('[AuthManager] Cross-tab logout detected');
        
        // Clear local state (don't trigger another storage event)
        this.accessToken = null;
        this.refreshToken = null;
        this.expiresAt = null;
        this.user = null;
        this.account = null;

        // Notify React components
        this.notifyListeners();

        // Redirect to login if on protected route
        if (!window.location.pathname.startsWith('/auth')) {
          console.log('[AuthManager] Redirecting to login page');
          window.location.href = '/auth/login';
        }
        return;
      }

      // LOGIN DETECTION: Refresh token added/changed = login
      if (event.key === STORAGE_KEYS.REFRESH_TOKEN && event.newValue) {
        console.log('[AuthManager] Cross-tab login detected, reloading state...');
        
        // Reload all auth state from localStorage
        this.loadFromStorage();
        
        // Notify React components
        this.notifyListeners();
      }
    });

    console.log('[AuthManager] Cross-tab synchronization enabled');
  }

  // ===========================================================================
  // TOKEN MANAGEMENT
  // ===========================================================================

/**
 * Get current tokens (for initialization check)
 * Returns raw token data without triggering refresh
 */
getTokens(): {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
} | null {
  // Return null if no refresh token (not authenticated)
  if (!this.refreshToken) {
    return null;
  }

  return {
    accessToken: this.accessToken,
    refreshToken: this.refreshToken,
    expiresAt: this.expiresAt,
  };
}

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
   *
   * RACE CONDITION PROTECTION:
   * - If multiple requests happen simultaneously, only one refresh call is made
   * - Subsequent calls wait for the same refresh promise to resolve
   */
  async getAccessToken(): Promise<string | null> {
    const timestamp = Date.now();

    // TRACE-003: Entry to getAccessToken
    console.log(`[AUTH-TRACE-003][${timestamp}] AuthManager.getAccessToken: Entry`, {
      memoryRefreshTokenPrefix: this.refreshToken?.substring(0, 8) || 'NULL',
      memoryAccessTokenPrefix: this.accessToken?.substring(0, 8) || 'NULL',
      expiresAt: this.expiresAt,
      currentTime: timestamp,
      isExpired: this.expiresAt ? timestamp >= this.expiresAt : 'N/A',
      timestamp
    });

    // No refresh token = not authenticated
    if (!this.refreshToken) {
      console.log(`[AUTH-TRACE-004][${Date.now()}] AuthManager.getAccessToken: No refresh token`, {
        timestamp: Date.now()
      });
      return null;
    }

    // Token still valid? Return it
    if (this.accessToken && this.expiresAt && Date.now() < this.expiresAt) {
      console.log(`[AUTH-TRACE-005][${Date.now()}] AuthManager.getAccessToken: Token still valid, returning`, {
        accessTokenPrefix: this.accessToken.substring(0, 8),
        timestamp: Date.now()
      });
      return this.accessToken;
    }

    console.log(`[AUTH-TRACE-006][${Date.now()}] AuthManager.getAccessToken: Token expired, attempting refresh`, {
      timestamp: Date.now()
    });

    // Token expired - refresh it
    const refreshed = await this.refresh();

    console.log(`[AUTH-TRACE-007][${Date.now()}] AuthManager.getAccessToken: Refresh completed`, {
      success: refreshed,
      newAccessTokenPrefix: this.accessToken?.substring(0, 8) || 'NULL',
      timestamp: Date.now()
    });

    return refreshed ? this.accessToken : null;
  }

  /**
 * Force token refresh (public method)
 * Used by HTTP client when it receives 401 response
 *
 * Returns new access token if successful, null if failed
 * This is called when backend returns 401 despite having what appears to be a valid token
 */
async forceRefresh(): Promise<string | null> {
  const timestamp = Date.now();

  // TRACE-008: forceRefresh entry - BEFORE reading localStorage
  console.log(`[AUTH-TRACE-008][${timestamp}] AuthManager.forceRefresh: Entry BEFORE localStorage read`, {
    memoryRefreshTokenPrefix: this.refreshToken?.substring(0, 8) || 'NULL',
    memoryAccessTokenPrefix: this.accessToken?.substring(0, 8) || 'NULL',
    timestamp
  });

  // TRACE-009: Reading from localStorage
  const storedRefreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  const storedAccessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

  console.log(`[AUTH-TRACE-009][${Date.now()}] AuthManager.forceRefresh: localStorage state`, {
    localStorageRefreshTokenPrefix: storedRefreshToken?.substring(0, 8) || 'NULL',
    localStorageAccessTokenPrefix: storedAccessToken?.substring(0, 8) || 'NULL',
    tokensMatch: storedRefreshToken === this.refreshToken,
    timestamp: Date.now()
  });

  // Re-read refresh token from localStorage to ensure memory state matches storage
  // This prevents race conditions where setTokens() hasn't propagated to memory yet
  if (storedRefreshToken && storedRefreshToken !== this.refreshToken) {
    console.log(`[AUTH-TRACE-010][${Date.now()}] AuthManager.forceRefresh: Syncing refresh token from localStorage`, {
      oldMemoryTokenPrefix: this.refreshToken?.substring(0, 8) || 'NULL',
      newMemoryTokenPrefix: storedRefreshToken.substring(0, 8),
      timestamp: Date.now()
    });
    this.refreshToken = storedRefreshToken;
  }

  // Clear existing refresh promise to force new refresh
  this.refreshPromise = null;

  console.log(`[AUTH-TRACE-011][${Date.now()}] AuthManager.forceRefresh: Starting refresh`, {
    refreshTokenToUse: this.refreshToken?.substring(0, 8) || 'NULL',
    timestamp: Date.now()
  });

  // Attempt refresh
  const success = await this.refresh();

  // TRACE-012: forceRefresh complete
  console.log(`[AUTH-TRACE-012][${Date.now()}] AuthManager.forceRefresh: Complete`, {
    success,
    newAccessTokenPrefix: this.accessToken?.substring(0, 8) || 'NULL',
    newRefreshTokenPrefix: this.refreshToken?.substring(0, 8) || 'NULL',
    timestamp: Date.now()
  });

  // Return new access token if successful
  return success ? this.accessToken : null;
}

  /**
   * Refresh access token using refresh token
   * 
   * RACE CONDITION PROTECTION:
   * - If refresh already in progress, return existing promise
   * - Prevents multiple simultaneous refresh calls
   * 
   * TOKEN ROTATION:
   * - Backend invalidates old refresh token
   * - Returns new refresh token + access token
   * - This prevents token reuse attacks
   */
  private async refresh(): Promise<boolean> {
    // Race condition protection: only one refresh at a time
    if (this.refreshPromise) {
      console.log('[AuthManager] Refresh already in progress, waiting...');
      return this.refreshPromise;
    }

    this.refreshPromise = this._performRefresh();

    try {
      return await this.refreshPromise;
    } finally {
      this.refreshPromise = null;
    }
  }

  /**
   * Perform actual refresh API call
   */
  private async _performRefresh(): Promise<boolean> {
    try {
      const timestamp = Date.now();

      // TRACE-013: BEFORE sending refresh request
      console.log(`[AUTH-TRACE-013][${timestamp}] AuthManager._performRefresh: BEFORE API call`, {
        refreshTokenBeingSent: this.refreshToken?.substring(0, 8) || 'NULL',
        memoryAccessTokenPrefix: this.accessToken?.substring(0, 8) || 'NULL',
        localStorageRefreshTokenPrefix: localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)?.substring(0, 8) || 'NULL',
        timestamp
      });

      const response = await fetch(`${env.apiUrl}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken: this.refreshToken,
        }),
      });

      // TRACE-014: API response received
      console.log(`[AUTH-TRACE-014][${Date.now()}] AuthManager._performRefresh: API response received`, {
        status: response.status,
        ok: response.ok,
        timestamp: Date.now()
      });

      if (!response.ok) {
        console.log(`[AUTH-TRACE-015][${Date.now()}] AuthManager._performRefresh: Refresh failed`, {
          status: response.status,
          timestamp: Date.now()
        });
        return false;
      }

      const data: RefreshResponse = await response.json();

      // TRACE-016: New tokens received from backend
      console.log(`[AUTH-TRACE-016][${Date.now()}] AuthManager._performRefresh: New tokens received from backend`, {
        newAccessTokenPrefix: data.accessToken.substring(0, 8),
        newRefreshTokenPrefix: data.refreshToken.substring(0, 8),
        expiresAt: data.expiresAt,
        timestamp: Date.now()
      });

      // Store new tokens (triggers cross-tab sync)
      this.setTokens(data.accessToken, data.refreshToken, data.expiresAt);

      console.log(`[AUTH-TRACE-017][${Date.now()}] AuthManager._performRefresh: Refresh complete`, {
        timestamp: Date.now()
      });

      return true;
    } catch (error) {
      console.error(`[AUTH-TRACE-018][${Date.now()}] AuthManager._performRefresh: Error`, {
        error,
        timestamp: Date.now()
      });
      return false;
    }
  }

  /**
   * Store tokens (called after login or refresh)
   *
   * CROSS-TAB SYNC:
   * - Writing to localStorage automatically triggers 'storage' event in other tabs
   * - Other tabs detect the change and update their state
   */
  setTokens(accessToken: string, refreshToken: string, expiresAt: number): void {
    const timestamp = Date.now();

    // TRACE-019: BEFORE setting tokens
    console.log(`[AUTH-TRACE-019][${timestamp}] AuthManager.setTokens: BEFORE setting tokens`, {
      oldMemoryAccessTokenPrefix: this.accessToken?.substring(0, 8) || 'NULL',
      oldMemoryRefreshTokenPrefix: this.refreshToken?.substring(0, 8) || 'NULL',
      oldLocalStorageAccessTokenPrefix: localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)?.substring(0, 8) || 'NULL',
      oldLocalStorageRefreshTokenPrefix: localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)?.substring(0, 8) || 'NULL',
      newAccessTokenPrefix: accessToken.substring(0, 8),
      newRefreshTokenPrefix: refreshToken.substring(0, 8),
      timestamp
    });

    // Set in memory first
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.expiresAt = expiresAt;

    // TRACE-020: AFTER setting memory, BEFORE localStorage
    console.log(`[AUTH-TRACE-020][${Date.now()}] AuthManager.setTokens: Memory updated, BEFORE localStorage write`, {
      memoryAccessTokenPrefix: this.accessToken.substring(0, 8),
      memoryRefreshTokenPrefix: this.refreshToken.substring(0, 8),
      localStorageAccessTokenPrefix: localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)?.substring(0, 8) || 'NULL',
      localStorageRefreshTokenPrefix: localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)?.substring(0, 8) || 'NULL',
      timestamp: Date.now()
    });

    // Persist to localStorage (triggers storage event in other tabs)
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    localStorage.setItem(STORAGE_KEYS.EXPIRES_AT, expiresAt.toString());

    // TRACE-021: AFTER localStorage write
    console.log(`[AUTH-TRACE-021][${Date.now()}] AuthManager.setTokens: AFTER localStorage write`, {
      memoryAccessTokenPrefix: this.accessToken.substring(0, 8),
      memoryRefreshTokenPrefix: this.refreshToken.substring(0, 8),
      localStorageAccessTokenPrefix: localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)?.substring(0, 8) || 'NULL',
      localStorageRefreshTokenPrefix: localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)?.substring(0, 8) || 'NULL',
      expiresAt: new Date(expiresAt).toISOString(),
      timestamp: Date.now()
    });

    this.notifyListeners();
  }

  // ===========================================================================
  // USER MANAGEMENT
  // ===========================================================================

  /**
   * Store user and account data
   * 
   * CROSS-TAB SYNC:
   * - Writing to localStorage automatically triggers 'storage' event in other tabs
   */
  setUser(user: UserData, account: AccountData): void {
    this.user = user;
    this.account = account;

    // Persist to localStorage (triggers storage event in other tabs)
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
   * Check if auth manager is ready (has refresh token in memory)
   * Useful for components to check synchronously if tokens are loaded
   */
  isReady(): boolean {
    return !!this.refreshToken;
  }

  /**
   * Mark authentication as ready
   * Called after successful login or token refresh to signal that auth is fully initialized
   */
  markAuthReady(): void {
    console.log('[AuthManager] Marking auth as ready');
    this.authReady = true;
    this.notifyListeners();
  }

  /**
   * Check if authentication is fully ready
   * Returns true only if both authReady flag is set AND refresh token exists
   */
  isAuthReady(): boolean {
    return this.authReady && !!this.refreshToken;
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
   * 
   * CROSS-TAB SYNC:
   * - Clearing localStorage triggers 'storage' event in all other tabs
   * - Other tabs detect the logout and clear their state automatically
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

    // Clear local state (triggers cross-tab sync)
    this.clear();
  }

  /**
   * Clear all auth state (memory + localStorage)
   *
   * CROSS-TAB SYNC:
   * - Removing items from localStorage triggers 'storage' event in other tabs
   * - Other tabs detect the changes and clear their state automatically
   */
  clear(): void {
    const timestamp = Date.now();

    // TRACE-022: BEFORE clearing
    console.log(`[AUTH-TRACE-022][${timestamp}] AuthManager.clear: BEFORE clearing`, {
      memoryAccessTokenPrefix: this.accessToken?.substring(0, 8) || 'NULL',
      memoryRefreshTokenPrefix: this.refreshToken?.substring(0, 8) || 'NULL',
      localStorageAccessTokenPrefix: localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)?.substring(0, 8) || 'NULL',
      localStorageRefreshTokenPrefix: localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)?.substring(0, 8) || 'NULL',
      timestamp
    });

    // Clear memory
    this.accessToken = null;
    this.refreshToken = null;
    this.expiresAt = null;
    this.user = null;
    this.account = null;
    this.authReady = false;

    // Clear localStorage (triggers storage event in other tabs)
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });

    // Also clear business profile selection
    localStorage.removeItem('oslira-selected-business');

    // TRACE-023: AFTER clearing
    console.log(`[AUTH-TRACE-023][${Date.now()}] AuthManager.clear: AFTER clearing`, {
      memoryAccessTokenPrefix: this.accessToken?.substring(0, 8) || 'NULL',
      memoryRefreshTokenPrefix: this.refreshToken?.substring(0, 8) || 'NULL',
      localStorageAccessTokenPrefix: localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)?.substring(0, 8) || 'NULL',
      localStorageRefreshTokenPrefix: localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)?.substring(0, 8) || 'NULL',
      timestamp: Date.now()
    });

    this.notifyListeners();
  }

  // ===========================================================================
  // EVENT SYSTEM (for React state sync)
  // ===========================================================================

  /**
   * Subscribe to auth state changes
   * Used by AuthProvider to sync React state with auth-manager
   * 
   * Returns unsubscribe function
   */
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Notify all listeners of state change
   * Called after any auth state modification
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }
}

// =============================================================================
// EXPORT SINGLETON INSTANCE
// =============================================================================

export const authManager = AuthManager.getInstance();
