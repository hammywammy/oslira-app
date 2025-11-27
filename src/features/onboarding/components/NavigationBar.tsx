/**
 * NAVIGATION BAR - LIGHT MODE REDESIGN
 * 
 * Clean navigation with:
 * - Light background
 * - Primary blue for main actions
 * - Neutral styling for back button
 * - Professional button designs
 */

import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

interface NavigationBarProps {
  currentStep: number;
  canGoBack: boolean;
  canGoNext: boolean;
  isLastStep: boolean;
  onBack: () => void;
  onNext: () => void;
  isLoading: boolean;
}

const ICONS = {
  arrowLeft: 'ph:arrow-left',
  arrowRight: 'ph:arrow-right',
  check: 'ph:check-circle',
  loader: 'ph:circle-notch',
};

export function NavigationBar({
  currentStep,
  canGoBack,
  canGoNext,
  isLastStep,
  onBack,
  onNext,
  isLoading,
}: NavigationBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-fixedNav">
      <div className="max-w-2xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Back Button */}
          <motion.button
            onClick={onBack}
            disabled={!canGoBack}
            className={`
              flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium
              transition-all duration-200
              ${canGoBack
                ? 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                : 'bg-neutral-50 text-neutral-400 cursor-not-allowed'
              }
            `}
            whileHover={canGoBack ? { scale: 1.02 } : {}}
            whileTap={canGoBack ? { scale: 0.98 } : {}}
            type="button"
          >
            <Icon icon={ICONS.arrowLeft} className="w-4 h-4" />
            <span>Back</span>
          </motion.button>

          {/* Step Indicator */}
          <div className="flex items-center gap-2">
            {Array.from({ length: 4 }, (_, i) => (
              <div
                key={i}
                className={`
                  w-2 h-2 rounded-full transition-all duration-200
                  ${i < currentStep
                    ? 'bg-secondary-500'
                    : i === currentStep - 1
                    ? 'bg-primary-500 w-8'
                    : 'bg-neutral-300'
                  }
                `}
              />
            ))}
          </div>

          {/* Next/Complete Button */}
          <motion.button
            onClick={onNext}
            disabled={!canGoNext || isLoading}
            className={`
              flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium
              transition-all duration-200
              ${canGoNext && !isLoading
                ? isLastStep
                  ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:from-primary-600 hover:to-secondary-600 shadow-lg shadow-primary-500/25'
                  : 'bg-primary-500 text-white hover:bg-primary-600 shadow-lg shadow-primary-500/25'
                : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
              }
            `}
            whileHover={canGoNext && !isLoading ? { scale: 1.02 } : {}}
            whileTap={canGoNext && !isLoading ? { scale: 0.98 } : {}}
            type="button"
          >
            {isLoading ? (
              <>
                <Icon icon={ICONS.loader} className="w-4 h-4 animate-spin" />
                <span>Processing</span>
              </>
            ) : (
              <>
                <span>{isLastStep ? 'Complete Setup' : 'Next'}</span>
                <Icon icon={isLastStep ? ICONS.check : ICONS.arrowRight} className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
