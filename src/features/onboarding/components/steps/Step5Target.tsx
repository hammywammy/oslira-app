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
import type { FormData, TargetCompanySize } from '../../constants/validationSchemas';

// =============================================================================
// DATA
// =============================================================================

const companySizeOptions: Array<{ value: TargetCompanySize; label: string; description: string }> = [
  { value: 'startup', label: 'Startup', description: '1-50 employees' },
  { value: 'smb', label: 'Small/Medium', description: '51-500 employees' },
  { value: 'enterprise', label: 'Enterprise', description: '500+ employees' },
];

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
        <p className="text-slate-400">Describe your target audience</p>
      </motion.div>

      {/* Target Description */}
      <motion.div variants={fadeInVariants}>
        <FormTextarea
          label="Target Audience Description"
          placeholder="E.g., Health and wellness coaches with engaged audiences who promote holistic living..."
          icon={ICONS.users}
          error={errors.target_description?.message}
          helperText="Describe who you're targeting (20-500 characters)"
          required
          rows={4}
          maxLength={500}
          {...register('target_description')}
        />
      </motion.div>

      {/* Follower Range */}
      <motion.div variants={fadeInVariants} className="grid grid-cols-2 gap-4">
        <FormInput
          label="Min Followers"
          placeholder="1000"
          type="number"
          icon={ICONS.users}
          error={errors.icp_min_followers?.message}
          required
          min={0}
          {...register('icp_min_followers', { valueAsNumber: true })}
        />

        <FormInput
          label="Max Followers"
          placeholder="50000"
          type="number"
          icon={ICONS.users}
          error={errors.icp_max_followers?.message}
          required
          min={0}
          {...register('icp_max_followers', { valueAsNumber: true })}
        />
      </motion.div>

      {/* Company Size Checkboxes */}
      <motion.div variants={fadeInVariants} className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
          <Icon icon={ICONS.building} className="text-lg text-purple-400" />
          Target Company Sizes (Optional)
        </label>

        <div className="space-y-2">
          {companySizeOptions.map((option) => {
            const isChecked = selectedSizes.includes(option.value);

            return (
              <label
                key={option.value}
                className={`
                  flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer
                  transition-all duration-200
                  ${
                    isChecked
                      ? 'bg-purple-500/10 border-purple-500'
                      : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                  }
                `}
              >
                <input
                  type="checkbox"
                  value={option.value}
                  checked={isChecked}
                  className="w-5 h-5 rounded border-slate-600 text-purple-500 focus:ring-purple-500"
                  {...register('target_company_sizes')}
                />
                <div className="flex-1">
                  <span className="font-medium text-white">{option.label}</span>
                  <p className="text-sm text-slate-400">{option.description}</p>
                </div>
              </label>
            );
          })}
        </div>
      </motion.div>

      {/* Errors */}
      {errors.target_company_sizes && (
        <div className="flex items-center gap-2 text-sm text-red-400">
          <Icon icon="lucide:alert-circle" />
          {errors.target_company_sizes.message}
        </div>
      )}
    </motion.div>
  );
}
