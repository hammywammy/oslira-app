// src/features/onboarding/components/steps/Step3Goals.tsx

/**
 * STEP 3: GOALS
 * 
 * Fields:
 * - primary_objective (radio)
 * - monthly_lead_goal (number)
 * 
 * FIXED: Removed unused setValue, properly handles monthly_lead_goal
 */

import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { FormInput } from '../FormInput';
import { ICONS } from '../../constants/icons';
import { fadeInVariants, containerVariants } from '../../animations/variants';
import { useFormContext } from 'react-hook-form';
import type { FormData, PrimaryObjective } from '../../constants/validationSchemas';

// =============================================================================
// DATA
// =============================================================================

const objectiveOptions: Array<{ value: PrimaryObjective; label: string; description: string }> = [
  {
    value: 'lead-generation',
    label: 'Lead Generation',
    description: 'Find and connect with potential customers',
  },
  {
    value: 'sales-automation',
    label: 'Sales Automation',
    description: 'Automate repetitive prospecting tasks',
  },
  {
    value: 'market-research',
    label: 'Market Research',
    description: 'Understand your target audience better',
  },
  {
    value: 'customer-retention',
    label: 'Customer Retention',
    description: 'Engage and retain existing customers',
  },
];

// =============================================================================
// COMPONENT
// =============================================================================

export function Step3Goals() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<FormData>();

  const selectedObjective = watch('primary_objective');

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={fadeInVariants} className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-white">What's your main goal?</h2>
        <p className="text-slate-400">Choose your primary objective</p>
      </motion.div>

      {/* Objective Selection */}
      <motion.div variants={fadeInVariants} className="space-y-3">
        {objectiveOptions.map((option) => {
          const isSelected = selectedObjective === option.value;

          return (
            <label
              key={option.value}
              className={`
                block p-4 rounded-xl border-2 cursor-pointer
                transition-all duration-200
                ${
                  isSelected
                    ? 'bg-purple-500/10 border-purple-500'
                    : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                }
              `}
            >
              <div className="flex items-start gap-4">
                {/* Radio */}
                <div className="flex items-center h-6 mt-0.5">
                  <input
                    type="radio"
                    value={option.value}
                    checked={isSelected}
                    className="w-5 h-5 text-purple-500 focus:ring-purple-500"
                    {...register('primary_objective')}
                  />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon icon={ICONS.target} className="text-purple-400" />
                    <span className="font-semibold text-white">{option.label}</span>
                  </div>
                  <p className="text-sm text-slate-400">{option.description}</p>
                </div>
              </div>
            </label>
          );
        })}
      </motion.div>

      {/* Error for objective */}
      {errors.primary_objective?.message && (
        <div className="flex items-center gap-2 text-sm text-red-400">
          <Icon icon="lucide:alert-circle" />
          {errors.primary_objective.message}
        </div>
      )}

      {/* Monthly Lead Goal */}
      <motion.div variants={fadeInVariants}>
        <FormInput
          label="Monthly Lead Goal"
          placeholder="50"
          type="number"
          icon={ICONS.trendingUp}
          error={errors.monthly_lead_goal?.message}
          helperText="How many leads do you want to generate per month?"
          required
          min={1}
          max={10000}
          {...register('monthly_lead_goal', { valueAsNumber: true })}
        />
      </motion.div>
    </motion.div>
  );
}
