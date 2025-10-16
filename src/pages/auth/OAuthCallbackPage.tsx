// src/pages/auth/OAuthCallbackPage.tsx
/**
 * @file OAuth Callback Page - FIXED
 * @description Completes OAuth flow using SINGLETON Supabase instance
 * 
 * CHANGES:
 * 1. Removed duplicate Supabase client creation
 * 2. Uses singleton from @/core/lib/supabase
 * 3. Added explicit redirect after success
 * 4. Fixed async timing issues
 * 5. TypeScript strict mode compliant
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { supabase } from '@/core/lib/supabase';
import { logger } from '@/core/utils/logger';

// =============================================================================
// TYPES
// =============================================================================

type CallbackState = 'processing' | 'success' | 'error';

// =============================================================================
// COMPONENT
// =============================================================================

export function OAuthCallbackPage() {
  const [state, setState] = useState<CallbackState>('processing');
  const [statusMessage, setStatusMessage] = useState('Processing authentication...');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let redirectTimer: ReturnType<typeof setTimeout> | null = null;

    async function processCallback() {
      logger.info('OAuth callback started');
      
      try {
        // Get URL parameters
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const error = params.get('error');
        const errorDescription = params.get('error_description');

        logger.debug('OAuth callback params', { hasCode: !!code, error });

        // Check for OAuth errors
        if (error) {
          const errorObj = new Error(errorDescription || `OAuth error: ${error}`);
          logger.error('OAuth error in URL', errorObj, { 
            errorCode: error,
            description: errorDescription 
          });
          
          if (error === 'access_denied') {
            setStatusMessage('Sign-in cancelled. Redirecting...');
            redirectTimer = setTimeout(() => {
              if (mounted) window.location.href = '/auth/login';
            }, 1500);
            return;
          }

          throw errorObj;
        }

        // Verify we have a code
        if (!code) {
          throw new Error('No authorization code received');
        }

        logger.info('Exchanging OAuth code for session');
        setStatusMessage('Verifying your credentials...');

        // Exchange the code for a session using SINGLETON client
        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

        if (exchangeError) {
          logger.error('OAuth code exchange failed', exchangeError);
          throw exchangeError;
        }

        if (!data.session) {
          throw new Error('No session returned after code exchange');
        }

        logger.info('OAuth session established', {
          userId: data.session.user.id,
          expiresAt: data.session.expires_at,
        });

        if (!mounted) return;

        // Check if user needs onboarding
        logger.debug('Checking onboarding status');
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('onboarding_completed')
          .eq('user_id', data.session.user.id)
          .maybeSingle();

        if (profileError) {
          logger.warn('Failed to fetch profile, assuming needs onboarding', {
            message: profileError.message,
            code: profileError.code,
          });
        }

        const needsOnboarding = !profile?.onboarding_completed;
        const redirectPath = needsOnboarding ? '/onboarding' : '/dashboard';

        logger.info('OAuth callback complete', { 
          needsOnboarding, 
          redirectPath 
        });

        if (!mounted) return;

        setState('success');
        setStatusMessage('Success! Redirecting...');

        // CRITICAL: Clear URL params and redirect
        // This prevents the callback from re-running on page reload
        redirectTimer = setTimeout(() => {
          if (mounted) {
            logger.info('Redirecting after OAuth success', { redirectPath });
            window.location.href = redirectPath;
          }
        }, 1000);

      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        logger.error('OAuth callback failed', error);
        
        if (!mounted) return;

        setState('error');
        setErrorMessage(error.message);
      }
    }

    processCallback();

    return () => {
      mounted = false;
      if (redirectTimer) {
        clearTimeout(redirectTimer);
      }
    };
  }, []); // Empty deps - only run once

  // ===========================================================================
  // RETRY HANDLER
  // ===========================================================================
  const handleRetry = () => {
    window.location.href = '/auth/login';
  };

  // ===========================================================================
  // RENDER
  // ===========================================================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          {/* PROCESSING STATE */}
          {state === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl border border-slate-200 p-12 text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 mx-auto mb-6 border-4 border-blue-600 border-t-transparent rounded-full"
              />
              <p className="text-lg font-semibold text-slate-900 mb-2">
                {statusMessage}
              </p>
              <p className="text-sm text-slate-500">
                Please wait a moment...
              </p>
            </motion.div>
          )}

          {/* SUCCESS STATE */}
          {state === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl border border-slate-200 p-12 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center"
              >
                <Icon icon="mdi:check" className="text-4xl text-green-600" />
              </motion.div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Authentication Successful!
              </h3>
              <p className="text-sm text-slate-500">
                {statusMessage}
              </p>
            </motion.div>
          )}

          {/* ERROR STATE */}
          {state === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl border border-slate-200 p-12 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center"
              >
                <Icon icon="mdi:alert-circle" className="text-4xl text-red-600" />
              </motion.div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Authentication Failed
              </h3>
              <p className="text-sm text-slate-600 mb-6">
                {errorMessage || 'Something went wrong'}
              </p>
              <button
                onClick={handleRetry}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Back to Login
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
