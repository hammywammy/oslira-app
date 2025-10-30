// src/features/onboarding/components/steps/Step3Target.tsx
// RING FIX: Changed ring-purple-500 to ring-primary-500 in CustomNumberInput

import { useFormContext } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { FormTextarea } from '@/features/onboarding/components/FormInput';
import type { FormData } from '@/features/onboarding/constants/validationSchemas';
import { useState } from 'react';

// =============================================================================
// CONSTANTS
// =============================================================================

const ICONS = {
  users: 'lucide:users',
  target: 'lucide:target',
  building: 'lucide:building-2',
  check: 'lucide:check',
  minus: 'lucide:minus',
  plus: 'lucide:plus',
  alertCircle: 'lucide:alert-circle',
} as const;

const companySizeOptions = [
  {
    value: 'solopreneur',
    label: 'Solopreneur',
    employees: '1',
    description: 'Independent professionals',
    icon: ICONS.users,
  },
  {
    value: 'small',
    label: 'Small',
    employees: '2-10',
    description: 'Small teams & agencies',
    icon: ICONS.users,
  },
  {
    value: 'medium',
    label: 'Medium',
    employees: '11-50',
    description: 'Growing businesses',
    icon: ICONS.building,
  },
  {
    value: 'large',
    label: 'Large',
    employees: '51-200',
    description: 'Established companies',
    icon: ICONS.building,
  },
  {
    value: 'enterprise',
    label: 'Enterprise',
    employees: '200+',
    description: 'Large organizations',
    icon: ICONS.building,
  },
];

// =============================================================================
// CUSTOM NUMBER INPUT
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
        {icon && <Icon icon={icon} className="text-lg text-primary-400" />}
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
          className="flex-1 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-center focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500"
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

  const toggleSize = (size: string) => {
    const newSizes = selectedSizes.includes(size)
      ? selectedSizes.filter((s) => s !== size)
      : [...selectedSizes, size];
    setValue('target_company_sizes', newSizes, { shouldValidate: true });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-8"
    >
      {/* SECTION 1: Target Audience Description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-primary-500/10 rounded-lg flex items-center justify-center mt-1">
            <Icon icon={ICONS.target} className="w-5 h-5 text-primary-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2">
              Who are you trying to reach?
            </h3>
            <p className="text-sm text-slate-400">
              Describe your ideal customers. Be specific about their roles, industries, and characteristics.
            </p>
          </div>
        </div>

        <FormTextarea
          label="Target Audience"
          placeholder="e.g., I help SaaS founders who are frustrated with low conversion rates and want to create compelling copy that actually converts visitors into paying customers..."
          icon={ICONS.users}
          rows={8}
          maxLength={500}
          error={errors.target_description}
          required
          {...register('target_description')}
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

      {/* SECTION 2: Follower Range */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-primary-500/10 rounded-lg flex items-center justify-center mt-1">
            <Icon icon="lucide:users" className="w-5 h-5 text-primary-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2">
              Follower Range
            </h3>
            <p className="text-sm text-slate-400">
              Set the minimum and maximum follower count for your ideal leads.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomNumberInput
            label="Minimum Followers"
            value={minFollowers}
            onChange={(val) => setValue('icp_min_followers', val, { shouldValidate: true })}
            icon="lucide:trending-up"
            min={0}
            max={10000000}
            error={errors.icp_min_followers?.message}
          />

          <CustomNumberInput
            label="Maximum Followers"
            value={maxFollowers}
            onChange={(val) => setValue('icp_max_followers', val, { shouldValidate: true })}
            icon="lucide:trending-up"
            min={0}
            max={10000000}
            error={errors.icp_max_followers?.message}
          />
        </div>
      </motion.div>

      {/* SECTION 3: Company Size */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-primary-500/10 rounded-lg flex items-center justify-center mt-1">
            <Icon icon={ICONS.building} className="w-5 h-5 text-primary-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2">
              Company Size <span className="text-slate-500 font-normal text-base">(optional)</span>
            </h3>
            <p className="text-sm text-slate-400">
              Select all company sizes you want to target. Leave blank if size doesn't matter.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {companySizeOptions.map((option) => {
            const isSelected = selectedSizes.includes(option.value);

            return (
              <motion.button
                key={option.value}
                type="button"
                onClick={() => toggleSize(option.value)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  p-4 rounded-xl border-2 text-left transition-all duration-200
                  ${
                    isSelected
                      ? 'bg-primary-500/10 border-primary-500'
                      : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  {/* Checkbox */}
                  <div className="flex-shrink-0 mt-0.5">
                    <div
                      className={`
                        w-5 h-5 rounded border-2 flex items-center justify-center transition-all
                        ${
                          isSelected
                            ? 'bg-primary-500 border-primary-500'
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
