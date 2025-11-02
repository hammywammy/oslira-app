// src/features/onboarding/components/ProgressBar.tsx

/**
 * PROGRESS BAR - LIGHT MODE REDESIGN
 * 
 * Clean progress indicator with:
 * - Light backgrounds
 * - Primary blue for active progress
 * - Secondary purple for completed steps
 * - Professional minimal styling
 */

import { motion } from 'framer-motion';
import { TOTAL_STEPS } from '../constants/steps';

interface ProgressBarProps {
  currentStep: number;
}

export function ProgressBar({ currentStep }: ProgressBarProps) {
  const progress = (currentStep / TOTAL_STEPS) * 100;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-neutral-200">
      <div className="max-w-2xl mx-auto px-6 py-4">
        {/* Step Indicators */}
        <div className="flex items-center justify-between mb-3">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => {
            const stepNumber = i + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;

            return (
              <div key={stepNumber} className="flex items-center">
                {/* Step Circle */}
                <motion.div
                  initial={false}
                  animate={{
                    scale: isCurrent ? 1.1 : 1,
                    transition: { duration: 0.2 }
                  }}
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center
                    text-sm font-medium transition-all duration-200
                    ${isCompleted 
                      ? 'bg-secondary-500 text-white'
                      : isCurrent
                      ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                      : 'bg-neutral-200 text-neutral-500'
                    }
                  `}
                >
                  {isCompleted ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    stepNumber
                  )}
                </motion.div>

                {/* Connector Line */}
                {i < TOTAL_STEPS - 1 && (
                  <div className="w-full h-1 mx-2 bg-neutral-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={false}
                      animate={{
                        width: isCompleted ? '100%' : '0%'
                      }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      className="h-full bg-secondary-500"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="relative h-2 bg-neutral-200 rounded-full overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>

        {/* Step Text */}
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-neutral-500">
            Step {currentStep} of {TOTAL_STEPS}
          </span>
          <span className="text-xs text-neutral-500">
            {Math.round(progress)}% Complete
          </span>
        </div>
      </div>
    </div>
  );
}
