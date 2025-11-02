// src/pages/onboarding/OnboardingPage.tsx

/**
 * ONBOARDING PAGE - LIGHT MODE REDESIGN
 * 
 * Updated color scheme:
 * - Light mode backgrounds (white/neutral)
 * - Primary blue (#00B8FF) for main actions
 * - Secondary purple (#8B7FC7) for accents
 * - Removed all pink colors
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
  const [isValidating, setIsValidating] = useState(false);

  const lastNavigationTime = useRef(0);
  const isThrottled = useCallback(() => {
    const now = Date.now();
    const timeSinceLastNav = now - lastNavigationTime.current;
    return timeSinceLastNav < ANIMATION_DURATION;
  }, []);

  const recordNavigation = useCallback(() => {
    lastNavigationTime.current = Date.now();
  }, []);

  const methods = useForm<FormData>({
    resolver: zodResolver(fullFormSchema),
    mode: 'onChange',
    defaultValues: {
      full_name: '',
      business_summary: '',
      communication_tone: 'professional',
      target_description: '',
      icp_min_followers: 10000,
      icp_max_followers: 1000000,
      target_company_sizes: [],
    },
  });

  const {
    trigger,
    clearErrors,
    handleSubmit,
  } = methods;

  const handleNext = async () => {
    if (isThrottled() || isPending || isValidating) return;
    recordNavigation();

    try {
      if (currentStep < TOTAL_STEPS) {
        setIsValidating(true);
        const currentSchema = stepSchemas[currentStep as keyof typeof stepSchemas];
        const schemaKeys = Object.keys(currentSchema.shape);
        const isValid = await trigger(schemaKeys as any);
        setIsValidating(false);

        if (!isValid) return;
      }

      if (currentStep === TOTAL_STEPS) {
        handleSubmit(onSubmit)();
        return;
      }

      nextStep();
    } catch (error) {
      console.error('[Onboarding] Navigation error:', error);
      setIsValidating(false);
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

  const canGoBack = currentStep > 1 && !isPending && !isValidating;
  const canGoNext = !isPending && !isValidating;
  const isLastStep = currentStep === TOTAL_STEPS;
  const isLoading = isPending || isValidating;

  return (
    <FormProvider {...methods}>
      {/* Light mode background with subtle gradient */}
      <div className="relative min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100">
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
