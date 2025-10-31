// src/shared/components/ui/Button.tsx

/**
 * BUTTON COMPONENT - PRODUCTION GRADE V3.0
 * 
 * Professional button with PROPER light/dark mode support
 * Inspired by Supabase, Linear, Stripe design systems
 * 
 * ARCHITECTURE:
 * ✅ Tailwind dark: classes for automatic mode detection
 * ✅ Proper contrast in BOTH light and dark modes
 * ✅ Subtle depth with shadows and borders
 * ✅ Refined hover states (1px lift, shadow progression)
 * ✅ No Framer Motion overhead (pure CSS)
 * ✅ Professional polish without over-animation
 * 
 * DESIGN PHILOSOPHY:
 * "Concert hall, not arcade"
 * - Subtle hover lift (1px, not 5px)
 * - Shadow progression (barely noticeable)
 * - 200ms transitions (smooth, not instant)
 * - Professional fills with proper contrast
 * 
 * VARIANTS:
 * - PRIMARY: Electric blue fill, white text, confident
 * - SECONDARY: Neutral fill, adapts to light/dark
 * - GHOST: Transparent, subtle hover background
 * - DANGER: Red fill, white text, clear warning
 */

import { Icon } from '@iconify/react';
import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Spinner } from './Spinner';

// =============================================================================
// TYPES
// =============================================================================

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  iconPosition?: 'left' | 'right' | 'only';
  loading?: boolean;
  isLoading?: boolean;
  fullWidth?: boolean;
  className?: string;
}

// =============================================================================
// VARIANT STYLES - LIGHT/DARK MODE COMPATIBLE
// =============================================================================

const variantStyles = {
  primary: `
    bg-primary-500 text-white
    border border-primary-600/10
    shadow-sm
    hover:bg-primary-600 hover:shadow-md hover:-translate-y-0.5
    active:translate-y-0 active:shadow-sm active:bg-primary-700
    dark:bg-primary-500 dark:text-white
    dark:hover:bg-primary-600
    dark:active:bg-primary-700
    disabled:opacity-50 disabled:cursor-not-allowed 
    disabled:hover:translate-y-0 disabled:hover:shadow-sm disabled:hover:bg-primary-500
  `,
  
  secondary: `
    bg-white text-neutral-800
    border border-neutral-300
    shadow-sm
    hover:bg-neutral-50 hover:border-neutral-400 hover:shadow-md hover:-translate-y-0.5
    active:translate-y-0 active:shadow-sm active:bg-neutral-100
    dark:bg-neutral-800 dark:text-neutral-100 dark:border-neutral-700
    dark:hover:bg-neutral-700 dark:hover:border-neutral-600
    dark:active:bg-neutral-600
    disabled:opacity-50 disabled:cursor-not-allowed 
    disabled:hover:translate-y-0 disabled:hover:shadow-sm
  `,
  
  ghost: `
    bg-transparent text-neutral-700
    border border-transparent
    hover:bg-neutral-100 hover:-translate-y-0.5
    active:translate-y-0 active:bg-neutral-200
    dark:text-neutral-300
    dark:hover:bg-neutral-800
    dark:active:bg-neutral-700
    disabled:opacity-50 disabled:cursor-not-allowed 
    disabled:hover:translate-y-0 disabled:hover:bg-transparent
  `,
  
  danger: `
    bg-error-600 text-white
    border border-error-700/10
    shadow-sm
    hover:bg-error-700 hover:shadow-md hover:-translate-y-0.5
    active:translate-y-0 active:shadow-sm active:bg-error-800
    dark:bg-error-600 dark:text-white
    dark:hover:bg-error-700
    dark:active:bg-error-800
    disabled:opacity-50 disabled:cursor-not-allowed 
    disabled:hover:translate-y-0 disabled:hover:shadow-sm disabled:hover:bg-error-600
  `,
} as const;

// =============================================================================
// SIZE STYLES
// =============================================================================

const sizeStyles = {
  sm: 'h-8 px-3 text-sm gap-1.5 rounded-md',
  md: 'h-10 px-4 text-base gap-2 rounded-lg',
  lg: 'h-12 px-6 text-lg gap-2.5 rounded-lg',
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
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${isIconOnly ? 'aspect-square !px-0' : ''}
        transition-all duration-200 ease-out
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
