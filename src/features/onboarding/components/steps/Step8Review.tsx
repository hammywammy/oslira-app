// src/features/onboarding/components/steps/Step8Review.tsx

/**
 * STEP 8: REVIEW & CONFIRM
 * 
 * Displays readonly summary of all inputs
 * Allows jumping back to edit specific sections
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

interface Step8ReviewProps {
  onEditStep: (step: number) => void;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function Step8Review({ onEditStep }: Step8ReviewProps) {
  const { getValues } = useFormContext<FormData>();
  const values = getValues();

  const sections = [
    {
      step: 1,
      title: 'Personal Information',
      items: [
        { label: 'Name', value: values.signature_name },
      ],
    },
    {
      step: 2,
      title: 'Business Details',
      items: [
        { label: 'Company', value: values.company_name },
        { label: 'Industry', value: values.industry === 'Other' ? values.industry_other : values.industry },
        { label: 'Size', value: values.company_size },
        { label: 'Website', value: values.website || 'Not provided' },
      ],
    },
    {
      step: 3,
      title: 'Goals',
      items: [
        { label: 'Objective', value: values.primary_objective?.replace('-', ' ') },
        { label: 'Monthly Target', value: `${values.monthly_lead_goal} leads` },
      ],
    },
    {
      step: 5,
      title: 'Target Audience',
      items: [
        { label: 'Follower Range', value: `${values.icp_min_followers?.toLocaleString()} - ${values.icp_max_followers?.toLocaleString()}` },
      ],
    },
    {
      step: 6,
      title: 'Communication',
      items: [
        { label: 'Channels', value: values.communication_channels?.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(', ') || 'None' },
        { label: 'Tone', value: values.communication_tone?.charAt(0).toUpperCase() + values.communication_tone?.slice(1) },
      ],
    },
    {
      step: 7,
      title: 'Team',
      items: [
        { label: 'Size', value: values.team_size?.replace('-', ' ') },
        { label: 'Manager', value: values.campaign_manager?.replace('-', ' ') },
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
      <motion.div variants={fadeInVariants} className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-white">
          Review & Confirm
        </h2>
        <p className="text-slate-400">
          Make sure everything looks good
        </p>
      </motion.div>

      {/* Review Sections */}
      <motion.div variants={fadeInVariants} className="space-y-3">
        {sections.map((section, index) => (
          <motion.div
            key={section.step}
            custom={index}
            variants={fadeInVariants}
            className="bg-slate-900/30 border border-slate-700/50 rounded-lg p-4"
          >
            {/* Section Header */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-violet-300">
                {section.title}
              </h3>
              <button
                type="button"
                onClick={() => onEditStep(section.step)}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-violet-400 transition-colors"
              >
                <Icon icon={ICONS.edit} className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>

            {/* Section Items */}
            <div className="space-y-2">
              {section.items.map((item) => (
                <div key={item.label} className="flex items-start">
                  <span className="text-xs text-slate-500 w-32 flex-shrink-0">
                    {item.label}
                  </span>
                  <span className="text-xs text-slate-200 flex-1">
                    {item.value || 'Not provided'}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Summary Sections */}
      <motion.div variants={fadeInVariants} className="space-y-3">
        {/* Business Description */}
        {values.business_summary && (
          <div className="bg-slate-900/30 border border-slate-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-violet-300">
                Business Description
              </h3>
              <button
                type="button"
                onClick={() => onEditStep(2)}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-violet-400 transition-colors"
              >
                <Icon icon={ICONS.edit} className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {values.business_summary}
            </p>
          </div>
        )}

        {/* Target Description */}
        {values.target_description && (
          <div className="bg-slate-900/30 border border-slate-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-violet-300">
                Target Audience Description
              </h3>
              <button
                type="button"
                onClick={() => onEditStep(5)}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-violet-400 transition-colors"
              >
                <Icon icon={ICONS.edit} className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {values.target_description}
            </p>
          </div>
        )}

        {/* Challenges */}
        {values.challenges && values.challenges.length > 0 && (
          <div className="bg-slate-900/30 border border-slate-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-violet-300">
                Challenges ({values.challenges.length})
              </h3>
              <button
                type="button"
                onClick={() => onEditStep(4)}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-violet-400 transition-colors"
              >
                <Icon icon={ICONS.edit} className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {values.challenges.map((challenge) => (
                <span
                  key={challenge}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-violet-500/10 text-violet-300 rounded text-xs"
                >
                  <Icon icon={ICONS.check} className="w-3 h-3" />
                  {challenge.replace('-', ' ')}
                </span>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Info box */}
      <motion.div
        variants={fadeInVariants}
        className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4"
      >
        <div className="flex gap-3">
          <Icon icon={ICONS.sparkles} className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-blue-300 font-medium mb-1">
              AI-Powered Personalization
            </p>
            <p className="text-xs text-blue-200/70">
              We'll use this information to personalize your experience and help you find the perfect leads.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
