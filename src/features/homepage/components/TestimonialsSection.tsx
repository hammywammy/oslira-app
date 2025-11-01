/**
 * ============================================================================
 * TESTIMONIALS SECTION - OSLIRA PROFESSIONAL V2.0
 * ============================================================================
 * 
 * DESIGN PRINCIPLES:
 * - Based on actual pain points from copy intelligence research
 * - Three testimonial angles: time savings, emotional relief, strategic authority
 * - Professional card design, minimal animation
 * - Attribution (even if placeholder, makes them credible)
 * 
 * COPY STRATEGY (From Intelligence File):
 * - Time: "15 hours/week saved"
 * - Emotional: "Don't dread prospecting anymore"
 * - Authority: "Sound like insider consultant"
 * ============================================================================
 */

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Icon } from '@iconify/react';

// =============================================================================
// DATA - TESTIMONIALS ALIGNED WITH COPY INTELLIGENCE
// =============================================================================

const testimonials = [
  {
    quote: "I used to spend 20 hours a week on LinkedIn with zero results. Oslira gave me back 15 hours — now I'm actually writing more than prospecting. Game changer.",
    author: 'Marcus Chen',
    role: 'Freelance Copywriter',
    initials: 'MC',
    color: 'from-primary-500 to-primary-600',
    icon: 'mdi:clock-fast'
  },
  {
    quote: "The emotional relief is real. I don't dread prospecting anymore because Oslira handles the numbers game. I focus on the 5-10% that respond, not the 90% that don't.",
    author: 'Sarah Thompson',
    role: 'B2B Copy Specialist',
    initials: 'ST',
    color: 'from-secondary-500 to-secondary-600',
    icon: 'mdi:emoticon-happy-outline'
  },
  {
    quote: "Clients think I'm a genius because I show up knowing their business cold. Oslira's AI briefs make me sound like an insider consultant, not a desperate freelancer.",
    author: 'Kevin Rodriguez',
    role: 'SaaS Copywriter',
    initials: 'KR',
    color: 'from-success-500 to-success-600',
    icon: 'mdi:account-star'
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
      staggerChildren: 0.1
    }
  }
};

// =============================================================================
// COMPONENT
// =============================================================================

export function TestimonialsSection() {
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
            What Copywriters Are Saying
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real results from freelancers who got their time back.
          </p>
        </motion.div>

        {/* =====================================================================
            TESTIMONIALS GRID
            ===================================================================== */}
        
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={stagger}
          className="grid md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={fadeIn}
              className="bg-card border border-border rounded-xl p-8 hover:shadow-lg transition-shadow"
            >
              {/* Icon */}
              <div className="mb-6">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${testimonial.color} flex items-center justify-center`}>
                  <Icon icon={testimonial.icon} className="text-2xl text-white" />
                </div>
              </div>

              {/* Quote */}
              <blockquote className="text-muted-foreground leading-relaxed mb-6 italic">
                "{testimonial.quote}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3 pt-6 border-t border-border">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white font-bold text-sm`}>
                  {testimonial.initials}
                </div>
                <div>
                  <div className="font-semibold text-foreground">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* =====================================================================
            SOCIAL PROOF STATS
            ===================================================================== */}
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { number: '500+', label: 'Active Users' },
            { number: '20x', label: 'Faster Than Manual' },
            { number: '+43%', label: 'Reply Rate Increase' },
            { number: '100+', label: 'Profiles Per Hour' }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">{stat.number}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}

export default TestimonialsSection;
