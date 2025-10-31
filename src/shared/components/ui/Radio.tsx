// src/shared/components/ui/Radio.tsx

/**
 * RADIO COMPONENT - PRODUCTION GRADE V2.0
 * 
 * Professional radio button with natural dark mode support
 * Follows Card.tsx and Button.tsx architecture patterns
 * 
 * ARCHITECTURE:
 * ✅ Natural Tailwind dark: classes for automatic mode detection
 * ✅ Proper contrast in both light and dark modes
 * ✅ Custom styled radio (replaces native)
 * ✅ Inner dot indicator
 * ✅ Error state
 * ✅ Size variants (md, lg)
 * 
 * DESIGN PHILOSOPHY:
 * "Concert hall, not arcade"
 * - Clean radio with subtle interactions
 * - Electric blue when selected
 * - Professional animations
 * 
 * USAGE:
 * <Radio name="plan" value="pro" checked={selected === 'pro'} onChange={handler}>
 *   Pro Plan
 * </Radio>
 * <Radio name="plan" value="enterprise" error>
 *   Enterprise Plan
 * </Radio>
 */

import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';

// =============================================================================
// TYPES
// =============================================================================

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** Size variant */
  size?: 'md' | 'lg';
  /** Error state */
  error?: boolean;
  /** Label content (rendered next to radio) */
  children?: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

// =============================================================================
// SIZE STYLES
// =============================================================================

const sizeStyles = {
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
} as const;

const dotSize = {
  md: 'w-2.5 h-2.5',
  lg: 'w-3 h-3',
} as const;

const labelTextSize = {
  md: 'text-sm',
  lg: 'text-base',
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
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <label
        className={`
          inline-flex items-center gap-2.5
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
                ? `
                  bg-primary-500 border-primary-500
                  dark:bg-primary-500 dark:border-primary-500
                `
                : error
                ? `
                  border-error-500
                  dark:border-error-500
                `
                : `
                  border-neutral-400
                  dark:border-neutral-600
                `
            }
            ${
              !disabled && !checked
                ? `
                  hover:border-primary-400
                  dark:hover:border-primary-400
                `
                : ''
            }
          `}
        >
          {/* Inner Dot (when checked) */}
          {checked && (
            <span
              className={`
                ${dotSize[size]}
                rounded-full
                bg-white
                transition-transform duration-150
              `}
              aria-hidden="true"
            />
          )}
        </span>

        {/* Label Text */}
        {children && (
          <span
            className={`
              ${labelTextSize[size]}
              text-neutral-900
              dark:text-neutral-100
              select-none
            `}
          >
            {children}
          </span>
        )}
      </label>
    );
  }
);

Radio.displayName = 'Radio';
