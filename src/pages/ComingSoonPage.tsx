// src/pages/ComingSoonPage.tsx

/**
 * COMING SOON PAGE - ELEGANT PLACEHOLDER
 * 
 * Single reusable page for all features under development.
 * Features animated blue wave background matching Oslira brand.
 * 
 * USAGE:
 * All placeholder routes redirect here:
 * - /analytics → /coming-soon
 * - /campaigns → /coming-soon
 * - /messages → /coming-soon
 * - /integrations → /coming-soon
 * - /leads → /coming-soon (if not aliased to dashboard)
 * 
 * DESIGN:
 * - Animated gradient waves (your blue: #00B8FF)
 * - Centered content with subtle animations
 * - Professional, on-brand messaging
 * - Back to Dashboard CTA
 */

import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

// =============================================================================
// COMPONENT
// =============================================================================

export function ComingSoonPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950 flex items-center justify-center">
      
      {/* ================================================================
          ANIMATED WAVE BACKGROUND
      ================================================================ */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Wave Layer 1 - Slowest, back */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 150% 80% at 50% 120%, 
                rgba(0, 184, 255, 0.15) 0%, 
                rgba(0, 184, 255, 0.05) 40%, 
                transparent 70%
              )
            `,
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Wave Layer 2 - Medium speed */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 120% 60% at 30% 110%, 
                rgba(0, 184, 255, 0.2) 0%, 
                rgba(0, 150, 255, 0.1) 30%, 
                transparent 60%
              )
            `,
          }}
          animate={{
            x: ['-10%', '10%', '-10%'],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Wave Layer 3 - Fastest, front */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 100% 50% at 70% 105%, 
                rgba(0, 184, 255, 0.25) 0%, 
                rgba(0, 200, 255, 0.1) 25%, 
                transparent 50%
              )
            `,
          }}
          animate={{
            x: ['10%', '-10%', '10%'],
            y: ['0%', '-5%', '0%'],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Subtle top gradient */}
        <div 
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(180deg, 
                rgba(0, 184, 255, 0.03) 0%, 
                transparent 30%
              )
            `,
          }}
        />

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-cyan-400/30"
            style={{
              left: `${15 + i * 15}%`,
              bottom: '20%',
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 0.6, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.8,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* ================================================================
          CONTENT
      ================================================================ */}
      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        
        {/* Animated Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-8"
        >
          <motion.div
            className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center backdrop-blur-sm"
            animate={{
              boxShadow: [
                '0 0 30px rgba(0, 184, 255, 0.2)',
                '0 0 60px rgba(0, 184, 255, 0.4)',
                '0 0 30px rgba(0, 184, 255, 0.2)',
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Icon 
              icon="ph:rocket-launch-duotone" 
              className="w-12 h-12 text-cyan-400"
            />
          </motion.div>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl md:text-5xl font-bold text-white mb-6"
        >
          Coming Soon
        </motion.h1>

        {/* Message */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-xl md:text-2xl text-cyan-100/80 mb-4 font-light"
        >
          We're working hard to bring you something amazing.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-base text-slate-400 mb-12 max-w-md mx-auto"
        >
          This feature is currently under development and will be available soon. 
          Thank you for your patience.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <motion.button
            onClick={() => navigate('/dashboard')}
            className="
              inline-flex items-center gap-3 px-8 py-4
              bg-gradient-to-r from-cyan-500 to-blue-600
              hover:from-cyan-400 hover:to-blue-500
              text-white font-semibold text-lg
              rounded-xl shadow-lg shadow-cyan-500/25
              transition-all duration-300
            "
            whileHover={{ 
              scale: 1.02,
              boxShadow: '0 20px 40px rgba(0, 184, 255, 0.3)',
            }}
            whileTap={{ scale: 0.98 }}
          >
            <Icon icon="ph:arrow-left" className="w-5 h-5" />
            Back to Dashboard
          </motion.button>
        </motion.div>

        {/* Subtle branding */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-16"
        >
          <span className="text-slate-600 text-sm">
            Oslira
          </span>
        </motion.div>
      </div>
    </div>
  );
}

export default ComingSoonPage;
