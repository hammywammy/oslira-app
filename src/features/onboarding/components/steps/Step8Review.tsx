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
// HELPER FUNCTIONS
// =============================================================================

function formatChallenges(challenges?: string[]): string {
  if (!challenges || challenges.length === 0) return 'None selected';
  return challenges.map(c => c.replace(/-/g, ' ')).join(', ');
}

function formatChannels(channels?: string[]): string {
  if (!channels || channels.length === 0) return 'None';
  return channels.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(', ');
}

function formatCompanySizes(sizes?: string[]): string {
  if (!sizes || sizes.length === 0) return 'All sizes';
  return sizes.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ');
}

function formatTone(tone?: string): string {
  if (!tone) return 'Not specified';
  return tone.charAt(0).toUpperCase() + tone.slice(1);
}

function formatEnum(value?: string): string {
  if (!value) return 'Not specified';
  return value.replace(/-/g, ' ');
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
        { label: 'Objective', value: formatEnum(values.primary_objective) },
        { label: 'Monthly Target', value: `${values.monthly_lead_goal} leads` },
      ],
    },
    {
      step: 4,
      title: 'Challenges',
      items: [
        { 
          label: 'Selected Challenges', 
          value: formatChallenges(values.challenges)
        },
      ],
    },
    {
      step: 5,
      title: 'Target Audience',
      items: [
        { label: 'Description', value: values.target_description?.substring(0, 60) + '...' },
        { label: 'Follower Range', value: `${values.icp_min_followers?.toLocaleString()} - ${values.icp_max_followers?.toLocaleString()}` },
        { 
          label: 'Company Sizes', 
          value: formatCompanySizes(values.target_company_sizes)
        },
      ],
    },
    {
      step: 6,
      title: 'Communication',
      items: [
        { 
          label: 'Channels', 
          value: formatChannels(values.communication_channels)
        },
        { label: 'Tone', value: formatTone(values.communication_tone) },
      ],
    },
    {
      step: 7,
      title: 'Team',
      items: [
        { label: 'Size', value: formatEnum(values.team_size) },
        { label: 'Manager', value: formatEnum(values.campaign_manager) },
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
      <motion.div variants={fadeInVariants} className="space-y-4 max-h-[380px] overflow-y-auto">
        {sections.map((section) => (
          <div
            key={section.step}
            className="bg-slate-800/50 rounded-xl p-4 border border-slate-700"
          >
            {/* Section Header */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-white">
                {section.title}
              </h3>
              <button
                type="button"
                onClick={() => onEditStep(section.step)}
                className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
              >
                <Icon icon={ICONS.edit} className="text-base" />
                Edit
              </button>
            </div>

            {/* Section Items */}
            <div className="space-y-2">
              {section.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-slate-400">{item.label}:</span>
                  <span className="text-white font-medium text-right max-w-[60%]">
                    {item.value || 'Not provided'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Confirmation Note */}
      <motion.div
        variants={fadeInVariants}
        className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4"
      >
        <div className="flex gap-3">
          <Icon icon={ICONS.sparkles} className="text-2xl text-purple-400 flex-shrink-0" />
          <div className="text-sm text-slate-300">
            <p className="font-semibold text-white mb-1">Ready to launch?</p>
            <p>
              We'll use this information to create your personalized business profile.
              This takes about 10-15 seconds.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
