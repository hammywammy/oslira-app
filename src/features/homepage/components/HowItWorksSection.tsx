/**
 * @file How It Works Section
 * @description Three-step process - Elegant Professional Design
 * Path: src/features/homepage/components/HowItWorksSection.tsx
 */

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

// =============================================================================
// DATA
// =============================================================================

const steps = [
  {
    number: '01',
    title: 'Paste Instagram Link',
    description: 'Drop any Instagram profile URL into Oslira. Our AI instantly analyzes their content, engagement patterns, and business indicators.',
    gradient: 'from-blue-500 to-cyan-600'
  },
  {
    number: '02',
    title: 'Get Smart Recommendations',
    description: 'Oslira scores the lead, highlights key insights, and suggests similar high-potential prospects. See exactly who needs your services most.',
    gradient: 'from-purple-500 to-pink-600'
  },
  {
    number: '03',
    title: 'Send Personalized Outreach',
    description: 'Use AI-generated message templates tailored to each lead. Copy, customize, and send - all in under 2 minutes per prospect.',
    gradient: 'from-green-500 to-emerald-600'
  }
];

// =============================================================================
// ANIMATION VARIANTS
// =============================================================================

const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const lineAnimation = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: { 
    pathLength: 1, 
    opacity: 1,
    transition: { duration: 1.5, ease: [0.22, 1, 0.36, 1] }
  }
};

// =============================================================================
// COMPONENT
// =============================================================================

export function HowItWorksSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-32 px-6 bg-gradient-to-b from-white via-purple-50/30 to-white overflow-hidden">
      {/* Animated gradient orb */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -100, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 right-0 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl"
      />

      <div className="relative max-w-7xl mx-auto">
        
        {/* Section Header */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeIn}
          className="text-center mb-20"
        >
          <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            How{' '}
            <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
              Oslira Works
            </span>
          </h2>
          <p className="text-xl lg:text-2xl text-slate-600 max-w-3xl mx-auto font-light">
            Three simple steps to transform your prospecting process
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={stagger}
          className="relative"
        >
          {/* Connection Line (Desktop) */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-px">
            <svg className="w-full h-2" viewBox="0 0 100 2" preserveAspectRatio="none">
              <motion.line
                x1="0"
                y1="1"
                x2="100"
                y2="1"
                stroke="#cbd5e1"
                strokeWidth="2"
                strokeDasharray="4 4"
                variants={lineAnimation}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
              />
            </svg>
          </div>

          <div className="grid lg:grid-cols-3 gap-12 lg:gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="relative"
              >
                <div className="flex flex-col items-center text-center">
                  {/* Step Number */}
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="relative z-10 w-20 h-20 mb-8 bg-gradient-to-br from-blue-600 via-violet-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/30"
                  >
                    <span className="text-2xl font-bold text-white">{step.number}</span>
                  </motion.div>

                  {/* Content */}
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-slate-900">
                      {step.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Mobile Connection Arrow */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center my-8">
                    <svg width="24" height="40" viewBox="0 0 24 40" fill="none">
                      <motion.path
                        d="M12 0L12 35M12 35L6 29M12 35L18 29"
                        stroke="#cbd5e1"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 + (index * 0.2), ease: [0.22, 1, 0.36, 1] }}
                      />
                    </svg>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default HowItWorksSection;
