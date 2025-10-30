// src/shared/components/ui/Input.tsx

/**
 * INPUT COMPONENT - OSLIRA PRODUCTION
 * 
 * Consistent text input with proper sizing and states.
 * Matches button heights for visual consistency.
 * 
 * FEATURES:
 * - 3 sizes: sm (32px), md (40px), lg (48px)
 * - Error state styling
 * - Icon support (left/right)
 * - Full-width option
 * - Proper focus ring
 * 
 * USAGE:
 * <Input placeholder="Search..." />
 * <Input error="Required field" />
 * <Input icon="mdi:search" iconPosition="left" />
 */

import { InputHTMLAttributes, forwardRef } from 'react';
import { Icon } from '@iconify/react';

// =============================================================================
// TYPES
// =============================================================================

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  fullWidth?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
  inputSize?: 'sm' | 'md' | 'lg';
}

// =============================================================================
// COMPONENT
// =============================================================================

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  error,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  inputSize = 'md',
  className = '',
  ...props
}, ref) => {
  
  // Size Classes
  const sizeClasses = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-5 text-base',
  };
  
  // Icon Sizes
  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 18,
  };
  
  // Padding adjustments when icon present
  const paddingWithIcon = icon ? (
    iconPosition === 'left' ? 'pl-10' : 'pr-10'
  ) : '';
  
  // Base Classes
  const baseClasses = [
    'bg-surface-raised border rounded-lg',
    'transition-all duration-150',
    'placeholder:text-text-muted',
    'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:border-primary',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    error ? 'border-danger focus:ring-danger' : 'border-border',
    sizeClasses[inputSize],
    paddingWithIcon,
    fullWidth ? 'w-full' : '',
    className,
  ].filter(Boolean).join(' ');
  
  return (
    <div className={`relative ${fullWidth ? 'w-full' : 'inline-block'}`}>
      {/* Icon */}
      {icon && (
        <div className={`absolute top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none ${
          iconPosition === 'left' ? 'left-3' : 'right-3'
        }`}>
          <Icon icon={icon} width={iconSizes[inputSize]} />
        </div>
      )}
      
      {/* Input */}
      <input
        ref={ref}
        className={baseClasses}
        {...props}
      />
      
      {/* Error Message */}
      {error && (
        <p className="mt-1 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
