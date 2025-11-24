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
  const { isFullyReady, isAuthenticated } = useAuth();
  const { fetchBalance } = useCreditsService();
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    // Only fetch when user is fully ready (authenticated AND onboarding completed)
    // Use ref to ensure we only fetch once per auth session
    if (isFullyReady && !hasFetchedRef.current) {
      console.log('[CreditsInitializer] User fully ready, fetching balance');
      fetchBalance().then(() => {
        if (!cancelled) {
          hasFetchedRef.current = true;
        }
      });
    }

    // Reset the ref when user logs out (isAuthenticated becomes false)
    if (!isAuthenticated) {
      hasFetchedRef.current = false;
    }

    return () => {
      cancelled = true;
    };
  }, [isFullyReady, isAuthenticated, fetchBalance]);

  // This component doesn't render anything
  return null;
}
