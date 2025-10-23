// src/features/onboarding/components/steps/Step3Goals.tsx

/**
 * STEP 3: GOALS
 * 
 * Fields:
 * - primary_objective (radio)
 * - monthly_lead_goal (number)
 */

import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { FormInput } from '../FormInput';
import { ICONS } from '../../constants/icons';
import { fadeInVariants, containerVariants } from '../../animations/variants';
import { useFormContext } from 'react-hook-form';
import type { FormData } from '../../constants/validationSchemas';

// =============================================================================
// COMPONENT
// =============================================================================

export function Step3Goals() {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormData>();

  const objectives = [
    {
      value: 'lead-generation',
      label: 'Lead Generation',
      description: 'Find and qualify new prospects',
    },
    {
      value: 'sales-automation',
      label: 'Sales Automation',
      description: 'Streamline outreach process',
    },
    {
      value: 'market-research',
      label: 'Market Research',
      description: 'Analyze competitors and trends',
    },
    {
      value: 'customer-retention',
      label: 'Customer Retention',
      description: 'Engage existing customers',
    },
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
          What are your goals?
        </h2>
        <p className="text-slate-400">
          Define what success looks like
        </p>
      </motion.div>

      {/* Primary Objective */}
      <motion.div variants={fadeInVariants} className="space-y-3">
        <label className="block text-sm font-medium text-slate-200">
          Primary Objective <span className="text-violet-400">*</span>
        </label>
        <div className="space-y-2">
          {objectives.map((option) => (
            <label
              key={option.value}
              className="relative flex items-start p-4 border border-slate-700/50 rounded-lg cursor-pointer hover:border-violet-500/50 transition-colors"
            >
              <input
                type="radio"
                value={option.value}
                {...register('primary_objective')}
                className="sr-only peer"
              />
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <Icon icon={ICONS.target} className="w-5 h-5 text-slate-400 peer-checked:text-violet-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-200 peer-checked:text-violet-400">
                      {option.label}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {option.description}
                    </p>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 border-2 border-violet-500 rounded-lg opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
            </label>
          ))}
        </div>
        {errors.primary_objective && (
          <p className="text-xs text-red-400 flex items-center gap-1.5">
            <Icon icon={ICONS.alertCircle} className="w-3.5 h-3.5" />
            {errors.primary_objective.message}
          </p>
        )}
      </motion.div>

      {/* Monthly Lead Goal */}
      <motion.div variants={fadeInVariants}>
        <FormInput
          label="Monthly Lead Goal"
          type="number"
          placeholder="50"
          icon={ICONS.trendingUp}
          error={errors.monthly_lead_goal?.message}
          helperText="How many leads do you want to analyze per month?"
          required
          min={1}
          max={10000}
          {...register('monthly_lead_goal', { valueAsNumber: true })}
        />
      </motion.div>
    </motion.div>
  );
}
