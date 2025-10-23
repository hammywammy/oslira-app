// features/auth/contexts/AuthProvider.tsx

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/core/api/client';
import { logger } from '@/core/utils/logger';

/**
 * AUTH CONTEXT PROVIDER
 * 
 * Matches backend Phase 0-2 architecture:
 * - JWT access tokens (15min expiry)
 * - Refresh tokens (30 days)
 * - Automatic token refresh
 * - Onboarding status tracking
 * - Session persistence
 */

// ===============================================================================
// TYPES
// ===============================================================================

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

interface AuthState {
  user: User | null;
  account: Account | null;
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (accessToken: string, refreshToken: string, expiresAt: number, user: User, account: Account) => void;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<boolean>;
  updateOnboardingStatus: (completed: boolean) => void;
}

// ===============================================================================
// CONTEXT
// ===============================================================================

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ===============================================================================
// STORAGE KEYS
// ===============================================================================

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'oslira_access_token',
  REFRESH_TOKEN: 'oslira_refresh_token',
  EXPIRES_AT: 'oslira_expires_at',
  USER: 'oslira_user',
  ACCOUNT: 'oslira_account',
};

// ===============================================================================
// PROVIDER
// ===============================================================================

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    account: null,
    accessToken: null,
    refreshToken: null,
    expiresAt: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // ===============================================================================
  // INITIALIZATION: Load auth from localStorage
  // ===============================================================================

  useEffect(() => {
    loadAuthFromStorage();
  }, []);

  // ===============================================================================
  // AUTO-REFRESH: Check token expiry every minute
  // ===============================================================================

  useEffect(() => {
    if (!state.isAuthenticated || !state.expiresAt) return;

    const checkAndRefresh = async () => {
      const now = Date.now();
      const timeUntilExpiry = state.expiresAt! - now;
      
      // Refresh if token expires in less than 5 minutes
      if (timeUntilExpiry < 5 * 60 * 1000) {
        logger.info('Token expiring soon, refreshing...', { timeUntilExpiry });
        await refreshAccessToken();
      }
    };

    // Check every minute
    const interval = setInterval(checkAndRefresh, 60 * 1000);
    
    // Also check immediately
    checkAndRefresh();

    return () => clearInterval(interval);
  }, [state.isAuthenticated, state.expiresAt]);

  // ===============================================================================
  // LOAD AUTH FROM STORAGE
  // ===============================================================================

  const loadAuthFromStorage = () => {
    try {
      const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      const expiresAtStr = localStorage.getItem(STORAGE_KEYS.EXPIRES_AT);
      const userStr = localStorage.getItem(STORAGE_KEYS.USER);
      const accountStr = localStorage.getItem(STORAGE_KEYS.ACCOUNT);

      if (!accessToken || !refreshToken || !userStr || !accountStr) {
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      const user = JSON.parse(userStr) as User;
      const account = JSON.parse(accountStr) as Account;
      const expiresAt = expiresAtStr ? parseInt(expiresAtStr) : null;

      // Check if token is expired
      if (expiresAt && expiresAt < Date.now()) {
        logger.info('Token expired, attempting refresh...');
        setState(prev => ({
          ...prev,
          refreshToken,
          user,
          account,
          isLoading: true,
        }));
        
        // Attempt refresh
        refreshAccessToken();
        return;
      }

      setState({
        user,
        account,
        accessToken,
        refreshToken,
        expiresAt,
        isAuthenticated: true,
        isLoading: false,
      });

      logger.info('Auth loaded from storage', { userId: user.id, onboarding: user.onboarding_completed });

    } catch (error) {
      logger.error('Failed to load auth from storage', error as Error);
      clearAuthFromStorage();
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // ===============================================================================
  // LOGIN: Store auth state
  // ===============================================================================

  const login = (
    accessToken: string,
    refreshToken: string,
    expiresAt: number,
    user: User,
    account: Account
  ) => {
    // Store in localStorage
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    localStorage.setItem(STORAGE_KEYS.EXPIRES_AT, expiresAt.toString());
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEYS.ACCOUNT, JSON.stringify(account));

    // Update state
    setState({
      user,
      account,
      accessToken,
      refreshToken,
      expiresAt,
      isAuthenticated: true,
      isLoading: false,
    });

    logger.info('User logged in', { userId: user.id, onboarding: user.onboarding_completed });
  };

  // ===============================================================================
  // LOGOUT: Clear auth state
  // ===============================================================================

  const logout = async () => {
    try {
      // Call backend logout endpoint
      if (state.refreshToken) {
        await api.post('/api/auth/logout', { refreshToken: state.refreshToken });
      }
    } catch (error) {
      logger.warn('Logout API call failed (continuing anyway)', error as Error);
    }

    // Clear storage and state
    clearAuthFromStorage();
    setState({
      user: null,
      account: null,
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
      isAuthenticated: false,
      isLoading: false,
    });

    logger.info('User logged out');
  };

  // ===============================================================================
  // REFRESH ACCESS TOKEN
  // ===============================================================================

  const refreshAccessToken = async (): Promise<boolean> => {
    try {
      const currentRefreshToken = state.refreshToken || localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

      if (!currentRefreshToken) {
        throw new Error('No refresh token available');
      }

      logger.info('Refreshing access token...');

      const response = await api.post('/api/auth/refresh', {
        refreshToken: currentRefreshToken,
      });

      const { accessToken, refreshToken, expiresAt } = response.data;

      // Update tokens in storage
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      localStorage.setItem(STORAGE_KEYS.EXPIRES_AT, expiresAt.toString());

      // Update state
      setState(prev => ({
        ...prev,
        accessToken,
        refreshToken,
        expiresAt,
        isAuthenticated: true,
        isLoading: false,
      }));

      logger.info('Access token refreshed successfully');
      return true;

    } catch (error) {
      logger.error('Token refresh failed', error as Error);
      
      // Refresh failed, log user out
      await logout();
      return false;
    }
  };

  // ===============================================================================
  // UPDATE ONBOARDING STATUS
  // ===============================================================================

  const updateOnboardingStatus = (completed: boolean) => {
    if (!state.user) return;

    const updatedUser = { ...state.user, onboarding_completed: completed };
    
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
    
    setState(prev => ({
      ...prev,
      user: updatedUser,
    }));

    logger.info('Onboarding status updated', { completed });
  };

  // ===============================================================================
  // CLEAR STORAGE HELPER
  // ===============================================================================

  const clearAuthFromStorage = () => {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  };

  // ===============================================================================
  // CONTEXT VALUE
  // ===============================================================================

  const value: AuthContextValue = {
    ...state,
    login,
    logout,
    refreshAccessToken,
    updateOnboardingStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ===============================================================================
// HOOK
// ===============================================================================

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
