// src/pages/onboarding/OnboardingPage.tsx

/**
 * ONBOARDING PAGE - STREAMLINED 4-STEP FLOW
 * 
 * Step 1: Identity (signature_name)
 * Step 2: Business (business_summary, communication_tone)
 * Step 3: Target (target_description, followers, company_sizes)
 * Step 4: Review
 * 
 * BUG FIXES:
 * - Debounced navigation (no spam click glitch)
 * - Dynamic container height (no scroll flash)
 * - Cross-field validation for follower range
 */

import { useState } from 'react';
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

// =============================================================================
// STEP SCHEMAS MAP
// =============================================================================

const stepSchemas = {
  1: step1Schema,
  2: step2Schema,
  3: step3Schema,
  4: fullFormSchema, // Full validation before submit
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
  // NAVIGATION HANDLERS (WITH DEBOUNCE FIX)
  // =============================================================================

  const handleNext = async () => {
    // Prevent spam clicking
    if (isNavigating) return;
    setIsNavigating(true);

    try {
      // Get the schema for current step
      const schema = stepSchemas[currentStep as keyof typeof stepSchemas];
      
      // Extract field names from schema
      const fields = Object.keys(schema.shape);
      
      // Validate current step fields
      const isValid = await trigger(fields as any);
      
      if (!isValid) {
        setIsNavigating(false);
        return;
      }

      // Manual cross-field validation for Step 3 (follower range)
      if (currentStep === 3) {
        const values = getValues();
        if (values.icp_max_followers < values.icp_min_followers) {
          setError('icp_max_followers', {
            type: 'manual',
            message: 'Maximum followers must be greater than or equal to minimum',
          });
          setIsNavigating(false);
          return;
        }
      }

      if (currentStep === TOTAL_STEPS) {
        // Submit form on last step
        handleSubmit(onSubmit)();
      } else {
        // Small delay to prevent animation conflicts
        setTimeout(() => {
          nextStep();
          setIsNavigating(false);
        }, 150);
      }
    } catch (error) {
      setIsNavigating(false);
    }
  };

  const handleBack = () => {
    // Prevent spam clicking
    if (isNavigating) return;
    setIsNavigating(true);

    // Small delay to prevent animation conflicts
    setTimeout(() => {
      prevStep();
      setIsNavigating(false);
    }, 150);
  };

  const handleEditStep = (step: number) => {
    if (isNavigating) return;
    goToStep(step);
  };

  // =============================================================================
  // FORM SUBMISSION
  // =============================================================================

  const onSubmit = (data: FormData) => {
    completeOnboarding(data);
  };

  // =============================================================================
  // RENDER STEP CONTENT
  // =============================================================================

  const renderStep = () => {
    if (isPending) {
      return <LoadingState />;
    }

    switch (currentStep) {
      case 1:
        return <Step1Personal />;
      case 2:
        return <Step2Business />;
      case 3:
        return <Step3Target />;
      case 4:
        return <Step4Review onEditStep={handleEditStep} />;
      default:
        return null;
    }
  };

  // =============================================================================
  // DETERMINE NAVIGATION STATE
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
        <ProgressBar currentStep={currentStep} />

        {/* Main Content - Fixed height container to prevent scroll flash */}
        <OnboardingShell>
          <div className="min-h-[600px] flex items-start">
            <StepContainer step={currentStep} direction={direction}>
              {renderStep()}
            </StepContainer>
          </div>
        </OnboardingShell>

        {/* Navigation Bar */}
        <NavigationBar
          currentStep={currentStep}
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
