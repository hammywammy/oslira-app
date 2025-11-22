/**
 * ============================================================================
 * BENEFITS SECTION - WHAT OSLIRA SOLVES
 * ============================================================================
 *
 * A Precise, Fast, and Predictable Prospecting System
 * Feature → Outcome focused, enterprise B2B positioning
 * ============================================================================
 */

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Icon } from '@iconify/react';

// =============================================================================
// DATA - WHAT OSLIRA SOLVES
// =============================================================================

const benefits = [
  {
    icon: 'mdi:flash',
    title: 'Instant Lead Research',
    description: 'Surfaces company info, social activity, and key buyer signals instantly.',
    outcome: 'Spend seconds, not minutes, preparing every outreach.',
    stat: 'Seconds',
    statLabel: 'not minutes'
  },
  {
    icon: 'mdi:chart-timeline-variant',
    title: 'AI Lead Scoring',
    description: 'Scores intent based on engagement, ICP fit, and recent activity.',
    outcome: 'Reps focus on the warmest prospects and stop guessing.',
    stat: '100%',
    statLabel: 'clarity'
  },
  {
    icon: 'mdi:bullseye-arrow',
    title: 'Engagement Insights & Outreach Angles',
    description: 'Finds what the lead posted, discussed, or struggled with recently.',
    outcome: 'Every message lands with relevance.',
    stat: '+20%',
    statLabel: 'conversion'
  },
  {
    icon: 'mdi:calendar-clock',
    title: 'Follow-up Automation',
    description: 'Integrated reminders and sequences.',
    outcome: 'Never lose revenue because someone forgot.',
    stat: '0',
    statLabel: 'missed deals'
  },
  {
    icon: 'mdi:pipeline',
    title: 'Pipeline Intelligence',
    description: 'Centralizes signals, notes, and actions.',
    outcome: 'See what's working, where deals stall, and where to focus.',
    stat: 'Full',
    statLabel: 'visibility'
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
      staggerChildren: 0.08
    }
  }
};

// =============================================================================
// COMPONENT
// =============================================================================

export function BenefitsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="py-24 px-6 bg-white">
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
            A Precise, Fast, and Predictable Prospecting System
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Oslira connects research, scoring, and outreach into one clean workflow.
          </p>
        </motion.div>

        {/* =====================================================================
            BENEFITS GRID
            ===================================================================== */}

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
              className="group bg-card border border-border rounded-xl p-8 hover:shadow-lg hover:border-primary/30 transition-all duration-300"
            >
              {/* Icon + Stat */}
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Icon icon={benefit.icon} className="text-2xl text-primary" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{benefit.stat}</div>
                  <div className="text-xs text-muted-foreground">{benefit.statLabel}</div>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {benefit.title}
              </h3>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed mb-3">
                {benefit.description}
              </p>

              {/* Outcome */}
              <div className="pt-3 border-t border-border">
                <p className="text-sm font-medium text-foreground">
                  → {benefit.outcome}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* =====================================================================
            BOTTOM CTA
            ===================================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-muted-foreground mb-6">
            Build a pipeline that never leaks and never sleeps.
          </p>
          <button
            onClick={() => window.location.href = '/auth/signup'}
            className="px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors shadow-md"
          >
            Start Free
          </button>
        </motion.div>

      </div>
    </section>
  );
}

export default BenefitsSection;
