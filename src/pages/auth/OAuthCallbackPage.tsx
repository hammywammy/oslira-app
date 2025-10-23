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
    processCallback();
  }, []);

  /**
   * Process OAuth callback
   */
  async function processCallback() {
    try {
      // Step 1: Extract code from URL
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const error = params.get('error');
      const errorDescription = params.get('error_description');

      // Handle OAuth errors from Google
      if (error) {
        if (error === 'access_denied') {
          setErrorMessage('Sign-in cancelled');
          setState('error');
          setTimeout(() => navigate('/auth/login'), 2000);
          return;
        }

        throw new Error(errorDescription || `OAuth error: ${error}`);
      }

      // Verify we have a code
      if (!code) {
        throw new Error('No authorization code received');
      }

      // Step 2: Exchange code for tokens
      setMessage('Verifying with Google...');

      const response = await httpClient.post<AuthResponse>(
        '/api/auth/google/callback',
        { code },
        { skipAuth: true } // This endpoint doesn't require auth
      );

      // Step 3: Store in auth-manager
      login(
        response.accessToken,
        response.refreshToken,
        response.expiresAt,
        response.user,
        response.account
      );

      // Step 4: Success state
      setState('success');
      setMessage(response.isNewUser ? 'Welcome to Oslira!' : 'Welcome back!');

      // Step 5: Redirect based on onboarding
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Brief success message

      if (response.user.onboarding_completed) {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/onboarding', { replace: true });
      }
    } catch (error: any) {
      console.error('[OAuthCallback] Error:', error);
      setState('error');
      setErrorMessage(error.message || 'Authentication failed');

      // Redirect to login after 3 seconds
      setTimeout(() => navigate('/auth/login'), 3000);
    }
  }

  // ===========================================================================
  // RENDER
  // ===========================================================================

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        {/* Processing State */}
        {state === 'processing' && (
          <div className="space-y-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 mx-auto"
            >
              <Icon
                icon="mdi:loading"
                className="w-full h-full text-blue-600"
              />
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                {message}
              </h2>
              <p className="text-slate-600">This will only take a moment</p>
            </div>
          </div>
        )}

        {/* Success State */}
        {state === 'success' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="space-y-6"
          >
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <Icon
                icon="mdi:check"
                className="w-10 h-10 text-green-600"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                {message}
              </h2>
              <p className="text-slate-600">Redirecting you now...</p>
            </div>
          </motion.div>
        )}

        {/* Error State */}
        {state === 'error' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="space-y-6"
          >
            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <Icon
                icon="mdi:alert-circle"
                className="w-10 h-10 text-red-600"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Authentication Failed
              </h2>
              <p className="text-slate-600 mb-4">
                {errorMessage || 'Something went wrong'}
              </p>
              <p className="text-sm text-slate-500">
                Redirecting to login page...
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
