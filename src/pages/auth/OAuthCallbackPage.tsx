// src/pages/auth/OAuthCallbackPage.tsx

/**
 * OAUTH CALLBACK PAGE
 * 
 * Handles Google OAuth redirect after user authorizes
 * 
 * Flow:
 * 1. Extract authorization code from URL (?code=xxx)
 * 2. POST /api/auth/google/callback { code }
 * 3. Backend: Exchange with Google → Create user → Issue tokens
 * 4. Frontend: Store tokens + user in auth-manager
 * 5. Redirect based on onboarding_completed:
 *    - TRUE  → /dashboard
 *    - FALSE → /onboarding
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useAuth } from '@/features/auth/contexts/AuthProvider';
import { httpClient } from '@/core/auth/http-client';
import { logger } from '@/core/utils/logger';

// =============================================================================
// TYPES
// =============================================================================

type CallbackState = 'processing' | 'success' | 'error';

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  user: {
    id: string;
    email: string;
    full_name: string;
    avatar_url: string | null;
    onboarding_completed: boolean;
  };
  account: {
    id: string;
    name: string;
    credit_balance: number;
  };
  isNewUser: boolean;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function OAuthCallbackPage() {
  const [state, setState] = useState<CallbackState>('processing');
  const [message, setMessage] = useState('Completing sign-in...');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logger.info('[OAuthCallback] Component mounted');
    processCallback();
  }, []);

  /**
   * Process OAuth callback
   */
  async function processCallback() {
    try {
      logger.info('[OAuthCallback] Starting callback processing');
      
      // Step 1: Extract parameters from URL
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const error = params.get('error');
      const errorDescription = params.get('error_description');

      logger.info('[OAuthCallback] URL parameters extracted', {
        hasCode: !!code,
        codeLength: code?.length,
        hasError: !!error,
        error,
        errorDescription
      });

      // Handle OAuth errors from Google
      if (error) {
        logger.warn('[OAuthCallback] OAuth error from Google', { error, errorDescription });
        
        if (error === 'access_denied') {
          setErrorMessage('Sign-in cancelled');
          setState('error');
          logger.info('[OAuthCallback] User cancelled - redirecting to login');
          setTimeout(() => navigate('/auth/login'), 2000);
          return;
        }

        throw new Error(errorDescription || `OAuth error: ${error}`);
      }

      // Verify we have a code
      if (!code) {
        logger.error('[OAuthCallback] No authorization code in URL');
        throw new Error('No authorization code received');
      }

      // Step 2: Exchange code for tokens
      setMessage('Verifying with Google...');
      logger.info('[OAuthCallback] Exchanging code for tokens', {
        endpoint: '/api/auth/google/callback'
      });

      let response: AuthResponse;
      try {
        response = await httpClient.post<AuthResponse>(
          '/api/auth/google/callback',
          { code },
          { skipAuth: true } // This endpoint doesn't require auth
        );
        
        logger.info('[OAuthCallback] Token exchange successful', {
          isNewUser: response.isNewUser,
          userId: response.user?.id,
          email: response.user?.email,
          onboardingCompleted: response.user?.onboarding_completed,
          hasAccessToken: !!response.accessToken,
          hasRefreshToken: !!response.refreshToken
        });
      } catch (fetchError: any) {
        logger.error('[OAuthCallback] Token exchange failed', fetchError, {
          errorMessage: fetchError.message,
          errorName: fetchError.name
        });
        throw new Error(fetchError.message || 'Failed to exchange authorization code');
      }

      // Step 3: Store in auth-manager
      logger.info('[OAuthCallback] Storing tokens in auth-manager');
      try {
        login(
          response.accessToken,
          response.refreshToken,
          response.expiresAt,
          response.user,
          response.account
        );
        logger.info('[OAuthCallback] Auth state updated successfully');
      } catch (loginError) {
        logger.error('[OAuthCallback] Failed to update auth state', loginError as Error);
        throw new Error('Failed to store authentication data');
      }

      // Step 4: Success state
      setState('success');
      const welcomeMessage = response.isNewUser 
        ? 'Welcome to Oslira!' 
        : 'Welcome back!';
      setMessage(welcomeMessage);
      
      logger.info('[OAuthCallback] Authentication complete', {
        isNewUser: response.isNewUser,
        redirecting: true
      });

      // Step 5: Redirect based on onboarding status
      setTimeout(() => {
        if (response.user.onboarding_completed) {
          logger.info('[OAuthCallback] Redirecting to dashboard');
          navigate('/dashboard', { replace: true });
        } else {
          logger.info('[OAuthCallback] Redirecting to onboarding');
          navigate('/onboarding', { replace: true });
        }
      }, 1500);

    } catch (error: any) {
      logger.error('[OAuthCallback] Callback processing failed', error, {
        errorMessage: error.message,
        errorStack: error.stack
      });
      
      setState('error');
      setErrorMessage(error.message || 'Authentication failed');
      
      // Redirect to login after showing error
      setTimeout(() => {
        logger.info('[OAuthCallback] Redirecting to login after error');
        navigate('/auth/login', { replace: true });
      }, 3000);
    }
  }

  // ===========================================================================
  // RENDER
  // ===========================================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 max-w-md w-full text-center"
      >
        {/* Icon */}
        <div className="mb-6">
          {state === 'processing' && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"
            />
          )}

          {state === 'success' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto"
            >
              <Icon icon="mdi:check" className="text-4xl text-green-600" />
            </motion.div>
          )}

          {state === 'error' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto"
            >
              <Icon icon="mdi:alert-circle" className="text-4xl text-red-600" />
            </motion.div>
          )}
        </div>

        {/* Message */}
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {state === 'processing' && 'Signing you in...'}
          {state === 'success' && message}
          {state === 'error' && 'Sign-in failed'}
        </h2>

        <p className="text-slate-600">
          {state === 'processing' && message}
          {state === 'success' && 'Redirecting...'}
          {state === 'error' && (errorMessage || 'Please try again')}
        </p>

        {/* Debug info in development */}
        {state === 'error' && process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-3 bg-slate-100 rounded text-xs text-left">
            <p className="font-mono text-slate-700">
              Check browser console for detailed error logs
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
