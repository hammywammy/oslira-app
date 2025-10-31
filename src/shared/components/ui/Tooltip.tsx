// src/shared/components/ui/Tooltip.tsx

/**
 * TOOLTIP COMPONENT
 * 
 * Hover info overlay with proper timing and positioning
 * 
 * FEATURES:
 * - 4 positions (top, bottom, left, right)
 * - 200ms entrance delay (prevents accidental shows)
 * - 150ms fade-in animation
 * - Arrow pointer
 * - Dark background for contrast
 * - Full accessibility
 * 
 * DESIGN:
 * - Background: Neutral-900 @ 95% opacity
 * - Text: White (high contrast)
 * - Border radius: 6px
 * - Shadow: Overlay level
 * - Max width: 200px
 * 
 * USAGE:
 * <Tooltip content="Click to add a new lead">
 *   <Button>Add Lead</Button>
 * </Tooltip>
 * <Tooltip content="Premium feature" position="right">
 *   <Icon icon="mdi:star" />
 * </Tooltip>
 */

import { ReactNode, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// =============================================================================
// TYPES
// =============================================================================

export interface TooltipProps {
  /** Tooltip content */
  content: ReactNode;
  /** Trigger element */
  children: ReactNode;
  /** Position relative to trigger */
  position?: 'top' | 'bottom' | 'left' | 'right';
  /** Delay before showing (ms) */
  delay?: number;
  /** Additional CSS classes */
  className?: string;
}

// =============================================================================
// POSITION STYLES
// =============================================================================

const positionStyles = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
} as const;

const arrowStyles = {
  top: 'top-full left-1/2 -translate-x-1/2 border-t-neutral-900 border-t-8 border-x-transparent border-x-4 border-b-0',
  bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-neutral-900 border-b-8 border-x-transparent border-x-4 border-t-0',
  left: 'left-full top-1/2 -translate-y-1/2 border-l-neutral-900 border-l-8 border-y-transparent border-y-4 border-r-0',
  right: 'right-full top-1/2 -translate-y-1/2 border-r-neutral-900 border-r-8 border-y-transparent border-y-4 border-l-0',
} as const;

// =============================================================================
// ANIMATION VARIANTS
// =============================================================================

const tooltipVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

// =============================================================================
// COMPONENT
// =============================================================================

export function Tooltip({
  content,
  children,
  position = 'top',
  delay = 200,
  className = '',
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      {/* Trigger Element */}
      {children}

      {/* Tooltip */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={tooltipVariants}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={`
              absolute ${positionStyles[position]}
              z-tooltip
              pointer-events-none
            `}
            role="tooltip"
          >
            {/* Tooltip Content */}
            <div
              className="
                px-3 py-2
                bg-neutral-900 bg-opacity-95
                text-neutral-0 text-xs
                rounded-md
                shadow-overlay
                max-w-[200px]
                whitespace-normal
                text-center
              "
            >
              {content}
            </div>

            {/* Arrow */}
            <div
              className={`
                absolute
                ${arrowStyles[position]}
                w-0 h-0
              `}
              aria-hidden="true"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
