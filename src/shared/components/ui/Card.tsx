// src/shared/components/ui/Card.tsx

/**
 * CARD COMPONENT
 * 
 * Versatile container primitive for content grouping
 * 
 * FEATURES:
 * - 3 padding variants (compact, default, spacious)
 * - Optional hover effect
 * - Optional header/footer sections
 * - Elevated background with shadow
 * - Full customization
 * 
 * DESIGN:
 * - Background: White (elevated)
 * - Border: 1px solid neutral-400
 * - Border radius: 8px
 * - Shadow: Elevated level (default)
 * - Hover: Lift effect with overlay shadow
 * 
 * USAGE:
 * <Card>Content here</Card>
 * <Card padding="compact" hoverable>Compact card</Card>
 * <Card header={<h3>Title</h3>} footer={<Button>Action</Button>}>
 *   Card content
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
  /** Enable hover effect */
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
        bg-neutral-0
        border border-neutral-400
        rounded-lg
        shadow-elevated
        ${hoverable ? 'transition-all duration-200 hover:shadow-overlay hover:-translate-y-0.5 cursor-pointer' : ''}
        ${className}
      `}
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
