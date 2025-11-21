/**
 * @file Marketing Header
 * @description Navigation header for marketing pages
 * Path: src/features/homepage/components/MarketingHeader.tsx
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { Logo } from '@/shared/components/ui/Logo';

// =============================================================================
// CONSTANTS
// =============================================================================

// Get app subdomain URL from environment
const APP_URL = import.meta.env.PROD 
  ? 'https://app.oslira.com'
  : 'http://localhost:5173';

// =============================================================================
// COMPONENT
// =============================================================================

export function MarketingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /**
   * Navigate to login page on app subdomain
   * CRITICAL: Use absolute URL to force cross-domain navigation
   * This ensures we navigate to app.oslira.com (where tokens are stored)
   * NOT oslira.com/auth/login (which has empty localStorage)
   */
  const handleLogin = () => {
    window.location.href = `${APP_URL}/auth/login`;
  };

  /**
   * Navigate to signup page on app subdomain
   * Same reasoning as handleLogin
   */
  const handleSignup = () => {
    window.location.href = `${APP_URL}/auth/signup`;
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-fixedNav bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            
            {/* Logo */}
            <motion.a
              href="/"
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <a href="/" className="flex items-center gap-2">
                <Logo size="md" />
              </a>
              <span className="text-xl font-bold text-slate-900">Oslira</span>
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {[
                { label: 'Features', href: '#benefits' },
                { label: 'How It Works', href: '#how-it-works' },
                { label: 'Pricing', href: '/pricing' },
                { label: 'About', href: '/about' }
              ].map((link) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
                  whileHover={{ y: -2 }}
                >
                  {link.label}
                </motion.a>
              ))}
            </div>

            {/* Desktop CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <motion.button
                onClick={handleLogin}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="px-5 py-2.5 text-slate-700 font-semibold rounded-lg border border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all"
              >
                Login
              </motion.button>
              
              <motion.button
                onClick={handleSignup}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all"
              >
                Get Started Free
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
              whileTap={{ scale: 0.95 }}
            >
              <Icon 
                icon={mobileMenuOpen ? 'mdi:close' : 'mdi:menu'} 
                className="text-2xl"
              />
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-[73px] left-0 right-0 z-dropdown bg-white border-b border-slate-200 shadow-lg md:hidden overflow-hidden"
          >
            <div className="px-6 py-6 space-y-4">
              {[
                { label: 'Features', href: '#benefits' },
                { label: 'How It Works', href: '#how-it-works' },
                { label: 'Pricing', href: '/pricing' },
                { label: 'About', href: '/about' }
              ].map((link, index) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="block text-slate-700 hover:text-slate-900 font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </motion.a>
              ))}
              
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <button
                  onClick={handleLogin}
                  className="w-full px-5 py-3 text-slate-700 font-semibold rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={handleSignup}
                  className="w-full px-5 py-3 bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/30"
                >
                  Get Started Free
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default MarketingHeader;
