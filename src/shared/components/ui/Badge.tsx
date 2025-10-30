// src/shared/components/ui/Badge.tsx

/**
 * BADGE COMPONENT
 * 
 * Minimalist status badges for tables and UI elements.
 * Follows 3-5-7 color system.
 * 
 * USAGE:
 * <Badge variant="success">Active</Badge>
 * <Badge variant="warning">Pending</Badge>
 */

import { ReactNode } from 'react';

// =============================================================================
// TYPES
// =============================================================================

export interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'primary' | 'info' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  className?: string;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function Badge({ 
  variant = 'default',
  size = 'md',
  children,
  className = '' 
}: BadgeProps) {
  const variantStyles = {
    default: 'bg-muted-light text-muted-600',
    success: 'bg-success-50 text-success-700',
    warning: 'bg-warning-50 text-warning-700',
    danger: 'bg-danger-50 text-danger-700',
    primary: 'bg-primary-50 text-primary-700',
    info: 'bg-primary-50 text-primary-700',
    neutral: 'bg-muted-light text-muted-600',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  return (
    <span
      className={`
        inline-flex items-center rounded-md font-medium
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      {children}
    </span>
  );
}
