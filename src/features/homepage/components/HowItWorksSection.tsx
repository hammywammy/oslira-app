/**
 * ============================================================================
 * HOW IT WORKS SECTION - OSLIRA PROFESSIONAL B2B
 * ============================================================================
 *
 * The complete prospecting workflow from lead to close
 * Clear, actionable steps for B2B teams
 * ============================================================================
 */

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Icon } from '@iconify/react';

// =============================================================================
// DATA - HOW IT WORKS
// =============================================================================

const steps = [
  {
    number: '01',
    title: 'Add Leads',
    description: 'Import from your CRM, spreadsheet, or scrape directly from platforms.',
    icon: 'mdi:database-import',
    color: 'primary'
  },
  {
    number: '02',
    title: 'Oslira Analyzes',
    description: 'Scores intent, identifies activity, pulls context, and detects angles.',
    icon: 'mdi:brain',
    color: 'secondary'
  },
  {
    number: '03',
    title: 'Prioritize & Act',
    description: 'Focus only on the "hot" or "warm" list.',
    icon: 'mdi:fire',
    color: 'warning'
  },
  {
    number: '04',
    title: 'Execute Outreach',
    description: 'Email, DM, or call with context baked in.',
    icon: 'mdi:send',
    color: 'success'
  },
  {
    number: '05',
    title: 'Close With Confidence',
    description: 'Follow-ups handled. Notes organized. Pipeline visible.',
    icon: 'mdi:check-circle',
    color: 'primary'
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
      staggerChildren: 0.12
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
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From raw leads to closed deals in five clear steps
          </p>
        </motion.div>

        {/* =====================================================================
            STEPS GRID
            ===================================================================== */}

        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={stagger}
          className="space-y-8"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={fadeIn}
              className="relative"
            >
              {/* Desktop Layout */}
              <div className={`flex items-center gap-8 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>

                {/* Number Circle */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                    {step.number}
                  </div>
                </div>

                {/* Content Card */}
                <div className="flex-1 bg-card border border-border rounded-xl p-8 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-6">

                    {/* Icon */}
                    <div className={`flex-shrink-0 w-16 h-16 rounded-lg bg-${step.color}/10 flex items-center justify-center`}>
                      <Icon
                        icon={step.icon}
                        className={`text-3xl ${
                          step.color === 'primary' ? 'text-primary' :
                          step.color === 'secondary' ? 'text-secondary-600' :
                          step.color === 'warning' ? 'text-warning-600' :
                          step.color === 'success' ? 'text-success-600' :
                          'text-primary'
                        }`}
                      />
                    </div>

                    {/* Text Content */}
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-foreground mb-3">
                        {step.title}
                      </h3>
                      <p className="text-lg text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Connecting Line */}
              {index < steps.length - 1 && (
                <div className="flex justify-center my-4">
                  <Icon icon="mdi:chevron-down" className="text-3xl text-border" />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* =====================================================================
            BOTTOM CTA
            ===================================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-16 bg-primary/5 border border-primary/20 rounded-xl p-8 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Icon icon="mdi:rocket-launch" className="text-3xl text-primary" />
            <h3 className="text-2xl font-bold text-foreground">Ready to Build Your Pipeline?</h3>
          </div>
          <p className="text-muted-foreground max-w-3xl mx-auto mb-6">
            Stop wasting time on dead leads. Start closing more deals with intelligent prospecting.
          </p>
          <button
            onClick={() => window.location.href = '/auth/signup'}
            className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
          >
            Start Free
          </button>
        </motion.div>

      </div>
    </section>
  );
}

export default HowItWorksSection;
