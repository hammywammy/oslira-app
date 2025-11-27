/**
 * RECOMMENDED ACTIONS SECTION COMPONENT
 *
 * Displays AI-generated action items and next steps
 * Professional design with clear, actionable guidance
 */

import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

interface RecommendedActionsSectionProps {
  recommendedActions: string[];
}

export function RecommendedActionsSection({
  recommendedActions,
}: RecommendedActionsSectionProps) {
  // Don't render if no actions
  if (!recommendedActions || recommendedActions.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="group rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/10 overflow-hidden transition-all duration-200 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700"
    >
      <div className="border-l-4 border-l-blue-500 p-5">
        <h3 className="flex items-center gap-2 text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wide mb-3">
          <Icon icon="mdi:clipboard-check-outline" className="w-4 h-4" />
          Recommended Next Steps
        </h3>

        <ul className="space-y-2">
          {recommendedActions.map((action, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300 leading-relaxed"
            >
              <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-semibold shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <span>{action}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
