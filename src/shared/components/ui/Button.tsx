// src/shared/components/ui/Button.tsx

/**
 * BUTTON COMPONENT
 * 
 * Primary interactive element with complete state system
 * 
 * FEATURES:
 * - 4 variants (primary, secondary, ghost, danger)
 * - 3 sizes (sm, md, lg)
 * - Optional icons (left/right/only)
 * - Loading state with spinner
 * - Full keyboard navigation
 * - Disabled state
 * 
 * DESIGN:
 * - 6px border radius (default)
 * - 150ms hover transition
 * - scale(0.98) active state
 * - Focus ring on keyboard navigation
 * 
 * USAGE:
 * <Button variant="primary" size="md">Save</Button>
 * <Button variant="secondary" icon="mdi:plus" iconPosition="left">Add Lead</Button>
 * <Button variant="ghost" loading>Processing...</Button>
 */

import { Icon } from '@iconify/react';
import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Spinner } from './Spinner';

// =============================================================================
// TYPES
// =============================================================================

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button content */
  children?: ReactNode;
  /** Visual variant */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Icon (Iconify icon name) */
  icon?: string;
  /** Icon position */
  iconPosition?: 'left' | 'right' | 'only';
  /** Loading state */
  loading?: boolean;
  /** Loading state (alias for loading) */
  isLoading?: boolean;
  /** Full width */
  fullWidth?: boolean;
  /** Additional CSS classes */
  className?: string;
}

// =============================================================================
// VARIANT STYLES
// =============================================================================

const variantStyles = {
  primary: `
    bg-primary-500 text-neutral-0 border border-primary-500
    hover:bg-primary-600 hover:border-primary-600
    active:bg-primary-700 active:border-primary-700
    disabled:opacity-50 disabled:cursor-not-allowed
  `,
  secondary: `
    bg-neutral-0 text-neutral-800 border border-neutral-400
    hover:bg-neutral-100 hover:border-neutral-500
    active:bg-neutral-200
    disabled:opacity-50 disabled:cursor-not-allowed
  `,
  ghost: `
    bg-transparent text-neutral-700 border border-transparent
    hover:bg-neutral-100
    active:bg-neutral-200
    disabled:opacity-50 disabled:cursor-not-allowed
  `,
  danger: `
    bg-error-600 text-neutral-0 border border-error-600
    hover:bg-error-700 hover:border-error-700
    active:bg-error-800 active:border-error-800
    disabled:opacity-50 disabled:cursor-not-allowed
  `,
} as const;

// =============================================================================
// SIZE STYLES
// =============================================================================

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2 text-base gap-2',
  lg: 'px-6 py-3 text-lg gap-2.5',
} as const;

const iconSize = {
  sm: 16,
  md: 18,
  lg: 20,
} as const;

// =============================================================================
// COMPONENT
// =============================================================================

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  isLoading = false,
  fullWidth = false,
  disabled = false,
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading || isLoading;
  const isIconOnly = iconPosition === 'only' && !children;
  const showLoading = loading || isLoading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center
        font-medium
        rounded-md
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${isIconOnly ? 'px-2' : ''}
        transition-all duration-150 ease-default
        active:scale-[0.98]
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      {...props}
    >
      {/* Loading Spinner */}
      {showLoading && (
        <Spinner
          size={size === 'lg' ? 'md' : 'sm'}
          variant={variant === 'primary' || variant === 'danger' ? 'neutral' : 'primary'}
        />
      )}

      {/* Left Icon */}
      {!showLoading && icon && (iconPosition === 'left' || iconPosition === 'only') && (
        <Icon
          icon={icon}
          width={iconSize[size]}
          height={iconSize[size]}
          aria-hidden="true"
        />
      )}

      {/* Button Text */}
      {!isIconOnly && children && (
        <span>{children}</span>
      )}

      {/* Right Icon */}
      {!showLoading && icon && iconPosition === 'right' && (
        <Icon
          icon={icon}
          width={iconSize[size]}
          height={iconSize[size]}
          aria-hidden="true"
        />
      )}
    </button>
  );
}
