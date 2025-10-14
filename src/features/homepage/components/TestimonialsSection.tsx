/**
 * @file Testimonials Section
 * @description Social proof testimonials - Elegant Professional Design
 * Path: src/features/homepage/components/TestimonialsSection.tsx
 */

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

// =============================================================================
// DATA
// =============================================================================

const testimonials = [
  {
    quote: "Oslira cut my prospecting time from 10 hours to under 2 hours per week. I'm landing 3x more clients with half the effort.",
    author: 'Marcus Johnson',
    role: 'Freelance Copywriter',
    initials: 'MJ',
    gradient: 'from-blue-500 to-cyan-600'
  },
  {
    quote: "The AI-generated outreach templates are shockingly good. My response rate jumped from 12% to 43% in the first month.",
    author: 'Sarah Park',
    role: 'B2B Copy Specialist',
    initials: 'SP',
    gradient: 'from-purple-500 to-pink-600'
  },
  {
    quote: "Finally, a tool that actually understands my niche. Oslira finds perfect-fit leads I would've missed manually.",
    author: 'Kevin Lee',
    role: 'SaaS Copywriter',
    initials: 'KL',
    gradient: 'from-green-500 to-emerald-600'
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
      staggerChildren: 0.15
    }
  }
};

// =============================================================================
// COMPONENT
// =============================================================================

export function TestimonialsSection() {
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
            Success{' '}
            <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
              Stories
            </span>
          </h2>
          <p className="text-xl lg:text-2xl text-slate-600 max-w-3xl mx-auto font-light">
            Real results from copywriters using Oslira
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={stagger}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={fadeIn}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="group"
            >
              <div className="h-full p-8 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-2xl hover:border-purple-300 
              hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500">
                
                {/* Quote */}
                <div className="mb-6">
                  <motion.svg 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`w-10 h-10 mb-4 bg-gradient-to-br ${testimonial.gradient} bg-clip-text text-transparent`}
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </motion.svg>
                  <p className="text-lg text-slate-700 leading-relaxed">
                    {testimonial.quote}
                  </p>
                </div>

                {/* Author */}
                <div className="flex items-center gap-4 pt-6 border-t border-blue-100">
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`w-12 h-12 bg-gradient-to-br ${testimonial.gradient} rounded-full flex items-center justify-center text-white font-bold shadow-lg`}
                    style={{ 
                      boxShadow: `0 10px 30px -12px ${
                        testimonial.gradient.includes('blue') ? 'rgba(59, 130, 246, 0.5)' :
                        testimonial.gradient.includes('purple') ? 'rgba(168, 85, 247, 0.5)' :
                        'rgba(34, 197, 94, 0.5)'
                      }`
                    }}
                  >
                    {testimonial.initials}
                  </motion.div>
                  <div>
                    <div className="font-bold text-slate-900">{testimonial.author}</div>
                    <div className="text-sm text-slate-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default TestimonialsSection;
