// src/shared/components/ui/Badge.tsx

/**
 * BADGE COMPONENT - V2.0 (SUBTLE PROFESSIONAL)
 * 
 * UPDATES:
 * ✅ New gradient variants (light-analysis, deep-analysis, xray-analysis)
 * ✅ Better color contrast
 * ✅ Softer borders
 * ✅ Optional subtle glow effect
 * 
 * PHILOSOPHY:
 * "Analysis badges should show tier hierarchy visually"
 * - Light = Blue (entry tier)
 * - Deep = Blue gradient (premium tier)
 * - X-Ray = Purple gradient (elite tier)
 * 
 * USAGE:
 * <Badge variant="light-analysis">Light</Badge>
 * <Badge variant="deep-analysis">Deep</Badge>
 * <Badge variant="xray-analysis">X-Ray</Badge>
 */

import { Icon } from '@iconify/react';
import { ReactNode } from 'react';

// =============================================================================
// TYPES
// =============================================================================

export interface BadgeProps {
  children: ReactNode;
  variant?: 
    | 'default' | 'neutral' 
    | 'primary' | 'secondary' 
    | 'success' | 'error' | 'warning' | 'info'
    | 'light-analysis' | 'deep-analysis' | 'xray-analysis'; // NEW
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  dot?: boolean;
  glow?: boolean; // NEW: Optional subtle glow
  className?: string;
}

// =============================================================================
// VARIANT STYLES - UPDATED (Better Contrast + Gradients)
// =============================================================================

const variantStyles = {
  // Standard variants
  default: 'bg-neutral-100 text-neutral-700 border border-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700',
  neutral: 'bg-neutral-100 text-neutral-700 border border-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700',
  primary: 'bg-primary-100 text-primary-700 border border-primary-200 dark:bg-primary-900/30 dark:text-primary-400 dark:border-primary-800',
  secondary: 'bg-secondary-100 text-secondary-700 border border-secondary-200 dark:bg-secondary-900/30 dark:text-secondary-400 dark:border-secondary-800',
  success: 'bg-success-100 text-success-700 border border-success-200 dark:bg-success-900/30 dark:text-success-400 dark:border-success-800',
  error: 'bg-error-100 text-error-700 border border-error-200 dark:bg-error-900/30 dark:text-error-400 dark:border-error-800',
  warning: 'bg-warning-100 text-warning-700 border border-warning-200 dark:bg-warning-900/30 dark:text-warning-400 dark:border-warning-800',
  info: 'bg-info-100 text-info-700 border border-info-200 dark:bg-info-900/30 dark:text-info-400 dark:border-info-800',
  
  // NEW: Analysis tier variants with gradients
  'light-analysis': 'bg-gradient-to-r from-info-100 to-info-50 text-info-700 border border-info-200 dark:from-info-900/20 dark:to-info-900/10 dark:text-info-400 dark:border-info-800',
  'deep-analysis': 'bg-gradient-to-r from-primary-100 via-primary-50 to-secondary-50 text-primary-700 border border-primary-200 dark:from-primary-900/30 dark:via-primary-900/20 dark:to-secondary-900/20 dark:text-primary-400 dark:border-primary-700',
  'xray-analysis': 'bg-gradient-to-r from-secondary-100 via-secondary-50 to-secondary-100 text-secondary-700 border border-secondary-200 dark:from-secondary-900/40 dark:via-secondary-900/30 dark:to-secondary-900/40 dark:text-secondary-400 dark:border-secondary-700',
} as const;

// Glow effects for special variants
const glowStyles = {
  'light-analysis': 'shadow-[0_0_8px_rgba(59,130,246,0.15)]',
  'deep-analysis': 'shadow-[0_0_12px_rgba(0,184,255,0.20)]',
  'xray-analysis': 'shadow-[0_0_12px_rgba(139,127,199,0.25)]',
} as const;

// =============================================================================
// SIZE STYLES
// =============================================================================

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs gap-1',
  md: 'px-2.5 py-1 text-sm gap-1.5',
  lg: 'px-3 py-1.5 text-base gap-2',
} as const;

const iconSize = {
  sm: 12,
  md: 14,
  lg: 16,
} as const;

const dotSize = {
  sm: 'w-1.5 h-1.5',
  md: 'w-2 h-2',
  lg: 'w-2.5 h-2.5',
} as const;

// =============================================================================
// COMPONENT
// =============================================================================

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  icon,
  dot = false,
  glow = false,
  className = '',
}: BadgeProps) {
  
  // Apply glow only to analysis variants when enabled
  const shouldGlow = glow && (
    variant === 'light-analysis' || 
    variant === 'deep-analysis' || 
    variant === 'xray-analysis'
  );
  
  const glowClass = shouldGlow ? glowStyles[variant as keyof typeof glowStyles] : '';
  
  return (
    <span
      className={`
        inline-flex items-center justify-center
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${glowClass}
        rounded-full
        font-medium
        whitespace-nowrap
        transition-all duration-200
        ${className}
      `}
    >
      {/* Dot Indicator */}
      {dot && (
        <span
          className={`
            ${dotSize[size]}
            rounded-full
            bg-current
            opacity-70
          `}
          aria-hidden="true"
        />
      )}

      {/* Icon */}
      {icon && !dot && (
        <Icon
          icon={icon}
          width={iconSize[size]}
          height={iconSize[size]}
          aria-hidden="true"
        />
      )}

      {/* Content */}
      <span>{children}</span>
    </span>
  );
}
