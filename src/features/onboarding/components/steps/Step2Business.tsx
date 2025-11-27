/**
 * STEP 2: BUSINESS CONTEXT - LIGHT MODE REDESIGN
 * 
 * Clean business info collection
 * Using primary blue and secondary purple accents
 */

import { useFormContext } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { Textarea } from '@/shared/components/ui/Textarea';
import type { FormData } from '@/features/onboarding/constants/validationSchemas';

const toneOptions = [
  {
    value: 'professional',
    label: 'Professional',
    description: 'Formal and business-focused',
    icon: 'ph:briefcase',
  },
  {
    value: 'friendly',
    label: 'Friendly',
    description: 'Warm and approachable',
    icon: 'ph:smiley',
  },
  {
    value: 'casual',
    label: 'Casual',
    description: 'Relaxed and conversational',
    icon: 'ph:chat-circle',
  },
];

export function Step2Business() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<FormData>();

  const businessSummary = watch('business_summary') || '';
  const selectedTone = watch('communication_tone');
  const charCount = businessSummary.length;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-100 mb-4">
          <Icon icon="ph:buildings" className="text-2xl text-primary-600" />
        </div>
        <h2 className="text-2xl font-semibold text-neutral-900 mb-2">
          Tell us about your business
        </h2>
        <p className="text-neutral-600">
          Help us understand what you do and how you communicate
        </p>
</div>

      {/* Business Name - NEW FIELD */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-neutral-700">
          Business Name
          <span className="text-red-500 ml-1">*</span>
        </label>
        <div className="relative">
          <Icon 
            icon="ph:buildings" 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5 pointer-events-none z-10" 
          />
          <input
            type="text"
            placeholder="Acme Marketing Agency"
            className={`
              w-full pl-11 pr-4 py-2.5
              bg-white border-2 rounded-xl
              text-neutral-900 placeholder:text-neutral-400
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
              ${errors.business_name 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                : 'border-neutral-200 hover:border-neutral-300'
              }
            `}
            {...register('business_name')}
          />
        </div>
        {errors.business_name?.message && (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <Icon icon="ph:warning-circle" className="w-4 h-4" />
            {errors.business_name.message}
          </div>
        )}
        <p className="text-sm text-neutral-500 flex items-center gap-2">
          <Icon icon="ph:info" className="w-4 h-4" />
          Your company or business name
        </p>
      </div>

      {/* Business Summary */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-neutral-700">
          Business Summary
        </label>
        <Textarea
          placeholder="Describe what you do, who you serve, and what makes you unique..."
          rows={5}
          error={errors.business_summary?.message}
          {...register('business_summary')}
          className="w-full"
        />
        <div className="flex items-center justify-between text-sm">
          <span className={`font-medium ${
            charCount < 50 ? 'text-red-500' :
            charCount < 200 ? 'text-amber-500' :
            'text-green-600'
          }`}>
            {charCount < 50 ? 'Add more detail' :
             charCount < 200 ? 'Good start' :
             'Perfect!'}
          </span>
          <span className="text-neutral-500">
            {charCount} / 750
          </span>
        </div>
      </div>

      {/* Communication Tone */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-neutral-700">
          Communication Tone
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {toneOptions.map((option) => {
            const isSelected = selectedTone === option.value;

            return (
              <label
                key={option.value}
                className={`
                  relative p-4 rounded-xl border-2 cursor-pointer
                  transition-all duration-200
                  ${isSelected
                    ? 'bg-primary-50 border-primary-500'
                    : 'bg-white border-neutral-200 hover:border-neutral-300'
                  }
                `}
              >
                <input
                  type="radio"
                  value={option.value}
                  checked={isSelected}
                  className="sr-only"
                  {...register('communication_tone')}
                />
                <div className="text-center space-y-2">
                  <Icon 
                    icon={option.icon} 
                    className={`text-2xl mx-auto ${
                      isSelected ? 'text-primary-600' : 'text-neutral-400'
                    }`}
                  />
                  <div className={`font-medium ${
                    isSelected ? 'text-neutral-900' : 'text-neutral-700'
                  }`}>
                    {option.label}
                  </div>
                  <div className="text-xs text-neutral-500">
                    {option.description}
                  </div>
                </div>
              </label>
            );
          })}
        </div>
        {errors.communication_tone?.message && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <Icon icon="ph:warning" />
            {errors.communication_tone.message}
          </p>
        )}
      </div>
    </motion.div>
  );
}
