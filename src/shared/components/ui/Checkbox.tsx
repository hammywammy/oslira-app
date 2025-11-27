/**
 * CHECKBOX COMPONENT - PRODUCTION GRADE V2.0
 * 
 * Professional checkbox with natural dark mode support
 * Follows Card.tsx and Button.tsx architecture patterns
 * 
 * ARCHITECTURE:
 * ✅ Natural Tailwind dark: classes for automatic mode detection
 * ✅ Proper contrast in both light and dark modes
 * ✅ Custom styled checkbox (replaces native)
 * ✅ Indeterminate state support
 * ✅ Error state
 * ✅ Size variants (md, lg)
 * 
 * DESIGN PHILOSOPHY:
 * "Concert hall, not arcade"
 * - Clean checkbox with subtle interactions
 * - Electric blue when checked
 * - Professional animations
 * 
 * USAGE:
 * <Checkbox checked={value} onChange={handler}>
 *   Accept terms
 * </Checkbox>
 * <Checkbox indeterminate error />
 */

import { Icon } from '@iconify/react';
import { InputHTMLAttributes, forwardRef, ReactNode, useEffect, useRef } from 'react';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** Size variant */
  size?: 'md' | 'lg';
  /** Indeterminate state (dash icon) */
  indeterminate?: boolean;
  /** Error state */
  error?: boolean;
  /** Label content (rendered next to checkbox) */
  children?: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

// SIZE STYLES
const sizeStyles = {
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
} as const;

const iconSize = {
  md: 14,
  lg: 16,
} as const;

const labelTextSize = {
  md: 'text-sm',
  lg: 'text-base',
} as const;

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      size = 'md',
      indeterminate = false,
      error = false,
      disabled = false,
      checked = false,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const internalRef = useRef<HTMLInputElement | null>(null);

    // Handle indeterminate state
    useEffect(() => {
      const checkbox = internalRef.current;
      if (checkbox) {
        checkbox.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    // Combine refs
    const setRefs = (element: HTMLInputElement | null) => {
      internalRef.current = element;
      if (typeof ref === 'function') {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
    };

    return (
      <label
        className={`
          inline-flex items-center gap-2.5
          ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
          ${className}
        `}
      >
        {/* Hidden Native Checkbox */}
        <input
          ref={setRefs}
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
            rounded-md
            border-2
            transition-all duration-150
            ${
              checked || indeterminate
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
              !disabled && !checked && !indeterminate
                ? `
                  hover:border-primary-400
                  dark:hover:border-primary-400
                `
                : ''
            }
          `}
        >
          {/* Check Icon */}
          {checked && !indeterminate && (
            <Icon
              icon="lucide:check"
              width={iconSize[size]}
              height={iconSize[size]}
              className="text-white"
              aria-hidden="true"
            />
          )}

          {/* Indeterminate Icon (dash) */}
          {indeterminate && (
            <Icon
              icon="lucide:minus"
              width={iconSize[size]}
              height={iconSize[size]}
              className="text-white"
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

Checkbox.displayName = 'Checkbox';
