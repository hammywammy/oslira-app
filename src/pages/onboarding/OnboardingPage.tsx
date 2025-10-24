// src/pages/onboarding/OnboardingPage.tsx

/**
 * ONBOARDING PAGE
 * 
 * Main orchestrator for 8-step onboarding flow
 * Manages form state, validation, and API submission
 * 
 * FIXED:
 * - Proper .shape access handling for all schema types
 * - Manual Step 5 cross-field validation (max >= min)
 * - Correct typing for form submission
 */

import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { OnboardingShell } from '@/features/onboarding/components/OnboardingShell';
import { ProgressBar } from '@/features/onboarding/components/ProgressBar';
import { StepContainer } from '@/features/onboarding/components/StepContainer';
import { NavigationBar } from '@/features/onboarding/components/NavigationBar';
import { LoadingState } from '@/features/onboarding/components/LoadingState';
import { Step1Personal } from '@/features/onboarding/components/steps/Step1Personal';
import { Step2Business } from '@/features/onboarding/components/steps/Step2Business';
import { Step3Goals } from '@/features/onboarding/components/steps/Step3Goals';
import { Step4Challenges } from '@/features/onboarding/components/steps/Step4Challenges';
import { Step5Target } from '@/features/onboarding/components/steps/Step5Target';
import { Step6Communication } from '@/features/onboarding/components/steps/Step6Communication';
import { Step7Team } from '@/features/onboarding/components/steps/Step7Team';
import { Step8Review } from '@/features/onboarding/components/steps/Step8Review';
import { useOnboardingForm } from '@/features/onboarding/hooks/useOnboardingForm';
import { useCompleteOnboarding } from '@/features/onboarding/hooks/useCompleteOnboarding';
import {
  fullFormSchema,
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  step5Schema,
  step6Schema,
  step7Schema,
  type FormData,
} from '@/features/onboarding/constants/validationSchemas';
import { TOTAL_STEPS } from '@/features/onboarding/constants/steps';

// =============================================================================
// STEP SCHEMAS MAP
// =============================================================================

const stepSchemas = {
  1: step1Schema,
  2: step2Schema,
  3: step3Schema,
  4: step4Schema,
  5: step5Schema,
  6: step6Schema,
  7: step7Schema,
  8: fullFormSchema, // Full validation before submit
};

// =============================================================================
// COMPONENT
// =============================================================================

export function OnboardingPage() {
  const { currentStep, direction, nextStep, prevStep, goToStep } = useOnboardingForm();
  const { mutate: completeOnboarding, isPending } = useCompleteOnboarding();

  // React Hook Form setup
  const methods = useForm<FormData>({
    resolver: zodResolver(fullFormSchema),
    mode: 'onBlur',
    defaultValues: {
      challenges: [],
      target_company_sizes: [],
      communication_channels: [],
    },
  });

  const { trigger, handleSubmit, getValues, setError } = methods;

  // =============================================================================
  // NAVIGATION HANDLERS
  // =============================================================================

  const handleNext = async () => {
    // Get the schema for current step
    const schema = stepSchemas[currentStep as keyof typeof stepSchemas];
    
    // ✅ FIXED: Safely extract field names from schema
    // All our step schemas are now pure ZodObjects with .shape
    const fields = Object.keys(schema.shape);
    
    // Validate current step fields
    const isValid = await trigger(fields as any);
    
    if (!isValid) {
      return; // Stay on current step if validation fails
    }

    // ✅ ADDED: Manual cross-field validation for Step 5
    // (Since we removed .refine() from step5Schema to maintain .shape access)
    if (currentStep === 5) {
      const values = getValues();
      if (values.icp_max_followers < values.icp_min_followers) {
        setError('icp_max_followers', {
          type: 'manual',
          message: 'Maximum followers must be greater than or equal to minimum',
        });
        return;
      }
    }

    if (currentStep === TOTAL_STEPS) {
      // Submit form on last step
      handleSubmit(onSubmit)();
    } else {
      nextStep();
    }
  };

  const handleBack = () => {
    prevStep();
  };

  const handleEditStep = (step: number) => {
    goToStep(step);
  };

  // =============================================================================
  // FORM SUBMISSION
  // =============================================================================

  const onSubmit = (data: FormData) => {
    // ✅ FIXED: Proper typing - data is already FormData type
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
        return <Step3Goals />;
      case 4:
        return <Step4Challenges />;
      case 5:
        return <Step5Target />;
      case 6:
        return <Step6Communication />;
      case 7:
        return <Step7Team />;
      case 8:
        return <Step8Review onEditStep={handleEditStep} />;
      default:
        return null;
    }
  };

  // =============================================================================
  // DETERMINE NAVIGATION STATE
  // =============================================================================

  const canGoBack = currentStep > 1 && !isPending;
  const canGoNext = !isPending;
  const isLastStep = currentStep === TOTAL_STEPS;

  // =============================================================================
  // RENDER
  // =============================================================================

  return (
    <FormProvider {...methods}>
      <div className="relative">
        {/* Progress Bar */}
        <ProgressBar currentStep={currentStep} />

        {/* Main Content */}
        <OnboardingShell>
          <StepContainer step={currentStep} direction={direction}>
            {renderStep()}
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
          isLoading={isPending}
        />
      </div>
    </FormProvider>
  );
}

// ✅ ALSO EXPORT AS DEFAULT
export default OnboardingPage;
