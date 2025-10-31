// src/shared/components/ui/Card.tsx

/**
 * CARD COMPONENT - PRODUCTION GRADE V3.0
 * 
 * Professional container with PROPER light/dark mode support
 * Inspired by Supabase, Linear, Stripe design systems
 * 
 * ARCHITECTURE:
 * ✅ Tailwind dark: classes for automatic mode detection
 * ✅ Subtle elevation system (shadow-sm default, shadow-md hover)
 * ✅ Refined borders (neutral-200 light, neutral-700 dark)
 * ✅ Smooth 200ms transitions
 * ✅ Optional hover lift (2px, subtle)
 * ✅ Professional polish without over-animation
 * 
 * DESIGN PHILOSOPHY:
 * "Concert hall, not arcade"
 * - Cards breathe with subtle elevation
 * - Hover lift is barely noticeable (2px)
 * - Shadow progression (sm → md)
 * - Borders refine edges without harshness
 * 
 * ELEVATION SYSTEM:
 * - Default: shadow-sm (barely visible depth)
 * - Hover: shadow-md + translateY(-2px)
 * - Borders adapt to light/dark (neutral-200/700)
 * - Background always contrasts with page (white/neutral-800)
 */

import { HTMLAttributes, ReactNode } from 'react';

// =============================================================================
// TYPES
// =============================================================================

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: 'compact' | 'default' | 'spacious';
  hoverable?: boolean;
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

// =============================================================================
// PADDING STYLES
// =============================================================================

const paddingStyles = {
  compact: 'p-4',
  default: 'p-6',
  spacious: 'p-8',
} as const;

// =============================================================================
// COMPONENT
// =============================================================================

export function Card({
  children,
  padding = 'default',
  hoverable = false,
  header,
  footer,
  className = '',
  ...props
}: CardProps) {
  return (
    <div
      className={`
        bg-white dark:bg-neutral-800
        border border-neutral-200 dark:border-neutral-700
        rounded-xl
        shadow-sm
        ${hoverable ? 'transition-all duration-200 ease-out hover:shadow-md hover:-translate-y-0.5 cursor-pointer' : ''}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      {...props}
    >
      {/* Header */}
      {header && (
        <div className={`
          ${paddingStyles[padding]} 
          border-b border-neutral-200 dark:border-neutral-700
        `}>
          {header}
        </div>
      )}

      {/* Content */}
      <div className={paddingStyles[padding]}>
        {children}
      </div>

      {/* Footer */}
      {footer && (
        <div className={`
          ${paddingStyles[padding]} 
          border-t border-neutral-200 dark:border-neutral-700
        `}>
          {footer}
        </div>
      )}
    </div>
  );
}
