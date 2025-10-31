// src/shared/components/ui/Select.tsx

/**
 * SELECT COMPONENT - PRODUCTION GRADE V2.0
 * 
 * Dropdown select with natural dark mode support
 * Follows Card.tsx and Button.tsx architecture patterns
 * 
 * ARCHITECTURE:
 * ✅ Natural Tailwind dark: classes for automatic mode detection
 * ✅ Proper contrast in both light and dark modes
 * ✅ Custom chevron icon (replaces native arrow)
 * ✅ Validation states (error, success)
 * ✅ Full accessibility support
 * ✅ Size variants (sm, md, lg)
 * 
 * DESIGN PHILOSOPHY:
 * "Concert hall, not arcade"
 * - Professional dropdown styling
 * - Matches Input component patterns
 * - WCAG AA compliant in all states
 * 
 * NOTE: Select REQUIRES children (<option> elements)
 * 
 * USAGE:
 * <Select>
 *   <option value="">Choose option</option>
 *   <option value="1">Option 1</option>
 * </Select>
 * <Select error="Required field" />
 */

import { Icon } from '@iconify/react';
import { SelectHTMLAttributes, forwardRef, ReactNode } from 'react';

// =============================================================================
// TYPES
// =============================================================================

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Full width */
  fullWidth?: boolean;
  /** Error message (shows error state) */
  error?: string;
  /** Success state */
  success?: boolean;
  /** Option elements (REQUIRED) */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

// =============================================================================
// SIZE STYLES
// =============================================================================

const sizeStyles = {
  sm: 'h-8 pl-3 pr-9 text-sm',
  md: 'h-10 pl-4 pr-10 text-base',
  lg: 'h-12 pl-5 pr-12 text-lg',
} as const;

const iconSize = {
  sm: 16,
  md: 18,
  lg: 20,
} as const;

const iconPosition = {
  sm: 'right-2',
  md: 'right-3',
  lg: 'right-4',
} as const;

// =============================================================================
// STATE STYLES - LIGHT/DARK MODE COMPATIBLE
// =============================================================================

const getStateStyles = (error?: string, success?: boolean, disabled?: boolean) => {
  if (disabled) {
    return `
      bg-neutral-100 border-neutral-300 text-neutral-500 cursor-not-allowed
      dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-500
    `;
  }
  
  if (error) {
    return `
      border-error-500 
      focus:border-error-600 focus:ring-2 focus:ring-error-200
      dark:border-error-500 
      dark:focus:border-error-400 dark:focus:ring-error-900/30
    `;
  }
  
  if (success) {
    return `
      border-success-500 
      focus:border-success-600 focus:ring-2 focus:ring-success-200
      dark:border-success-500 
      dark:focus:border-success-400 dark:focus:ring-success-900/30
    `;
  }
  
  return `
    border-neutral-400 
    focus:border-primary-500 focus:ring-2 focus:ring-primary-200
    dark:border-neutral-600 
    dark:focus:border-primary-500 dark:focus:ring-primary-900/30
  `;
};

// =============================================================================
// COMPONENT
// =============================================================================

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      size = 'md',
      fullWidth = false,
      error,
      success = false,
      disabled = false,
      className = '',
      id,
      children,
      ...props
    },
    ref
  ) => {
    const errorId = error && id ? `${id}-error` : undefined;

    return (
      <div className={`flex flex-col gap-2 ${fullWidth ? 'w-full' : ''}`}>
        {/* Select Wrapper */}
        <div className="relative">
          {/* Select Element */}
          <select
            ref={ref}
            id={id}
            disabled={disabled}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={errorId}
            className={`
              ${sizeStyles[size]}
              ${getStateStyles(error, success, disabled)}
              ${fullWidth ? 'w-full' : ''}
              rounded-lg border
              bg-white text-neutral-900
              dark:bg-neutral-800 dark:text-neutral-100
              font-normal
              transition-all duration-200
              focus:outline-none
              disabled:opacity-50
              appearance-none
              cursor-pointer
              ${className}
            `.trim().replace(/\s+/g, ' ')}
            {...props}
          >
            {children}
          </select>

          {/* Custom Chevron Icon */}
          <div className={`absolute ${iconPosition[size]} top-1/2 -translate-y-1/2 pointer-events-none`}>
            <Icon
              icon="lucide:chevron-down"
              width={iconSize[size]}
              height={iconSize[size]}
              className="text-neutral-600 dark:text-neutral-400"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div 
            id={errorId}
            className="flex items-center gap-1.5 text-sm text-error-600 dark:text-error-400"
            role="alert"
          >
            <Icon icon="lucide:alert-circle" width={14} height={14} />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
