// src/features/dashboard/components/LeadsTable/FitReasoningSection.tsx

/**
 * FIT REASONING SECTION COMPONENT
 *
 * Displays AI-generated reasoning for ICP fit assessment
 * Professional card design with emphasis on strategic insights
 */

import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

interface FitReasoningSectionProps {
  fitReasoning: string;
  leadTier?: 'hot' | 'warm' | 'cold';
}

function getTierColor(tier?: string) {
  switch (tier) {
    case 'hot':
      return {
        borderColor: 'border-emerald-500',
        bgColor: 'bg-emerald-50 dark:bg-emerald-900/10',
        textColor: 'text-emerald-700 dark:text-emerald-400',
        icon: 'mdi:fire',
      };
    case 'warm':
      return {
        borderColor: 'border-amber-500',
        bgColor: 'bg-amber-50 dark:bg-amber-900/10',
        textColor: 'text-amber-700 dark:text-amber-400',
        icon: 'mdi:thermometer-medium',
      };
    case 'cold':
      return {
        borderColor: 'border-blue-500',
        bgColor: 'bg-blue-50 dark:bg-blue-900/10',
        textColor: 'text-blue-700 dark:text-blue-400',
        icon: 'mdi:snowflake',
      };
    default:
      return {
        borderColor: 'border-gray-500',
        bgColor: 'bg-gray-50 dark:bg-gray-800/30',
        textColor: 'text-gray-700 dark:text-gray-400',
        icon: 'mdi:information',
      };
  }
}

export function FitReasoningSection({ fitReasoning, leadTier }: FitReasoningSectionProps) {
  const { borderColor, bgColor, textColor, icon } = getTierColor(leadTier);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`group rounded-lg border border-gray-200 dark:border-gray-800 ${bgColor} overflow-hidden transition-all duration-200 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-700`}
    >
      <div className={`border-l-4 ${borderColor} p-5`}>
        <h3 className={`flex items-center gap-2 text-xs font-semibold ${textColor} uppercase tracking-wide mb-3`}>
          <Icon icon={icon} className="w-4 h-4" />
          ICP Fit Assessment
          {leadTier && (
            <span className="ml-auto text-xs font-bold uppercase px-2 py-1 rounded-md bg-white/50 dark:bg-gray-900/50">
              {leadTier}
            </span>
          )}
        </h3>

        <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
          {fitReasoning}
        </p>
      </div>
    </motion.div>
  );
}
