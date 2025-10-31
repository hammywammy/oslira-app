// src/shared/components/ui/Progress.tsx

/**
 * PROGRESS COMPONENT - PRODUCTION GRADE V2.0
 * 
 * Professional progress bar with natural dark mode support
 * Follows Card.tsx and Button.tsx architecture patterns
 * 
 * ARCHITECTURE:
 * ✅ Natural Tailwind dark: classes for automatic mode detection
 * ✅ Proper contrast in both light and dark modes
 * ✅ Semantic variants (primary, secondary, success)
 * ✅ Size variants (sm, md, lg)
 * ✅ Optional label and percentage display
 * ✅ Smooth animations
 * 
 * DESIGN PHILOSOPHY:
 * "Concert hall, not arcade"
 * - Clean progress bar with subtle motion
 * - Professional color transitions
 * - Clear visual feedback
 * 
 * USAGE:
 * <Progress value={65} />
 * <Progress value={80} size="lg" label="Analyzing..." showPercentage />
 * <Progress value={100} variant="success" />
 */

import { HTMLAttributes } from 'react';

// =============================================================================
// TYPES
// =============================================================================

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  /** Progress value (0-100) */
  value: number;
  /** Size variant (height) */
  size?: 'sm' | 'md' | 'lg';
  /** Color variant */
  variant?: 'primary' | 'secondary' | 'success';
  /** Optional label */
  label?: string;
  /** Show percentage text */
  showPercentage?: boolean;
  /** Additional CSS classes */
  className?: string;
}

// =============================================================================
// SIZE STYLES (HEIGHT)
// =============================================================================

const sizeStyles = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
} as const;

// =============================================================================
// VARIANT STYLES - LIGHT/DARK MODE COMPATIBLE
// =============================================================================

const variantStyles = {
  primary: `
    bg-primary-500
    dark:bg-primary-500
  `,
  secondary: `
    bg-secondary-500
    dark:bg-secondary-500
  `,
  success: `
    bg-success-500
    dark:bg-success-500
  `,
} as const;

// =============================================================================
// COMPONENT
// =============================================================================

export function Progress({
  value,
  size = 'md',
  variant = 'primary',
  label,
  showPercentage = false,
  className = '',
  ...props
}: ProgressProps) {
  // Clamp value between 0 and 100
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={`w-full ${className}`} {...props}>
      {/* Label & Percentage Row */}
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-2">
          {label && (
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              {label}
            </span>
          )}
          {showPercentage && (
            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              {Math.round(clampedValue)}%
            </span>
          )}
        </div>
      )}

      {/* Progress Track */}
      <div
        className={`
          ${sizeStyles[size]}
          w-full
          bg-neutral-200
          dark:bg-neutral-700
          rounded-full
          overflow-hidden
        `}
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        {/* Progress Bar */}
        <div
          className={`
            ${sizeStyles[size]}
            ${variantStyles[variant]}
            rounded-full
            transition-all duration-300 ease-out
          `}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
}
