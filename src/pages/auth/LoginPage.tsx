/**
 * @file Login Page - Minimal Professional Design
 * @description Clean, centered login with subtle depth
 */

import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GoogleOAuthButton } from '@/features/auth/components/GoogleOAuthButton';
import { useAuth } from '@/features/auth/contexts/AuthProvider';
import { logger } from '@/core/utils/logger';
import { Logo } from '@/shared/components/ui/Logo';

// ANIMATION VARIANTS - Very subtle
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

const slideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

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

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="w-5 h-5 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100/50 flex flex-col">
      {/* Main Content - Fully Centered */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="w-full max-w-[380px]"
        >
          {/* Logo - Centered Above Card */}
          <motion.div 
            variants={slideUp}
            className="flex justify-center mb-8"
          >
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <Logo size="lg" />
              <span className="text-2xl font-semibold text-neutral-900 tracking-tight">
                Oslira
              </span>
            </Link>
          </motion.div>

          {/* Card - Subtle Shadow for Depth */}
          <motion.div
            variants={slideUp}
            className="bg-white rounded-2xl shadow-xl shadow-neutral-200/50 border border-neutral-100 p-8"
          >
            {/* Welcome Text */}
            <div className="text-center mb-8">
              <h1 className="text-xl font-medium text-neutral-900 mb-2">
                Welcome back
              </h1>
              <p className="text-sm text-neutral-500">
                Sign in to continue to Oslira
              </p>
            </div>

            {/* Google OAuth Button */}
            <GoogleOAuthButton 
              label="Continue with Google"
              mode="login"
            />

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-4 bg-white text-neutral-400">
                  Secure authentication
                </span>
              </div>
            </div>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-neutral-600">
              New to Oslira?{' '}
              <Link 
                to="/auth/signup" 
                className="text-neutral-900 font-medium hover:underline underline-offset-2"
              >
                Create account
              </Link>
            </p>
          </motion.div>

          {/* Footer Links - Outside Card */}
          <motion.div 
            variants={slideUp}
            className="mt-8 flex items-center justify-center gap-6 text-xs text-neutral-400"
          >
            <a 
              href="/terms" 
              className="hover:text-neutral-600 transition-colors"
            >
              Terms
            </a>
            <span>•</span>
            <a 
              href="/privacy" 
              className="hover:text-neutral-600 transition-colors"
            >
              Privacy
            </a>
            <span>•</span>
            <a 
              href="/help" 
              className="hover:text-neutral-600 transition-colors"
            >
              Help
            </a>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
