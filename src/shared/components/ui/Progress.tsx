// src/shared/components/ui/Progress.tsx

/**
 * PROGRESS COMPONENT
 * 
 * Linear progress bar for loading and completion states
 * 
 * FEATURES:
 * - Percentage-based (0-100)
 * - 3 sizes (sm, md, lg)
 * - 2 variants (primary, secondary)
 * - Optional label
 * - Smooth animation
 * 
 * DESIGN:
 * - Track: Neutral-200 background
 * - Bar: Primary-500 (default)
 * - Border radius: Full pill
 * - Transition: 300ms smooth
 * 
 * USAGE:
 * <Progress value={65} />
 * <Progress value={80} size="lg" label="Analyzing..." />
 * <Progress value={100} variant="secondary" />
 */

import { HTMLAttributes } from 'react';

// =============================================================================
// TYPES
// =============================================================================

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  /** Progress value (0-100) */
  value: number;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Color variant */
  variant?: 'primary' | 'secondary';
  /** Optional label */
  label?: string;
  /** Show percentage text */
  showPercentage?: boolean;
  /** Additional CSS classes */
  className?: string;
}

// =============================================================================
// SIZE STYLES
// =============================================================================

const sizeStyles = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
} as const;

// =============================================================================
// VARIANT STYLES
// =============================================================================

const variantStyles = {
  primary: 'bg-primary-500',
  secondary: 'bg-secondary-500',
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
      {/* Label & Percentage */}
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-2">
          {label && (
            <span className="text-sm font-medium text-neutral-700">
              {label}
            </span>
          )}
          {showPercentage && (
            <span className="text-sm font-medium text-neutral-600">
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
