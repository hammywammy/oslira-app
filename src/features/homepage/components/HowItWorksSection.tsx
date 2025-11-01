/**
 * ============================================================================
 * HOW IT WORKS SECTION - OSLIRA PROFESSIONAL V2.0
 * ============================================================================
 * 
 * DESIGN PRINCIPLES:
 * - Actual Oslira workflow (paste URL → choose tier → get intelligence)
 * - Clean 3-step visualization
 * - Minimal animation (fade-in + subtle line draw)
 * - Professional color usage
 * 
 * COPY STRATEGY:
 * - Real product steps, not generic "sign up → use → profit"
 * - Highlight three-tier system (Light/Deep/X-Ray)
 * - Emphasize speed and intelligence quality
 * ============================================================================
 */

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Icon } from '@iconify/react';

// =============================================================================
// DATA - ACTUAL OSLIRA WORKFLOW
// =============================================================================

const steps = [
  {
    number: '01',
    title: 'Paste Instagram URL',
    description: 'Drop any Instagram business profile URL into Oslira. Our AI instantly begins analyzing engagement patterns, content themes, and commercial signals to assess partnership fit.',
    icon: 'mdi:link-variant',
    color: 'primary'
  },
  {
    number: '02',
    title: 'Choose Analysis Depth',
    description: 'Select Light for quick filtering, Deep for comprehensive profiling, or X-Ray for complete business intelligence with psychographic analysis and personalized outreach messages.',
    icon: 'mdi:layers-triple',
    color: 'secondary'
  },
  {
    number: '03',
    title: 'Get Lead Intelligence',
    description: 'Receive engagement scoring, partnership viability assessment, content analysis, and ready-to-send personalized outreach – all in 30 seconds.',
    icon: 'mdi:sparkles',
    color: 'success'
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
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

// =============================================================================
// COMPONENT
// =============================================================================

export function HowItWorksSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="py-24 px-6 bg-neutral-50">
      <div className="max-w-7xl mx-auto">
        
        {/* =====================================================================
            SECTION HEADER
            ===================================================================== */}
        
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeIn}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            How Oslira Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Three steps to qualified leads. No guesswork, no spreadsheets.
          </p>
        </motion.div>

        {/* =====================================================================
            STEPS TIMELINE
            ===================================================================== */}
        
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={stagger}
          className="relative"
        >
          {/* Connection Lines (Desktop) */}
          <div className="hidden lg:block absolute top-16 left-0 right-0 h-0.5 bg-border" 
               style={{ 
                 left: 'calc(16.666% + 3rem)', 
                 right: 'calc(16.666% + 3rem)' 
               }} 
          />

          {/* Steps Grid */}
          <div className="grid lg:grid-cols-3 gap-12 lg:gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="relative"
              >
                {/* Mobile Connection Arrow */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center my-8">
                    <Icon icon="mdi:chevron-down" className="text-3xl text-border" />
                  </div>
                )}

                {/* Step Card */}
                <div className="relative bg-card border border-border rounded-xl p-8">
                  
                  {/* Step Number Circle */}
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg shadow-lg z-10">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="mt-4 mb-6 flex justify-center">
                    <div className={`w-16 h-16 rounded-lg bg-${step.color}/10 flex items-center justify-center`}>
                      <Icon 
                        icon={step.icon} 
                        className={`text-3xl ${
                          step.color === 'primary' ? 'text-primary' :
                          step.color === 'secondary' ? 'text-secondary-600' :
                          'text-success-600'
                        }`} 
                      />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-foreground mb-4 text-center">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed text-center">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* =====================================================================
            FEATURE CALLOUT
            ===================================================================== */}
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-16 bg-primary/5 border border-primary/20 rounded-xl p-8 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Icon icon="mdi:lightning-bolt" className="text-3xl text-primary" />
            <h3 className="text-2xl font-bold text-foreground">Three-Tier Intelligence</h3>
          </div>
          <p className="text-muted-foreground max-w-3xl mx-auto mb-6">
            Not every prospect deserves deep research. Filter 100 profiles quickly with Light analysis, 
            then invest time in comprehensive Deep analysis for strong prospects, 
            then get complete X-Ray intelligence on your top candidates – complete with psychographic profiling and personalized outreach.
          </p>
          <button
            onClick={() => window.location.href = '/auth/signup'}
            className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Light Analysis Free
          </button>
        </motion.div>

      </div>
    </section>
  );
}

export default HowItWorksSection;
