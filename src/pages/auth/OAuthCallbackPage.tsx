// src/pages/auth/OAuthCallbackPage.tsx
/**
 * @file OAuth Callback Page - Stripe-inspired Professional Design
 * @description Clean callback handler with elegant loading states
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useAuth } from '@/features/auth/contexts/AuthProvider';
import { httpClient } from '@/core/auth/http-client';
import { logger } from '@/core/utils/logger';
import { Logo } from '@/shared/components/ui/Logo';

// =============================================================================
// TYPES
// =============================================================================

type CallbackState = 'processing' | 'success' | 'error';

interface AuthResponse {
  data: {
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
      light_analyses_balance: number;
    };
    isNewUser: boolean;
  };
}

// =============================================================================
// ANIMATION VARIANTS
// =============================================================================

const fadeIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 }
  }
};

const checkmarkPath = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.4, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};

// =============================================================================
// COMPONENT
// =============================================================================

export function OAuthCallbackPage() {
  const [state, setState] = useState<CallbackState>('processing');
  const [message, setMessage] = useState('Completing sign-in');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logger.info('[OAuthCallback] Component mounted');
    processCallback();
  }, []);

  // Simulate progress for better UX
  useEffect(() => {
    if (state === 'processing') {
      const timer = setInterval(() => {
        setProgress((prev) => Math.min(prev + 15, 90));
      }, 200);
      return () => clearInterval(timer);
    } else if (state === 'success') {
      setProgress(100);
    }
    // Explicit return for other cases
    return undefined;
  }, [state]);

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
        hasError: !!error
      });

      // Handle OAuth errors from Google
      if (error) {
        logger.warn('[OAuthCallback] OAuth error from Google', { error, errorDescription });
        
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
        logger.error('[OAuthCallback] No authorization code in URL');
        throw new Error('No authorization code received');
      }

      // Step 2: Exchange code for tokens
      setMessage('Verifying with Google');
      logger.info('[OAuthCallback] Exchanging code for tokens');

      const response = await httpClient.post<AuthResponse>(
        '/api/auth/google/callback',
        { code },
        { skipAuth: true }
      );

      logger.info('[OAuthCallback] Token exchange successful', {
        isNewUser: response.data.isNewUser,
        userId: response.data.user?.id
      });

      // Step 3: Store in auth-manager and update React state
      setMessage('Setting up your account');

      // Call login() to store tokens, user data, mark auth ready, and update React state
      login(
        response.data.accessToken,
        response.data.refreshToken,
        response.data.expiresAt,
        response.data.user,
        response.data.account
      );

      // DIAGNOSTIC: Confirm token storage
      console.log('[OAuthCallback] DIAGNOSTIC: Token stored', {
        refreshTokenPrefix: response.data.refreshToken.substring(0, 8),
        localStorageToken: localStorage.getItem('oslira_refresh_token')?.substring(0, 8),
        timestamp: Date.now()
      });

      // Step 4: Success state
      setState('success');
      const welcomeMessage = response.data.isNewUser
        ? 'Welcome to Oslira!'
        : 'Welcome back!';
      setMessage(welcomeMessage);

      // Small delay to ensure React state has propagated
      await new Promise(resolve => setTimeout(resolve, 50));

      // Step 5: Navigate to appropriate page
      const redirectPath = response.data.user.onboarding_completed
        ? '/dashboard'
        : '/onboarding';
      logger.info('[OAuthCallback] Redirecting', { path: redirectPath });
      navigate(redirectPath, { replace: true });

    } catch (error: any) {
      logger.error('[OAuthCallback] Processing failed', error);
      setState('error');
      setErrorMessage(error.message || 'Authentication failed');
      
      // Redirect to login after showing error
      setTimeout(() => navigate('/auth/login'), 3000);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>

        {/* Status Card */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-8">
          <AnimatePresence mode="wait">
            {/* Processing State */}
            {state === 'processing' && (
              <motion.div
                key="processing"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={fadeIn}
                className="text-center"
              >
                {/* Spinner */}
                <div className="mb-6 flex justify-center">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-muted rounded-full"></div>
                    <div 
                      className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"
                      style={{
                        animationDuration: '1s'
                      }}
                    ></div>
                  </div>
                </div>

                {/* Status Text */}
                <h2 className="text-lg font-semibold text-foreground mb-2">
                  {message}
                </h2>
                <p className="text-sm text-muted-foreground">
                  This will only take a moment
                </p>

                {/* Progress Bar */}
                <div className="mt-6 h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                </div>
              </motion.div>
            )}

            {/* Success State */}
            {state === 'success' && (
              <motion.div
                key="success"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={fadeIn}
                className="text-center"
              >
                {/* Success Icon */}
                <div className="mb-6 flex justify-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <motion.path
                        variants={checkmarkPath}
                        initial="hidden"
                        animate="visible"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>

                {/* Success Text */}
                <h2 className="text-lg font-semibold text-foreground mb-2">
                  {message}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Redirecting to your dashboard...
                </p>
              </motion.div>
            )}

            {/* Error State */}
            {state === 'error' && (
              <motion.div
                key="error"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={fadeIn}
                className="text-center"
              >
                {/* Error Icon */}
                <div className="mb-6 flex justify-center">
                  <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
                    <Icon 
                      icon="ph:x-circle" 
                      className="w-8 h-8 text-destructive"
                    />
                  </div>
                </div>

                {/* Error Text */}
                <h2 className="text-lg font-semibold text-foreground mb-2">
                  Authentication failed
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  {errorMessage || 'Something went wrong. Please try again.'}
                </p>

                {/* Return Button */}
                <button
                  onClick={() => navigate('/auth/login')}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  <Icon icon="ph:arrow-left" className="w-4 h-4" />
                  Back to login
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Security Note */}
        {state === 'processing' && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-center text-xs text-muted-foreground"
          >
            <Icon icon="ph:lock" className="w-3 h-3 inline mr-1" />
            Secure connection with 256-bit encryption
          </motion.p>
        )}
      </div>
    </div>
  );
}
