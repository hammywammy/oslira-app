// src/features/onboarding/components/StepContainer.tsx

/**
 * STEP CONTAINER
 * 
 * Wraps each step with AnimatePresence for smooth slide transitions
 * Direction-aware animations (slide left/right based on navigation)
 */

import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { slideVariants, slideTransition } from '../animations/variants';

// =============================================================================
// TYPES
// =============================================================================

interface StepContainerProps {
  step: number;
  direction: number;
  children: ReactNode;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function StepContainer({ step, direction, children }: StepContainerProps) {
  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={step}
        custom={direction}
        variants={slideVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={slideTransition}
        className="w-full h-full flex items-center justify-center"
      >
        {/* Inner container with consistent sizing */}
        <div className="w-full max-h-full overflow-y-auto px-1">
          {children}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
