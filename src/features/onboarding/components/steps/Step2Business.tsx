// src/features/onboarding/components/steps/Step2Business.tsx

/**
 * STEP 2: BUSINESS BASICS
 * 
 * Fields:
 * - company_name
 * - business_summary (textarea)
 * - industry (select)
 * - industry_other (conditional text)
 * - company_size (radio)
 * - website (optional)
 * 
 * FIXED: Using ICONS.briefcase for industry field (not ICONS.industry)
 */

import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { FormInput, FormTextarea } from '../FormInput';
import { ICONS } from '../../constants/icons';
import { fadeInVariants, containerVariants } from '../../animations/variants';
import { useFormContext } from 'react-hook-form';
import type { FormData, Industry, CompanySize } from '../../constants/validationSchemas';

// =============================================================================
// DATA
// =============================================================================

const industries: Industry[] = [
  'Technology',
  'Healthcare',
  'Finance',
  'Real Estate',
  'Retail',
  'Manufacturing',
  'Consulting',
  'Marketing',
  'Education',
  'Other',
];

const companySizes: Array<{ value: CompanySize; label: string }> = [
  { value: '1-10', label: '1-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51+', label: '51+ employees' },
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

  const selectedIndustry = watch('industry');
  const selectedSize = watch('company_size');
  const showOtherIndustry = selectedIndustry === 'Other';

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
          Help us understand what you do
        </p>
      </motion.div>

      {/* Company Name */}
      <motion.div variants={fadeInVariants}>
        <FormInput
          label="Company Name"
          placeholder="Acme Marketing"
          icon={ICONS.building}
          error={errors.company_name?.message}
          required
          {...register('company_name')}
        />
      </motion.div>

      {/* Business Summary */}
      <motion.div variants={fadeInVariants}>
        <FormTextarea
          label="What does your business do?"
          placeholder="We help health coaches build their personal brands on Instagram..."
          icon={ICONS.briefcase}
          error={errors.business_summary?.message}
          helperText="Describe your business in 50-500 characters"
          required
          rows={4}
          maxLength={500}
          {...register('business_summary')}
        />
      </motion.div>

      {/* Industry Dropdown */}
      <motion.div variants={fadeInVariants} className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
          <Icon icon={ICONS.briefcase} className="text-lg text-purple-400" />
          Industry
          <span className="text-red-400">*</span>
        </label>

        <select
          className={`
            w-full px-4 py-3 
            bg-slate-800/50 
            border-2 rounded-xl 
            text-white
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-purple-500/50
            ${
              errors.industry
                ? 'border-red-500/50 focus:border-red-500'
                : 'border-slate-700 focus:border-purple-500'
            }
          `}
          {...register('industry')}
        >
          <option value="">Select an industry...</option>
          {industries.map((industry) => (
            <option key={industry} value={industry}>
              {industry}
            </option>
          ))}
        </select>

        {errors.industry?.message && (
          <div className="flex items-center gap-2 text-sm text-red-400">
            <Icon icon="lucide:alert-circle" />
            {errors.industry.message}
          </div>
        )}
      </motion.div>

      {/* Other Industry (Conditional) */}
      {showOtherIndustry && (
        <motion.div
          variants={fadeInVariants}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
        >
          <FormInput
            label="Please specify"
            placeholder="Your industry"
            icon={ICONS.briefcase}
            error={errors.industry_other?.message}
            {...register('industry_other')}
          />
        </motion.div>
      )}

      {/* Company Size */}
      <motion.div variants={fadeInVariants} className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
          <Icon icon={ICONS.users} className="text-lg text-purple-400" />
          Company Size
          <span className="text-red-400">*</span>
        </label>

        <div className="space-y-2">
          {companySizes.map((size) => {
            const isSelected = selectedSize === size.value;

            return (
              <label
                key={size.value}
                className={`
                  flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer
                  transition-all duration-200
                  ${
                    isSelected
                      ? 'bg-purple-500/10 border-purple-500'
                      : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                  }
                `}
              >
                <input
                  type="radio"
                  value={size.value}
                  checked={isSelected}
                  className="w-4 h-4 text-purple-500"
                  {...register('company_size')}
                />
                <span className="text-white">{size.label}</span>
              </label>
            );
          })}
        </div>

        {errors.company_size?.message && (
          <div className="flex items-center gap-2 text-sm text-red-400">
            <Icon icon="lucide:alert-circle" />
            {errors.company_size.message}
          </div>
        )}
      </motion.div>

      {/* Website (Optional) */}
      <motion.div variants={fadeInVariants}>
        <FormInput
          label="Website (Optional)"
          placeholder="https://example.com"
          type="url"
          icon={ICONS.globe}
          error={errors.website?.message}
          helperText="Your company website"
          {...register('website')}
        />
      </motion.div>
    </motion.div>
  );
}
