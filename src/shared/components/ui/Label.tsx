// src/shared/components/ui/Label.tsx

/**
 * LABEL COMPONENT - PRODUCTION GRADE V2.0
 * 
 * Professional form label with natural dark mode support
 * Follows Card.tsx and Button.tsx architecture patterns
 * 
 * ARCHITECTURE:
 * ✅ Natural Tailwind dark: classes for automatic mode detection
 * ✅ Proper contrast in both light and dark modes
 * ✅ Required indicator (asterisk)
 * ✅ Helper text support
 * ✅ Full accessibility support
 * 
 * DESIGN PHILOSOPHY:
 * "Concert hall, not arcade"
 * - Clean, professional label styling
 * - Clear visual hierarchy
 * - WCAG AA compliant
 * 
 * USAGE:
 * <Label htmlFor="email">Email Address</Label>
 * <Label htmlFor="password" required>Password</Label>
 * <Label htmlFor="bio" helper="Maximum 500 characters">Biography</Label>
 */

import { LabelHTMLAttributes, ReactNode } from 'react';

// =============================================================================
// TYPES
// =============================================================================

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  /** Label content */
  children: ReactNode;
  /** Show required indicator (*) */
  required?: boolean;
  /** Helper text (shown below label) */
  helper?: string;
  /** Additional CSS classes */
  className?: string;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function Label({
  children,
  required = false,
  helper,
  className = '',
  ...props
}: LabelProps) {
  return (
    <div className="flex flex-col gap-1">
      {/* Label */}
      <label
        className={`
          text-sm font-medium
          text-neutral-900
          dark:text-neutral-100
          ${className}
        `.trim().replace(/\s+/g, ' ')}
        {...props}
      >
        {children}
        {required && (
          <span className="text-error-600 dark:text-error-400 ml-1" aria-label="required">
            *
          </span>
        )}
      </label>

      {/* Helper Text */}
      {helper && (
        <span className="text-xs text-neutral-600 dark:text-neutral-400">
          {helper}
        </span>
      )}
    </div>
  );
}
