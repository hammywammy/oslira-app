/**
 * COMING SOON PAGE - ELECTRIC BLUE WAVE GRADIENT
 * 
 * Simple, clean design with animated gradient background and CSS waves.
 * Light mode with electric blue (#00B8FF) as primary color.
 */

import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

// STYLES (Inline for portability)
const styles = `
  @keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  @keyframes wave {
    0% { transform: translateX(0) translateZ(0) scaleY(1); }
    50% { transform: translateX(-25%) translateZ(0) scaleY(0.8); }
    100% { transform: translateX(-50%) translateZ(0) scaleY(1); }
  }

  .animated-gradient {
    background: linear-gradient(
      -45deg,
      #00B8FF,
      #0090FF,
      #00D4FF,
      #0066FF
    );
    background-size: 400% 400%;
    animation: gradient 15s ease infinite;
  }

  .wave {
    background: rgba(255, 255, 255, 0.25);
    border-radius: 1000% 1000% 0 0;
    position: absolute;
    width: 200%;
    height: 12em;
    bottom: 0;
    left: 0;
    animation: wave 10s linear infinite;
    transform: translate3d(0, 0, 0);
  }

  .wave:nth-child(2) {
    bottom: -0.5em;
    animation: wave 18s linear reverse infinite;
    opacity: 0.8;
  }

  .wave:nth-child(3) {
    bottom: -1em;
    animation: wave 20s linear infinite;
    opacity: 0.6;
  }
`;

export function ComingSoonPage() {
  const navigate = useNavigate();

  return (
    <>
      {/* Inject styles */}
      <style>{styles}</style>

      <div className="animated-gradient min-h-screen relative overflow-hidden flex items-center justify-center">
        
        {/* Animated Waves */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="wave" />
          <div className="wave" />
          <div className="wave" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
          
          {/* Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Icon 
                icon="ph:rocket-launch-duotone" 
                className="w-10 h-10 text-white"
              />
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Coming Soon
          </motion.h1>

          {/* Message */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl text-white/90 mb-4"
          >
            We're working hard to bring you something amazing.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-base text-white/70 mb-12"
          >
            This feature is under development. Stay tuned!
          </motion.p>

          {/* Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <button
              onClick={() => navigate('/dashboard')}
              className="
                inline-flex items-center gap-3 px-8 py-4
                bg-white text-[#00B8FF] font-semibold text-lg
                rounded-xl shadow-lg
                hover:bg-white/90 hover:shadow-xl
                transition-all duration-300
              "
            >
              <Icon icon="ph:arrow-left" className="w-5 h-5" />
              Back to Dashboard
            </button>
          </motion.div>

          {/* Branding */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-16"
          >
            <span className="text-white/50 text-sm">Oslira</span>
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default ComingSoonPage;
