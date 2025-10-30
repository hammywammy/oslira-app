// src/features/onboarding/components/steps/Step2Business.tsx
// COLOR FIX: Changed purple-500 to primary-500, purple-400 to primary-400

import { useFormContext } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { FormInput, FormTextarea } from '@/features/onboarding/components/FormInput';
import type { FormData } from '@/features/onboarding/constants/validationSchemas';

// =============================================================================
// CONSTANTS
// =============================================================================

const ICONS = {
  briefcase: 'lucide:briefcase',
  target: 'lucide:target',
  wand: 'lucide:wand-sparkles',
  checkCircle: 'lucide:check-circle',
  messageCircle: 'lucide:message-circle',
  megaphone: 'lucide:megaphone',
  handshake: 'lucide:handshake',
} as const;

const toneOptions = [
  {
    value: 'professional',
    label: 'Professional',
    description: 'Formal and business-focused',
    icon: ICONS.briefcase,
  },
  {
    value: 'friendly',
    label: 'Friendly',
    description: 'Warm and approachable',
    icon: ICONS.messageCircle,
  },
  {
    value: 'casual',
    label: 'Casual',
    description: 'Relaxed and conversational',
    icon: ICONS.handshake,
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

  // Character counter logic
  const getCharCountColor = () => {
    if (charCount < 100) return 'text-red-400';
    if (charCount < 200) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getCharCountLabel = () => {
    if (charCount < 100) return 'Add more detail';
    if (charCount < 200) return 'Good start';
    return 'Perfect!';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-8"
    >
      {/* SECTION 1: Business Description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-primary-500/10 rounded-lg flex items-center justify-center mt-1">
            <Icon icon={ICONS.briefcase} className="w-5 h-5 text-primary-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2">
              Tell us about your business
            </h3>
            <p className="text-sm text-slate-400">
              Describe what you do, who you serve, and what makes you unique. This helps us
              personalize your outreach messages.
            </p>
          </div>
        </div>

        <FormTextarea
          label="Business Description"
          placeholder="e.g., I'm a copywriter specializing in conversion-focused landing pages for SaaS companies. I help founders turn their product features into compelling benefits that drive sign-ups..."
          icon={ICONS.briefcase}
          rows={8}
          maxLength={500}
          error={errors.business_summary}
          required
          {...register('business_summary')}
        />

        {/* Character Counter */}
        <div className="flex items-center justify-between text-sm">
          <span className={`font-medium ${getCharCountColor()}`}>
            {getCharCountLabel()}
          </span>
          <span className="text-slate-500">
            {charCount} / 500
          </span>
        </div>
      </motion.div>

      {/* SECTION 2: Industry */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <FormInput
          label="Industry"
          placeholder="e.g., Marketing, Design, Development, Consulting"
          icon={ICONS.target}
          error={errors.industry}
          required
          {...register('industry')}
        />
      </motion.div>

      {/* SECTION 3: Communication Tone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
          <Icon icon={ICONS.wand} className="text-lg text-primary-400" />
          Preferred Communication Tone
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
                      ? 'bg-primary-500/10 border-primary-500'
                      : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                  }
                `}
              >
                <div className="flex flex-col items-center text-center gap-2">
                  <Icon icon={option.icon} className="text-2xl text-primary-400" />
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
