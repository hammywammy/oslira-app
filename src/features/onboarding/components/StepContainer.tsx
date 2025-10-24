// src/features/onboarding/components/StepContainer.tsx

/**
 * STEP CONTAINER - BULLETPROOF ANIMATIONS
 * 
 * FIXES:
 * - Proper AnimatePresence with mode="wait"
 * - No layout shift during transitions
 * - Content-driven height (no crushing)
 * 
 * ARCHITECTURE:
 * - AnimatePresence ensures only one child at a time
 * - mode="wait" prevents overlap/desync
 * - Key-based rendering from parent forces clean unmount/mount
 */

import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// =============================================================================
// TYPES
// =============================================================================

interface StepContainerProps {
  step: number;
  direction: number;
  children: ReactNode;
}

// =============================================================================
// ANIMATION VARIANTS - SIMPLIFIED, NO BOUNCE
// =============================================================================

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 30 : -30,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 30 : -30,
    opacity: 0,
  }),
};

const slideTransition = {
  duration: 0.3,
  ease: 'easeInOut',
};

// =============================================================================
// COMPONENT
// =============================================================================

export function StepContainer({ step, direction, children }: StepContainerProps) {
  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={`step-${step}`}
        custom={direction}
        variants={slideVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={slideTransition}
        className="w-full"
      >
        {/* 
          Content wrapper:
          - No fixed height
          - Allows natural content expansion
          - Prevents horizontal overflow
        */}
        <div className="w-full overflow-x-hidden">
          {children}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
