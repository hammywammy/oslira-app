// src/features/onboarding/components/steps/Step4Challenges.tsx

/**
 * STEP 4: CHALLENGES
 * 
 * Fields:
 * - challenges (multi-select checkboxes)
 * 
 * FIXED: Proper Challenge type annotation instead of generic string
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
    label: 'Low Quality Leads',
    description: 'Spending time on prospects that never convert',
  },
  {
    value: 'time-consuming',
    label: 'Time-Consuming Research',
    description: 'Hours spent manually vetting prospects',
  },
  {
    value: 'expensive-tools',
    label: 'Expensive Tools',
    description: 'Current solutions are too costly',
  },
  {
    value: 'lack-personalization',
    label: 'Lack of Personalization',
    description: 'Generic outreach that doesn\'t resonate',
  },
  {
    value: 'poor-data-quality',
    label: 'Poor Data Quality',
    description: 'Outdated or inaccurate prospect information',
  },
  {
    value: 'difficult-scaling',
    label: 'Difficult to Scale',
    description: 'Can\'t scale prospecting without hiring',
  },
];

// =============================================================================
// COMPONENT
// =============================================================================

export function Step4Challenges() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<FormData>();

  const selectedChallenges = watch('challenges') || [];

  // ✅ FIXED: Changed parameter type from 'string' to 'Challenge'
  const toggleChallenge = (value: Challenge) => {
    const current = watch('challenges') || [];
    
    if (current.includes(value)) {
      // ✅ FIXED: Type assertion for filter callback
      setValue('challenges', current.filter((v: Challenge) => v !== value));
    } else {
      // ✅ Type is already correct here - spreading Challenge[]
      setValue('challenges', [...current, value]);
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
          What challenges are you facing?
        </h2>
        <p className="text-slate-400">
          Select all that apply (optional)
        </p>
      </motion.div>

      {/* Challenge Options */}
      <motion.div variants={fadeInVariants} className="space-y-3">
        {challengeOptions.map((option) => {
          const isSelected = selectedChallenges.includes(option.value);

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
              onClick={() => toggleChallenge(option.value)}
            >
              <div className="flex items-start gap-4">
                {/* Checkbox */}
                <div className="flex items-center h-6 mt-0.5">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}} // Handled by label onClick
                    className="w-5 h-5 text-purple-500 rounded focus:ring-purple-500"
                  />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon icon={ICONS.alertTriangle} className="text-purple-400" />
                    <span className="font-semibold text-white">{option.label}</span>
                  </div>
                  <p className="text-sm text-slate-400">{option.description}</p>
                </div>
              </div>
            </label>
          );
        })}
      </motion.div>

      {/* Error Message */}
      {errors.challenges?.message && (
        <div className="flex items-center gap-2 text-sm text-red-400">
          <Icon icon="lucide:alert-circle" />
          {errors.challenges.message}
        </div>
      )}
    </motion.div>
  );
}
