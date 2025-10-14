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
    initials: 'MJ'
  },
  {
    quote: "The AI-generated outreach templates are shockingly good. My response rate jumped from 12% to 43% in the first month.",
    author: 'Sarah Park',
    role: 'B2B Copy Specialist',
    initials: 'SP'
  },
  {
    quote: "Finally, a tool that actually understands my niche. Oslira finds perfect-fit leads I would've missed manually.",
    author: 'Kevin Lee',
    role: 'SaaS Copywriter',
    initials: 'KL'
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
    <section ref={ref} className="relative py-32 px-6 bg-gradient-to-b from-white via-pink-50/20 to-white overflow-hidden">
      {/* Animated background */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, -45, 0],
        }}
        transition={{ duration: 35, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-r from-pink-200/20 via-purple-200/20 to-blue-200/20 rounded-full blur-3xl"
      />

      <div className="relative max-w-7xl mx-auto">
        
        {/* Section Header */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeIn}
          className="text-center mb-20"
        >
          <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Success Stories
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
              <div className="h-full p-8 bg-white border border-slate-200 rounded-2xl hover:border-slate-300 
              hover:shadow-xl hover:shadow-slate-900/5 transition-all duration-500">
                
                {/* Quote */}
                <div className="mb-6">
                  <svg className="w-10 h-10 text-slate-300 mb-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <p className="text-lg text-slate-700 leading-relaxed">
                    {testimonial.quote}
                  </p>
                </div>

                {/* Author */}
                <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                  <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.initials}
                  </div>
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
