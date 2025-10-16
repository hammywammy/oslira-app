// src/features/auth/hooks/useSession.ts
/**
 * @file Session Management Hook
 * @description React hook for session validation and management
 * 
 * Preserves functionality from SessionValidator.js:
 * - Periodic session validation
 * - Server-side validation
 * - Automatic sign-out on invalid session
 * - Validation statistics
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/core/lib/supabase';
import { logger } from '@/core/utils/logger';
import { AUTH } from '@/core/config/constants';

// =============================================================================
// TYPES
// =============================================================================

interface SessionStats {
  isValidating: boolean;
  validationCount: number;
  failureCount: number;
  lastValidation: number;
}

interface UseSessionReturn {
  session: Session | null;
  isValid: boolean;
  isValidating: boolean;
  stats: SessionStats;
  validateSession: () => Promise<boolean>;
  refreshSession: () => Promise<boolean>;
}

// =============================================================================
// HOOK
// =============================================================================

export function useSession(): UseSessionReturn {
  const [session, setSession] = useState<Session | null>(null);
  const [isValid, setIsValid] = useState(false);
  const [stats, setStats] = useState<SessionStats>({
    isValidating: false,
    validationCount: 0,
    failureCount: 0,
    lastValidation: 0,
  });

  const validationTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isMountedRef = useRef(true);

  // ===========================================================================
  // VALIDATION LOGIC (from SessionValidator.js)
  // ===========================================================================

  const validateSession = useCallback(async (): Promise<boolean> => {
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
      const err = error instanceof Error ? error : new Error(String(error));
      logger.error('Session validation error', err);

      if (!isMountedRef.current) return false;

      setStats((prev) => ({
        ...prev,
        isValidating: false,
        failureCount: prev.failureCount + 1,
        lastValidation: Date.now(),
      }));

      setIsValid(false);
      return false;
    }
  }, []);

  // ===========================================================================
  // REFRESH SESSION
  // ===========================================================================

  const refreshSession = useCallback(async (): Promise<boolean> => {
    if (!isMountedRef.current) return false;

    try {
      logger.debug('Refreshing session...');

      const { data, error } = await supabase.auth.refreshSession();

      if (!isMountedRef.current) return false;

      if (error || !data.session) {
        logger.warn('Session refresh failed', { error: error?.message });
        return false;
      }

      logger.debug('Session refreshed successfully');
      setSession(data.session);
      setIsValid(true);
      return true;

    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      logger.error('Session refresh error', err);
      return false;
    }
  }, []);

  // ===========================================================================
  // SETUP PERIODIC VALIDATION
  // ===========================================================================

  useEffect(() => {
    // Get initial session
    async function getInitialSession() {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (isMountedRef.current && currentSession) {
        setSession(currentSession);
        setIsValid(true);
      }
    }

    getInitialSession();

    // Setup auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (isMountedRef.current) {
        setSession(newSession);
        setIsValid(!!newSession);
      }
    });

    // Setup periodic validation (every 5 minutes)
    validationTimerRef.current = setInterval(() => {
      if (isMountedRef.current) {
        validateSession();
      }
    }, AUTH.VALIDATION_INTERVAL);

    logger.debug('Session validation enabled', {
      interval: AUTH.VALIDATION_INTERVAL / 1000 / 60, // minutes
    });

    return () => {
      isMountedRef.current = false;
      subscription.unsubscribe();
      
      if (validationTimerRef.current) {
        clearInterval(validationTimerRef.current);
        validationTimerRef.current = null;
      }
    };
  }, [validateSession]);

  // ===========================================================================
  // RETURN
  // ===========================================================================

  return {
    session,
    isValid,
    isValidating: stats.isValidating,
    stats,
    validateSession,
    refreshSession,
  };
}

// =============================================================================
// EXPORTS
// =============================================================================

export default useSession;
