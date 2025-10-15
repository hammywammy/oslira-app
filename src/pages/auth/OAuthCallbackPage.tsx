// src/pages/auth/OAuthCallbackPage.tsx
/**
 * @file OAuth Callback Page
 * @description Processes OAuth callback from Supabase, then redirects
 */

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useAuth } from '@/features/auth/contexts/AuthProvider';
import { logger } from '@/core/utils/logger';

// =============================================================================
// TYPES
// =============================================================================

type CallbackState = 'processing' | 'success' | 'error';

// =============================================================================
// COMPONENT
// =============================================================================

export function OAuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { handleOAuthCallback } = useAuth();
  
  const [state, setState] = useState<CallbackState>('processing');
  const [statusMessage, setStatusMessage] = useState('Processing authentication...');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

// In OAuthCallbackPage.tsx, add these console.logs to the processCallback function:

async function processCallback() {
  console.log('🔵 OAuthCallback: processCallback STARTED');
  
  try {
    logger.info('Processing OAuth callback...');

    // Check for errors
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');
    
    console.log('🟡 OAuthCallback: URL params', { error, errorDescription });

    if (error) {
      console.log('❌ OAuthCallback: Error in URL');
      const errorMsg = `OAuth error: ${error}${errorDescription ? ` - ${errorDescription}` : ''}`;
      logger.error('OAuth error in URL', new Error(errorMsg));

      if (error === 'access_denied') {
        setStatusMessage('Redirecting back to login...');
        setTimeout(() => {
          if (mounted) navigate('/auth/login', { replace: true });
        }, 1500);
        return;
      }

      throw new Error(getErrorMessage(error, errorDescription));
    }

    // Call handleOAuthCallback
    console.log('🟢 OAuthCallback: Calling handleOAuthCallback...');
    setStatusMessage('Verifying your credentials...');
    
    const redirectPath = await handleOAuthCallback();
    
    console.log('🟣 OAuthCallback: handleOAuthCallback returned', { redirectPath, mounted });

    if (!mounted) {
      console.log('⚫ OAuthCallback: Component unmounted, stopping');
      return;
    }

    // Check redirect path
    if (!redirectPath || redirectPath === '/auth/login') {
      console.log('❌ OAuthCallback: Invalid redirect path');
      throw new Error('Authentication failed. No valid session.');
    }

    console.log('✅ OAuthCallback: Success! Setting state and redirecting');
    logger.info('Authentication successful', { redirectPath });        
    setState('success');
    setStatusMessage('Success! Redirecting...');

    // Brief delay for UX, then redirect
    setTimeout(() => {
      console.log('🚀 OAuthCallback: Navigating to', redirectPath);
      if (mounted) navigate(redirectPath, { replace: true });
    }, 1000);

  } catch (err) {
    console.error('💥 OAuthCallback: Error in processCallback', err);
    logger.error('Callback processing failed', err as Error, { component: 'OAuthCallbackPage' });
    
    if (!mounted) return;

    setState('error');
    setErrorMessage(err instanceof Error ? err.message : 'Authentication failed');
  }
}

    processCallback();

    return () => {
      mounted = false;
    };
  }, [searchParams, handleOAuthCallback, navigate]);

  // ===========================================================================
  // ERROR MESSAGE HELPER
  // ===========================================================================
  function getErrorMessage(error: string, description: string | null): string {
    const errorMessages: Record<string, string> = {
      'access_denied': 'Sign-in was cancelled',
      'invalid_request': 'Invalid authentication request',
      'server_error': 'Server error occurred',
      'temporarily_unavailable': 'Service temporarily unavailable'
    };

    return errorMessages[error] || description || 'Authentication failed';
  }

  // ===========================================================================
  // RETRY HANDLER
  // ===========================================================================
  const handleRetry = () => {
    navigate('/auth/login', { replace: true });
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
