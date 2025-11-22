/**
 * ============================================================================
 * FINAL CTA SECTION - OSLIRA PROFESSIONAL B2B
 * ============================================================================
 *
 * Build a pipeline that never leaks and never sleeps
 * Professional, outcome-focused call to action
 * ============================================================================
 */

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Icon } from '@iconify/react';

// =============================================================================
// ANIMATION VARIANTS
// =============================================================================

const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

// =============================================================================
// COMPONENT
// =============================================================================

export function FinalCTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const handleGetStarted = () => {
    window.location.href = '/auth/signup';
  };

  return (
    <section ref={ref} className="py-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto">

        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={scaleIn}
          className="relative bg-gradient-to-br from-primary-500 via-secondary-500 to-secondary-600 rounded-2xl p-12 lg:p-16 text-center overflow-hidden"
        >

          {/* Enhanced gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-secondary-400/20 to-secondary-500/30" />

          {/* Subtle texture overlay */}
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")',
          }} />

          {/* Content */}
          <div className="relative z-10 space-y-8">

            {/* Headline */}
            <motion.div variants={fadeIn}>
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                Build a Pipeline That Never Leaks and Never Sleeps
              </h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Prospecting clarity. Better conversations. More closed deals.
              </p>
            </motion.div>

            {/* CTA Button */}
            <motion.div variants={fadeIn}>
              <button
                onClick={handleGetStarted}
                className="inline-flex items-center gap-3 px-10 py-5 bg-white text-primary-600 font-bold text-lg rounded-lg hover:bg-neutral-50 transition-colors shadow-2xl"
              >
                <span>Start Free</span>
                <Icon icon="mdi:arrow-right" className="text-2xl" />
              </button>
            </motion.div>

            {/* Trust Signals */}
            <motion.div
              variants={fadeIn}
              className="flex flex-wrap justify-center gap-8 pt-6 text-white/90"
            >
              {[
                { icon: 'mdi:credit-card-off', text: 'No credit card required' },
                { icon: 'mdi:check-circle', text: 'Free tier available' },
                { icon: 'mdi:cancel', text: 'Cancel anytime' }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2"
                >
                  <Icon icon={feature.icon} className="text-xl" />
                  <span className="text-sm font-medium">{feature.text}</span>
                </div>
              ))}
            </motion.div>

            {/* Value Reinforcement */}
            <motion.div variants={fadeIn} className="pt-8 border-t border-white/20">
              <p className="text-white/80 text-sm max-w-2xl mx-auto">
                <strong className="text-white">Intent Clarity:</strong> Never waste time on dead leads. {' '}
                <strong className="text-white">Follow-up Automation:</strong> Never miss revenue from forgotten leads. {' '}
                <strong className="text-white">Outreach Intelligence:</strong> Every message lands with relevance.
              </p>
            </motion.div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}

export default FinalCTASection;
