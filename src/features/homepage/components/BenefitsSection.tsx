/**
 * ============================================================================
 * BENEFITS SECTION - OSLIRA PROFESSIONAL V2.0
 * ============================================================================
 * 
 * DESIGN PRINCIPLES:
 * - Clean 3-column grid (professional, scannable)
 * - Data-driven benefits from copy intelligence
 * - Minimal animation (fade-in only, purposeful)
 * - Proper color usage (blue icons, neutral foundation)
 * 
 * COPY STRATEGY (From Intelligence File):
 * - Time savings: "20 minutes → 60 seconds"
 * - Rejection shield: "Emotional distance from failures"
 * - Strategic authority: "Sound like insider consultant"
 * ============================================================================
 */

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Icon } from '@iconify/react';

// =============================================================================
// DATA - REAL OSLIRA BENEFITS
// =============================================================================

const benefits = [
  {
    icon: 'mdi:clock-fast',
    title: '20x Faster Prospecting',
    description: 'Analyze 100+ Instagram profiles in parallel – in the time manual research takes for one. Oslira processes engagement patterns, content quality, and business fit in 30 seconds per lead.',
    stat: '30 sec',
    statLabel: 'per prospect'
  },
  {
    icon: 'mdi:target-variant',
    title: 'Comprehensive Lead Scoring',
    description: 'AI evaluates every aspect: engagement patterns, content themes, audience quality, posting consistency, and business signals. Then scores partnership fit against your ideal customer profile.',
    stat: '20+',
    statLabel: 'data points'
  },
  {
    icon: 'mdi:message-text-outline',
    title: 'Personalized Outreach',
    description: 'Get tailored message templates based on each lead\'s content, industry, and pain points. Sound like an insider consultant, not a cold caller.',
    stat: '+43%',
    statLabel: 'reply rate'
  },
  {
    icon: 'mdi:brain',
    title: 'Psychographic Profiling',
    description: 'X-Ray analysis reveals how prospects make decisions – data-driven or emotion-driven, cautious or aggressive. Customize your pitch to match their communication style.',
    stat: 'X-Ray',
    statLabel: 'exclusive'
  },
  {
    icon: 'mdi:shield-check',
    title: 'Partnership Viability',
    description: 'See budget signals, team stability, and growth trajectory before investing time. Filter out poor-fit prospects and focus on qualified leads.',
    stat: '5+',
    statLabel: 'signals'
  },
  {
    icon: 'mdi:database-outline',
    title: 'Built-In CRM',
    description: 'All your prospect intelligence in one searchable place. Tag leads, track analysis history, export to CSV. No spreadsheets needed.',
    stat: 'Zero',
    statLabel: 'spreadsheets'
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
            Why Copywriters Choose Oslira
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stop wasting time on manual research. Let AI do the heavy lifting.
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
              <p className="text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
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
            Ready to see the difference?
          </p>
          <button
            onClick={() => window.location.href = '/auth/signup'}
            className="px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors shadow-md"
          >
            Get Started Free
          </button>
        </motion.div>

      </div>
    </section>
  );
}

export default BenefitsSection;
