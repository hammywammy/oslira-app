// src/pages/onboarding/OnboardingPage.tsx

/**
 * ONBOARDING PAGE - PRODUCTION-GRADE NAVIGATION
 * 
 * FIXED ISSUES:
 * ❌ Spam clicking next/back causing step desync
 * ❌ Animation conflicts between exit/enter
 * ❌ Race conditions between state updates
 * ❌ Validation running during navigation
 * 
 * SOLUTION ARCHITECTURE:
 * ✅ Ref-based navigation lock (immune to render cycles)
 * ✅ Throttled navigation (300ms minimum between clicks)
 * ✅ Synchronous Zustand updates (no async gaps)
 * ✅ Animation-aware unlocking (waits for exit complete)
 * ✅ Single source of truth (currentStep in Zustand)
 * 
 * TECHNICAL DETAILS:
 * - useRef prevents re-render race conditions
 * - setTimeout unlocking matches animation duration exactly
 * - Key-based rendering forces clean component lifecycle
 * - Cross-field validation only on current step
 */

import { useState, useMemo, useRef, useCallback } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { OnboardingShell } from '@/features/onboarding/components/OnboardingShell';
import { ProgressBar } from '@/features/onboarding/components/ProgressBar';
import { StepContainer } from '@/features/onboarding/components/StepContainer';
import { NavigationBar } from '@/features/onboarding/components/NavigationBar';
import { LoadingState } from '@/features/onboarding/components/LoadingState';
import { Step1Personal } from '@/features/onboarding/components/steps/Step1Personal';
import { Step2Business } from '@/features/onboarding/components/steps/Step2Business';
import { Step3Target } from '@/features/onboarding/components/steps/Step3Target';
import { Step4Review } from '@/features/onboarding/components/steps/Step4Review';
import { useOnboardingForm } from '@/features/onboarding/hooks/useOnboardingForm';
import { useCompleteOnboarding } from '@/features/onboarding/hooks/useCompleteOnboarding';
import {
  fullFormSchema,
  step1Schema,
  step2Schema,
  step3Schema,
  type FormData,
} from '@/features/onboarding/constants/validationSchemas';

// =============================================================================
// CONSTANTS
// =============================================================================

const TOTAL_STEPS = 4;
const ANIMATION_DURATION = 300; // Must match StepContainer transition (ms)

const stepSchemas = {
  1: step1Schema,
  2: step2Schema,
  3: step3Schema,
  4: fullFormSchema,
};

// =============================================================================
// COMPONENT
// =============================================================================

export function OnboardingPage() {
  // Zustand store for step state
  const { currentStep, direction, nextStep, prevStep, goToStep } = useOnboardingForm();
  
  // Form submission mutation
  const { mutate: completeOnboarding, isPending } = useCompleteOnboarding();
  
  // Navigation lock (ref-based to avoid re-render issues)
  const navigationLockRef = useRef(false);
  const lastNavigationTime = useRef(0);
  
  // Validation state
  const [isValidating, setIsValidating] = useState(false);

  // React Hook Form setup
  const methods = useForm<FormData>({
    resolver: zodResolver(fullFormSchema),
    mode: 'onBlur',
    defaultValues: {
      target_company_sizes: [],
    },
  });

  const { trigger, handleSubmit, getValues, setError, clearErrors } = methods;

  // =============================================================================
  // NAVIGATION LOCK SYSTEM
  // =============================================================================

  const isLocked = useCallback(() => {
    return navigationLockRef.current || isPending || isValidating;
  }, [isPending, isValidating]);

  const lockNavigation = () => {
    navigationLockRef.current = true;
    lastNavigationTime.current = Date.now();
  };

  const unlockNavigation = () => {
    navigationLockRef.current = false;
  };

  // Additional throttle check (prevents spam even if lock somehow fails)
  const isThrottled = () => {
    const now = Date.now();
    return now - lastNavigationTime.current < ANIMATION_DURATION;
  };

  // =============================================================================
  // VALIDATION
  // =============================================================================

  const validateCurrentStep = async (): Promise<boolean> => {
    setIsValidating(true);
    
    try {
      const schema = stepSchemas[currentStep as keyof typeof stepSchemas];
      const fields = Object.keys(schema.shape);
      const isValid = await trigger(fields as any);
      
      if (!isValid) {
        return false;
      }

      // Cross-field validation for Step 3 (follower range)
      if (currentStep === 3) {
        const values = getValues();
        if (values.icp_max_followers < values.icp_min_followers) {
          setError('icp_max_followers', {
            type: 'manual',
            message: 'Maximum must be greater than or equal to minimum',
          });
          return false;
        }
      }

      return true;
    } finally {
      setIsValidating(false);
    }
  };

  // =============================================================================
  // NAVIGATION HANDLERS
  // =============================================================================

  const handleNext = async () => {
    // Guard: Check all lock conditions
    if (isLocked() || isThrottled()) {
      console.log('[Onboarding] Navigation blocked - locked or throttled');
      return;
    }
    
    // Lock immediately (synchronous)
    lockNavigation();
    console.log('[Onboarding] Navigation locked for NEXT');

    try {
      // Validate current step
      const isValid = await validateCurrentStep();
      if (!isValid) {
        console.log('[Onboarding] Validation failed');
        unlockNavigation();
        return;
      }

      // Last step - submit form
      if (currentStep === TOTAL_STEPS) {
        console.log('[Onboarding] Final step - submitting');
        handleSubmit(onSubmit)();
        // Don't unlock - submission redirects
        return;
      }

      // Navigate to next step (synchronous Zustand update)
      console.log(`[Onboarding] Moving from step ${currentStep} to ${currentStep + 1}`);
      nextStep();
      
      // Unlock after animation completes
      setTimeout(() => {
        unlockNavigation();
        console.log('[Onboarding] Navigation unlocked');
      }, ANIMATION_DURATION);
      
    } catch (error) {
      console.error('[Onboarding] Navigation error:', error);
      unlockNavigation();
    }
  };

  const handleBack = () => {
    // Guard: Check all lock conditions
    if (isLocked() || isThrottled()) {
      console.log('[Onboarding] Navigation blocked - locked or throttled');
      return;
    }
    
    // Lock immediately (synchronous)
    lockNavigation();
    console.log('[Onboarding] Navigation locked for BACK');

    // Clear any validation errors from current step
    clearErrors();

    // Navigate to previous step (synchronous Zustand update)
    console.log(`[Onboarding] Moving from step ${currentStep} to ${currentStep - 1}`);
    prevStep();
    
    // Unlock after animation completes
    setTimeout(() => {
      unlockNavigation();
      console.log('[Onboarding] Navigation unlocked');
    }, ANIMATION_DURATION);
  };

  const handleEditStep = (step: number) => {
    // Guard: Check all lock conditions
    if (isLocked() || isThrottled()) {
      console.log('[Onboarding] Edit navigation blocked');
      return;
    }
    
    // Lock immediately
    lockNavigation();
    console.log(`[Onboarding] Editing - jumping to step ${step}`);
    
    // Clear any validation errors
    clearErrors();
    
    // Jump to target step
    goToStep(step);
    
    // Unlock after animation completes
    setTimeout(() => {
      unlockNavigation();
      console.log('[Onboarding] Navigation unlocked');
    }, ANIMATION_DURATION);
  };

  // =============================================================================
  // FORM SUBMISSION
  // =============================================================================

  const onSubmit = (data: FormData) => {
    console.log('[Onboarding] Submitting form data:', data);
    completeOnboarding(data);
  };

  // =============================================================================
  // STEP RENDERING
  // =============================================================================

  const stepContent = useMemo(() => {
    console.log(`[Onboarding] Rendering step ${currentStep}`);
    
    if (isPending) {
      return <LoadingState />;
    }

    // Each step has unique key - forces clean unmount/remount on step change
    switch (currentStep) {
      case 1:
        return <Step1Personal key="step-1" />;
      case 2:
        return <Step2Business key="step-2" />;
      case 3:
        return <Step3Target key="step-3" />;
      case 4:
        return <Step4Review key="step-4" onEditStep={handleEditStep} />;
      default:
        return <Step1Personal key="step-1" />;
    }
  }, [currentStep, isPending]);

  // =============================================================================
  // UI STATE
  // =============================================================================

  const canGoBack = currentStep > 1 && !isLocked() && !isThrottled();
  const canGoNext = !isLocked() && !isThrottled();
  const isLastStep = currentStep === TOTAL_STEPS;
  const isLoading = isPending || isValidating;

  // =============================================================================
  // RENDER
  // =============================================================================

  return (
    <FormProvider {...methods}>
      <div className="relative min-h-screen">
        {/* Progress Bar */}
        <ProgressBar currentStep={currentStep} />

        {/* Main Content */}
        <OnboardingShell>
          <StepContainer step={currentStep} direction={direction}>
            {stepContent}
          </StepContainer>
        </OnboardingShell>

        {/* Navigation Bar */}
        <NavigationBar
          currentStep={currentStep}
          canGoBack={canGoBack}
          canGoNext={canGoNext}
          isLastStep={isLastStep}
          onBack={handleBack}
          onNext={handleNext}
          isLoading={isLoading}
        />
      </div>
    </FormProvider>
  );
}

export default OnboardingPage;
