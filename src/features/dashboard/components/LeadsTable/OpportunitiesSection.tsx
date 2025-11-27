/**
 * OPPORTUNITIES SECTION COMPONENT
 *
 * Displays AI-generated partnership and engagement opportunities
 * Professional design highlighting potential value and strategic angles
 */

import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

interface OpportunitiesSectionProps {
  opportunities: string[];
}

export function OpportunitiesSection({ opportunities }: OpportunitiesSectionProps) {
  // Don't render if no opportunities
  if (!opportunities || opportunities.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="group rounded-lg border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/10 overflow-hidden transition-all duration-200 hover:shadow-md hover:border-purple-300 dark:hover:border-purple-700"
    >
      <div className="border-l-4 border-l-purple-500 p-5">
        <h3 className="flex items-center gap-2 text-xs font-semibold text-purple-700 dark:text-purple-400 uppercase tracking-wide mb-3">
          <Icon icon="mdi:lightbulb-on-outline" className="w-4 h-4" />
          Partnership Opportunities
        </h3>

        <ul className="space-y-2">
          {opportunities.map((opportunity, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300 leading-relaxed"
            >
              <Icon
                icon="mdi:arrow-right-circle"
                className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5"
              />
              <span>{opportunity}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
