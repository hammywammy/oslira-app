// src/pages/onboarding/OnboardingPage.tsx

/**
 * ONBOARDING PAGE - PRODUCTION FIXED
 * 
 * FIXES:
 * ✅ Ref-based navigation lock (no race conditions)
 * ✅ Proper background color on page wrapper (no white bar)
 * ✅ Vertical expansion (no height restrictions)
 * ✅ Clean animation transitions
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
  4: fullFormSchema,
};

export function OnboardingPage() {
  const { currentStep, direction, nextStep, prevStep, goToStep } = useOnboardingForm();
  const { mutate: completeOnboarding, isPending } = useCompleteOnboarding();
  
  const navigationLockRef = useRef(false);
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

  // Navigation lock system
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

  const isThrottled = () => {
    const now = Date.now();
    return now - lastNavigationTime.current < ANIMATION_DURATION;
  };

  // Validation
  const validateCurrentStep = async (): Promise<boolean> => {
    setIsValidating(true);
    
    try {
      const schema = stepSchemas[currentStep as keyof typeof stepSchemas];
      const fields = Object.keys(schema.shape);
      const isValid = await trigger(fields as any);
      
      if (!isValid) return false;

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
    if (isLocked() || isThrottled()) return;
    lockNavigation();

    try {
      const isValid = await validateCurrentStep();
      if (!isValid) {
        unlockNavigation();
        return;
      }

      if (currentStep === TOTAL_STEPS) {
        handleSubmit(onSubmit)();
        return;
      }

      nextStep();
      setTimeout(unlockNavigation, ANIMATION_DURATION);
    } catch (error) {
      console.error('[Onboarding] Navigation error:', error);
      unlockNavigation();
    }
  };

  const handleBack = () => {
    if (isLocked() || isThrottled()) return;
    lockNavigation();
    clearErrors();
    prevStep();
    setTimeout(unlockNavigation, ANIMATION_DURATION);
  };

  const handleEditStep = (step: number) => {
    if (isLocked() || isThrottled()) return;
    lockNavigation();
    clearErrors();
    goToStep(step);
    setTimeout(unlockNavigation, ANIMATION_DURATION);
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

  const canGoBack = currentStep > 1 && !isLocked() && !isThrottled();
  const canGoNext = !isLocked() && !isThrottled();
  const isLastStep = currentStep === TOTAL_STEPS;
  const isLoading = isPending || isValidating;

  return (
    <FormProvider {...methods}>
      {/* 
        ✅ FIXED: Added bg-gradient to match OnboardingShell
        This prevents the white bar at the bottom
      */}
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
