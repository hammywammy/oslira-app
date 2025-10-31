// src/shared/components/ui/Spinner.tsx

/**
 * SPINNER COMPONENT - PRODUCTION GRADE V2.0
 * 
 * Professional loading spinner with natural dark mode support
 * Follows Card.tsx and Button.tsx architecture patterns
 * 
 * ARCHITECTURE:
 * ✅ Natural Tailwind dark: classes for automatic mode detection
 * ✅ Proper contrast in both light and dark modes
 * ✅ Semantic variants (primary, neutral, white)
 * ✅ Size variants (sm, md, lg, xl)
 * ✅ Smooth rotation animation
 * ✅ Full accessibility support
 * 
 * DESIGN PHILOSOPHY:
 * "Concert hall, not arcade"
 * - Clean, professional spinner
 * - Subtle rotation animation
 * - Clear visual feedback
 * 
 * USAGE:
 * <Spinner size="md" variant="primary" />
 * <Spinner size="sm" variant="neutral" label="Loading data..." />
 * <Spinner variant="white" /> (for dark backgrounds)
 */

// =============================================================================
// TYPES
// =============================================================================

export interface SpinnerProps {
  /** Size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Color variant */
  variant?: 'primary' | 'neutral' | 'white';
  /** Accessible label */
  label?: string;
  /** Additional CSS classes */
  className?: string;
}

// =============================================================================
// SIZE STYLES
// =============================================================================

const sizeStyles = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-8 h-8 border-3',
  xl: 'w-12 h-12 border-[3px]',
} as const;

// =============================================================================
// VARIANT STYLES - LIGHT/DARK MODE COMPATIBLE
// =============================================================================

const variantStyles = {
  primary: `
    border-primary-500 border-t-transparent
    dark:border-primary-500 dark:border-t-transparent
  `,
  neutral: `
    border-neutral-400 border-t-transparent
    dark:border-neutral-600 dark:border-t-transparent
  `,
  white: `
    border-white border-t-transparent
  `,
} as const;

// =============================================================================
// COMPONENT
// =============================================================================

export function Spinner({
  size = 'md',
  variant = 'primary',
  label = 'Loading...',
  className = '',
}: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label={label}
      className={`inline-block ${className}`}
    >
      <div
        className={`
          ${sizeStyles[size]}
          ${variantStyles[variant]}
          rounded-full
          animate-spin
        `}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}
