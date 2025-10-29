// src/shared/components/ui/Button.tsx

/**
 * BUTTON COMPONENT
 * 
 * Minimalist button following Linear design principles.
 * Supports icons, loading states, and multiple variants.
 * 
 * USAGE:
 * <Button variant="primary">Click me</Button>
 * <Button variant="secondary" icon="mdi:plus" iconPosition="left">Add</Button>
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
  icon?: string; // Iconify icon name (e.g., "mdi:plus")
  iconPosition?: 'left' | 'right';
}

// =============================================================================
// STYLES
// =============================================================================

const variantStyles = {
  primary: 'bg-primary text-white hover:bg-primary-600',
  secondary: 'bg-muted-light text-text hover:bg-muted-100',
  outline: 'border border-border text-text hover:bg-muted-light',
  ghost: 'text-text hover:bg-muted-light',
} as const;

const sizeStyles = {
  sm: 'px-3 py-1.5 text-xs h-8',
  md: 'px-4 py-2 text-sm h-10',
  lg: 'px-6 py-3 text-base h-12',
} as const;

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
  ...props
}: ButtonProps) {
  const baseStyles = 'font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2';
  
  const widthStyles = fullWidth ? 'w-full' : '';

  const combinedClassName = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${widthStyles}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <button
      className={combinedClassName}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && <Icon icon={icon} width={16} />}
          {children}
          {icon && iconPosition === 'right' && <Icon icon={icon} width={16} />}
        </>
      )}
    </button>
  );
}
