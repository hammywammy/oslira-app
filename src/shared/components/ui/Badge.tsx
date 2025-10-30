// src/shared/components/ui/Badge.tsx

/**
 * BADGE COMPONENT - OSLIRA PRODUCTION
 * 
 * Minimalist status badges for tables and UI elements.
 * Semantic color variants matching 3-5-7 system.
 * 
 * FEATURES:
 * - 6 semantic variants (success, warning, danger, primary, neutral, info)
 * - 3 sizes: sm, md, lg
 * - Consistent with design system colors
 * 
 * USAGE:
 * <Badge variant="success">Complete</Badge>
 * <Badge variant="warning" size="sm">Pending</Badge>
 * <Badge variant="info">Deep</Badge>
 */

import { ReactNode } from 'react';

// =============================================================================
// TYPES
// =============================================================================

export interface BadgeProps {
  variant?: 'success' | 'warning' | 'danger' | 'primary' | 'neutral' | 'info';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  className?: string;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function Badge({ 
  variant = 'neutral',
  size = 'sm',
  children,
  className = '' 
}: BadgeProps) {
  
  // Variant Styles (using light backgrounds + darker text)
  const variantClasses = {
    success: 'bg-success-light text-success-700 border-success-200',
    warning: 'bg-warning-light text-warning-700 border-warning-200',
    danger: 'bg-danger-light text-danger-700 border-danger-200',
    primary: 'bg-primary-light text-primary-700 border-primary-200',
    info: 'bg-primary-light text-primary-700 border-primary-200',
    neutral: 'bg-muted-light text-muted-700 border-muted-200',
  };
  
  // Size Styles
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };
  
  // Base Classes
  const baseClasses = [
    'inline-flex items-center justify-center',
    'font-medium rounded-md border',
    variantClasses[variant],
    sizeClasses[size],
    className,
  ].filter(Boolean).join(' ');
  
  return (
    <span className={baseClasses}>
      {children}
    </span>
  );
}
