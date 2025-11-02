// src/pages/auth/SignupPage.tsx
/**
 * @file Signup Page - Stripe-inspired Professional Design
 * @description Clean registration with 25 free credits messaging
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

  if (isLoading || isAuthenticated) {
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
          {/* Promotional Badge */}
          <motion.div 
            variants={fadeIn}
            className="mb-6 flex justify-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full border border-primary/20">
              <Icon icon="ph:sparkle" className="w-4 h-4" />
              <span className="text-sm font-medium">25 free credits included</span>
            </div>
          </motion.div>

          {/* Form Container */}
          <div className="bg-card rounded-2xl border border-border shadow-sm">
            <div className="p-8 sm:p-10">
              {/* Title Section */}
              <motion.div variants={fadeIn} className="text-center mb-8">
                <h1 className="text-2xl font-semibold text-foreground tracking-tight">
                  Get started with Oslira
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Transform Instagram leads into revenue
                </p>
              </motion.div>

              {/* OAuth Button */}
              <motion.div variants={fadeIn}>
                <GoogleOAuthButton 
                  label="Sign up with Google"
                  mode="signup"
                />
              </motion.div>

              {/* Value Propositions */}
              <motion.div 
                variants={fadeIn}
                className="mt-8 space-y-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon icon="ph:robot" className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      AI-Powered Analysis
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      GPT-5 analyzes profiles in seconds
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon icon="ph:target" className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Partnership Scoring
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      0-100 viability scores instantly
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon icon="ph:envelope-simple" className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Personalized Outreach
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Custom messages that convert
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div 
                variants={fadeIn}
                className="mt-8 pt-6 border-t border-border"
              >
                <div className="flex items-center justify-center gap-6">
                  <div className="flex items-center gap-1.5">
                    <Icon icon="ph:shield-check" className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">SOC 2 Compliant</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Icon icon="ph:lock" className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">256-bit SSL</span>
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
                Already have an account?{' '}
                <Link 
                  to="/auth/login" 
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Sign in
                </Link>
              </motion.p>
            </div>
          </div>

          {/* Legal text */}
          <motion.p 
            variants={fadeIn}
            className="mt-6 text-center text-xs text-muted-foreground px-4"
          >
            By signing up, you agree to our{' '}
            <a href="/terms" className="text-foreground hover:text-primary transition-colors">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-foreground hover:text-primary transition-colors">
              Privacy Policy
            </a>
          </motion.p>
        </motion.div>
      </main>
    </div>
  );
}
