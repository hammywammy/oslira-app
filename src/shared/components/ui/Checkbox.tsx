// src/shared/components/ui/Checkbox.tsx

/**
 * CHECKBOX COMPONENT
 * 
 * Boolean input with custom styling
 * 
 * FEATURES:
 * - Custom styled checkbox (replaces native)
 * - Indeterminate state support
 * - 2 sizes (md, lg)
 * - Error state
 * - Disabled state
 * - Full accessibility
 * 
 * DESIGN:
 * - 16px (md) or 20px (lg) square
 * - Electric blue when checked
 * - Checkmark icon from Iconify
 * - Border radius: 4px
 * - Focus: Electric blue ring
 * 
 * USAGE:
 * <Checkbox checked={value} onChange={handleChange} />
 * <Checkbox indeterminate />
 * <Checkbox error />
 */

import { Icon } from '@iconify/react';
import { InputHTMLAttributes, forwardRef, useEffect, useRef } from 'react';

// =============================================================================
// TYPES
// =============================================================================

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Size variant */
  size?: 'md' | 'lg';
  /** Indeterminate state (dash instead of check) */
  indeterminate?: boolean;
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

const iconSize = {
  md: 12,
  lg: 14,
} as const;

// =============================================================================
// COMPONENT
// =============================================================================

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      size = 'md',
      indeterminate = false,
      error = false,
      disabled = false,
      checked,
      className = '',
      ...props
    },
    ref
  ) => {
    const internalRef = useRef<HTMLInputElement | null>(null);

    // Handle indeterminate state (not controllable via HTML attribute)
    useEffect(() => {
      if (internalRef.current) {
        internalRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    const isChecked = checked || indeterminate;

    return (
      <label
        className={`
          inline-flex items-center gap-2
          ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
          ${className}
        `}
      >
        {/* Hidden Native Checkbox */}
        <input
          ref={(node) => {
            // Handle both forwarded ref and internal ref
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
            internalRef.current = node;
          }}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          className="sr-only"
          {...props}
        />

        {/* Custom Checkbox Visual */}
        <span
          className={`
            ${sizeStyles[size]}
            flex items-center justify-center
            rounded
            border-2
            transition-all duration-150
            ${
              isChecked
                ? error
                  ? 'bg-error-600 border-error-600'
                  : 'bg-primary-500 border-primary-500'
                : error
                ? 'border-error-500 bg-neutral-0'
                : 'border-neutral-400 bg-neutral-0'
            }
            ${
              !disabled && !isChecked
                ? 'hover:border-primary-500'
                : ''
            }
            focus-within:ring-2 focus-within:ring-primary-200 focus-within:ring-offset-2
          `}
        >
          {/* Check Icon */}
          {isChecked && (
            <Icon
              icon={indeterminate ? 'mdi:minus' : 'mdi:check'}
              width={iconSize[size]}
              height={iconSize[size]}
              className="text-neutral-0"
              aria-hidden="true"
            />
          )}
        </span>
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
