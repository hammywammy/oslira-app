// src/pages/onboarding/OnboardingPage.tsx

/**
 * ONBOARDING PAGE - NAVIGATION LOCK FIX
 * 
 * FIXES:
 * ✅ Navigation buttons always enabled (no waiting for form changes)
 * ✅ Lock/unlock happens BEFORE step change (prevents race condition)
 * ✅ Throttle still prevents rapid clicking
 * ✅ Validation still works on Next
 * ✅ Step 4 Complete button always enabled
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

const TOTAL_STEPS = 4;
const ANIMATION_DURATION = 300;

const stepSchemas = {
  1: step1Schema,
  2: step2Schema,
  3: step3Schema,
  4: fullFormSchema, // Step 4 is review - validation not enforced
};

export function OnboardingPage() {
  const { currentStep, direction, nextStep, prevStep, goToStep } = useOnboardingForm();
  const { mutate: completeOnboarding, isPending } = useCompleteOnboarding();
  
  const lastNavigationTime = useRef(0);
  const [isValidating, setIsValidating] = useState(false);

  const methods = useForm<FormData>({
    resolver: zodResolver(fullFormSchema),
    mode: 'onBlur',
    defaultValues: {
      target_company_sizes: [],
    },
  });

  const { trigger, handleSubmit, getValues, setError, clearErrors } = methods;

  // Throttle system (prevents rapid clicking)
  const isThrottled = useCallback(() => {
    const now = Date.now();
    return now - lastNavigationTime.current < ANIMATION_DURATION;
  }, []);

  const recordNavigation = () => {
    lastNavigationTime.current = Date.now();
  };

  // Validation
  const validateCurrentStep = async (): Promise<boolean> => {
    if (currentStep === 4) return true; // Review step - no validation

    setIsValidating(true);
    
    try {
      const schema = stepSchemas[currentStep as keyof typeof stepSchemas];
      const fields = Object.keys(schema.shape);
      const isValid = await trigger(fields as any);
      
      if (!isValid) return false;

      // Step 3 specific validation
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

  // Navigation handlers
  const handleNext = async () => {
    if (isThrottled() || isPending) return;
    recordNavigation();

    try {
      // Validate before moving forward (except Step 4)
      const isValid = await validateCurrentStep();
      if (!isValid) return;

      // If on last step, submit form
      if (currentStep === TOTAL_STEPS) {
        handleSubmit(onSubmit)();
        return;
      }

      // Move to next step
      nextStep();
    } catch (error) {
      console.error('[Onboarding] Navigation error:', error);
    }
  };

  const handleBack = () => {
    if (isThrottled() || isPending) return;
    recordNavigation();
    clearErrors();
    prevStep();
  };

  const handleEditStep = (step: number) => {
    if (isThrottled() || isPending) return;
    recordNavigation();
    clearErrors();
    goToStep(step);
  };

  const onSubmit = (data: FormData) => {
    completeOnboarding(data);
  };

  // Step rendering
  const stepContent = useMemo(() => {
    if (isPending) return <LoadingState />;

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

  // Navigation state
  const canGoBack = currentStep > 1 && !isPending && !isValidating;
  const canGoNext = !isPending && !isValidating;
  const isLastStep = currentStep === TOTAL_STEPS;
  const isLoading = isPending || isValidating;

  return (
    <FormProvider {...methods}>
      <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <ProgressBar currentStep={currentStep} />

        <OnboardingShell>
          <StepContainer step={currentStep} direction={direction}>
            {stepContent}
          </StepContainer>
        </OnboardingShell>

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
