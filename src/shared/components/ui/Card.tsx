// src/shared/components/ui/Card.tsx

/**
 * CARD COMPONENT - PRODUCTION GRADE
 * 
 * Versatile container with sophisticated elevation system
 * Inspired by Supabase, Linear, Stripe design systems
 * 
 * ENHANCEMENTS (v2.0):
 * ✅ Proper elevation with shadow-raised (default)
 * ✅ Refined border colors (neutral-200/300)
 * ✅ Subtle hover lift with shadow-elevated
 * ✅ Smooth 200ms transitions
 * ✅ Optional header/footer with proper dividers
 * ✅ 3 padding variants (compact/default/spacious)
 * ✅ Interactive states without over-animation
 * 
 * PHILOSOPHY:
 * "Concert hall, not arcade" - Elegant depth over dramatic effects
 * Cards breathe with subtle elevation, not aggressive shadows
 * 
 * FEATURES:
 * - 3 padding variants (compact, default, spacious)
 * - Optional hover effect (lift + shadow)
 * - Optional header/footer sections with dividers
 * - Elevated background with refined shadows
 * - Full customization via className
 * 
 * DESIGN:
 * - Background: White (neutral-0)
 * - Border: 1px solid neutral-200 (light) / neutral-300 (dividers)
 * - Border radius: 12px (refined, modern)
 * - Shadow: shadow-raised (default) → shadow-elevated (hover)
 * - Transition: 200ms cubic-bezier(0.4, 0, 0.2, 1)
 * - Hover lift: translateY(-2px)
 * 
 * USAGE:
 * <Card>Basic content</Card>
 * <Card padding="compact" hoverable>Interactive card</Card>
 * <Card 
 *   header={<h3 className="font-semibold">Title</h3>}
 *   footer={<Button>Action</Button>}
 * >
 *   Card with header and footer
 * </Card>
 */

import { HTMLAttributes, ReactNode } from 'react';

// =============================================================================
// TYPES
// =============================================================================

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Card content */
  children: ReactNode;
  /** Padding variant */
  padding?: 'compact' | 'default' | 'spacious';
  /** Enable hover effect (lift + shadow) */
  hoverable?: boolean;
  /** Optional header section */
  header?: ReactNode;
  /** Optional footer section */
  footer?: ReactNode;
  /** Additional CSS classes */
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
        bg-white
        border border-neutral-200
        rounded-xl
        shadow-raised
        ${hoverable ? 'transition-all duration-200 ease-out hover:shadow-elevated hover:-translate-y-0.5 cursor-pointer' : ''}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      {...props}
    >
      {/* Header */}
      {header && (
        <div className={`${paddingStyles[padding]} border-b border-neutral-300`}>
          {header}
        </div>
      )}

      {/* Content */}
      <div className={paddingStyles[padding]}>
        {children}
      </div>

      {/* Footer */}
      {footer && (
        <div className={`${paddingStyles[padding]} border-t border-neutral-300`}>
          {footer}
        </div>
      )}
    </div>
  );
}
