// src/features/onboarding/components/steps/Step3Target.tsx

/**
 * STEP 3: TARGET CUSTOMER
 * 
 * FIXES:
 * ✅ Company size cards are fully clickable (not just checkbox)
 * ✅ Added employee count ranges
 * ✅ Better visual styling and hover states
 * ✅ Custom checkbox design matching app style
 */

import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { FormTextarea } from '../FormInput';
import { RefinementCallout } from '../RefinementCallout';
import { ICONS } from '../../constants/icons';
import { fadeInVariants, containerVariants } from '../../animations/variants';
import { useFormContext } from 'react-hook-form';
import type { FormData, TargetCompanySize } from '../../constants/validationSchemas';

// =============================================================================
// DATA
// =============================================================================

const companySizeOptions: Array<{ 
  value: TargetCompanySize; 
  label: string; 
  description: string;
  employees: string;
}> = [
  {
    value: 'startup',
    label: 'Startups',
    description: 'Early-stage companies, lean teams',
    employees: '1-50 employees',
  },
  {
    value: 'smb',
    label: 'Small & Medium',
    description: 'Established businesses, growing teams',
    employees: '51-500 employees',
  },
  {
    value: 'enterprise',
    label: 'Enterprise',
    description: 'Large corporations, complex structures',
    employees: '500+ employees',
  },
];

// =============================================================================
// CUSTOM NUMBER INPUT COMPONENT
// =============================================================================

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  error?: string;
  min?: number;
  max?: number;
  icon?: string;
}

function CustomNumberInput({ label, value, onChange, error, min = 0, max = 10000000, icon }: NumberInputProps) {
  const increment = () => {
    const step = value < 1000 ? 100 : value < 10000 ? 1000 : 10000;
    onChange(Math.min(value + step, max));
  };

  const decrement = () => {
    const step = value <= 1000 ? 100 : value <= 10000 ? 1000 : 10000;
    onChange(Math.max(value - step, min));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value) || 0;
    onChange(Math.min(Math.max(val, min), max));
  };

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
        {icon && <Icon icon={icon} className="text-lg text-purple-400" />}
        {label}
      </label>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={decrement}
          className="flex items-center justify-center w-10 h-10 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 rounded-lg transition-colors"
        >
          <Icon icon="lucide:minus" className="w-4 h-4 text-slate-300" />
        </button>

        <input
          type="number"
          value={value}
          onChange={handleInputChange}
          min={min}
          max={max}
          className="flex-1 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-center focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500"
        />

        <button
          type="button"
          onClick={increment}
          className="flex items-center justify-center w-10 h-10 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 rounded-lg transition-colors"
        >
          <Icon icon="lucide:plus" className="w-4 h-4 text-slate-300" />
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-400">
          <Icon icon="lucide:alert-circle" />
          {error}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function Step3Target() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<FormData>();

  const targetDescription = watch('target_description') || '';
  const minFollowers = watch('icp_min_followers') || 0;
  const maxFollowers = watch('icp_max_followers') || 0;
  const selectedSizes = watch('target_company_sizes') || [];
  const charCount = targetDescription.length;

  // Character counter logic
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

  // Company size toggle
  const toggleCompanySize = (size: TargetCompanySize) => {
    const current = selectedSizes;
    if (current.includes(size)) {
      setValue('target_company_sizes', current.filter((s: TargetCompanySize) => s !== size));
    } else {
      setValue('target_company_sizes', [...current, size]);
    }
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
          Who is your ideal customer?
        </h2>
        <p className="text-slate-400">
          Describe the Instagram accounts you want to target
        </p>
      </motion.div>

      {/* Refinement Callout */}
      <motion.div variants={fadeInVariants}>
        <RefinementCallout />
      </motion.div>

      {/* Target Description */}
      <motion.div variants={fadeInVariants} className="space-y-2">
        <FormTextarea
          label="Describe Your Ideal Customer"
          placeholder="Example: Health and wellness coaches with engaged audiences who promote holistic living, natural remedies, and mindfulness. They create educational content about nutrition, fitness routines, and mental health. Their followers are typically women aged 25-45 interested in self-improvement..."
          rows={8}
          maxLength={750}
          error={errors.target_description?.message}
          {...register('target_description')}
        />

        <div className="flex items-center justify-between text-sm">
          <span className={`font-medium ${getCharCountColor()}`}>
            {getCharCountLabel()}
          </span>
          <span className="text-slate-500">
            {charCount} / 750 characters
          </span>
        </div>
      </motion.div>

      {/* Follower Range */}
      <motion.div variants={fadeInVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CustomNumberInput
          label="Minimum Followers"
          value={minFollowers}
          onChange={(val) => setValue('icp_min_followers', val)}
          error={errors.icp_min_followers?.message}
          icon={ICONS.trendingUp}
        />

        <CustomNumberInput
          label="Maximum Followers"
          value={maxFollowers}
          onChange={(val) => setValue('icp_max_followers', val)}
          error={errors.icp_max_followers?.message}
          icon={ICONS.trendingUp}
        />
      </motion.div>

      {/* Company Size Selection - FULLY CLICKABLE CARDS */}
      <motion.div variants={fadeInVariants} className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
          <Icon icon={ICONS.building} className="text-lg text-purple-400" />
          Target Company Sizes (Optional)
        </label>

        <div className="space-y-3">
          {companySizeOptions.map((option) => {
            const isSelected = selectedSizes.includes(option.value);

            return (
              <motion.button
                key={option.value}
                type="button"
                onClick={() => toggleCompanySize(option.value)}
                className={`
                  w-full text-left p-4 rounded-xl border-2 transition-all
                  ${
                    isSelected
                      ? 'bg-purple-500/10 border-purple-500 shadow-lg shadow-purple-500/20'
                      : 'bg-slate-800/50 border-slate-700 hover:border-slate-600 hover:bg-slate-800/70'
                  }
                `}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-start gap-4">
                  {/* Custom Checkbox */}
                  <div className="flex items-center justify-center w-6 h-6 mt-0.5 flex-shrink-0">
                    <div
                      className={`
                        w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all
                        ${
                          isSelected
                            ? 'bg-purple-500 border-purple-500'
                            : 'border-slate-600 bg-slate-900/50'
                        }
                      `}
                    >
                      {isSelected && (
                        <Icon icon={ICONS.check} className="w-4 h-4 text-white" />
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="font-semibold text-white mb-1 flex items-center gap-2">
                      {option.label}
                      <span className="text-xs text-slate-400 font-normal">
                        {option.employees}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400">{option.description}</p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {errors.target_company_sizes?.message && (
          <div className="flex items-center gap-2 text-sm text-red-400">
            <Icon icon="lucide:alert-circle" />
            {errors.target_company_sizes.message}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
