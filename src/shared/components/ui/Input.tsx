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
 * - Full accessibility
 * - Disabled state
 * 
 * DESIGN:
 * - Border radius: 6px
 * - Focus: Electric blue ring
 * - Height: 32px (sm), 40px (md), 48px (lg)
 * 
 * USAGE:
 * <Input placeholder="Enter email..." />
 * <Input icon="mdi:magnify" iconPosition="left" />
 * <Input error="Email is required" />
 */

import { Icon } from '@iconify/react';
import { InputHTMLAttributes, forwardRef } from 'react';

// =============================================================================
// TYPES
// =============================================================================

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Error message (shows error state) */
  error?: string;
  /** Success state */
  success?: boolean;
  /** Icon name from Iconify */
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
          {hasIcon && iconPosition === 'left' && icon && (
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

          {/* Input - CRITICAL: Self-closing, NO children allowed */}
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
              rounded-md border bg-white
              font-normal text-neutral-900 placeholder-neutral-500
              transition-all duration-200
              focus:outline-none
              disabled:opacity-50
              ${className}
            `.trim().replace(/\s+/g, ' ')}
            {...props}
          />

          {/* Right Icon */}
          {hasIcon && iconPosition === 'right' && icon && (
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

Input.displayName = 'Input';
