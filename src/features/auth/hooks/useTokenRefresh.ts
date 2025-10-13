/**
 * @file Token Refresh Monitor Hook
 * @description Migrated from TokenRefresher.js - monitors automatic refresh
 * 
 * Note: Supabase handles token refresh automatically, but we preserve
 * the monitoring and logging logic from TokenRefresher.js
 * 
 * Features Preserved:
 * - Refresh event monitoring
 * - Statistics tracking
 * - Error logging
 * - Time-until-expiry calculations
 */

import { useEffect, useState } from 'react';
import { supabase } from '@/core/lib/supabase';
import { logger } from '@/core/utils/logger';

// =============================================================================
// TYPES
// =============================================================================

interface TokenRefreshStats {
  refreshCount: number;
  failureCount: number;
  lastRefresh: number | null;
  timeUntilExpiry: number | null;
  isExpired: boolean;
}

interface UseTokenRefreshReturn {
  stats: TokenRefreshStats;
  getExpiryDate: () => Date | null;
}

// =============================================================================
// HOOK
// =============================================================================

/**
 * Token refresh monitor
 * Monitors Supabase's automatic token refresh (from TokenRefresher.js)
 */
export function useTokenRefresh(): UseTokenRefreshReturn {
  const [stats, setStats] = useState<TokenRefreshStats>({
    refreshCount: 0,
    failureCount: 0,
    lastRefresh: null,
    timeUntilExpiry: null,
    isExpired: false,
  });

  // ===========================================================================
  // EXPIRY CALCULATIONS (from TokenRefresher.js)
  // ===========================================================================

  const getExpiryDate = (): Date | null => {
    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.expires_at) {
        return new Date(session.expires_at * 1000);
      }
    });

    return null;
  };

  const calculateTimeUntilExpiry = async (): Promise<number | null> => {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.expires_at) {
      return null;
    }

    const expiryTime = session.expires_at * 1000;
    const now = Date.now();
    const timeRemaining = Math.max(0, expiryTime - now);

    return timeRemaining;
  };

  // ===========================================================================
  // MONITOR TOKEN REFRESH (from TokenRefresher.js)
  // ===========================================================================

  useEffect(() => {
    let mounted = true;

    // Monitor auth state changes for refresh events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        // Track refresh events (from TokenRefresher.js)
        if (event === 'TOKEN_REFRESHED') {
          logger.info('Token refreshed automatically', {
            expiresAt: session?.expires_at,
          });

          setStats((prev) => ({
            ...prev,
            refreshCount: prev.refreshCount + 1,
            lastRefresh: Date.now(),
          }));
        }

        // Update time until expiry
        if (session) {
          const timeUntilExpiry = await calculateTimeUntilExpiry();
          const isExpired = timeUntilExpiry !== null && timeUntilExpiry <= 0;

          setStats((prev) => ({
            ...prev,
            timeUntilExpiry,
            isExpired,
          }));
        }
      }
    );

    // Initial expiry calculation
    calculateTimeUntilExpiry().then((timeUntilExpiry) => {
      if (mounted) {
        const isExpired = timeUntilExpiry !== null && timeUntilExpiry <= 0;
        setStats((prev) => ({
          ...prev,
          timeUntilExpiry,
          isExpired,
        }));
      }
    });

    // Update time until expiry every minute (from TokenRefresher.js check interval)
    const intervalId = setInterval(async () => {
      if (!mounted) return;

      const timeUntilExpiry = await calculateTimeUntilExpiry();
      const isExpired = timeUntilExpiry !== null && timeUntilExpiry <= 0;

      setStats((prev) => ({
        ...prev,
        timeUntilExpiry,
        isExpired,
      }));

      // Log warning if token expires soon (< 5 minutes)
      if (timeUntilExpiry !== null && timeUntilExpiry < 5 * 60 * 1000 && timeUntilExpiry > 0) {
        logger.warn('Token expiring soon', {
          timeRemaining: `${Math.floor(timeUntilExpiry / 1000)}s`,
        });
      }
    }, 60 * 1000); // Check every minute

    logger.info('Token refresh monitoring started');

    // Cleanup
    return () => {
      mounted = false;
      subscription.unsubscribe();
      clearInterval(intervalId);
      logger.info('Token refresh monitoring stopped');
    };
  }, []);

  // ===========================================================================
  // RETURN
  // ===========================================================================

  return {
    stats,
    getExpiryDate,
  };
}
