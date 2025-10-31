// src/shared/components/ui/Switch.tsx

/**
 * SWITCH COMPONENT
 * 
 * Toggle boolean input with smooth animation
 * 
 * FEATURES:
 * - 2 sizes (md, lg)
 * - Smooth slide animation
 * - Electric blue when active
 * - Disabled state
 * - Full accessibility
 * 
 * DESIGN:
 * - Pill shape (rounded-full)
 * - Sliding circle indicator
 * - 150ms transition
 * - Focus: Electric blue ring
 * 
 * USAGE:
 * <Switch checked={enabled} onChange={setEnabled} />
 * <Switch size="lg" disabled />
 */

import { InputHTMLAttributes, forwardRef } from 'react';

// =============================================================================
// TYPES
// =============================================================================

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** Size variant */
  size?: 'md' | 'lg';
  /** Additional CSS classes */
  className?: string;
}

// =============================================================================
// SIZE STYLES
// =============================================================================

const trackStyles = {
  md: 'w-10 h-6',
  lg: 'w-12 h-7',
} as const;

const thumbStyles = {
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
} as const;

const thumbPosition = {
  md: {
    off: 'translate-x-1',
    on: 'translate-x-5',
  },
  lg: {
    off: 'translate-x-1',
    on: 'translate-x-6',
  },
} as const;

// =============================================================================
// COMPONENT
// =============================================================================

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      size = 'md',
      checked = false,
      disabled = false,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <label
        className={`
          inline-flex items-center
          ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
          ${className}
        `}
      >
        {/* Hidden Native Checkbox */}
        <input
          ref={ref}
          type="checkbox"
          role="switch"
          checked={checked}
          disabled={disabled}
          aria-checked={checked}
          className="sr-only"
          {...props}
        />

        {/* Switch Track */}
        <span
          className={`
            ${trackStyles[size]}
            relative
            inline-flex items-center
            rounded-full
            transition-colors duration-150
            ${
              checked
                ? 'bg-primary-500'
                : 'bg-neutral-300'
            }
            ${
              !disabled && !checked
                ? 'hover:bg-neutral-400'
                : ''
            }
            ${
              !disabled && checked
                ? 'hover:bg-primary-600'
                : ''
            }
            focus-within:ring-2 focus-within:ring-primary-200 focus-within:ring-offset-2
          `}
        >
          {/* Switch Thumb (Sliding Circle) */}
          <span
            className={`
              ${thumbStyles[size]}
              ${checked ? thumbPosition[size].on : thumbPosition[size].off}
              inline-block
              rounded-full
              bg-neutral-0
              shadow-sm
              transition-transform duration-150
            `}
            aria-hidden="true"
          />
        </span>
      </label>
    );
  }
);

Switch.displayName = 'Switch';
