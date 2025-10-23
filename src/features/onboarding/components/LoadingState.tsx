// src/features/onboarding/components/LoadingState.tsx

/**
 * LOADING STATE
 * 
 * Displayed during AI generation (Step 8)
 * Shows animated dots and rotating messages
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { loadingDotVariants } from '../animations/variants';

// =============================================================================
// CONSTANTS
// =============================================================================

const LOADING_MESSAGES = [
  'Analyzing your business profile...',
  'Identifying ideal prospects...',
  'Personalizing your workspace...',
  'Almost ready...',
];

// =============================================================================
// COMPONENT
// =============================================================================

export function LoadingState() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-12">
      {/* Animated dots */}
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            custom={i}
            variants={loadingDotVariants}
            animate="animate"
            className="w-2.5 h-2.5 bg-violet-500 rounded-full"
          />
        ))}
      </div>

      {/* Rotating messages */}
      <div className="h-6 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={messageIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-slate-300 text-center font-medium"
          >
            {LOADING_MESSAGES[messageIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Indeterminate progress bar */}
      <div className="w-64 h-1 bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-violet-500 to-purple-500"
          animate={{
            x: ['-100%', '200%'],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>
    </div>
  );
}
