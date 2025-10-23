// src/features/auth/contexts/AuthProvider.tsx

/**
 * AUTH PROVIDER (React Context)
 * 
 * Wraps auth-manager and exposes state to React components
 * 
 * Responsibilities:
 * - Initialize on mount (check if tokens exist)
 * - Fetch user data from /api/auth/session if authenticated
 * - Subscribe to auth-manager state changes
 * - Provide { user, account, isAuthenticated, isLoading } to components
 * 
 * Usage:
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
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
   * Initialize authentication
   */
  async function initializeAuth() {
    try {
      // Check if tokens exist in storage
      const authenticated = authManager.isAuthenticated();

      if (!authenticated) {
        setIsLoading(false);
        return;
      }

      // Tokens exist - fetch user data
      await fetchUserData();
    } catch (error) {
      console.error('[AuthProvider] Initialization failed:', error);
      authManager.clear();
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Fetch user data from backend
   */
  async function fetchUserData() {
    try {
      const response = await httpClient.get<{
        user: User;
        account: Account;
      }>('/api/auth/session');

      setUser(response.user);
      setAccount(response.account);
      setIsAuthenticated(true);

      // Update auth-manager with fresh data
      authManager.setUser(response.user, response.account);
    } catch (error) {
      console.error('[AuthProvider] Failed to fetch user data:', error);
      authManager.clear();
      setIsAuthenticated(false);
      setUser(null);
      setAccount(null);
    }
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
