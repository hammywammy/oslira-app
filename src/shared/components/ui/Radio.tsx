// src/shared/components/ui/Radio.tsx

/**
 * RADIO COMPONENT
 * 
 * Single-choice input with custom styling
 * 
 * FEATURES:
 * - Custom styled radio (replaces native)
 * - 2 sizes (md, lg)
 * - Error state
 * - Disabled state
 * - Full accessibility
 * 
 * DESIGN:
 * - 16px (md) or 20px (lg) circle
 * - Electric blue when selected
 * - Inner dot indicator
 * - Focus: Electric blue ring
 * 
 * USAGE:
 * <Radio name="plan" value="pro" checked={selected === 'pro'} onChange={handleChange} />
 * <Radio name="plan" value="enterprise" error />
 */

import { InputHTMLAttributes, forwardRef } from 'react';

// =============================================================================
// TYPES
// =============================================================================

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** Size variant */
  size?: 'md' | 'lg';
  /** Error state */
  error?: boolean;
  /** Additional CSS classes */
  className?: string;
}

// =============================================================================
// SIZE STYLES
// =============================================================================

const sizeStyles = {
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
} as const;

const dotSize = {
  md: 'w-2 h-2',
  lg: 'w-2.5 h-2.5',
} as const;

// =============================================================================
// COMPONENT
// =============================================================================

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      size = 'md',
      error = false,
      disabled = false,
      checked = false,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <label
        className={`
          inline-flex items-center gap-2
          ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
          ${className}
        `}
      >
        {/* Hidden Native Radio */}
        <input
          ref={ref}
          type="radio"
          checked={checked}
          disabled={disabled}
          className="sr-only"
          {...props}
        />

        {/* Custom Radio Visual */}
        <span
          className={`
            ${sizeStyles[size]}
            flex items-center justify-center
            rounded-full
            border-2
            transition-all duration-150
            ${
              checked
                ? error
                  ? 'bg-neutral-0 border-error-600'
                  : 'bg-neutral-0 border-primary-500'
                : error
                ? 'border-error-500 bg-neutral-0'
                : 'border-neutral-400 bg-neutral-0'
            }
            ${
              !disabled && !checked
                ? 'hover:border-primary-500'
                : ''
            }
            focus-within:ring-2 focus-within:ring-primary-200 focus-within:ring-offset-2
          `}
        >
          {/* Inner Dot */}
          {checked && (
            <span
              className={`
                ${dotSize[size]}
                rounded-full
                ${error ? 'bg-error-600' : 'bg-primary-500'}
                transition-transform duration-150
                scale-100
              `}
              aria-hidden="true"
            />
          )}
        </span>
      </label>
    );
  }
);

Radio.displayName = 'Radio';
