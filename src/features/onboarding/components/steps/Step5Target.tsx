// src/features/onboarding/components/steps/Step5Target.tsx

/**
 * STEP 5: TARGET AUDIENCE
 * 
 * Fields:
 * - target_description (textarea)
 * - icp_min_followers (number)
 * - icp_max_followers (number)
 * - target_company_sizes (checkbox array - optional)
 */

import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { FormInput, FormTextarea } from '../FormInput';
import { ICONS } from '../../constants/icons';
import { fadeInVariants, containerVariants } from '../../animations/variants';
import { useFormContext } from 'react-hook-form';
import type { FormData } from '../../constants/validationSchemas';

// =============================================================================
// COMPONENT
// =============================================================================

export function Step5Target() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<FormData>();

  const selectedSizes = watch('target_company_sizes') || [];

  const companySizes = [
    { value: 'startup', label: 'Startup', description: '1-50 employees' },
    { value: 'smb', label: 'Small/Medium', description: '51-500 employees' },
    { value: 'enterprise', label: 'Enterprise', description: '500+ employees' },
  ];

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
          Who is your ideal customer?
        </h2>
        <p className="text-slate-400">
          Describe your target audience
        </p>
      </motion.div>

      {/* Target Description */}
      <motion.div variants={fadeInVariants}>
        <FormTextarea
          label="Target Audience Description"
          placeholder="Small business owners in the wellness industry, age 30-50, focused on sustainable growth..."
          error={errors.target_description?.message}
          helperText="Be specific about demographics, interests, and pain points (20-500 characters)"
          required
          rows={4}
          maxLength={500}
          {...register('target_description')}
        />
      </motion.div>

      {/* Follower Range */}
      <motion.div variants={fadeInVariants} className="grid grid-cols-2 gap-4">
        <FormInput
          label="Minimum Followers"
          type="number"
          placeholder="1000"
          icon={ICONS.hash}
          error={errors.icp_min_followers?.message}
          required
          min={0}
          {...register('icp_min_followers', { valueAsNumber: true })}
        />
        <FormInput
          label="Maximum Followers"
          type="number"
          placeholder="50000"
          icon={ICONS.hash}
          error={errors.icp_max_followers?.message}
          required
          min={0}
          {...register('icp_max_followers', { valueAsNumber: true })}
        />
      </motion.div>

      {/* Target Company Sizes */}
      <motion.div variants={fadeInVariants} className="space-y-3">
        <label className="block text-sm font-medium text-slate-200">
          Target Company Sizes <span className="text-slate-500">(optional)</span>
        </label>
        <div className="grid grid-cols-3 gap-3">
          {companySizes.map((size) => {
            const isSelected = selectedSizes.includes(size.value);
            
            return (
              <label
                key={size.value}
                className={`
                  relative flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer
                  transition-all duration-200
                  ${
                    isSelected
                      ? 'border-violet-500/50 bg-violet-500/5'
                      : 'border-slate-700/50 hover:border-violet-500/30'
                  }
                `}
              >
                <input
                  type="checkbox"
                  value={size.value}
                  {...register('target_company_sizes')}
                  className="sr-only peer"
                />
                
                {/* Checkmark indicator */}
                <div className={`
                  absolute top-2 right-2 w-5 h-5 rounded-full border-2
                  flex items-center justify-center
                  transition-colors duration-200
                  ${
                    isSelected
                      ? 'border-violet-500 bg-violet-500'
                      : 'border-slate-600'
                  }
                `}>
                  {isSelected && (
                    <Icon icon={ICONS.check} className="w-3 h-3 text-white" />
                  )}
                </div>

                {/* Icon */}
                <Icon
                  icon={ICONS.users}
                  className={`
                    w-6 h-6 mb-2 transition-colors
                    ${isSelected ? 'text-violet-400' : 'text-slate-400'}
                  `}
                />

                {/* Label */}
                <p className={`
                  text-sm font-medium text-center transition-colors
                  ${isSelected ? 'text-violet-300' : 'text-slate-200'}
                `}>
                  {size.label}
                </p>
                <p className="text-xs text-slate-500 text-center mt-0.5">
                  {size.description}
                </p>
              </label>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
