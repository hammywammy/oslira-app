// src/core/theme/ThemeToggle.tsx

/**
 * THEME TOGGLE BUTTON - PRODUCTION GRADE V1.0
 * 
 * ARCHITECTURE:
 * ✅ Uses global ThemeProvider (no local state)
 * ✅ Works anywhere in the app
 * ✅ Professional animation (icon rotation/fade)
 * ✅ Accessible (aria-label, keyboard support)
 * ✅ Variants for different placements
 * 
 * PHILOSOPHY:
 * "One component, infinite placements"
 * - Fixed bottom-left (showcase pages)
 * - Inline (navbar, settings)
 * - Minimal (icon only)
 * - Full (icon + text)
 * 
 * USAGE:
 * 
 * // Fixed bottom-left (ComponentShowcase):
 * <ThemeToggle variant="fixed" />
 * 
 * // Inline in navbar:
 * <ThemeToggle variant="inline" />
 * 
 * // Icon only:
 * <ThemeToggle variant="minimal" />
 * 
 * // With text:
 * <ThemeToggle variant="full" />
 */

import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useTheme } from './ThemeProvider';

// =============================================================================
// TYPES
// =============================================================================

interface ThemeToggleProps {
  /** Visual variant */
  variant?: 'fixed' | 'inline' | 'minimal' | 'full';
  /** Additional CSS classes */
  className?: string;
}

// =============================================================================
// VARIANT STYLES
// =============================================================================

const variantStyles = {
  fixed: `
    fixed bottom-8 left-8 z-50 
    w-14 h-14 rounded-full 
    shadow-elevated
    bg-white dark:bg-neutral-800 
    hover:bg-neutral-50 dark:hover:bg-neutral-700 
    border border-neutral-300 dark:border-neutral-600
  `,
  inline: `
    relative
    w-10 h-10 rounded-lg
    bg-white dark:bg-neutral-800 
    hover:bg-neutral-50 dark:hover:bg-neutral-700 
    border border-neutral-300 dark:border-neutral-600
  `,
  minimal: `
    relative
    w-9 h-9 rounded-lg
    bg-transparent
    hover:bg-neutral-100 dark:hover:bg-neutral-800
  `,
  full: `
    relative
    px-4 h-10 rounded-lg
    flex items-center gap-2
    bg-white dark:bg-neutral-800 
    hover:bg-neutral-50 dark:hover:bg-neutral-700 
    border border-neutral-300 dark:border-neutral-600
  `,
};

// =============================================================================
// COMPONENT
// =============================================================================

export function ThemeToggle({ 
  variant = 'inline',
  className = '' 
}: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <motion.button
      onClick={toggleTheme}
      className={`
        ${variantStyles[variant]}
        ${className}
        flex items-center justify-center 
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.div
            key="sun"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Icon 
              icon="ph:sun-bold" 
              className="text-2xl text-yellow-400" 
            />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Icon 
              icon="ph:moon-bold" 
              className="text-2xl text-neutral-700 dark:text-neutral-300" 
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Show text only for 'full' variant */}
      {variant === 'full' && (
        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
          {isDark ? 'Light' : 'Dark'}
        </span>
      )}
    </motion.button>
  );
}
