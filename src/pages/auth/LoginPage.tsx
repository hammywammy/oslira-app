// src/pages/auth/LoginPage.tsx
/**
 * @file Login Page
 * @description Professional login page with Google OAuth only
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GoogleOAuthButton } from '@/features/auth/components/GoogleOAuthButton';
import { useAuth } from '@/features/auth/contexts/AuthProvider';
import { logger } from '@/core/utils/logger';
import { Logo } from '@/shared/components/ui/Logo';

// =============================================================================
// ANIMATION VARIANTS
// =============================================================================

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

// =============================================================================
// COMPONENT
// =============================================================================

export function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      logger.info('User already authenticated, redirecting to dashboard');
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

// TEMPORARY FIX: Show page even while loading
// TODO: Fix AuthProvider initialization race condition
if (isAuthenticated) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"
      />
    </div>
  );
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 flex items-center justify-center px-4">
<motion.div
  animate="visible"
  variants={staggerContainer}
>
        {/* Logo & Header */}
        <motion.div variants={fadeIn} className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
<Logo size="lg" />
            <span className="text-2xl font-bold text-slate-900">Oslira</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome back
          </h1>
          <p className="text-slate-600">
            Sign in to continue to your account
          </p>
        </motion.div>

        {/* Auth Card */}
        <motion.div 
          variants={fadeIn}
          className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8"
        >
          <GoogleOAuthButton label="Sign in with Google" />

          {/* Divider */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-center text-sm text-slate-500">
              Don't have an account?{' '}
              <a 
                href="/auth/signup" 
                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Get started free
              </a>
            </p>
          </div>
        </motion.div>

        {/* Footer Links */}
        <motion.div variants={fadeIn} className="mt-6 text-center">
          <p className="text-xs text-slate-500 mb-3">
            By continuing, you agree to our{' '}
            <a href="/legal/terms" className="underline hover:text-slate-700">Terms</a>
            {' '}and{' '}
            <a href="/legal/privacy" className="underline hover:text-slate-700">Privacy Policy</a>
          </p>
          <div className="flex items-center justify-center gap-4 text-xs">
            <a href="/" className="text-slate-600 hover:text-slate-900 transition-colors">
              ← Back to home
            </a>
            <span className="text-slate-300">|</span>
            <a href="/contact" className="text-slate-600 hover:text-slate-900 transition-colors">
              Need help?
            </a>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
