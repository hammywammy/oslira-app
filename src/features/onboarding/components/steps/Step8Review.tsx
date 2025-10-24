// src/features/onboarding/components/steps/Step8Review.tsx

/**
 * STEP 8: REVIEW & CONFIRM
 * 
 * Displays readonly summary of all inputs
 * Allows jumping back to edit specific sections
 * 
 * FIXED: Proper type assertions for all fields including monthly_lead_goal
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
        { label: 'Industry', value: values.industry === 'Other' 
          ? values.industry_other || 'Other' 
          : values.industry 
        },
        { label: 'Company Size', value: values.company_size },
        { label: 'Website', value: values.website || 'Not provided' },
      ],
    },
    {
      step: 3,
      title: 'Goals',
      items: [
        { 
          label: 'Primary Goal', 
          value: formatEnum(values.primary_objective as string | undefined) 
        },
        { 
          label: 'Monthly Lead Goal', 
          value: values.monthly_lead_goal?.toString() || 'Not specified' 
        },
      ],
    },
    {
      step: 4,
      title: 'Challenges',
      items: [
        { 
          label: 'Challenges', 
          value: formatChallenges(values.challenges as string[] | undefined) 
        },
      ],
    },
    {
      step: 5,
      title: 'Target Audience',
      items: [
        { label: 'Follower Range', value: `${values.icp_min_followers || 0} - ${values.icp_max_followers || 0}` },
        { 
          label: 'Company Sizes', 
          value: formatCompanySizes(values.target_company_sizes as string[] | undefined) 
        },
      ],
    },
    {
      step: 6,
      title: 'Communication',
      items: [
        { 
          label: 'Tone', 
          value: formatTone(values.communication_tone as string | undefined) 
        },
        { 
          label: 'Channels', 
          value: formatChannels(values.communication_channels as string[] | undefined) 
        },
      ],
    },
    {
      step: 7,
      title: 'Team',
      items: [
        { label: 'Team Size', value: formatEnum(values.team_size as string | undefined) },
        { label: 'Campaign Manager', value: formatEnum(values.campaign_manager as string | undefined) },
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
          Review Your Information
        </h2>
        <p className="text-slate-400 text-lg">
          Make sure everything looks correct before submitting
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
                <div key={item.label} className="flex justify-between items-start">
                  <span className="text-slate-400 text-sm">{item.label}</span>
                  <span className="text-white text-sm font-medium text-right max-w-[60%]">
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
          <Icon icon={ICONS.alertCircle} className="text-purple-400 text-xl flex-shrink-0 mt-0.5" />
          <div className="text-sm text-purple-200">
            <p className="font-medium mb-1">Ready to get started?</p>
            <p className="text-purple-300">
              Click "Complete Setup" to finish your onboarding and start prospecting.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
