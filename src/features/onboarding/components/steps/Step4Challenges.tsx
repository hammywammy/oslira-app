// src/features/onboarding/components/steps/Step4Challenges.tsx

/**
 * STEP 4: CHALLENGES
 * 
 * Fields:
 * - challenges (checkbox array - optional)
 */

import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { ICONS } from '../../constants/icons';
import { fadeInVariants, containerVariants } from '../../animations/variants';
import { useFormContext } from 'react-hook-form';
import type { FormData, Challenge } from '../../constants/validationSchemas';

// =============================================================================
// DATA
// =============================================================================

const challengeOptions: Array<{ value: Challenge; label: string; description: string }> = [
  {
    value: 'low-quality-leads',
    label: 'Low-quality leads',
    description: 'Wasting time on prospects who aren\'t a good fit',
  },
  {
    value: 'time-consuming',
    label: 'Time-consuming research',
    description: 'Manual profile analysis takes hours',
  },
  {
    value: 'expensive-tools',
    label: 'Expensive tools',
    description: 'Current solutions cost too much',
  },
  {
    value: 'lack-personalization',
    label: 'Lack of personalization',
    description: 'Generic outreach doesn\'t convert',
  },
  {
    value: 'poor-data-quality',
    label: 'Poor data quality',
    description: 'Inaccurate or outdated information',
  },
  {
    value: 'difficult-scaling',
    label: 'Difficult to scale',
    description: 'Can\'t handle growing volume',
  },
];

// =============================================================================
// COMPONENT
// =============================================================================

export function Step4Challenges() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<FormData>();

  const selectedChallenges = watch('challenges') || [];

  const handleToggle = (value: Challenge) => {
    const currentValues = watch('challenges') || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    return newValues;
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
          What challenges are you facing?
        </h2>
        <p className="text-slate-400">
          Select all that apply (optional)
        </p>
      </motion.div>

      {/* Checkbox Grid */}
      <motion.div variants={fadeInVariants} className="space-y-3">
        {challengeOptions.map((option) => {
          const isChecked = selectedChallenges.includes(option.value);

          return (
            <label
              key={option.value}
              className={`
                block p-4 rounded-xl border-2 cursor-pointer
                transition-all duration-200
                ${
                  isChecked
                    ? 'bg-purple-500/10 border-purple-500'
                    : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                }
              `}
            >
              <div className="flex items-start gap-4">
                {/* Checkbox */}
                <div className="flex items-center h-6 mt-0.5">
                  <input
                    type="checkbox"
                    value={option.value}
                    checked={isChecked}
                    className="w-5 h-5 rounded border-slate-600 text-purple-500 focus:ring-purple-500"
                    {...register('challenges')}
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

      {/* Error message */}
      {errors.challenges && (
        <div className="flex items-center gap-2 text-sm text-red-400">
          <Icon icon="lucide:alert-circle" />
          {errors.challenges.message}
        </div>
      )}
    </motion.div>
  );
}
