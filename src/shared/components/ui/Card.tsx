// src/shared/components/ui/Card.tsx

/**
 * CARD COMPONENT - PRODUCTION GRADE V4.1 (SUBTLE PROFESSIONAL)
 * 
 * UPDATES:
 * ✅ Better shadow system (softer, more depth)
 * ✅ Improved hover states (subtle lift)
 * ✅ Enhanced border contrast
 * ✅ Optional gradient accent (for premium cards)
 * 
 * PHILOSOPHY:
 * "Subtle depth creates visual hierarchy"
 * - Cards should feel elevated but not floaty
 * - Shadows should be soft, not harsh
 * - Hover states should be purposeful, not gimmicky
 * 
 * USAGE: (Same API, better visuals)
 * <Card size="lg" shadow="md" hoverable>
 * <Card fillColor="primary-50" borderColor="primary-200">
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
  
  // Visual
  fillColor?: string;    
  borderColor?: string;  
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  
  // Interactive
  hoverable?: boolean;
  clickable?: boolean;
  selected?: boolean;
  disabled?: boolean;
  
  // NEW: Gradient accent (optional)
  gradientAccent?: boolean;
  
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
// SHADOW STYLES - UPGRADED (Softer, More Depth)
// =============================================================================

const shadowStyles = {
  none: '',
  sm: 'shadow-[0_1px_2px_rgba(0,0,0,0.04),0_1px_4px_rgba(0,0,0,0.02)]',
  md: 'shadow-[0_2px_8px_rgba(0,0,0,0.06),0_1px_4px_rgba(0,0,0,0.04)]',
  lg: 'shadow-[0_4px_16px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.06)]',
  xl: 'shadow-[0_8px_24px_rgba(0,0,0,0.12),0_4px_12px_rgba(0,0,0,0.08)]',
} as const;

// Hover shadow upgrades (subtle lift effect)
const hoverShadowStyles = {
  none: '',
  sm: 'hover:shadow-[0_2px_8px_rgba(0,0,0,0.06),0_1px_4px_rgba(0,0,0,0.04)]',
  md: 'hover:shadow-[0_4px_16px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.06)]',
  lg: 'hover:shadow-[0_8px_24px_rgba(0,0,0,0.12),0_4px_12px_rgba(0,0,0,0.08)]',
  xl: 'hover:shadow-[0_12px_32px_rgba(0,0,0,0.16),0_6px_16px_rgba(0,0,0,0.12)]',
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
// HELPER: GET DEFAULT COLORS (Improved Contrast)
// =============================================================================

function getDefaultFillColor(fillColor?: string): string {
  if (fillColor) return buildColorClass('bg', fillColor);
  // Slightly off-white for better layering
  return 'bg-white dark:bg-neutral-800';
}

function getDefaultBorderColor(borderColor?: string): string {
  if (borderColor === 'transparent') return 'border-transparent';
  if (borderColor) return buildColorClass('border', borderColor);
  // Better contrast borders
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
  gradientAccent = false,
  className = '',
  onClick,
  ...props
}: CardProps) {
  
  // Auto-enable clickable if onClick provided
  const isClickable = clickable || !!onClick;
  
  // Base classes with improved transitions
  const baseClasses = [
    // Layout
    'relative', // For gradient accent positioning
    sizeStyles[size],
    roundedStyles[rounded],
    'overflow-hidden', // Contains gradient accent
    
    // Visual
    getDefaultFillColor(fillColor),
    getDefaultBorderColor(borderColor),
    shadowStyles[shadow],
    
    // Interactive states with smoother transitions
    'transition-all duration-300 ease-out',
    isClickable && 'cursor-pointer',
    hoverable && `${hoverShadowStyles[shadow]} hover:-translate-y-0.5`,
    isClickable && !hoverable && hoverShadowStyles[shadow],
    selected && 'ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-neutral-900',
    disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
    
    // Active state (for clickable) - subtle press effect
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
      {/* Optional gradient accent (top border) */}
      {gradientAccent && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500" />
      )}
      
      {children}
    </div>
  );
}
