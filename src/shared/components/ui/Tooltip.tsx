// src/shared/components/ui/Tooltip.tsx

/**
 * TOOLTIP COMPONENT - PRODUCTION GRADE V1.0
 * 
 * Professional tooltip with natural dark mode support
 * Follows Card.tsx and Button.tsx architecture patterns
 * 
 * ARCHITECTURE:
 * ✅ Natural Tailwind dark: classes for automatic mode detection
 * ✅ Proper contrast in both light and dark modes
 * ✅ Placement options (top, bottom, left, right)
 * ✅ Size variants (sm, md, lg)
 * ✅ Variant styles (dark, light)
 * ✅ CSS-only implementation (no complex JS positioning)
 * 
 * DESIGN PHILOSOPHY:
 * "Concert hall, not arcade"
 * - Clean, minimal tooltip styling
 * - Subtle animations
 * - Professional appearance
 * 
 * USAGE:
 * <Tooltip content="Helpful information">
 *   <button>Hover me</button>
 * </Tooltip>
 * <Tooltip content="More details" placement="bottom" size="lg">
 *   <span>Info</span>
 * </Tooltip>
 */

import { HTMLAttributes, ReactNode, useState } from 'react';

// =============================================================================
// TYPES
// =============================================================================

export interface TooltipProps extends Omit<HTMLAttributes<HTMLDivElement>, 'content'> {
  /** Tooltip content */
  content: ReactNode;
  /** Trigger element (what user hovers) */
  children: ReactNode;
  /** Tooltip placement */
  placement?: 'top' | 'bottom' | 'left' | 'right';
  /** Size variant (controls padding) */
  size?: 'sm' | 'md' | 'lg';
  /** Visual variant */
  variant?: 'dark' | 'light';
  /** Additional CSS classes */
  className?: string;
}

// =============================================================================
// SIZE STYLES (PADDING)
// =============================================================================

const sizeStyles = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base',
} as const;

// =============================================================================
// PLACEMENT STYLES
// =============================================================================

const placementStyles = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
} as const;

// =============================================================================
// VARIANT STYLES - LIGHT/DARK MODE COMPATIBLE
// =============================================================================

const variantStyles = {
  dark: `
    bg-neutral-900 text-white
    dark:bg-neutral-800 dark:text-white
    border border-neutral-800
    dark:border-neutral-700
  `,
  light: `
    bg-white text-neutral-900
    dark:bg-neutral-100 dark:text-neutral-900
    border border-neutral-300
    dark:border-neutral-400
    shadow-lg
  `,
} as const;

// =============================================================================
// COMPONENT
// =============================================================================

export function Tooltip({
  content,
  children,
  placement = 'top',
  size = 'md',
  variant = 'dark',
  className = '',
  ...props
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
      {...props}
    >
      {/* Trigger Element */}
      {children}

      {/* Tooltip */}
      {isVisible && (
        <div
          role="tooltip"
          className={`
            absolute z-50
            ${placementStyles[placement]}
            ${sizeStyles[size]}
            ${variantStyles[variant]}
            rounded-lg
            whitespace-nowrap
            pointer-events-none
            animate-in fade-in-0 zoom-in-95 duration-150
            ${className}
          `.trim().replace(/\s+/g, ' ')}
        >
          {content}
        </div>
      )}
    </div>
  );
}
