// src/features/onboarding/components/steps/Step4Review.tsx

/**
 * STEP 4: REVIEW & LAUNCH - LIGHT MODE REDESIGN
 * 
 * Clean review page with:
 * - Light backgrounds
 * - Primary blue and secondary purple accents
 * - Professional card-based layout
 */

import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useFormContext } from 'react-hook-form';
import type { FormData } from '@/features/onboarding/constants/validationSchemas';

interface Step4ReviewProps {
  onEditStep: (step: number) => void;
}

function formatCompanySizes(sizes?: string[]): string {
  if (!sizes || sizes.length === 0) return 'All company sizes';
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

export function Step4Review({ onEditStep }: Step4ReviewProps) {
  const { getValues } = useFormContext<FormData>();
  const values = getValues();

  const sections = [
    {
      step: 1,
      title: 'Your Identity',
      icon: 'ph:user',
      items: [
        { label: 'Name', value: values.full_name },
      ],
    },
    {
      step: 2,
      title: 'Your Business',
      icon: 'ph:buildings',
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
      icon: 'ph:target',
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
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 mb-4">
          <Icon icon="ph:check-circle" className="text-2xl text-primary-600" />
        </div>
        <h2 className="text-2xl font-semibold text-neutral-900 mb-2">
          You're all set!
        </h2>
        <p className="text-neutral-600">
          Review your information before we start finding leads
        </p>
      </div>

      {/* Review Sections */}
      <div className="space-y-4">
        {sections.map((section) => (
          <div
            key={section.step}
            className="bg-white border border-neutral-200 rounded-xl p-6"
          >
            {/* Section Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <Icon icon={section.icon} className="text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900">
                  {section.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onEditStep(section.step)}
                className="flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 transition-colors"
              >
                <Icon icon="ph:pencil" className="w-4 h-4" />
                Edit
              </button>
            </div>

            {/* Section Items */}
            <div className="space-y-3 pl-11">
              {section.items.map((item) => (
                <div key={item.label} className="flex flex-col gap-0.5">
                  <span className="text-sm text-neutral-500">{item.label}</span>
                  <span className="text-sm text-neutral-900 font-medium">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Ready Message */}
      <div className="bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200 rounded-xl p-5">
        <div className="flex gap-3">
          <Icon icon="ph:rocket-launch" className="text-primary-600 text-xl flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-neutral-900 mb-1">
              Ready to launch!
            </p>
            <p className="text-sm text-neutral-700">
              Click "Complete Setup" to start finding and analyzing Instagram leads that match your ideal customer profile.
            </p>
          </div>
        </div>
      </div>

      {/* Credit Bonus */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-100 text-secondary-700 rounded-full text-sm font-medium">
          <Icon icon="ph:sparkle" className="w-4 h-4" />
          <span>You'll start with 10 free analysis credits</span>
        </div>
      </div>
    </motion.div>
  );
}
