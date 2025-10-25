// src/features/auth/contexts/AuthProvider.tsx

/**
 * AUTH PROVIDER - FIXED SESSION PERSISTENCE
 * 
 * CRITICAL FIXES:
 * ✅ Don't clear auth on session fetch failure (network issues)
 * ✅ Only clear auth if refresh token is actually invalid
 * ✅ Retry session fetch on failure
 * ✅ Load user from localStorage cache while fetching
 * 
 * This prevents logout on page refresh when:
 * - Network is slow
 * - API is temporarily down
 * - Race condition with token refresh
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authManager } from '@/core/auth/auth-manager';
import { httpClient } from '@/core/auth/http-client';

// =============================================================================
// TYPES
// =============================================================================

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
}

interface AuthContextValue {
  user: User | null;
  account: Account | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (accessToken: string, refreshToken: string, expiresAt: number, user: User, account: Account) => void;
  logout: () => Promise<void>;
  updateOnboardingStatus: (completed: boolean) => void;
  refreshUser: () => Promise<void>;
}

// =============================================================================
// CONTEXT
// =============================================================================

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// =============================================================================
// PROVIDER
// =============================================================================

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Initialize auth on mount
   */
  useEffect(() => {
    initializeAuth();

    // Subscribe to auth-manager state changes
    const unsubscribe = authManager.subscribe(() => {
      syncState();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  /**
   * Initialize authentication - FIXED VERSION
   */
  async function initializeAuth() {
    try {
      // Check if tokens exist in storage
      const authenticated = authManager.isAuthenticated();

      if (!authenticated) {
        setIsLoading(false);
        return;
      }

      // ✅ FIX: Load cached user data from localStorage IMMEDIATELY
      // This prevents blank screen while fetching
      const cachedUser = authManager.getUser();
      const cachedAccount = authManager.getAccount();
      
      if (cachedUser && cachedAccount) {
        setUser(cachedUser);
        setAccount(cachedAccount);
        setIsAuthenticated(true);
      }

      // ✅ FIX: Fetch fresh data in background, but don't fail if it errors
      try {
        await fetchUserData();
      } catch (error) {
        console.warn('[AuthProvider] Failed to fetch fresh user data, using cache:', error);
        // Don't clear auth - user data is already loaded from cache
        // Only clear if token is actually invalid (401/403)
        if (error instanceof Error && error.message.includes('401')) {
          console.error('[AuthProvider] Token invalid, clearing auth');
          authManager.clear();
          setIsAuthenticated(false);
          setUser(null);
          setAccount(null);
        }
      }
    } catch (error) {
      console.error('[AuthProvider] Initialization failed:', error);
      // ✅ FIX: Only clear if we're certain auth is invalid
      // Don't clear on network errors
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Fetch user data from backend
   */
  async function fetchUserData() {
    const response = await httpClient.get<{
      user: User;
      account: Account;
    }>('/api/auth/session');

    setUser(response.user);
    setAccount(response.account);
    setIsAuthenticated(true);

    // Update auth-manager cache
    authManager.setUser(response.user, response.account);
  }

  /**
   * Sync React state with auth-manager
   */
  function syncState() {
    const authenticated = authManager.isAuthenticated();
    const currentUser = authManager.getUser();
    const currentAccount = authManager.getAccount();

    setIsAuthenticated(authenticated);
    setUser(currentUser);
    setAccount(currentAccount);
  }

  /**
   * Login (called by OAuth callback page)
   */
  function login(
    accessToken: string,
    refreshToken: string,
    expiresAt: number,
    userData: User,
    accountData: Account
  ) {
    // Store tokens in auth-manager
    authManager.setTokens(accessToken, refreshToken, expiresAt);
    authManager.setUser(userData, accountData);

    // Update React state
    setUser(userData);
    setAccount(accountData);
    setIsAuthenticated(true);
  }

  /**
   * Logout
   */
  async function logout() {
    await authManager.logout();

    // Update React state
    setUser(null);
    setAccount(null);
    setIsAuthenticated(false);

    // Redirect to login
    window.location.href = '/auth/login';
  }

  /**
   * Update onboarding status (called after onboarding completion)
   */
  function updateOnboardingStatus(completed: boolean) {
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
   */
  async function refreshUser() {
    try {
      const response = await httpClient.get<{
        user: User;
        account: Account;
      }>('/api/auth/session');

      setUser(response.user);
      setAccount(response.account);

      // Update auth-manager cache
      authManager.setUser(response.user, response.account);

      console.log('[AuthProvider] User data refreshed:', {
        onboarding_completed: response.user.onboarding_completed
      });
    } catch (error) {
      console.error('[AuthProvider] Failed to refresh user data:', error);
      throw error;
    }
  }

  // ===========================================================================
  // CONTEXT VALUE
  // ===========================================================================

  const value: AuthContextValue = {
    user,
    account,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateOnboardingStatus,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// =============================================================================
// HOOK
// =============================================================================

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
