// src/shared/components/ui/Spinner.tsx

/**
 * SPINNER COMPONENT
 * 
 * Loading indicator for async operations
 * 
 * FEATURES:
 * - 3 sizes (sm, md, lg)
 * - 2 variants (primary, neutral)
 * - Smooth rotation animation
 * - Accessible (aria-label)
 * 
 * USAGE:
 * <Spinner size="md" variant="primary" />
 * <Spinner size="sm" variant="neutral" label="Loading data..." />
 */

// =============================================================================
// TYPES
// =============================================================================

export interface SpinnerProps {
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Color variant */
  variant?: 'primary' | 'neutral';
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
} as const;

// =============================================================================
// VARIANT STYLES
// =============================================================================

const variantStyles = {
  primary: 'border-primary-500 border-t-transparent',
  neutral: 'border-neutral-400 border-t-transparent',
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
        style={{
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}

// Add keyframe animation if not in Tailwind
// This goes in global CSS:
/*
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
*/
