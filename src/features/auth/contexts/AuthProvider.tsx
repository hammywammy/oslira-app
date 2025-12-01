/**
 * AUTH PROVIDER - INDUSTRY STANDARD (2025)
 * 
 * ARCHITECTURE:
 * Implements Auth0/Clerk/WorkOS pattern for SaaS authentication
 * 
 * INITIALIZATION FLOW (On App Load):
 * 1. Check localStorage for refresh token
 * 2. If exists → call /api/auth/refresh (no Bearer header needed)
 * 3. If successful → store new tokens + user data
 * 4. If fails → clear auth, user must re-login
 * 
 * TOKEN MANAGEMENT:
 * - Access Token (JWT): 15min expiry, stateless, for API requests
 * - Refresh Token (Opaque): 30 days, stateful (DB), for getting new access tokens
 * - Token Rotation: Every refresh invalidates old token, issues new one
 * 
 * SECURITY:
 * - Tokens stored in localStorage (acceptable for SPA per OWASP 2025)
 * - Refresh tokens rotated on every use (prevents token reuse attacks)
 * - Access tokens short-lived (limits exposure window)
 * - No session endpoint on init (prevents chicken-egg auth problems)
 * 
 * WHAT'S DIFFERENT FROM OLD CODE:
 * ❌ OLD: Called /session endpoint on init (requires Bearer token)
 * ✅ NEW: Calls /refresh endpoint on init (only needs refresh token)
 * 
 * WHY THIS MATTERS:
 * - /session requires valid access token (which might be expired)
 * - /refresh doesn't require Bearer header (uses body param)
 * - Industry standard: rehydrate auth via refresh, not session check
 * 
 * THE /session ENDPOINT:
 * - Still exists in backend
 * - Only used for explicit "fetch fresh user data" calls
 * - Called after profile updates, onboarding completion, etc.
 * - Never called during initialization
 * 
 * REFERENCES:
 * - Auth0: https://auth0.com/blog/refresh-tokens-what-are-they-and-when-to-use-them/
 * - Clerk: https://clerk.com/docs (session management)
 * - WorkOS: https://workos.com/blog/why-your-app-needs-refresh-tokens
 * - Passage: https://passage.1password.com/post/better-session-management-with-refresh-tokens
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authManager } from '@/core/auth/auth-manager';
import { env } from '@/core/auth/environment';
import { logger } from '@/core/utils/logger';
import { httpClient } from '@/core/auth/http-client';
import { useCreditsStore } from '@/features/credits/store/creditsStore';
import { useSubscriptionStore, Subscription } from '@/features/billing/store/subscriptionStore';

interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  onboarding_completed: boolean;
}

interface Account {
  id: string;
  name: string;
  credit_balance: number;
  light_analyses_balance: number;
}

interface CreditBalance {
  account_id: string;
  credit_balance: number;
  light_analyses_balance: number;
  last_transaction_at: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthContextValue {
  user: User | null;
  account: Account | null;
  isAuthenticated: boolean;
  isAuthReady: boolean;
  isFullyReady: boolean;
  isLoading: boolean;
  login: (accessToken: string, refreshToken: string, expiresAt: number, user: User, account: Account) => void;
  logout: () => Promise<void>;
  updateOnboardingStatus: (completed: boolean) => void;
  refreshUser: () => Promise<void>;
}

interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

// CONTEXT
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// PROVIDER
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // ===========================================================================
  // INITIALIZATION - INDUSTRY STANDARD PATTERN
  // ===========================================================================

  useEffect(() => {
    // CRITICAL: Skip initialization on OAuth callback page
    // OAuthCallbackPage handles its own auth flow
    const isOAuthCallback = window.location.pathname === '/auth/callback';

    if (!isOAuthCallback) {
      void initializeAuth();
    } else {
      // On callback page, just set loading to false
      // OAuthCallbackPage will call login() directly
      setIsLoading(false);
    }

    // Subscribe to auth changes from auth-manager
    const unsubscribe = authManager.subscribe(syncState);
    return unsubscribe;
  }, []);

  /**
   * Initialize auth on app load
   *
   * FLOW:
   * 1. Get tokens from auth-manager (reads from localStorage)
   * 2. If no refresh token → user not authenticated
   * 3. If refresh token exists → call /refresh endpoint
   * 4. If refresh succeeds → user authenticated with new tokens
   * 5. If refresh fails → clear auth, user must re-login
   *
   * WHY NOT USE /session:
   * - /session requires valid Bearer token in header
   * - Access token might be expired on page load
   * - Creates chicken-egg problem: need valid token to check session
   *
   * WHY USE /refresh:
   * - /refresh takes refresh token in request body (not header)
   * - Doesn't require access token to be valid
   * - Returns new access token + user data in one call
   * - This is how Auth0, Clerk, WorkOS all do it
   */
  async function initializeAuth() {
    logger.info('[AuthProvider] Initializing auth...');
    setIsLoading(true);

    try {
      // Get current tokens from auth-manager (localStorage)
      const tokens = authManager.getTokens();

      if (!tokens?.refreshToken) {
        logger.info('[AuthProvider] No refresh token found, user not authenticated');
        setIsLoading(false);
        return;
      }

      logger.info('[AuthProvider] Refresh token found, attempting to rehydrate session');

      // Call /refresh endpoint to get new tokens + user data
      const response = await fetch(`${env.apiUrl}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: tokens.refreshToken }),
      });

      if (!response.ok) {
        logger.warn('[AuthProvider] Refresh failed, clearing auth', {
          status: response.status
        });
        authManager.clear();
        setIsLoading(false);
        return;
      }

      const data: RefreshResponse = await response.json();

      logger.info('[AuthProvider] Refresh successful, session rehydrated');

      // Store new tokens in auth-manager
      authManager.setTokens(data.accessToken, data.refreshToken, data.expiresAt);

      // Now fetch user data using the new access token
      // This is safe because we just got a fresh token from /refresh
      await fetchBootstrap();

      // Mark auth as ready after successful initialization
      authManager.markAuthReady();
      setIsAuthReady(true);

    } catch (error) {
      logger.error('[AuthProvider] Initialization failed', error as Error);
      authManager.clear();
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Fetch all user data from /bootstrap endpoint
   *
   * HYDRATES ALL STORES AT ONCE:
   * - User and account data (React state)
   * - Credits store (Zustand)
   * - Subscription store (Zustand)
   *
   * WHEN TO USE:
   * - After successful /refresh (to get user data with fresh token)
   * - When explicitly refreshing user data (profile updates, etc.)
   *
   * WHEN NOT TO USE:
   * - During initialization (use /refresh instead)
   * - When access token might be expired (use /refresh first)
   *
   * BENEFITS:
   * - Single API call instead of 3 separate calls
   * - No flickering UI on page load
   * - All stores hydrated atomically
   */
  async function fetchBootstrap() {
    logger.info('[AuthProvider] Fetching bootstrap data');

    // Set loading states on stores BEFORE API call
    // This enables components to show skeletons during bootstrap
    useCreditsStore.getState().setLoading(true);
    useSubscriptionStore.getState().setLoading(true);

    const response = await httpClient.get<{
      data: {
        user: User;
        account: Account;
        subscription: Subscription;
        balances: CreditBalance;
        newAccessToken?: string;  // Optional fresh token when onboarding status changed
      };
    }>('/api/auth/bootstrap');

    // CRITICAL: If backend issued new token, update auth-manager
    if (response.data.newAccessToken) {
      logger.info('[AuthProvider] Received fresh JWT from bootstrap endpoint');

      const tokens = authManager.getTokens();
      if (tokens?.refreshToken) {
        authManager.setTokens(
          response.data.newAccessToken,
          tokens.refreshToken,
          Date.now() + (15 * 60 * 1000)  // 15 minutes from now
        );
      }
    }

    // Hydrate React state
    setUser(response.data.user);
    setAccount(response.data.account);
    setIsAuthenticated(true);

    // Hydrate credits store
    useCreditsStore.getState().setBalance(response.data.balances);

    // Hydrate subscription store
    useSubscriptionStore.getState().setSubscription(response.data.subscription);

    // Update auth-manager cache
    authManager.setUser(response.data.user, response.data.account);

    logger.info('[AuthProvider] Bootstrap complete', {
      userId: response.data.user.id,
      onboardingCompleted: response.data.user.onboarding_completed,
      tier: response.data.subscription?.tier,
      creditBalance: response.data.balances?.credit_balance,
      receivedFreshToken: !!response.data.newAccessToken
    });
  }

  /**
   * Sync React state with auth-manager
   * Called when auth-manager emits state changes
   */
  function syncState() {
    const authenticated = authManager.isAuthenticated();
    const currentUser = authManager.getUser();
    const currentAccount = authManager.getAccount();
    const authReady = authManager.isAuthReady();

    setIsAuthenticated(authenticated);
    setUser(currentUser);
    setAccount(currentAccount);
    setIsAuthReady(authReady);

    logger.debug('[AuthProvider] State synced with auth-manager');
  }

  // ===========================================================================
  // PUBLIC METHODS
  // ===========================================================================

  /**
   * Login (called by OAuth callback page after Google auth)
   *
   * FLOW:
   * 1. Backend completes OAuth flow
   * 2. Callback page receives tokens + user data
   * 3. Calls this function to store in auth system
   * 4. Redirects to dashboard or onboarding
   */
  function login(
    accessToken: string,
    refreshToken: string,
    expiresAt: number,
    userData: User,
    accountData: Account
  ) {
    logger.info('[AuthProvider] Login called', { userId: userData.id });

    // Store tokens in auth-manager
    authManager.setTokens(accessToken, refreshToken, expiresAt);

    authManager.setUser(userData, accountData);

    // Mark auth as ready
    authManager.markAuthReady();

    // Update React state
    setUser(userData);
    setAccount(accountData);
    setIsAuthenticated(true);
    setIsAuthReady(true);
  }

  /**
   * Logout
   *
   * FLOW:
   * 1. Call auth-manager logout (revokes refresh token on backend)
   * 2. Clear local state
   * 3. Clear credits store
   * 4. Redirect to login page
   */
  async function logout() {
    logger.info('[AuthProvider] Logout initiated');

    await authManager.logout();

    // Clear credits store
    useCreditsStore.getState().clearBalance();

    // Clear subscription store
    useSubscriptionStore.getState().clearSubscription();

    // Update React state
    setUser(null);
    setAccount(null);
    setIsAuthenticated(false);

    // Redirect to login
    window.location.href = '/auth/login';
  }

  /**
   * Update onboarding status
   * Called after user completes onboarding flow
   */
  function updateOnboardingStatus(completed: boolean) {
    logger.info('[AuthProvider] Updating onboarding status', { completed });

    authManager.updateOnboardingStatus(completed);

    // Update React state
    if (user) {
      setUser({
        ...user,
        onboarding_completed: completed,
      });
    }
  }

  /**
   * Refresh user data from backend
   *
   * USE CASES:
   * - User updates their profile
   * - Need to fetch latest credit balance
   * - Verify onboarding status
   *
   * NOTE: This uses /bootstrap endpoint with current access token
   * If token is expired, httpClient will auto-refresh via auth-manager
   */
  async function refreshUser() {
    logger.info('[AuthProvider] Refreshing user data');

    try {
      await fetchBootstrap();
    } catch (error) {
      logger.error('[AuthProvider] Failed to refresh user data', error as Error);
      throw error;
    }
  }

  // ===========================================================================
  // CONTEXT VALUE
  // ===========================================================================

  // Computed: User is fully ready when authenticated AND onboarding completed
  // This is the single source of truth for "ready for dashboard data fetching"
  const isFullyReady = isAuthReady && isAuthenticated && (user?.onboarding_completed ?? false);

  const value: AuthContextValue = {
    user,
    account,
    isAuthenticated,
    isAuthReady,
    isFullyReady,
    isLoading,
    login,
    logout,
    updateOnboardingStatus,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
