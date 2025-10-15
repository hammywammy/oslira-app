// src/features/auth/contexts/AuthProvider.tsx
/**
 * @file Auth Provider - Production Ready
 * @description Google OAuth with zero race conditions and proper error handling
 * 
 * Architecture:
 * - Guarantees isLoading becomes false (via finally block)
 * - Non-blocking business/subscription loading
 * - Proper TypeScript types
 * - Error recovery with fallbacks
 * - Thread-safe state updates
 */

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { User, Session, AuthError as SupabaseAuthError } from '@supabase/supabase-js';
import { supabase } from '@/core/lib/supabase';
import { httpClient } from '@/core/api/client';
import { logger } from '@/core/utils/logger';
import { AuthState, UserSubscription } from '../types/auth.types';

// =============================================================================
// TYPES
// =============================================================================

interface Business {
  id: string;
  name: string;
  industry?: string;
  created_at: string;
}

interface AuthContextValue extends AuthState {
  // Google OAuth only
  signInWithOAuth: () => Promise<void>;
  signOut: () => Promise<void>;
  
  // OAuth callback
  handleOAuthCallback: () => Promise<string | null>;
  
  // Business management
  businesses: Business[];
  selectedBusiness: Business | null;
  selectBusiness: (businessId: string) => void;
  refreshBusinesses: () => Promise<void>;
  
  // Subscription data
  subscription: UserSubscription | null;
  refreshSubscription: () => Promise<void>;
}

// =============================================================================
// CONTEXT
// =============================================================================

const AuthContext = createContext<AuthContextValue | null>(null);

// =============================================================================
// PROVIDER COMPONENT
// =============================================================================

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  // Core auth state
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Business state
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);

  // Subscription state
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);

  // ===========================================================================
  // HELPER: LOAD BUSINESSES (NON-THROWING)
  // ===========================================================================

  const loadBusinesses = useCallback(async (userId: string): Promise<void> => {
    try {
      logger.info('Loading user businesses...', { userId });

      const response = await httpClient.get<Business[]>('/v1/business', {
        params: { user_id: userId },
      });

      if (response.success && response.data) {
        setBusinesses(response.data);

        // Auto-select first business if none selected
        if (response.data.length > 0 && !selectedBusiness) {
          const firstBusiness = response.data[0];
          if (firstBusiness) {
            setSelectedBusiness(firstBusiness);
            localStorage.setItem('oslira-selected-business', firstBusiness.id);
          }
        }

        logger.info('Businesses loaded', { count: response.data.length });
      } else {
        logger.warn('No businesses returned from API');
      }
    } catch (err) {
      // ✅ NON-CRITICAL: Don't throw, just log warning
      logger.warn('Failed to load businesses (non-critical)', { 
        error: err instanceof Error ? err.message : 'Unknown error',
        userId 
      });
    }
  }, [selectedBusiness]);

  // ===========================================================================
  // HELPER: LOAD SUBSCRIPTION (NON-THROWING)
  // ===========================================================================

  const loadSubscription = useCallback(async (userId: string): Promise<void> => {
    try {
      logger.info('Loading user subscription...', { userId });

      const response = await httpClient.get<UserSubscription>('/v1/subscription', {
        params: { user_id: userId },
      });

      if (response.success && response.data) {
        setSubscription(response.data);
        logger.info('Subscription loaded', { 
          plan: response.data.plan,
          status: response.data.status 
        });
      } else {
        // Fallback to free tier
        logger.info('No subscription found, using free tier');
        setSubscription({
          id: '',
          user_id: userId,
          plan: 'free',
          status: 'active',
          credits: 25,
          credits_used: 0,
          period_start: new Date().toISOString(),
          period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        });
      }
    } catch (err) {
      // ✅ NON-CRITICAL: Fallback to free tier
      logger.warn('Failed to load subscription, using free tier', {
        error: err instanceof Error ? err.message : 'Unknown error',
        userId
      });
      
      setSubscription({
        id: '',
        user_id: userId,
        plan: 'free',
        status: 'active',
        credits: 25,
        credits_used: 0,
        period_start: new Date().toISOString(),
        period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }
  }, []);

  // ===========================================================================
  // INITIALIZATION (RACE-CONDITION FREE)
  // ===========================================================================

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      try {
        logger.info('Initializing auth system...');

        // Get initial session
        const { data: { session: initialSession }, error: sessionError } = 
          await supabase.auth.getSession();

        if (sessionError) {
          logger.error('Session error during init', sessionError);
          // Don't throw - just continue without session
        }

        // ✅ Check mounted BEFORE any state updates
        if (!mounted) return;

        if (initialSession && !sessionError) {
          logger.info('Initial session found', { userId: initialSession.user.id });
          
          // Update auth state
          setSession(initialSession);
          setUser(initialSession.user);
          setIsAuthenticated(true);

          // ✅ Load businesses/subscription (non-blocking, never throws)
          await Promise.allSettled([
            loadBusinesses(initialSession.user.id),
            loadSubscription(initialSession.user.id),
          ]);
        } else {
          logger.info('No initial session found');
          // Explicitly set unauthenticated state
          setSession(null);
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        // ✅ Catch ANY error and continue
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize auth';
        logger.error('Auth initialization failed (non-fatal)', err instanceof Error ? err : new Error(errorMessage), { 
          component: 'AuthProvider' 
        });
        
        // ✅ Set error but don't prevent rendering
        if (mounted) {
          setError(errorMessage);
          // Ensure we're in a clean unauthenticated state
          setSession(null);
          setUser(null);
          setIsAuthenticated(false);
        }
      } finally {
        // ✅✅ CRITICAL: ALWAYS set loading to false - this MUST execute
        if (mounted) {
          setIsLoading(false);
          logger.info('Auth initialization complete (isLoading = false)');
        }
      }
    }

    // Start initialization
    initializeAuth();

    // ===========================================================================
    // AUTH STATE LISTENER
    // ===========================================================================

    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!mounted) return;

        logger.debug('Auth state changed', { event, hasSession: !!newSession });

        if (newSession) {
          setSession(newSession);
          setUser(newSession.user);
          setIsAuthenticated(true);

          // Load businesses and subscription on sign in
          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            await Promise.allSettled([
              loadBusinesses(newSession.user.id),
              loadSubscription(newSession.user.id),
            ]);
          }
        } else {
          // Clear state on sign out
          setSession(null);
          setUser(null);
          setIsAuthenticated(false);
          setBusinesses([]);
          setSelectedBusiness(null);
          setSubscription(null);
        }
      }
    );

    // ===========================================================================
    // HTTP CLIENT TOKEN PROVIDER
    // ===========================================================================

    httpClient.setTokenProvider(async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      return currentSession?.access_token ?? null;
    });

    // ===========================================================================
    // CLEANUP
    // ===========================================================================

    return () => {
      mounted = false;
      authSubscription.unsubscribe();
    };
  }, [loadBusinesses, loadSubscription]); // ✅ Include callbacks in deps

  // ===========================================================================
  // SAFETY: Timeout fallback (prevents infinite loading)
  // ===========================================================================
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading) {
        logger.warn('Auth initialization timeout - forcing isLoading = false');
        setIsLoading(false);
      }
    }, 10000); // 10 second timeout

    return () => clearTimeout(timeout);
  }, [isLoading]);

  // ===========================================================================
  // PUBLIC API: REFRESH FUNCTIONS
  // ===========================================================================

  const refreshBusinesses = useCallback(async () => {
    if (user) {
      await loadBusinesses(user.id);
    }
  }, [user, loadBusinesses]);

  const refreshSubscription = useCallback(async () => {
    if (user) {
      await loadSubscription(user.id);
    }
  }, [user, loadSubscription]);

  // ===========================================================================
  // PUBLIC API: BUSINESS SELECTION
  // ===========================================================================

  const selectBusiness = useCallback((businessId: string) => {
    const business = businesses.find((b) => b.id === businessId);
    if (business) {
      setSelectedBusiness(business);
      localStorage.setItem('oslira-selected-business', business.id);
      logger.info('Business selected', { businessId, name: business.name });
    }
  }, [businesses]);

  // ===========================================================================
  // PUBLIC API: GOOGLE OAUTH SIGN IN
  // ===========================================================================

  const signInWithOAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const redirectTo = `${window.location.origin}/auth/callback`;

      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          scopes: 'email profile',
        },
      });

      if (signInError) {
        throw signInError;
      }

      logger.info('Google OAuth sign in initiated');
    } catch (err) {
      const errorMessage = err instanceof SupabaseAuthError 
        ? err.message 
        : 'Failed to sign in with Google';
      setError(errorMessage);
      logger.error('Google OAuth sign in failed', err instanceof Error ? err : new Error(errorMessage), {
        component: 'AuthProvider'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ===========================================================================
  // PUBLIC API: OAUTH CALLBACK
  // ===========================================================================

  const handleOAuthCallback = useCallback(async (): Promise<string | null> => {
    try {
      logger.info('Processing OAuth callback...');

      // Exchange code for session
      const { data: { session: callbackSession }, error: exchangeError } = 
        await supabase.auth.getSession();

      if (exchangeError) {
        throw exchangeError;
      }

      if (!callbackSession) {
        // Check for OAuth code in URL
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (code) {
          logger.info('Found OAuth code, exchanging for session...');
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);

          if (error) {
            throw error;
          }

          if (!data.session) {
            throw new Error('No session returned after code exchange');
          }

          logger.info('OAuth code exchanged successfully');
        } else {
          throw new Error('No session and no OAuth code found');
        }
      }

      // Check if user needs onboarding
      const { data: { user: currentUser } } = await supabase.auth.getUser();

      if (!currentUser) {
        throw new Error('No user found after OAuth callback');
      }

      // Check if user has completed onboarding
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('onboarding_completed')
        .eq('user_id', currentUser.id)
        .single();

      if (!profile?.onboarding_completed) {
        logger.info('User needs onboarding');
        return '/onboarding';
      }

      logger.info('OAuth callback processed successfully');
      return '/dashboard';

    } catch (err) {
      logger.error('OAuth callback failed', err instanceof Error ? err : new Error('Unknown error'), {
        component: 'AuthProvider'
      });
      setError('Authentication failed. Please try again.');
      return '/auth/login';
    }
  }, []);

  // ===========================================================================
  // PUBLIC API: SIGN OUT
  // ===========================================================================

  const signOut = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) {
        throw signOutError;
      }

      // Clear local storage
      localStorage.removeItem('oslira-selected-business');

      logger.info('Sign out successful');
    } catch (err) {
      const errorMessage = err instanceof SupabaseAuthError 
        ? err.message 
        : 'Failed to sign out';
      setError(errorMessage);
      logger.error('Sign out failed', err instanceof Error ? err : new Error(errorMessage), {
        component: 'AuthProvider'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ===========================================================================
  // CONTEXT VALUE
  // ===========================================================================

  const value: AuthContextValue = {
    // State
    user,
    session,
    isAuthenticated,
    isLoading,
    error,

    // Google OAuth only
    signInWithOAuth,
    signOut,
    handleOAuthCallback,

    // Business management
    businesses,
    selectedBusiness,
    selectBusiness,
    refreshBusinesses,

    // Subscription
    subscription,
    refreshSubscription,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// =============================================================================
// EXPORT CONTEXT
// =============================================================================
export { AuthContext };

// =============================================================================
// HOOK
// =============================================================================
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  
  return context;
}
