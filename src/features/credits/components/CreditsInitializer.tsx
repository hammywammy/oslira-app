// src/features/credits/components/CreditsInitializer.tsx

/**
 * CREDITS INITIALIZER
 *
 * Initializes the credits store when user is authenticated.
 * Watches auth state and fetches balance when auth is ready.
 *
 * USAGE:
 * Place this component inside AuthProvider in App.tsx
 */

import { useEffect, useRef } from 'react';
import { useAuth } from '@/features/auth/contexts/AuthProvider';
import { useCreditsService } from '../hooks/useCreditsService';

export function CreditsInitializer() {
  const { isFullyReady, isAuthenticated, user } = useAuth();
  const { fetchBalance } = useCreditsService();
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    // Guard: Only fetch when fully ready AND user has completed onboarding
    // AND user object exists with correct onboarding status
    if (isFullyReady && user?.onboarding_completed && !hasFetchedRef.current) {
      console.log('[CreditsInitializer] User fully ready, fetching balance');
      fetchBalance().then(() => {
        if (!cancelled) {
          hasFetchedRef.current = true;
        }
      }).catch((error) => {
        // Don't retry on 403 - user state might still be transitioning
        if (error.message?.includes('Onboarding not completed')) {
          console.log('[CreditsInitializer] Onboarding transition - will retry');
          // Will retry on next render when state updates
        }
      });
    }

    // Reset the ref when user logs out
    if (!isAuthenticated) {
      hasFetchedRef.current = false;
    }

    return () => {
      cancelled = true;
    };
  }, [isFullyReady, isAuthenticated, user?.onboarding_completed, fetchBalance]);

  return null;
}
