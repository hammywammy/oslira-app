// src/features/onboarding/components/StepContainer.tsx

/**
 * STEP CONTAINER - FLEXIBLE ANIMATION WRAPPER
 * 
 * FIXED:
 * ✅ No height restrictions
 * ✅ No overflow hidden
 * ✅ Content expands naturally
 * ✅ Smooth transitions preserved
 * 
 * CRITICAL:
 * - AnimatePresence mode="wait" ensures one child at a time
 * - Duration matches parent timeout (300ms)
 * - No layout conflicts during transitions
 */

import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// =============================================================================
// CONSTANTS
// =============================================================================

const ANIMATION_DURATION = 0.3; // 300ms

// =============================================================================
// TYPES
// =============================================================================

interface StepContainerProps {
  step: number;
  direction: number;
  children: ReactNode;
}

// =============================================================================
// ANIMATION VARIANTS
// =============================================================================

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 40 : -40,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 40 : -40,
    opacity: 0,
  }),
};

const slideTransition = {
  duration: ANIMATION_DURATION,
  ease: [0.22, 1, 0.36, 1],
};

// =============================================================================
// COMPONENT
// =============================================================================

export function StepContainer({ step, direction, children }: StepContainerProps) {
  return (
    <AnimatePresence 
      mode="wait" 
      custom={direction}
      initial={false}
    >
      <motion.div
        key={step}
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
          - w-full: Full width
          - NO height or overflow restrictions
          - Content determines height naturally
        */}
        <div className="w-full">
          {children}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
