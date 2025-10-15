// src/features/auth/contexts/AuthProvider.tsx

console.log('🔵 AuthProvider.tsx: FILE LOADED');

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
  signInWithOAuth: () => Promise<void>;
  signOut: () => Promise<void>;
  handleOAuthCallback: () => Promise<string | null>;
  businesses: Business[];
  selectedBusiness: Business | null;
  selectBusiness: (businessId: string) => void;
  refreshBusinesses: () => Promise<void>;
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
  console.log('🟢 AuthProvider: COMPONENT RENDERING');
  
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);

  console.log('🟡 AuthProvider: Initial state', { isLoading, isAuthenticated });

  // ===========================================================================
  // HELPER: LOAD BUSINESSES
  // ===========================================================================

  const loadBusinesses = useCallback(async (userId: string): Promise<void> => {
    try {
      logger.info('Loading user businesses...', { userId });
      const response = await httpClient.get<Business[]>('/v1/business', {
        params: { user_id: userId },
      });
      if (response.success && response.data) {
        setBusinesses(response.data);
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
      logger.warn('Failed to load businesses (non-critical)', { 
        error: err instanceof Error ? err.message : 'Unknown error',
        userId 
      });
    }
  }, [selectedBusiness]);

  // ===========================================================================
  // HELPER: LOAD SUBSCRIPTION
  // ===========================================================================

  const loadSubscription = useCallback(async (userId: string): Promise<void> => {
    try {
      logger.info('Loading user subscription...', { userId });
      const response = await httpClient.get<UserSubscription>('/v1/subscription', {
        params: { user_id: userId },
      });
      if (response.success && response.data) {
        setSubscription(response.data);
        logger.info('Subscription loaded', { plan: response.data.plan, status: response.data.status });
      } else {
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
  // INITIALIZATION
  // ===========================================================================

  useEffect(() => {
    console.log('🟣 AuthProvider: useEffect STARTED');
    let mounted = true;

    async function initializeAuth() {
      console.log('🔴 AuthProvider: initializeAuth() CALLED');
      try {
        console.log('⚪ AuthProvider: Fetching session...');
        const { data: { session: initialSession }, error: sessionError } = 
          await supabase.auth.getSession();

        console.log('🟠 AuthProvider: Session fetched', { 
          hasSession: !!initialSession,
          hasError: !!sessionError,
          mounted 
        });

        if (sessionError) {
          console.error('❌ AuthProvider: Session error', sessionError);
        }

        if (!mounted) {
          console.log('⚫ AuthProvider: Component unmounted, stopping');
          return;
        }

        if (initialSession && !sessionError) {
          console.log('✅ AuthProvider: User authenticated', initialSession.user.id);
          setSession(initialSession);
          setUser(initialSession.user);
          setIsAuthenticated(true);

          console.log('🔵 AuthProvider: Loading businesses & subscription...');
          await Promise.allSettled([
            loadBusinesses(initialSession.user.id),
            loadSubscription(initialSession.user.id),
          ]);
          console.log('🟢 AuthProvider: Businesses & subscription loaded');
        } else {
          console.log('⚠️ AuthProvider: No session, user not authenticated');
          setSession(null);
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('💥 AuthProvider: CRITICAL ERROR in initializeAuth', err);
        if (mounted) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to initialize auth';
          setError(errorMessage);
          setSession(null);
          setUser(null);
          setIsAuthenticated(false);
        }
      } finally {
        console.log('🎯 AuthProvider: Setting isLoading = false');
        if (mounted) {
          setIsLoading(false);
          console.log('✨ AuthProvider: Initialization COMPLETE');
        }
      }
    }

    initializeAuth();

    console.log('👂 AuthProvider: Setting up auth state listener');
const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
  (event, newSession) => {  // ← NO ASYNC
    console.log('🔔 AuthProvider: Auth state changed', { event, hasSession: !!newSession });
    if (!mounted) return;

    if (newSession) {
      setSession(newSession);
      setUser(newSession.user);
      setIsAuthenticated(true);
      
      // Defer async operations using setTimeout (Supabase best practice)
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setTimeout(() => {
          if (mounted) {
            Promise.allSettled([
              loadBusinesses(newSession.user.id),
              loadSubscription(newSession.user.id),
            ]).catch((err) => {
              logger.error('Failed to load user data after auth change', err);
            });
          }
        }, 0);
      }
    } else {
      setSession(null);
      setUser(null);
      setIsAuthenticated(false);
      setBusinesses([]);
      setSelectedBusiness(null);
      setSubscription(null);
    }
  }
);

    httpClient.setTokenProvider(async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      return currentSession?.access_token ?? null;
    });

    return () => {
      console.log('🧹 AuthProvider: Cleanup - unmounting');
      mounted = false;
      authSubscription.unsubscribe();
    };
  }, [loadBusinesses, loadSubscription]);

  // ===========================================================================
  // PUBLIC API
  // ===========================================================================

  const refreshBusinesses = useCallback(async () => {
    if (user) await loadBusinesses(user.id);
  }, [user, loadBusinesses]);

  const refreshSubscription = useCallback(async () => {
    if (user) await loadSubscription(user.id);
  }, [user, loadSubscription]);

  const selectBusiness = useCallback((businessId: string) => {
    const business = businesses.find((b) => b.id === businessId);
    if (business) {
      setSelectedBusiness(business);
      localStorage.setItem('oslira-selected-business', business.id);
      logger.info('Business selected', { businessId, name: business.name });
    }
  }, [businesses]);

  const signInWithOAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const redirectTo = `${window.location.origin}/auth/callback`;
      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo, scopes: 'email profile' },
      });
      if (signInError) throw signInError;
      logger.info('Google OAuth sign in initiated');
    } catch (err) {
      const errorMessage = err instanceof SupabaseAuthError 
        ? err.message 
        : 'Failed to sign in with Google';
      setError(errorMessage);
      logger.error('Google OAuth sign in failed', err instanceof Error ? err : new Error(errorMessage));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

 const handleOAuthCallback = useCallback(async (): Promise<string | null> => {
  try {
    // Add 10s timeout to prevent infinite hang
    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('Callback timeout - please try again')), 10000)
    );

    const callbackPromise = (async () => {
      const { data: { session: callbackSession }, error: exchangeError } = 
        await supabase.auth.getSession();
      
      if (exchangeError) throw exchangeError;
      
      if (!callbackSession) {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        
        if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
          if (!data.session) throw new Error('No session returned after code exchange');
        } else {
          throw new Error('No session and no OAuth code found');
        }
      }
      
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) throw new Error('No user found after OAuth callback');
      
      // Query profile with timeout protection
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('onboarding_completed')
        .eq('user_id', currentUser.id)
        .single();
      
      if (!profile?.onboarding_completed) return '/onboarding';
      return '/dashboard';
    })();

    return await Promise.race([callbackPromise, timeoutPromise]);

  } catch (err) {
    logger.error('OAuth callback failed', err instanceof Error ? err : new Error('Unknown error'));
    setError('Authentication failed. Please try again.');
    return '/auth/login';
  }
}, []);

  const signOut = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;
      localStorage.removeItem('oslira-selected-business');
      logger.info('Sign out successful');
    } catch (err) {
      const errorMessage = err instanceof SupabaseAuthError 
        ? err.message 
        : 'Failed to sign out';
      setError(errorMessage);
      logger.error('Sign out failed', err instanceof Error ? err : new Error(errorMessage));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value: AuthContextValue = {
    user,
    session,
    isAuthenticated,
    isLoading,
    error,
    signInWithOAuth,
    signOut,
    handleOAuthCallback,
    businesses,
    selectedBusiness,
    selectBusiness,
    refreshBusinesses,
    subscription,
    refreshSubscription,
  };

  console.log('🎨 AuthProvider: About to render children', { isLoading, isAuthenticated, hasUser: !!user });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// =============================================================================
// EXPORTS
// =============================================================================

export { AuthContext };

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
