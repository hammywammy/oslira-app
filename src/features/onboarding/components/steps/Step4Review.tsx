// src/features/onboarding/components/steps/Step4Review.tsx

/**
 * STEP 4: REVIEW & LAUNCH
 * 
 * Displays readonly summary of 3 steps
 * Allows editing any step before submission
 */

import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { ICONS } from '../../constants/icons';
import { fadeInVariants, containerVariants } from '../../animations/variants';
import { useFormContext } from 'react-hook-form';
import type { FormData } from '../../constants/validationSchemas';

// =============================================================================
// TYPES
// =============================================================================

interface Step4ReviewProps {
  onEditStep: (step: number) => void;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function formatCompanySizes(sizes?: string[]): string {
  if (!sizes || sizes.length === 0) return 'All sizes';
  return sizes
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join(', ');
}

function formatTone(tone?: string): string {
  if (!tone) return 'Not specified';
  return tone.charAt(0).toUpperCase() + tone.slice(1);
}

function truncateText(text: string, maxLength: number = 150): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

// =============================================================================
// COMPONENT
// =============================================================================

export function Step4Review({ onEditStep }: Step4ReviewProps) {
  const { getValues } = useFormContext<FormData>();
  const values = getValues();

  const sections = [
  {
    step: 1,
    title: 'Your Identity',
    items: [
      { label: 'Name', value: values.full_name },  // ✅ Changed from signature_name
    ],
  },
  {
    step: 2,
    title: 'Your Business',
    items: [
      { 
        label: 'Business Summary', 
        value: truncateText(values.business_summary || '', 200),
        fullValue: values.business_summary 
      },
      { label: 'Communication Tone', value: formatTone(values.communication_tone as string | undefined) },
    ],
  },
  {
    step: 3,
    title: 'Your Ideal Customer',
    items: [
      { 
        label: 'Target Description', 
        value: truncateText(values.target_description || '', 200),
        fullValue: values.target_description 
      },
      { 
        label: 'Follower Range', 
        value: `${values.icp_min_followers?.toLocaleString() || 0} - ${values.icp_max_followers?.toLocaleString() || 0}` 
      },
      { 
        label: 'Company Sizes', 
        value: formatCompanySizes(values.target_company_sizes as string[] | undefined) 
      },
    ],
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
      <motion.div variants={fadeInVariants} className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/20 mb-4">
          <Icon icon={ICONS.checkCircle} className="text-4xl text-purple-400" />
        </div>
        <h2 className="text-3xl font-bold text-white">
          You're All Set!
        </h2>
        <p className="text-slate-400 text-lg">
          Review your information before we get started
        </p>
      </motion.div>

      {/* Review Sections */}
      <motion.div variants={fadeInVariants} className="space-y-4">
        {sections.map((section) => (
          <div
            key={section.step}
            className="bg-slate-800/50 rounded-xl p-6 border border-slate-700"
          >
            {/* Section Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 text-sm">
                  {section.step}
                </span>
                {section.title}
              </h3>
              <button
                type="button"
                onClick={() => onEditStep(section.step)}
                className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
              >
                <Icon icon={ICONS.edit} />
                Edit
              </button>
            </div>

            {/* Section Items */}
            <div className="space-y-3">
              {section.items.map((item) => (
                <div key={item.label} className="flex flex-col gap-1">
                  <span className="text-slate-400 text-sm">{item.label}</span>
                  <span className="text-white text-sm">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Confirmation Message */}
      <motion.div
        variants={fadeInVariants}
        className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4"
      >
        <div className="flex gap-3">
          <Icon icon={ICONS.sparkles} className="text-purple-400 text-xl flex-shrink-0 mt-0.5" />
          <div className="text-sm text-purple-200">
            <p className="font-medium mb-1">Ready to find your ideal customers?</p>
            <p className="text-purple-300">
              Click "Complete Setup" to start prospecting on Instagram.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
