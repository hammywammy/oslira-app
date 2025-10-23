// src/features/onboarding/components/NavigationBar.tsx

/**
 * NAVIGATION BAR
 * 
 * Fixed-position bottom navigation with:
 * - Back button (left) - only shows when canGoBack
 * - Step counter (center)
 * - Next button (right) - always in same position
 * - Subtle hover effects
 */

import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { ICONS } from '../constants/icons';
import { buttonHover, buttonTap } from '../animations/variants';
import { TOTAL_STEPS } from '../constants/steps';

// =============================================================================
// TYPES
// =============================================================================

interface NavigationBarProps {
  currentStep: number;
  canGoBack: boolean;
  canGoNext: boolean;
  isLastStep: boolean;
  onBack: () => void;
  onNext: () => void;
  isLoading?: boolean;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function NavigationBar({
  currentStep,
  canGoBack,
  canGoNext,
  isLastStep,
  onBack,
  onNext,
  isLoading = false,
}: NavigationBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-950/80 backdrop-blur-md border-t border-slate-800/50 z-40">
      <div className="max-w-2xl mx-auto px-6 py-5 flex items-center justify-between">
        {/* Back button */}
        <div className="w-24">
          {canGoBack && (
            <motion.button
              onClick={onBack}
              className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
              whileHover={buttonHover}
              whileTap={buttonTap}
              type="button"
            >
              <Icon icon={ICONS.arrowLeft} className="w-4 h-4" />
              <span className="text-sm font-medium">Back</span>
            </motion.button>
          )}
        </div>

        {/* Step counter */}
        <div className="text-center">
          <span className="text-xs text-slate-400 font-medium">
            Step {currentStep} of {TOTAL_STEPS}
          </span>
        </div>

        {/* Next button - always in same position */}
        <div className="w-24 flex justify-end">
          <motion.button
            onClick={onNext}
            disabled={!canGoNext || isLoading}
            className={`
              flex items-center gap-2 px-5 py-2 rounded-lg font-medium text-sm
              transition-all duration-200
              ${
                canGoNext && !isLoading
                  ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:from-violet-600 hover:to-purple-600 shadow-lg shadow-violet-500/25'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }
            `}
            whileHover={canGoNext && !isLoading ? buttonHover : {}}
            whileTap={canGoNext && !isLoading ? buttonTap : {}}
            type="button"
          >
            {isLoading ? (
              <>
                <Icon icon={ICONS.loader} className="w-4 h-4 animate-spin" />
                <span>Processing</span>
              </>
            ) : (
              <>
                <span>{isLastStep ? 'Complete' : 'Next'}</span>
                <Icon icon={ICONS.arrowRight} className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
