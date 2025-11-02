// src/pages/auth/LoginPage.tsx
/**
 * @file Login Page - Stripe-inspired Professional Design
 * @description Clean, minimal login with subtle sophistication
 */

import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { GoogleOAuthButton } from '@/features/auth/components/GoogleOAuthButton';
import { useAuth } from '@/features/auth/contexts/AuthProvider';
import { logger } from '@/core/utils/logger';
import { Logo } from '@/shared/components/ui/Logo';

// =============================================================================
// ANIMATION VARIANTS - Subtle and professional
// =============================================================================

const fadeIn = {
  hidden: { opacity: 0, y: 8 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1
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

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-5 h-5 border-2 border-primary/60 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Minimal Header */}
      <motion.header 
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="px-6 py-6 sm:px-8"
      >
        <Link 
          to="/" 
          className="inline-flex items-center gap-2.5 text-foreground hover:opacity-70 transition-opacity duration-200"
        >
          <Logo size="sm" />
          <span className="text-lg font-semibold tracking-tight">Oslira</span>
        </Link>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 sm:px-8 py-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="w-full max-w-[400px]"
        >
          {/* Form Container */}
          <div className="bg-card rounded-2xl border border-border shadow-sm">
            <div className="p-8 sm:p-10">
              {/* Title Section */}
              <motion.div variants={fadeIn} className="text-center mb-8">
                <h1 className="text-2xl font-semibold text-foreground tracking-tight">
                  Welcome back
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Sign in to your Oslira account
                </p>
              </motion.div>

              {/* OAuth Button */}
              <motion.div variants={fadeIn}>
                <GoogleOAuthButton 
                  label="Continue with Google"
                  mode="login"
                />
              </motion.div>

              {/* Divider with text */}
              <motion.div 
                variants={fadeIn} 
                className="relative my-8"
              >
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-card text-muted-foreground">
                    Secure authentication via Google
                  </span>
                </div>
              </motion.div>

              {/* Features list */}
              <motion.div variants={fadeIn} className="space-y-3">
                <div className="flex items-start gap-3">
                  <Icon 
                    icon="ph:shield-check" 
                    className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" 
                  />
                  <div>
                    <p className="text-sm text-foreground font-medium">
                      Enterprise-grade security
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      OAuth 2.0 with encrypted tokens
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Icon 
                    icon="ph:lightning" 
                    className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" 
                  />
                  <div>
                    <p className="text-sm text-foreground font-medium">
                      Instant AI analysis
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Powered by advanced ML models
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Footer Section */}
            <div className="px-8 sm:px-10 py-5 bg-muted/30 border-t border-border rounded-b-2xl">
              <motion.p 
                variants={fadeIn}
                className="text-center text-sm text-muted-foreground"
              >
                Don't have an account?{' '}
                <Link 
                  to="/auth/signup" 
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Sign up
                </Link>
              </motion.p>
            </div>
          </div>

          {/* Legal links */}
          <motion.div 
            variants={fadeIn}
            className="mt-8 flex items-center justify-center gap-4 text-xs text-muted-foreground"
          >
            <a 
              href="/privacy" 
              className="hover:text-foreground transition-colors"
            >
              Privacy Policy
            </a>
            <span className="text-border">•</span>
            <a 
              href="/terms" 
              className="hover:text-foreground transition-colors"
            >
              Terms of Service
            </a>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
