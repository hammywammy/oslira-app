// src/features/onboarding/components/steps/Step1Personal.tsx

/**
 * STEP 1: PERSONAL INFORMATION - LIGHT MODE REDESIGN
 * 
 * Clean, minimal personal info collection
 * Using primary blue accents
 */

import { useFormContext } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { Input } from '@/shared/components/ui/Input';
import type { FormData } from '@/features/onboarding/constants/validationSchemas';

export function Step1Personal() {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormData>();

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
          <Icon icon="ph:user" className="text-2xl text-primary-600" />
        </div>
        <h2 className="text-2xl font-semibold text-neutral-900 mb-2">
          Welcome to Oslira
        </h2>
        <p className="text-neutral-600">
          Let's start by getting to know you
        </p>
      </div>

      {/* Form Field */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Your Full Name
          </label>
          <Input
            type="text"
            placeholder="Enter your full name"
            error={errors.full_name?.message}
            {...register('full_name')}
            className="w-full"
          />
          <p className="mt-2 text-sm text-neutral-500">
            This will be used in your outreach messages
          </p>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
        <div className="flex gap-3">
          <Icon icon="ph:info" className="text-primary-600 text-xl flex-shrink-0" />
          <div className="text-sm">
            <p className="text-primary-900 font-medium mb-1">
              Quick Setup
            </p>
            <p className="text-primary-700">
              This onboarding takes less than 3 minutes to complete
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
