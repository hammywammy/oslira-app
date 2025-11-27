/**
 * REFINEMENT CALLOUT
 * 
 * Reduces user anxiety about perfection
 * Shows that fields can be refined later in Settings
 */

import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

export function RefinementCallout() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6"
    >
      <div className="flex gap-3">
        <Icon 
          icon="lucide:lightbulb" 
          className="text-blue-400 text-xl flex-shrink-0 mt-0.5" 
        />
        <div className="text-sm text-blue-200">
          <p className="font-medium mb-1">Don't stress perfection</p>
          <p className="text-blue-300">
            You can refine these in Settings anytime if your results need tweaking.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
