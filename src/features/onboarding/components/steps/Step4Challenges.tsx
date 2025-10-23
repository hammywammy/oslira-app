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
import type { FormData } from '../../constants/validationSchemas';

// =============================================================================
// COMPONENT
// =============================================================================

export function Step4Challenges() {
  const {
    register,
    watch,
  } = useFormContext<FormData>();

  const selectedChallenges = watch('challenges') || [];

  const challenges = [
    {
      value: 'low-quality-leads',
      label: 'Low-Quality Leads',
      description: 'Spending time on prospects who aren\'t a good fit',
    },
    {
      value: 'time-consuming',
      label: 'Time-Consuming Research',
      description: 'Manual profile analysis takes too long',
    },
    {
      value: 'expensive-tools',
      label: 'Expensive Tools',
      description: 'Current solutions are too costly',
    },
    {
      value: 'lack-personalization',
      label: 'Lack of Personalization',
      description: 'Generic outreach doesn\'t convert',
    },
    {
      value: 'poor-data-quality',
      label: 'Poor Data Quality',
      description: 'Inaccurate or outdated prospect information',
    },
    {
      value: 'difficult-scaling',
      label: 'Difficult to Scale',
      description: 'Can\'t analyze enough prospects efficiently',
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
          What challenges do you face?
        </h2>
        <p className="text-slate-400">
          Select all that apply (optional)
        </p>
      </motion.div>

      {/* Challenges */}
      <motion.div variants={fadeInVariants} className="space-y-2">
        {challenges.map((challenge, index) => {
          const isSelected = selectedChallenges.includes(challenge.value);
          
          return (
            <motion.label
              key={challenge.value}
              custom={index}
              variants={fadeInVariants}
              className={`
                relative flex items-start p-4 border rounded-lg cursor-pointer
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
                value={challenge.value}
                {...register('challenges')}
                className="sr-only peer"
              />
              
              {/* Checkbox visual */}
              <div className={`
                flex-shrink-0 w-5 h-5 rounded border-2 mr-3 mt-0.5
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

              {/* Content */}
              <div className="flex-1">
                <p className={`
                  text-sm font-medium transition-colors
                  ${isSelected ? 'text-violet-300' : 'text-slate-200'}
                `}>
                  {challenge.label}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {challenge.description}
                </p>
              </div>
            </motion.label>
          );
        })}
      </motion.div>

      {/* Helper text */}
      <motion.p variants={fadeInVariants} className="text-xs text-slate-500 text-center">
        {selectedChallenges.length > 0
          ? `${selectedChallenges.length} challenge${selectedChallenges.length > 1 ? 's' : ''} selected`
          : 'No challenges selected'}
      </motion.p>
    </motion.div>
  );
}
