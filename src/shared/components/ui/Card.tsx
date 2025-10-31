// src/shared/components/ui/Card.tsx

/**
 * CARD COMPONENT - PRODUCTION GRADE V4.0
 * 
 * Professional container with compositional API
 * Maximum flexibility with type-safe semantic props
 * 
 * ARCHITECTURE:
 * ✅ Compositional design (mix any colors/sizes)
 * ✅ Full light/dark mode support
 * ✅ Type-safe semantic props
 * ✅ className override for edge cases
 * ✅ All interactive states
 * 
 * PHILOSOPHY:
 * "Give developers the tools, let them compose"
 * - Not locked into preset variants
 * - Full design system access
 * - Type-safe + flexible
 * 
 * USAGE:
 * <Card size="lg" fillColor="primary-50" borderColor="primary-400" shadow="md" hoverable>
 * <Card size="sm" fillColor="white" clickable onClick={handleClick}>
 * <Card className="bg-gradient-to-r from-blue-500 to-purple-600">
 */

import { HTMLAttributes, ReactNode } from 'react';

// =============================================================================
// TYPES
// =============================================================================

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  children: ReactNode;
  
  // Layout
  size?: 'sm' | 'md' | 'lg';
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  
  // Visual (any color from design system)
  fillColor?: string;    // 'white' | 'primary-50' | 'neutral-100' | etc
  borderColor?: string;  // 'neutral-200' | 'primary-400' | 'transparent' | etc
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  
  // Interactive
  hoverable?: boolean;
  clickable?: boolean;
  selected?: boolean;
  disabled?: boolean;
  
  // Override
  className?: string;
}

// =============================================================================
// SIZE STYLES (PADDING)
// =============================================================================

const sizeStyles = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
} as const;

// =============================================================================
// ROUNDED STYLES
// =============================================================================

const roundedStyles = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full',
} as const;

// =============================================================================
// SHADOW STYLES
// =============================================================================

const shadowStyles = {
  none: '',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
} as const;

// =============================================================================
// HELPER: BUILD COLOR CLASS
// =============================================================================

function buildColorClass(prefix: 'bg' | 'border', color?: string, darkColor?: string): string {
  if (!color) return '';
  
  // Check if it's a gradient or custom class
  if (color.startsWith('gradient-') || color.includes('(')) {
    return color;
  }
  
  // Build Tailwind class with dark mode support
  const lightClass = `${prefix}-${color}`;
  const darkClass = darkColor ? `dark:${prefix}-${darkColor}` : '';
  
  return `${lightClass} ${darkClass}`.trim();
}

// =============================================================================
// HELPER: GET DEFAULT COLORS
// =============================================================================

function getDefaultFillColor(fillColor?: string): string {
  if (fillColor) return buildColorClass('bg', fillColor);
  return 'bg-white dark:bg-neutral-800';
}

function getDefaultBorderColor(borderColor?: string): string {
  if (borderColor === 'transparent') return 'border-transparent';
  if (borderColor) return buildColorClass('border', borderColor);
  return 'border border-neutral-200 dark:border-neutral-700';
}

// =============================================================================
// COMPONENT
// =============================================================================

export function Card({
  children,
  size = 'md',
  rounded = 'xl',
  fillColor,
  borderColor,
  shadow = 'sm',
  hoverable = false,
  clickable = false,
  selected = false,
  disabled = false,
  className = '',
  onClick,
  ...props
}: CardProps) {
  
  // Auto-enable clickable if onClick provided
  const isClickable = clickable || !!onClick;
  
  // Base classes
  const baseClasses = [
    // Layout
    sizeStyles[size],
    roundedStyles[rounded],
    
    // Visual
    getDefaultFillColor(fillColor),
    getDefaultBorderColor(borderColor),
    shadowStyles[shadow],
    
    // Interactive states
    isClickable && 'cursor-pointer',
    hoverable && 'transition-all duration-200 ease-out hover:shadow-md hover:-translate-y-0.5',
    isClickable && !hoverable && 'transition-all duration-200 ease-out hover:shadow-md',
    selected && 'ring-2 ring-primary-500 ring-offset-2',
    disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
    
    // Active state (for clickable)
    isClickable && 'active:translate-y-0 active:shadow-sm',
    
  ].filter(Boolean).join(' ');

  return (
    <div
      className={`${baseClasses} ${className}`.trim()}
      onClick={disabled ? undefined : onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable && !disabled ? 0 : undefined}
      aria-disabled={disabled}
      {...props}
    >
      {children}
    </div>
  );
}
