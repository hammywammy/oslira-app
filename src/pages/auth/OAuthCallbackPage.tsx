// pages/auth/OAuthCallbackPage.tsx

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useAuth } from '@/features/auth/contexts/AuthProvider';
import { api } from '@/core/api/client';
import { logger } from '@/core/utils/logger';

/**
 * OAUTH CALLBACK PAGE
 * 
 * Handles Google OAuth callback
 * 
 * Flow:
 * 1. Extract authorization code from URL
 * 2. POST /api/auth/google/callback with code
 * 3. Backend exchanges code with Google
 * 4. Backend creates/updates user (atomic)
 * 5. Backend returns tokens + user info
 * 6. Frontend stores tokens in AuthContext
 * 7. Redirect based on onboarding status
 */

type CallbackState = 'processing' | 'success' | 'error';

export function OAuthCallbackPage() {
  const [state, setState] = useState<CallbackState>('processing');
  const [message, setMessage] = useState('Completing sign-in...');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const processCallback = async () => {
      try {
        // Extract code from URL
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const error = params.get('error');
        const errorDescription = params.get('error_description');

        // Handle OAuth errors
        if (error) {
          logger.error('OAuth error in URL', new Error(error), { errorDescription });
          
          if (error === 'access_denied') {
            setMessage('Sign-in cancelled');
            setTimeout(() => navigate('/auth/login'), 2000);
            return;
          }

          throw new Error(errorDescription || `OAuth error: ${error}`);
        }

        // Verify we have a code
        if (!code) {
          throw new Error('No authorization code received');
        }

        logger.info('Processing OAuth callback', { hasCode: true });

        // Exchange code for tokens
        setMessage('Verifying with Google...');
        
        const response = await api.post('/api/auth/google/callback', { code });

        if (!mounted) return;

        const {
          accessToken,
          refreshToken,
          expiresAt,
          user,
          account,
          isNewUser
        } = response.data;

        logger.info('OAuth successful', { 
          userId: user.id, 
          isNewUser,
          onboarding: user.onboarding_completed 
        });

        // Store auth in context
        login(accessToken, refreshToken, expiresAt, user, account);

        // Success state
        setState('success');
        setMessage(isNewUser ? 'Welcome to Oslira!' : 'Welcome back!');

        // Redirect based on onboarding status
        const redirectPath = user.onboarding_completed ? '/dashboard' : '/onboarding';
        
        setTimeout(() => {
          if (mounted) {
            logger.info('Redirecting after OAuth', { redirectPath });
            navigate(redirectPath, { replace: true });
          }
        }, 1500);

      } catch (error: any) {
        logger.error('OAuth callback failed', error);

        if (!mounted) return;

        setState('error');
        setErrorMessage(error.message || 'Authentication failed');
      }
    };

    processCallback();

    return () => {
      mounted = false;
    };
  }, [login, navigate]);

  // ===============================================================================
  // RENDER
  // ===============================================================================

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
                {message}
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
                {message}
              </h3>
              <p className="text-sm text-slate-500">
                Redirecting you now...
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
                {errorMessage}
              </p>
              <button
                onClick={() => navigate('/auth/login')}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
