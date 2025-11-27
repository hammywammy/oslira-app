/**
 * ============================================================================
 * TESTIMONIALS SECTION - OSLIRA PROFESSIONAL B2B
 * ============================================================================
 *
 * Built for the People Who Carry the Pipeline
 * Solo operators, consultants, founder-led sales teams
 * ============================================================================
 */

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Icon } from '@iconify/react';

// DATA - B2B PERSONAS TESTIMONIALS
const testimonials = [
  {
    quote: "Running a solo agency means I wear every hat. Oslira gave me back 10+ hours a week by automating lead research. Now I can focus on delivery instead of hunting for the next client.",
    author: 'Marcus Chen',
    role: 'Solo Agency Owner',
    initials: 'MC',
    color: 'from-primary-500 to-primary-600',
    icon: 'mdi:briefcase'
  },
  {
    quote: "In cybersecurity consulting, trust is everything. Oslira helps me show up to every conversation knowing exactly what the prospect struggles with. No more cold outreach—just warm, relevant conversations.",
    author: 'Sarah Thompson',
    role: 'Cybersecurity Consultant',
    initials: 'ST',
    color: 'from-secondary-500 to-secondary-600',
    icon: 'mdi:shield-check'
  },
  {
    quote: "Before Oslira, we were losing 20% of revenue from missed follow-ups. The follow-up automation and pipeline intelligence eliminated that completely. Every hot lead gets the attention it deserves.",
    author: 'Kevin Rodriguez',
    role: 'Founder, B2B Services',
    initials: 'KR',
    color: 'from-success-500 to-success-600',
    icon: 'mdi:rocket-launch'
  }
];

// ANIMATION VARIANTS
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
            Built for the People Who Carry the Pipeline
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real results from solo operators, consultants, and founder-led sales teams
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
            { number: '1,400', label: 'Hours Saved/Year' },
            { number: '20%', label: 'Conversion Lift' },
            { number: 'Seconds', label: 'Not Minutes' },
            { number: '0', label: 'Missed Follow-Ups' }
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
