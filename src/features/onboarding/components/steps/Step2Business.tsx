// src/features/onboarding/components/steps/Step2Business.tsx

/**
 * STEP 2: BUSINESS CONTEXT
 * 
 * Fields:
 * - business_summary (50-750 chars with progress indicator)
 * - communication_tone (Professional/Friendly/Casual)
 * 
 * FEATURES:
 * - Refinement callout (reduces perfection anxiety)
 * - Character counter with color coding
 * - Helpful placeholder with examples
 */

import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { FormTextarea } from '../FormInput';
import { RefinementCallout } from '../RefinementCallout';
import { ICONS } from '../../constants/icons';
import { fadeInVariants, containerVariants } from '../../animations/variants';
import { useFormContext } from 'react-hook-form';
import type { FormData, CommunicationTone } from '../../constants/validationSchemas';

// =============================================================================
// DATA
// =============================================================================

const toneOptions: Array<{ value: CommunicationTone; label: string; description: string; icon: string }> = [
  {
    value: 'professional',
    label: 'Professional',
    description: 'Formal, business-focused communication',
    icon: 'lucide:briefcase',
  },
  {
    value: 'friendly',
    label: 'Friendly',
    description: 'Warm and approachable tone',
    icon: 'lucide:smile',
  },
  {
    value: 'casual',
    label: 'Casual',
    description: 'Relaxed, conversational style',
    icon: 'lucide:message-circle',
  },
];

// =============================================================================
// COMPONENT
// =============================================================================

export function Step2Business() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<FormData>();

  const businessSummary = watch('business_summary') || '';
  const selectedTone = watch('communication_tone');
  const charCount = businessSummary.length;

  // Character counter color logic
  const getCharCountColor = () => {
    if (charCount < 50) return 'text-red-400';
    if (charCount < 150) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getCharCountLabel = () => {
    if (charCount < 50) return 'Add more detail';
    if (charCount < 150) return 'Good start';
    return 'Great detail!';
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={fadeInVariants} className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-white">
          Tell us about your business
        </h2>
        <p className="text-slate-400">
          Help the AI understand what you do
        </p>
      </motion.div>

      {/* Refinement Callout */}
      <motion.div variants={fadeInVariants}>
        <RefinementCallout />
      </motion.div>

      {/* Business Summary */}
      <motion.div variants={fadeInVariants} className="space-y-2">
        <FormTextarea
          label="What does your business do?"
          placeholder="Example: Acme Marketing is a boutique agency specializing in health & wellness brands. We solve the problem of generic social media presence by creating authentic, data-driven Instagram strategies that convert followers into customers. Our unique approach combines behavioral psychology with influencer partnerships..."
          icon={ICONS.briefcase}
          error={errors.business_summary?.message}
          required
          rows={6}
          maxLength={750}
          {...register('business_summary')}
        />
        
        {/* Character Counter */}
        <div className="flex items-center justify-between text-sm">
          <span className={getCharCountColor()}>
            {getCharCountLabel()}
          </span>
          <span className="text-slate-500">
            {charCount} / 750
          </span>
        </div>

        {/* Helper Prompts */}
        <div className="bg-slate-800/30 rounded-lg p-3 text-xs text-slate-400">
          <p className="mb-2 font-medium text-slate-300">Include:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Company name & industry/niche</li>
            <li>What problems do you solve?</li>
            <li>What makes you different?</li>
            <li>Who you work with (optional)</li>
          </ul>
        </div>
      </motion.div>

      {/* Communication Tone */}
      <motion.div variants={fadeInVariants} className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
          <Icon icon={ICONS.messageSquare} className="text-lg text-purple-400" />
          How do you prefer to communicate?
          <span className="text-red-400">*</span>
        </label>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {toneOptions.map((option) => {
            const isSelected = selectedTone === option.value;

            return (
              <label
                key={option.value}
                className={`
                  block p-4 rounded-xl border-2 cursor-pointer
                  transition-all duration-200
                  ${
                    isSelected
                      ? 'bg-purple-500/10 border-purple-500'
                      : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                  }
                `}
              >
                <div className="flex flex-col items-center text-center gap-2">
                  <Icon icon={option.icon} className="text-2xl text-purple-400" />
                  <div>
                    <input
                      type="radio"
                      value={option.value}
                      checked={isSelected}
                      className="sr-only"
                      {...register('communication_tone')}
                    />
                    <div className="font-semibold text-white mb-1">{option.label}</div>
                    <div className="text-xs text-slate-400">{option.description}</div>
                  </div>
                </div>
              </label>
            );
          })}
        </div>

        {errors.communication_tone?.message && (
          <div className="flex items-center gap-2 text-sm text-red-400">
            <Icon icon="lucide:alert-circle" />
            {errors.communication_tone.message}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
