/**
 * @file Final CTA Section
 * @description Conversion-focused final call-to-action - Elegant Professional Design
 * Path: src/features/homepage/components/FinalCTASection.tsx
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
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

// =============================================================================
// COMPONENT
// =============================================================================

export function FinalCTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const handleGetStarted = () => {
    // Navigate to signup - replace with your routing logic
    window.location.href = '/auth/signup';
  };

  return (
    <section ref={ref} className="py-32 px-6 bg-slate-50">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={scaleIn}
          className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-violet-600 to-purple-600 rounded-3xl p-12 lg:p-16 text-center shadow-2xl shadow-blue-500/30"
        >
          {/* Animated gradient overlay */}
          <motion.div
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            style={{ backgroundSize: '200% 100%' }}
          />

          {/* Content */}
          <div className="relative z-10 space-y-8">
            <motion.div variants={fadeIn} className="space-y-6">
              <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
                Ready to 10x Your Prospecting?
              </h2>
              <p className="text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto font-light">
                Join 1,200+ copywriters who are landing more clients with less effort. 
                Start with 25 free credits — no card required.
              </p>
            </motion.div>

            <motion.div variants={fadeIn}>
              <motion.button
                onClick={handleGetStarted}
                whileHover={{ scale: 1.05, boxShadow: "0 25px 50px -12px rgba(255, 255, 255, 0.5)" }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-3 px-10 py-5 bg-white text-blue-600 font-bold text-lg rounded-xl 
                hover:bg-blue-50 transition-all duration-300 shadow-2xl shadow-white/20"
              >
                <span>Get Started Free</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Icon icon="mdi:arrow-right" className="text-2xl" />
                </motion.div>
              </motion.button>
            </motion.div>

            {/* Features List */}
            <motion.div 
              variants={fadeIn}
              className="flex flex-wrap justify-center gap-6 pt-6 text-white/90"
            >
              {[
                { icon: 'mdi:check-circle', text: '25 free profile analyses' },
                { icon: 'mdi:check-circle', text: 'No credit card needed' },
                { icon: 'mdi:check-circle', text: 'Cancel anytime' }
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2"
                >
                  <Icon icon={feature.icon} className="text-xl text-green-300" />
                  <span className="text-sm font-medium">{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default FinalCTASection;
