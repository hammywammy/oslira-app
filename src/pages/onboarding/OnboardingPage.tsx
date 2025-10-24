// src/pages/onboarding/OnboardingPage.tsx

/**
 * ONBOARDING PAGE - BULLETPROOF 4-STEP FLOW
 * 
 * FIXES:
 * - Key-based step rendering (prevents desync on spam click)
 * - Synchronous state updates (no animation conflicts)
 * - Proper navigation locking during transitions
 * - Consistent container height (no scroll flash)
 * 
 * SOLID PRINCIPLES:
 * - Step display driven by state, not animation frames
 * - Single source of truth (currentStep)
 * - Immutable step transitions
 */

import { useState, useMemo } from 'react';
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
  const { currentStep, direction, nextStep, prevStep, goToStep } = useOnboardingForm();
  const { mutate: completeOnboarding, isPending } = useCompleteOnboarding();
  const [isNavigating, setIsNavigating] = useState(false);

  // React Hook Form setup
  const methods = useForm<FormData>({
    resolver: zodResolver(fullFormSchema),
    mode: 'onBlur',
    defaultValues: {
      target_company_sizes: [],
    },
  });

  const { trigger, handleSubmit, getValues, setError } = methods;

  // =============================================================================
  // NAVIGATION HANDLERS - BULLETPROOF
  // =============================================================================

  const handleNext = async () => {
    // ✅ LOCK: Prevent all navigation during transition
    if (isNavigating || isPending) return;
    setIsNavigating(true);

    try {
      const schema = stepSchemas[currentStep as keyof typeof stepSchemas];
      const fields = Object.keys(schema.shape);
      const isValid = await trigger(fields as any);
      
      if (!isValid) {
        setIsNavigating(false);
        return;
      }

      // Cross-field validation for Step 3
      if (currentStep === 3) {
        const values = getValues();
        if (values.icp_max_followers < values.icp_min_followers) {
          setError('icp_max_followers', {
            type: 'manual',
            message: 'Maximum must be greater than or equal to minimum',
          });
          setIsNavigating(false);
          return;
        }
      }

      // Last step - submit
      if (currentStep === TOTAL_STEPS) {
        handleSubmit(onSubmit)();
        setIsNavigating(false);
        return;
      }

      // Navigate to next step
      nextStep();
      
      // ✅ UNLOCK: Brief delay for animation, then release lock
      setTimeout(() => {
        setIsNavigating(false);
      }, 200);
      
    } catch (error) {
      setIsNavigating(false);
    }
  };

  const handleBack = () => {
    // ✅ LOCK: Prevent navigation during transition
    if (isNavigating || isPending) return;
    setIsNavigating(true);

    prevStep();
    
    // ✅ UNLOCK: Brief delay for animation
    setTimeout(() => {
      setIsNavigating(false);
    }, 200);
  };

  const handleEditStep = (step: number) => {
    if (isNavigating || isPending) return;
    goToStep(step);
  };

  // =============================================================================
  // FORM SUBMISSION
  // =============================================================================

  const onSubmit = (data: FormData) => {
    completeOnboarding(data);
  };

  // =============================================================================
  // STEP RENDERING - KEY-BASED FOR IMMUTABILITY
  // ✅ useMemo ensures step only changes when currentStep changes
  // ✅ Key forces React to unmount/remount on step change
  // =============================================================================

  const stepContent = useMemo(() => {
    if (isPending) {
      return <LoadingState />;
    }

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
  // NAVIGATION STATE
  // =============================================================================

  const canGoBack = currentStep > 1 && !isPending && !isNavigating;
  const canGoNext = !isPending && !isNavigating;
  const isLastStep = currentStep === TOTAL_STEPS;

  // =============================================================================
  // RENDER
  // =============================================================================

  return (
    <FormProvider {...methods}>
      <div className="relative min-h-screen">
        {/* Progress Bar */}
        <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />

        {/* Main Content - Fixed height prevents layout shift */}
        <OnboardingShell>
          <StepContainer step={currentStep} direction={direction}>
            {stepContent}
          </StepContainer>
        </OnboardingShell>

        {/* Navigation Bar */}
        <NavigationBar
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          canGoBack={canGoBack}
          canGoNext={canGoNext}
          isLastStep={isLastStep}
          onBack={handleBack}
          onNext={handleNext}
          isLoading={isPending || isNavigating}
        />
      </div>
    </FormProvider>
  );
}

export default OnboardingPage;
