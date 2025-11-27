/**
 * FRAMER MOTION VARIANTS
 * 
 * Subtle, professional animations for onboarding flow
 * - No bounce/spring physics
 * - No excessive scale effects
 * - Clean easing curves
 */

// STEP TRANSITION (HORIZONTAL SLIDE)
export const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 40 : -40,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 40 : -40,
    opacity: 0,
  }),
};

export const slideTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.3,
};

// FADE IN (FOR FORM FIELDS)
export const fadeInVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: (index: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: 'easeOut',
      delay: index * 0.04,
    },
  }),
};

// PROGRESS BAR
export const progressVariants = {
  initial: { scaleX: 0 },
  animate: {
    scaleX: 1,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

// BUTTON HOVER
export const buttonHover = {
  scale: 1.02,
  transition: { duration: 0.2, ease: 'easeOut' },
};

export const buttonTap = {
  scale: 0.98,
  transition: { duration: 0.1 },
};

// ERROR MESSAGE
export const errorVariants = {
  hidden: { opacity: 0, y: -4, height: 0 },
  visible: {
    opacity: 1,
    y: 0,
    height: 'auto',
    transition: { duration: 0.2, ease: 'easeOut' },
  },
};

// LOADING DOTS
export const loadingDotVariants = {
  animate: (index: number) => ({
    scale: [1, 1.3, 1],
    opacity: [0.4, 1, 0.4],
    transition: {
      duration: 1.2,
      repeat: Infinity,
      delay: index * 0.15,
      ease: 'easeInOut',
    },
  }),
};

// CONTAINER
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
    },
  },
};
