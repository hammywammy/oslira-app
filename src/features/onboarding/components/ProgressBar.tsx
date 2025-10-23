// src/features/onboarding/components/ProgressBar.tsx

/**
 * PROGRESS BAR
 * 
 * Fixed-position progress indicator at top of screen
 * Shows current step progress with smooth gradient animation
 */

import { motion } from 'framer-motion';
import { TOTAL_STEPS } from '../constants/steps';

// =============================================================================
// TYPES
// =============================================================================

interface ProgressBarProps {
  currentStep: number;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function ProgressBar({ currentStep }: ProgressBarProps) {
  const progress = (currentStep / TOTAL_STEPS) * 100;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-slate-900">
      <motion.div
        className="h-full bg-gradient-to-r from-violet-500 via-purple-500 to-blue-500 origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: progress / 100 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />
    </div>
  );
}
