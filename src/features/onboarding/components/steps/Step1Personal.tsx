// src/features/onboarding/components/steps/Step1Personal.tsx

/**
 * STEP 1: PERSONAL INFORMATION - MODERN PROFESSIONAL
 * 
 * Clean, welcoming personal info collection
 * With personality and modern touches
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
    watch,
  } = useFormContext<FormData>();

  const name = watch('full_name');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-8"
    >
      {/* Welcome Header - More Personality */}
      <div className="text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50 mb-5"
        >
          <Icon icon="ph:hand-waving" className="text-3xl text-primary-600" />
        </motion.div>
        
        <h2 className="text-3xl font-bold text-neutral-900 mb-2">
          Welcome to Oslira
        </h2>
        <p className="text-neutral-600 text-lg">
          Let's start by getting to know you
        </p>
      </div>

      {/* Form Field - Cleaner Design */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-neutral-800">
          Your Full Name
        </label>
        <Input
          type="text"
          placeholder="Enter your full name"
          error={errors.full_name?.message}
          {...register('full_name')}
          className="w-full text-base"
        />
        <p className="text-sm text-neutral-500">
          This will be used in your outreach messages
        </p>
      </div>

      {/* Dynamic Welcome Message */}
      {name && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-4 border border-primary-100"
        >
          <p className="text-sm font-medium text-neutral-800">
            Nice to meet you, {name.split(' ')[0]}! 👋
          </p>
        </motion.div>
      )}

      {/* Quick Setup Info - Modern Card */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="relative overflow-hidden bg-white rounded-xl border border-neutral-200 p-5"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-100/50 to-secondary-100/50 rounded-full blur-3xl" />
        <div className="relative flex gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
              <Icon icon="ph:lightning" className="text-primary-600 text-xl" />
            </div>
          </div>
          <div>
            <p className="font-semibold text-neutral-900 mb-1">
              Quick Setup
            </p>
            <p className="text-sm text-neutral-600">
              This onboarding takes less than 3 minutes to complete
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
