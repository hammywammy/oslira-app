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
 */

import { motion } from 'framer-motion';
import { FormInput, FormTextarea } from '../FormInput';
import { ICONS } from '../../constants/icons';
import { fadeInVariants, containerVariants } from '../../animations/variants';
import { useFormContext } from 'react-hook-form';
import type { FormData } from '../../constants/validationSchemas';

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
          placeholder="We help small businesses grow their online presence through Instagram marketing and content creation..."
          error={errors.business_summary?.message}
          helperText="Be specific about your services and target market (50-500 characters)"
          required
          rows={4}
          maxLength={500}
          {...register('business_summary')}
        />
      </motion.div>

      {/* Industry */}
      <motion.div variants={fadeInVariants} className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-200">
          Industry <span className="text-violet-400">*</span>
        </label>
        <div className="relative">
          <Icon icon={ICONS.briefcase} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <select
            {...register('industry')}
            className={`
              w-full pl-11 pr-4 py-2.5
              bg-slate-900/50 border rounded-lg
              text-white
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:bg-slate-900
              ${errors.industry ? 'border-red-500/50' : 'border-slate-700/50'}
            `}
          >
            <option value="">Select industry</option>
            <option value="Technology">Technology</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Finance">Finance</option>
            <option value="Real Estate">Real Estate</option>
            <option value="Retail">Retail</option>
            <option value="Manufacturing">Manufacturing</option>
            <option value="Consulting">Consulting</option>
            <option value="Marketing">Marketing</option>
            <option value="Education">Education</option>
            <option value="Other">Other</option>
          </select>
        </div>
        {errors.industry && (
          <p className="text-xs text-red-400 flex items-center gap-1.5">
            <Icon icon={ICONS.alertCircle} className="w-3.5 h-3.5" />
            {errors.industry.message}
          </p>
        )}
      </motion.div>

      {/* Other Industry (conditional) */}
      {showOtherIndustry && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <FormInput
            label="Specify Industry"
            placeholder="e.g., Hospitality"
            error={errors.industry_other?.message}
            required
            {...register('industry_other')}
          />
        </motion.div>
      )}

      {/* Company Size */}
      <motion.div variants={fadeInVariants} className="space-y-2">
        <label className="block text-sm font-medium text-slate-200">
          Company Size <span className="text-violet-400">*</span>
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: '1-10', label: '1-10' },
            { value: '11-50', label: '11-50' },
            { value: '51+', label: '51+' },
          ].map((option) => (
            <label
              key={option.value}
              className="relative flex items-center justify-center p-3 border border-slate-700/50 rounded-lg cursor-pointer hover:border-violet-500/50 transition-colors"
            >
              <input
                type="radio"
                value={option.value}
                {...register('company_size')}
                className="sr-only peer"
              />
              <span className="text-sm font-medium text-slate-300 peer-checked:text-violet-400">
                {option.label}
              </span>
              <div className="absolute inset-0 border-2 border-violet-500 rounded-lg opacity-0 peer-checked:opacity-100 transition-opacity" />
            </label>
          ))}
        </div>
        {errors.company_size && (
          <p className="text-xs text-red-400 flex items-center gap-1.5">
            <Icon icon={ICONS.alertCircle} className="w-3.5 h-3.5" />
            {errors.company_size.message}
          </p>
        )}
      </motion.div>

      {/* Website (optional) */}
      <motion.div variants={fadeInVariants}>
        <FormInput
          label="Website"
          type="url"
          placeholder="https://example.com"
          icon={ICONS.globe}
          error={errors.website?.message}
          helperText="Optional"
          {...register('website')}
        />
      </motion.div>
    </motion.div>
  );
}

// Missing Icon import
import { Icon } from '@iconify/react';
