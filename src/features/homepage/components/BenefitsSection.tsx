/**
 * @file Benefits Section
 * @description Why copywriters choose Oslira - Elegant Professional Design
 * Path: src/features/homepage/components/BenefitsSection.tsx
 */

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Icon } from '@iconify/react';

// =============================================================================
// DATA
// =============================================================================

const benefits = [
  {
    icon: 'mdi:lightning-bolt-outline',
    title: '10x Faster Prospecting',
    description: 'Analyze 50+ Instagram profiles in the time it used to take for 5. Oslira instantly evaluates engagement, content quality, and business fit.',
    gradient: 'from-yellow-500 to-orange-600',
    iconColor: 'text-yellow-500'
  },
  {
    icon: 'mdi:target-variant',
    title: 'Smart Lead Scoring',
    description: 'AI grades each profile and highlights decision-makers who actually need your services. No more guessing who\'s a good fit.',
    gradient: 'from-green-500 to-emerald-600',
    iconColor: 'text-green-500'
  },
  {
    icon: 'mdi:message-text-outline',
    title: 'Personalized Outreach',
    description: 'Get tailored message templates for each lead. Oslira crafts opening lines based on their recent posts and business needs.',
    gradient: 'from-blue-500 to-cyan-600',
    iconColor: 'text-blue-500'
  },
  {
    icon: 'mdi:reload',
    title: 'Automated Follow-Ups',
    description: 'Never lose a warm lead again. Oslira tracks your outreach and reminds you when to follow up for maximum conversion.',
    gradient: 'from-purple-500 to-pink-600',
    iconColor: 'text-purple-500'
  },
  {
    icon: 'mdi:chart-line-variant',
    title: 'Track What Works',
    description: 'See which profiles convert best and refine your targeting. Built-in analytics show you exactly where to focus your efforts.',
    gradient: 'from-red-500 to-rose-600',
    iconColor: 'text-red-500'
  },
  {
    icon: 'mdi:rocket-launch-outline',
    title: 'Scale Without Burnout',
    description: 'Handle 3x more clients without sacrificing quality. Oslira handles the tedious research so you can focus on high-value work.',
    gradient: 'from-indigo-500 to-violet-600',
    iconColor: 'text-indigo-500'
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
      staggerChildren: 0.08
    }
  }
};

const cardHover = {
  rest: { y: 0 },
  hover: { 
    y: -8,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
  }
};

// =============================================================================
// COMPONENT
// =============================================================================

export function BenefitsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-32 px-6 bg-white">
      <div className="relative max-w-7xl mx-auto">
        
        {/* Section Header */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeIn}
          className="text-center mb-20"
        >
          <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Why Copywriters{' '}
            <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
              Choose Oslira
            </span>
          </h2>
          <p className="text-xl lg:text-2xl text-slate-600 max-w-3xl mx-auto font-light">
            Stop wasting time on manual research. Let AI do the heavy lifting.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={stagger}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={fadeIn}
              initial="rest"
              whileHover="hover"
              className="group"
            >
              <motion.div
                variants={cardHover}
                className="h-full p-8 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-2xl 
                hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 group-hover:bg-gradient-to-br group-hover:from-white group-hover:to-blue-50/30"
              >
                {/* Icon */}
                <motion.div 
                  whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                  className={`w-14 h-14 bg-gradient-to-br ${benefit.gradient} rounded-xl flex items-center justify-center mb-6 
                  shadow-lg shadow-${benefit.iconColor.split('-')[1]}-500/30 group-hover:shadow-xl group-hover:shadow-${benefit.iconColor.split('-')[1]}-500/40 transition-shadow duration-500`}
                >
                  <Icon icon={benefit.icon} className="text-3xl text-white" />
                </motion.div>

                {/* Title */}
                <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight">
                  {benefit.title}
                </h3>

                {/* Description */}
                <p className="text-slate-600 leading-relaxed">
                  {benefit.description}
                </p>

                {/* Subtle hover indicator */}
                <motion.div 
                  className={`mt-6 h-1 bg-gradient-to-r ${benefit.gradient} rounded-full origin-left`}
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default BenefitsSection;
