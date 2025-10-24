// src/features/onboarding/components/StepContainer.tsx

/**
 * STEP CONTAINER - ANIMATION-PERFECT
 * 
 * FIXES:
 * ✅ AnimatePresence with mode="wait" - one child at a time
 * ✅ Exit completes BEFORE next enters
 * ✅ No layout shift during transitions
 * ✅ Consistent animation timing
 * 
 * CRITICAL:
 * - Duration must match ANIMATION_DURATION in OnboardingPage (300ms)
 * - mode="wait" ensures exit animation completes before enter starts
 * - unique key from parent forces proper unmount/remount
 */

import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// =============================================================================
// CONSTANTS
// =============================================================================

const ANIMATION_DURATION = 0.3; // 300ms - matches parent timeout

// =============================================================================
// TYPES
// =============================================================================

interface StepContainerProps {
  step: number;
  direction: number;
  children: ReactNode;
}

// =============================================================================
// ANIMATION VARIANTS - NO SPRING/BOUNCE
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
  ease: [0.22, 1, 0.36, 1], // Smooth easing curve
};

// =============================================================================
// COMPONENT
// =============================================================================

export function StepContainer({ step, direction, children }: StepContainerProps) {
  return (
    <div className="w-full">
      <AnimatePresence 
        mode="wait" 
        custom={direction}
        initial={false}
      >
        <motion.div
          key={step} // ✅ Uses step number directly for absolute uniqueness
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
            - No fixed height (allows natural content flow)
            - Prevents horizontal overflow from slide animation
            - Maintains full width
          */}
          <div className="w-full overflow-x-hidden">
            {children}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
