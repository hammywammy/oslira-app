// src/pages/auth/SignupPage.tsx
/**
 * @file Signup Page (Get Started)
 * @description New user signup with 25 free credits messaging
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { GoogleOAuthButton } from '@/features/auth/components/GoogleOAuthButton';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { logger } from '@/core/utils/logger';

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

export function SignupPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      logger.info('User already authenticated, redirecting to dashboard');
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Don't render if loading or already authenticated
  if (isLoading || isAuthenticated) {
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
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="w-full max-w-md"
      >
        {/* Logo & Header */}
        <motion.div variants={fadeIn} className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <img 
              src="/assets/images/oslira-logo.png" 
              alt="Oslira" 
              className="w-12 h-12"
            />
            <span className="text-2xl font-bold text-slate-900">Oslira</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Start your free trial
          </h1>
          <p className="text-slate-600">
            Get 25 free credits for AI-powered lead analysis
          </p>
        </motion.div>

        {/* Auth Card */}
        <motion.div 
          variants={fadeIn}
          className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8"
        >
          {/* Feature Highlights */}
          <div className="mb-6 space-y-3">
            {[
              { icon: 'mdi:gift-outline', text: '25 free credits included' },
              { icon: 'mdi:credit-card-off-outline', text: 'No credit card required' },
              { icon: 'mdi:clock-fast', text: 'Start analyzing leads in 2 minutes' },
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3 text-sm text-slate-600">
                <Icon icon={feature.icon} className="text-green-600 text-lg flex-shrink-0" />
                <span>{feature.text}</span>
              </div>
            ))}
          </div>

          <GoogleOAuthButton label="Sign up with Google" />

          {/* Divider */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-center text-sm text-slate-500">
              Already have an account?{' '}
              <a 
                href="/auth/login" 
                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Sign in
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
