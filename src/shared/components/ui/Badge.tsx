// src/shared/components/ui/Badge.tsx

/**
 * BADGE COMPONENT
 * 
 * Small label/tag for statuses, categories, counts
 * 
 * FEATURES:
 * - 6 semantic variants (default, primary, success, error, warning, info)
 * - 3 sizes (sm, md, lg)
 * - Optional icon
 * - Optional dot indicator
 * - Pill shape (rounded-full)
 * 
 * USAGE:
 * <Badge variant="success">Active</Badge>
 * <Badge variant="primary" icon="mdi:star">Premium</Badge>
 * <Badge variant="error" dot>Offline</Badge>
 */

import { Icon } from '@iconify/react';
import { ReactNode } from 'react';

// =============================================================================
// TYPES
// =============================================================================

export interface BadgeProps {
  /** Content to display */
  children: ReactNode;
  /** Visual variant */
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Optional icon (Iconify icon name) */
  icon?: string;
  /** Show dot indicator instead of icon */
  dot?: boolean;
  /** Additional CSS classes */
  className?: string;
}

// =============================================================================
// VARIANT STYLES
// =============================================================================

const variantStyles = {
  default: 'bg-neutral-100 text-neutral-700 border border-neutral-300',
  primary: 'bg-primary-100 text-primary-700 border border-primary-300',
  secondary: 'bg-secondary-100 text-secondary-700 border border-secondary-300',
  success: 'bg-success-100 text-success-700 border border-success-300',
  error: 'bg-error-100 text-error-700 border border-error-300',
  warning: 'bg-warning-100 text-warning-700 border border-warning-300',
  info: 'bg-info-100 text-info-700 border border-info-300',
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
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center justify-center
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        rounded-full
        font-medium
        whitespace-nowrap
        transition-colors duration-150
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
