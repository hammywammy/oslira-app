// src/core/theme/ThemeToggle.tsx

/**
 * THEME TOGGLE BUTTON - V2.0 (SUBDOMAIN-AWARE)
 * 
 * UPDATES:
 * ✅ Respects darkModeEnabled from ThemeProvider
 * ✅ Shows disabled state on marketing pages
 * ✅ Tooltip explains why disabled (optional)
 * ✅ Works normally on app pages
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
  /** Show tooltip when disabled */
  showDisabledTooltip?: boolean;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function ThemeToggle({ 
  variant = 'fixed',
  className = '',
  showDisabledTooltip = false
}: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme, darkModeEnabled } = useTheme();

  // ===========================================================================
  // VARIANT STYLES
  // ===========================================================================
  
  const variantStyles = {
    fixed: 'fixed bottom-6 left-6 z-fixedNav',
    inline: 'relative',
    minimal: 'relative',
    full: 'relative',
  };

  const baseStyles = variant === 'fixed'
    ? 'px-4 py-3 bg-card border-2 border-border rounded-xl shadow-lg hover:shadow-xl'
    : 'px-3 py-2 bg-card border border-border rounded-lg hover:bg-accent';

  // ===========================================================================
  // DISABLED STATE
  // ===========================================================================
  
  if (!darkModeEnabled) {
    return (
      <div className={`${variantStyles[variant]} ${className} group relative`}>
        <button
          disabled
          className={`${baseStyles} opacity-50 cursor-not-allowed flex items-center gap-2`}
          title="Dark mode disabled on marketing pages"
        >
          <Icon icon="mdi:theme-light-dark" className="text-xl text-muted-foreground" />
          {(variant === 'full' || variant === 'fixed') && (
            <span className="text-sm font-medium text-muted-foreground">Light Only</span>
          )}
        </button>
        
        {/* Optional tooltip */}
        {showDisabledTooltip && (
          <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block w-48 p-2 bg-neutral-900 text-white text-xs rounded shadow-lg">
            Dark mode is disabled on marketing pages
          </div>
        )}
      </div>
    );
  }

  // ===========================================================================
  // ACTIVE STATE (Normal behavior)
  // ===========================================================================

  return (
    <div className={`${variantStyles[variant]} ${className}`}>
      <motion.button
        onClick={toggleTheme}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`${baseStyles} flex items-center gap-2 transition-all duration-300`}
        aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
      >
        {/* Icon with rotation animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={resolvedTheme}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Icon
              icon={resolvedTheme === 'dark' ? 'mdi:weather-night' : 'mdi:white-balance-sunny'}
              className="text-xl text-foreground"
            />
          </motion.div>
        </AnimatePresence>

        {/* Text (for full/fixed variants) */}
        {(variant === 'full' || variant === 'fixed') && (
          <span className="text-sm font-medium text-foreground">
            {resolvedTheme === 'dark' ? 'Dark' : 'Light'}
          </span>
        )}
      </motion.button>
    </div>
  );
}
