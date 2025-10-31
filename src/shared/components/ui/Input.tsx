// src/shared/components/ui/Input.tsx

/**
 * INPUT COMPONENT
 * 
 * Text input primitive with validation states
 * 
 * FEATURES:
 * - 3 sizes (sm, md, lg)
 * - Validation states (default, error, success)
 * - Optional icons (left/right)
 * - Full accessibility (aria-invalid, aria-describedby)
 * - Error message display
 * - Disabled state
 * 
 * DESIGN:
 * - Height: 40px default (md)
 * - Border radius: 6px
 * - Border: 1px solid, 2px on focus
 * - Focus: Electric blue ring
 * - Transition: 100ms for immediate feedback
 * 
 * USAGE:
 * <Input placeholder="Enter email..." />
 * <Input icon="mdi:magnify" iconPosition="left" placeholder="Search..." />
 * <Input error="Email is required" />
 */

import { Icon } from '@iconify/react';
import { InputHTMLAttributes, forwardRef } from 'react';

// =============================================================================
// TYPES
// =============================================================================

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Error message (shows error state) */
  error?: string;
  /** Success state */
  success?: boolean;
  /** Icon (Iconify icon name) */
  icon?: string;
  /** Icon position */
  iconPosition?: 'left' | 'right';
  /** Full width */
  fullWidth?: boolean;
  /** Additional CSS classes */
  className?: string;
}

// =============================================================================
// SIZE STYLES
// =============================================================================

const sizeStyles = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-3 text-base',
  lg: 'h-12 px-4 text-lg',
} as const;

const iconSize = {
  sm: 16,
  md: 18,
  lg: 20,
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

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = 'md',
      error,
      success = false,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      disabled = false,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const hasIcon = Boolean(icon);
    const errorId = error && id ? `${id}-error` : undefined;

    return (
      <div className={`flex flex-col gap-2 ${fullWidth ? 'w-full' : ''}`}>
        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {hasIcon && iconPosition === 'left' && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <Icon
                icon={icon}
                width={iconSize[size]}
                height={iconSize[size]}
                className="text-neutral-500"
                aria-hidden="true"
              />
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            id={id}
            disabled={disabled}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={errorId}
            className={`
              ${sizeStyles[size]}
              ${getStateStyles(error, success, disabled)}
              ${hasIcon && iconPosition === 'left' ? 'pl-10' : ''}
              ${hasIcon && iconPosition === 'right' ? 'pr-10' : ''}
              ${fullWidth ? 'w-full' : ''}
              bg-neutral-0
              border
              rounded-md
              font-normal
              text-neutral-900
              placeholder:text-neutral-500
              transition-all duration-100
              focus:outline-none
              ${className}
            `.trim().replace(/\s+/g, ' ')}
            {...props}
          />

          {/* Right Icon */}
          {hasIcon && iconPosition === 'right' && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <Icon
                icon={icon}
                width={iconSize[size]}
                height={iconSize[size]}
                className="text-neutral-500"
                aria-hidden="true"
              />
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <span
            id={errorId}
            className="text-xs text-error-700 flex items-center gap-1"
            role="alert"
          >
            <Icon icon="mdi:alert-circle" width={12} height={12} aria-hidden="true" />
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
