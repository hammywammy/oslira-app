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
  const { isAuthenticated, isAuthReady } = useAuth();
  const { fetchBalance } = useCreditsService();
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    // Only fetch when auth is ready and user is authenticated
    // Use ref to ensure we only fetch once per auth session
    if (isAuthReady && isAuthenticated && !hasFetchedRef.current) {
      console.log('[CreditsInitializer] Auth ready and authenticated, fetching balance');
      fetchBalance();
      hasFetchedRef.current = true;
    }

    // Reset the ref when user logs out (isAuthenticated becomes false)
    if (!isAuthenticated) {
      hasFetchedRef.current = false;
    }
  }, [isAuthReady, isAuthenticated, fetchBalance]);

  // This component doesn't render anything
  return null;
}
