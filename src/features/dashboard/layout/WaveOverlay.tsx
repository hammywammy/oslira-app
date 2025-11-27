/**
 * WAVE OVERLAY
 * 
 * Subtle animated gradient background
 * Very low opacity - barely noticeable but adds depth
 * "Concert hall, not arcade" - elegant and restrained
 */

import { motion } from 'framer-motion';

export function WaveOverlay() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Gradient Blob 1 */}
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl"
      />

      {/* Gradient Blob 2 */}
      <motion.div
        animate={{
          x: [0, -30, 0],
          y: [0, 50, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
        className="absolute top-1/4 -right-40 w-96 h-96 bg-gradient-to-bl from-success/4 to-transparent rounded-full blur-3xl"
      />

      {/* Gradient Blob 3 */}
      <motion.div
        animate={{
          x: [0, 40, 0],
          y: [0, -40, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 4,
        }}
        className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-gradient-to-tr from-warning/3 to-transparent rounded-full blur-3xl"
      />
    </div>
  );
}
