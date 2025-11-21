// src/features/onboarding/components/ProgressBar.tsx

/**
 * PROGRESS BAR - MODERN MINIMAL DESIGN
 * 
 * Simple, clean progress indicator
 * Correct progress calculation (0% at step 1, 100% at step 4)
 */

import { motion } from 'framer-motion';
import { TOTAL_STEPS } from '../constants/steps';

interface ProgressBarProps {
  currentStep: number;
}

export function ProgressBar({ currentStep }: ProgressBarProps) {
  // Correct progress calculation: (currentStep - 1) / (totalSteps - 1)
  const progress = ((currentStep - 1) / (TOTAL_STEPS - 1)) * 100;

  return (
    <div className="fixed top-0 left-0 right-0 z-fixedNav bg-white/95 backdrop-blur-sm border-b border-neutral-100">
      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* Step Counter */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-neutral-900">
            Step {currentStep} of {TOTAL_STEPS}
          </h3>
          <span className="text-sm text-neutral-500">
            {Math.round(progress)}% complete
          </span>
        </div>

        {/* Progress Bar - Simple and Clean */}
        <div className="relative h-1.5 bg-neutral-100 rounded-full overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full rounded-full"
            style={{
              background: `linear-gradient(90deg, #00B8FF ${progress}%, #8B7FC7 100%)`
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>

        {/* Step Labels - Minimal */}
        <div className="grid grid-cols-4 gap-4 mt-4">
          {['Identity', 'Business', 'Audience', 'Review'].map((label, i) => {
            const stepNum = i + 1;
            const isCompleted = stepNum < currentStep;
            const isCurrent = stepNum === currentStep;
            
            return (
              <div key={label} className="text-center">
                <span className={`text-xs font-medium transition-colors ${
                  isCompleted ? 'text-secondary-600' :
                  isCurrent ? 'text-primary-600' :
                  'text-neutral-400'
                }`}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
