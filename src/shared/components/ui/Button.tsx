// src/shared/components/ui/Button.tsx

/**
 * BUTTON COMPONENT - OSLIRA PRODUCTION
 * 
 * Minimalist button following Linear design principles.
 * Proper sizing, transitions, loading states, icon support.
 * 
 * FEATURES:
 * - 4 variants: primary, secondary, outline, ghost
 * - 3 sizes: sm (32px), md (40px), lg (48px)
 * - Loading state with spinner
 * - Icon support (left/right)
 * - Full accessibility (ARIA, keyboard)
 * 
 * USAGE:
 * <Button variant="primary">Save</Button>
 * <Button variant="secondary" size="sm" icon="mdi:plus">Add</Button>
 * <Button isLoading>Submitting...</Button>
 */

import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Icon } from '@iconify/react';

// =============================================================================
// TYPES
// =============================================================================

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  isLoading?: boolean;
  fullWidth?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
}

// =============================================================================
// COMPONENT
// =============================================================================

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  isLoading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  className = '',
  disabled,
  type = 'button',
  ...props
}: ButtonProps) {
  
  // Variant Styles
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-600 active:bg-primary-700',
    secondary: 'bg-surface-raised text-text border border-border hover:bg-muted-light',
    outline: 'bg-transparent text-text border border-border hover:bg-muted-light',
    ghost: 'bg-transparent text-text hover:bg-muted-light',
  };
  
  // Size Styles
  const sizeClasses = {
    sm: 'h-8 px-3 text-xs gap-1.5',
    md: 'h-10 px-4 text-sm gap-2',
    lg: 'h-12 px-6 text-base gap-2',
  };
  
  // Icon Size (matches text size)
  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 18,
  };
  
  // Base Classes
  const baseClasses = [
    'inline-flex items-center justify-center',
    'font-medium rounded-lg',
    'transition-all duration-150',
    'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? 'w-full' : '',
    className,
  ].filter(Boolean).join(' ');
  
  return (
    <button
      type={type}
      className={baseClasses}
      disabled={disabled || isLoading}
      {...props}
    >
      {/* Loading Spinner */}
      {isLoading && (
        <Icon
          icon="mdi:loading"
          width={iconSizes[size]}
          className="animate-spin"
        />
      )}
      
      {/* Left Icon */}
      {!isLoading && icon && iconPosition === 'left' && (
        <Icon icon={icon} width={iconSizes[size]} />
      )}
      
      {/* Button Text */}
      {children}
      
      {/* Right Icon */}
      {!isLoading && icon && iconPosition === 'right' && (
        <Icon icon={icon} width={iconSizes[size]} />
      )}
    </button>
  );
}
