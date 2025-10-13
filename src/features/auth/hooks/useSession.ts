/**
 * @file Session Validation Hook
 * @description Migrated from SessionValidator.js - preserves ALL functionality
 * 
 * Features Preserved:
 * - Periodic server-side session validation (every 10 minutes)
 * - Network failure tolerance
 * - Automatic sign-out on invalid sessions
 * - Validation statistics tracking
 */

import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/core/lib/supabase';
import { logger } from '@/core/utils/logger';
import { AUTH } from '@/core/config/constants';

// =============================================================================
// TYPES
// =============================================================================

interface SessionValidationStats {
  validationCount: number;
  failureCount: number;
  lastValidation: number | null;
  isValidating: boolean;
}

interface UseSessionReturn {
  isValid: boolean;
  isValidating: boolean;
  stats: SessionValidationStats;
  validateNow: () => Promise<boolean>;
}

// =============================================================================
// HOOK
// =============================================================================

/**
 * Session validation hook
 * Validates session with server every 10 minutes (from SessionValidator.js)
 */
export function useSession(): UseSessionReturn {
  const [isValid, setIsValid] = useState(true);
  const [stats, setStats] = useState<SessionValidationStats>({
    validationCount: 0,
    failureCount: 0,
    lastValidation: null,
    isValidating: false,
  });

  const validationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  // ===========================================================================
  // VALIDATION LOGIC (from SessionValidator.js)
  // ===========================================================================

  const validateSession = async (): Promise<boolean> => {
    if (!isMountedRef.current) return false;

    setStats((prev) => ({ ...prev, isValidating: true }));

    try {
      logger.debug('Validating session with server...');

      // Get current user from Supabase (server-side validation)
      const { data: { user }, error } = await supabase.auth.getUser();

      if (!isMountedRef.current) return false;

      if (error || !user) {
        logger.warn('Session validation failed - invalid session', { error: error?.message });

        // Update stats
        setStats((prev) => ({
          ...prev,
          isValidating: false,
          failureCount: prev.failureCount + 1,
          lastValidation: Date.now(),
        }));

        setIsValid(false);

        // Sign out on invalid session (from SessionValidator.js behavior)
        await supabase.auth.signOut();
        
        return false;
      }

      // Session is valid
      logger.debug('Session validation successful', { userId: user.id });

      // Update stats
      setStats((prev) => ({
        ...prev,
        isValidating: false,
        validationCount: prev.validationCount + 1,
        lastValidation: Date.now(),
      }));

      setIsValid(true);
      return true;

    } catch (error) {
      logger.error('Session validation error', error as Error);

      if (!isMountedRef.current) return false;

      // Network error - don't sign out (from SessionValidator.js tolerance)
      setStats((prev) => ({
        ...prev,
        isValidating: false,
        failureCount: prev.failureCount + 1,
        lastValidation: Date.now(),
      }));

      // Keep session valid on network errors (tolerance)
      return true;
    }
  };

  // ===========================================================================
  // PERIODIC VALIDATION (from SessionValidator.js)
  // ===========================================================================

  useEffect(() => {
    isMountedRef.current = true;

    // Run initial validation
    validateSession();

    // Setup periodic validation (every 10 minutes)
    validationTimerRef.current = setInterval(() => {
      validateSession();
    }, AUTH.SESSION_VALIDATION_INTERVAL);

    logger.info('Session validation started', {
      interval: `${AUTH.SESSION_VALIDATION_INTERVAL / 1000}s`,
    });

    // Cleanup
    return () => {
      isMountedRef.current = false;
      
      if (validationTimerRef.current) {
        clearInterval(validationTimerRef.current);
        validationTimerRef.current = null;
      }

      logger.info('Session validation stopped');
    };
  }, []);

  // ===========================================================================
  // RETURN
  // ===========================================================================

  return {
    isValid,
    isValidating: stats.isValidating,
    stats,
    validateNow: validateSession,
  };
}
