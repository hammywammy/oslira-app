/**
 * @file Motion Box Component
 * @description Framer Motion wrapper for common animations
 */

import { motion, MotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface MotionBoxProps extends MotionProps {
  children: ReactNode;
  className?: string;
  animation?: 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scale' | 'rotate';
  duration?: number;
  delay?: number;
}

const animationPresets = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  slideLeft: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
  slideRight: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  },
  rotate: {
    initial: { opacity: 0, rotate: -10 },
    animate: { opacity: 1, rotate: 0 },
    exit: { opacity: 0, rotate: 10 },
  },
};

export function MotionBox({
  children,
  className = '',
  animation = 'fadeIn',
  duration = 0.3,
  delay = 0,
  ...motionProps
}: MotionBoxProps) {
  const preset = animationPresets[animation];

  return (
    <motion.div
      className={className}
      initial={preset.initial}
      animate={preset.animate}
      exit={preset.exit}
      transition={{ duration, delay }}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
}

export default MotionBox;
