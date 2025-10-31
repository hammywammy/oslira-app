// src/shared/components/ui/Select.tsx

/**
 * SELECT COMPONENT - PRODUCTION GRADE
 * 
 * Dropdown select primitive with custom styling
 * 
 * NOTE: Select elements REQUIRE children (<option> elements), unlike input/textarea
 * 
 * FEATURES:
 * - Native <select> for performance and accessibility
 * - 3 sizes (sm, md, lg)
 * - Validation states (default, error, success)
 * - Custom chevron icon
 * - Full accessibility
 * - Disabled state
 * 
 * DESIGN:
 * - Matches Input component styling
 * - Custom chevron instead of native dropdown arrow
 * - Border radius: 6px
 * - Focus: Electric blue ring
 * 
 * USAGE:
 * <Select>
 *   <option value="">Select an option</option>
 *   <option value="1">Option 1</option>
 * </Select>
 * <Select error="Please select an option" />
 */

import { Icon } from '@iconify/react';
import { SelectHTMLAttributes, forwardRef, ReactNode } from 'react';

// =============================================================================
// TYPES
// =============================================================================

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Error message (shows error state) */
  error?: string;
  /** Success state */
  success?: boolean;
  /** Full width */
  fullWidth?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Option elements (REQUIRED for select) */
  children: ReactNode;
}

// =============================================================================
// SIZE STYLES
// =============================================================================

const sizeStyles = {
  sm: 'h-8 px-3 pr-8 text-sm',
  md: 'h-10 px-3 pr-10 text-base',
  lg: 'h-12 px-4 pr-12 text-lg',
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
// STATE STYLES
// =============================================================================

const getStateStyles = (error?: string, success?: boolean, disabled?: boolean) => {
  if (disabled) {
    return 'bg-neutral-100 border-neutral-300 text-neutral-500 cursor-not-allowed';
  }
  if (error) {
    return 'border-error-500 focus:border-error-600 focus:ring-2 focus:ring-error-200';
  }
  if (success) {
    return 'border-success-500 focus:border-success-600 focus:ring-2 focus:ring-success-200';
  }
  return 'border-neutral-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-200';
};

// =============================================================================
// COMPONENT
// =============================================================================

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      size = 'md',
      error,
      success = false,
      fullWidth = false,
      disabled = false,
      className = '',
      id,
      children, // ← NOTE: Select REQUIRES children (option elements)
      ...props
    },
    ref
  ) => {
    const errorId = error && id ? `${id}-error` : undefined;

    return (
      <div className={`flex flex-col gap-2 ${fullWidth ? 'w-full' : ''}`}>
        {/* Select Container */}
        <div className="relative">
          {/* Select - NOTE: Unlike input/textarea, select NEEDS children */}
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
              rounded-md border bg-white
              font-normal text-neutral-900
              transition-all duration-200
              focus:outline-none
              disabled:opacity-50
              appearance-none
              cursor-pointer
              ${disabled ? 'cursor-not-allowed' : ''}
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
              className={`${disabled ? 'text-neutral-500' : 'text-neutral-700'}`}
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div 
            id={errorId}
            className="flex items-center gap-1.5 text-sm text-error-600"
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
