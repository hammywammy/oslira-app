// src/pages/auth/OAuthCallbackPage.tsx
/**
 * @file OAuth Callback Page - STANDALONE AUTH HANDLER
 * @description Completes OAuth flow BEFORE app initialization
 * 
 * CRITICAL: This page handles auth exchange independently of AuthProvider
 * to prevent race conditions. It completes the auth flow, then triggers
 * a full app reload so AuthProvider initializes with a valid session.
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { createClient } from '@supabase/supabase-js';
import { getConfig } from '@/core/config/env';

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

    async function processCallback() {
      console.log('🔵 OAuthCallback: STANDALONE HANDLER STARTED');
      
      try {
        // Get URL parameters
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const error = params.get('error');
        const errorDescription = params.get('error_description');

        console.log('🟡 OAuthCallback: URL params', { hasCode: !!code, error, errorDescription });

        // Check for OAuth errors
        if (error) {
          console.log('❌ OAuthCallback: Error in URL');
          
          if (error === 'access_denied') {
            setStatusMessage('Sign-in cancelled. Redirecting...');
            setTimeout(() => {
              if (mounted) window.location.href = '/auth/login';
            }, 1500);
            return;
          }

          throw new Error(errorDescription || `OAuth error: ${error}`);
        }

        // Verify we have a code
        if (!code) {
          throw new Error('No authorization code received');
        }

        // Get config (your app uses getConfig(), not import.meta.env)
        const config = getConfig();

        // Create a fresh Supabase client (independent of app state)
        const supabase = createClient(
          config.supabaseUrl,
          config.supabaseAnonKey,
          {
            auth: {
              persistSession: true,
              storageKey: 'oslira-auth', // Same key as your app
              autoRefreshToken: true,
              detectSessionInUrl: true,
              flowType: 'pkce',
            },
          }
        );

        console.log('🟢 OAuthCallback: Exchanging code for session...');
        setStatusMessage('Verifying your credentials...');

        // Exchange the code for a session
        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

        if (exchangeError) {
          console.error('❌ OAuthCallback: Exchange failed', exchangeError);
          throw exchangeError;
        }

        if (!data.session) {
          throw new Error('No session returned after code exchange');
        }

        console.log('✅ OAuthCallback: Session established!', {
          userId: data.session.user.id,
          expiresAt: data.session.expires_at,
        });

        if (!mounted) return;

        // Check if user needs onboarding
        console.log('🔍 OAuthCallback: Checking onboarding status...');
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('onboarding_completed')
          .eq('user_id', data.session.user.id)
          .single();

        const needsOnboarding = !profile?.onboarding_completed;
        const redirectPath = needsOnboarding ? '/onboarding' : '/dashboard';

        console.log('🎯 OAuthCallback: Redirect determined', { 
          needsOnboarding, 
          redirectPath 
        });

        setState('success');
        setStatusMessage('Success! Redirecting...');

        // CRITICAL: Use window.location.href instead of navigate()
        // This forces a full page reload, ensuring AuthProvider initializes
        // with the newly established session from localStorage
        setTimeout(() => {
          if (mounted) {
            console.log('🚀 OAuthCallback: Redirecting to', redirectPath);
            window.location.href = redirectPath;
          }
        }, 1000);

      } catch (err) {
        console.error('💥 OAuthCallback: Error in processCallback', err);
        
        if (!mounted) return;

        setState('error');
        setErrorMessage(err instanceof Error ? err.message : 'Authentication failed');
      }
    }

    processCallback();

    return () => {
      mounted = false;
    };
  }, []);

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
              <p className="text-slate-600">
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
              <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                <Icon icon="mdi:alert-circle" className="text-4xl text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Authentication Failed
              </h3>
              <p className="text-slate-600 mb-6">
                {errorMessage || 'Something went wrong. Please try again.'}
              </p>
              <motion.button
                onClick={handleRetry}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                Try Again
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
