/**
 * ============================================================================
 * FINAL CTA SECTION - OSLIRA PROFESSIONAL V2.0
 * ============================================================================
 * 
 * DESIGN PRINCIPLES:
 * - Professional urgency (not fake scarcity)
 * - Clear value proposition reinforcement
 * - Trust signals (no card required, cancel anytime)
 * - Clean gradient, minimal animation
 * 
 * COPY STRATEGY:
 * - Core promise: "Get back to writing"
 * - Proof: 25 free credits (real trial)
 * - Remove friction: No card, no commitment
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
    <section ref={ref} className="py-24 px-6 bg-muted">
      <div className="max-w-5xl mx-auto">
        
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={scaleIn}
          className="relative bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-600 rounded-2xl p-12 lg:p-16 text-center overflow-hidden"
        >
          
          {/* Subtle texture overlay */}
          <div className="absolute inset-0 opacity-[0.015]" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")',
          }} />

          {/* Content */}
          <div className="relative z-10 space-y-8">
            
            {/* Headline */}
            <motion.div variants={fadeIn}>
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                Ready to Get Back to Writing?
              </h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Join 500+ copywriters who stopped wasting time on prospecting. 
                Start with 25 free credits — no card required.
              </p>
            </motion.div>

            {/* CTA Button */}
            <motion.div variants={fadeIn}>
              <button
                onClick={handleGetStarted}
                className="inline-flex items-center gap-3 px-10 py-5 bg-white text-primary-600 font-bold text-lg rounded-lg hover:bg-neutral-50 transition-colors shadow-2xl"
              >
                <span>Get 25 Free Credits</span>
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
                { icon: 'mdi:check-circle', text: '25 free profile analyses' },
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
                <strong className="text-white">Time saved:</strong> 20 minutes → 60 seconds per prospect. {' '}
                <strong className="text-white">Cost:</strong> $30/month Pro plan vs. $80/month LinkedIn Sales Navigator. {' '}
                <strong className="text-white">Result:</strong> 15 hours saved every week.
              </p>
            </motion.div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}

export default FinalCTASection;
