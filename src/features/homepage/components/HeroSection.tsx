/**
 * ============================================================================
 * HERO SECTION - OSLIRA PROFESSIONAL B2B
 * ============================================================================
 *
 * The Prospecting Engine for Small Teams and Solo Operators
 * Professional, enterprise-grade, outcome-first positioning
 * Clean, centered layout without interactive demo
 * ============================================================================
 */

import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

// ANIMATION VARIANTS
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
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
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export function HeroSection() {
  const handleGetStarted = () => {
    window.location.href = '/auth/signup';
  };

  const handleWatchDemo = () => {
    // Scroll to benefits section or open demo video
    const benefitsSection = document.querySelector('[data-section="benefits"]');
    benefitsSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 pt-32 pb-24 overflow-hidden bg-gradient-to-br from-primary-500 via-secondary-500 to-secondary-600">

      {/* Enhanced gradient overlay for depth and purple prominence */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-secondary-400/20 to-secondary-500/30" />

      {/* Subtle animated mesh gradient */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(139, 127, 199, 0.4) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(0, 184, 255, 0.3) 0%, transparent 50%)',
            backgroundSize: '200% 200%'
          }}
        />
      </div>

      {/* Subtle noise texture */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")',
      }} />

      <div className="relative max-w-5xl mx-auto w-full text-center">

        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="space-y-8"
        >
          {/* Badge */}
          <motion.div variants={fadeIn}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <Icon icon="mdi:lightning-bolt" className="text-white text-lg" />
              <span className="text-white/90 text-sm font-medium">The Prospecting Engine for Small Teams</span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.div variants={fadeIn}>
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight max-w-4xl mx-auto">
              Turn Raw Leads Into Revenue With Intelligent Outbound
            </h1>
          </motion.div>

          {/* Subheadline */}
          <motion.div variants={fadeIn}>
            <p className="text-xl lg:text-2xl text-white/80 leading-relaxed max-w-3xl mx-auto">
              Oslira analyzes buyers, scores intent, and gives you the exact reason to reach out—so you never waste time on dead leads or miss a serious one again.
            </p>
          </motion.div>

          {/* Value Props */}
          <motion.div variants={fadeIn} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto pt-8">
            {[
              { icon: 'mdi:clock-fast', text: 'Cuts research time from minutes to seconds' },
              { icon: 'mdi:chart-line', text: 'Raises conversions by eliminating missed follow-ups' },
              { icon: 'mdi:message-text-outline', text: 'Clear outreach angles from real engagement data' },
              { icon: 'mdi:account-group', text: 'Built for agencies, consultants, and sales teams' }
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center gap-3 p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Icon icon={item.icon} className="text-white text-xl" />
                </div>
                <span className="text-white/90 text-center text-sm leading-relaxed">{item.text}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <button
              onClick={handleGetStarted}
              className="px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg hover:bg-neutral-50 transition-colors shadow-lg text-lg"
            >
              Start Free
            </button>
            <button
              onClick={handleWatchDemo}
              className="px-8 py-4 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/20 text-lg"
            >
              See How It Works
            </button>
          </motion.div>

          {/* Social Proof */}
          <motion.div variants={fadeIn} className="pt-12 border-t border-white/20 max-w-2xl mx-auto">
            <div className="grid grid-cols-3 gap-8">
              <div className="text-white/80 text-center">
                <div className="font-semibold text-white text-2xl mb-1">1,400</div>
                <div className="text-sm">Hours Saved/Year</div>
              </div>
              <div className="text-white/80 text-center">
                <div className="font-semibold text-white text-2xl mb-1">20%</div>
                <div className="text-sm">Conversion Lift</div>
              </div>
              <div className="text-white/80 text-center">
                <div className="font-semibold text-white text-2xl mb-1">Seconds</div>
                <div className="text-sm">Not Minutes</div>
              </div>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}

export default HeroSection;
