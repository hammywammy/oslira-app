// src/features/onboarding/hooks/useOnboardingForm.ts

/**
 * ONBOARDING FORM HOOK
 * 
 * Manages:
 * - Current step state
 * - Step navigation (next/back)
 * - Direction tracking for animations
 * - Step validation
 */

import { create } from 'zustand';

// =============================================================================
// TYPES
// =============================================================================

interface OnboardingFormStore {
  currentStep: number;
  direction: number;
  
  // Actions
  goToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
}

// =============================================================================
// STORE
// =============================================================================

export const useOnboardingForm = create<OnboardingFormStore>((set) => ({
  currentStep: 1,
  direction: 0,

  goToStep: (step: number) =>
    set((state) => ({
      currentStep: step,
      direction: step > state.currentStep ? 1 : -1,
    })),

  nextStep: () =>
    set((state) => ({
      currentStep: state.currentStep + 1,
      direction: 1,
    })),

  prevStep: () =>
    set((state) => ({
      currentStep: Math.max(1, state.currentStep - 1),
      direction: -1,
    })),

  reset: () =>
    set(() => ({
      currentStep: 1,
      direction: 0,
    })),
}));
