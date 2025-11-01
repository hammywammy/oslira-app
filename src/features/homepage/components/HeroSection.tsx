/**
 * ============================================================================
 * HERO SECTION - OSLIRA PROFESSIONAL V2.1 (FINAL)
 * ============================================================================
 * 
 * UPDATES:
 * - Stronger purple gradient (more visible, professional)
 * - Upgraded demo card (better elevation, glow, depth)
 * - Enhanced visual polish
 * - All white/light backgrounds only
 * 
 * COLOR STRATEGY:
 * - Primary Blue → Secondary Purple gradient (50/50 blend)
 * - Purple more prominent but still professional
 * - Demo card has subtle glow effect
 * ============================================================================
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

// =============================================================================
// TYPES
// =============================================================================

interface AnalysisDemo {
  username: string;
  score: number;
  niche: string;
  followers: string;
  signals: string[];
}

// =============================================================================
// ANIMATION VARIANTS
// =============================================================================

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

// =============================================================================
// COMPONENT
// =============================================================================

export function HeroSection() {
  const [username, setUsername] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisDemo | null>(null);

  // ===========================================================================
  // HANDLERS
  // ===========================================================================
  
  const handleAnalysis = async () => {
    const cleanUsername = username.trim().replace('@', '');
    
    if (!cleanUsername) return;

    setIsAnalyzing(true);
    setResult(null);

    await new Promise(resolve => setTimeout(resolve, 1500));

    const demoData: AnalysisDemo = {
      username: cleanUsername,
      score: Math.floor(Math.random() * 25 + 70),
      niche: 'Content Creator',
      followers: `${(Math.random() * 50 + 5).toFixed(1)}K`,
      signals: [
        'High engagement rate',
        'Business-focused content',
        'Active in last 7 days'
      ]
    };

    setResult(demoData);
    setIsAnalyzing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isAnalyzing) {
      handleAnalysis();
    }
  };

  const handleGetStarted = () => {
    window.location.href = '/auth/signup';
  };

  // ===========================================================================
  // RENDER
  // ===========================================================================

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
      
      {/* Subtle noise texture (OpenAI-style) */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")',
      }} />

      <div className="relative max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* ===================================================================
              LEFT COLUMN - VALUE PROPOSITION
              =================================================================== */}
          
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
                <span className="text-white/90 text-sm font-medium">AI-Powered Instagram Prospecting</span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.div variants={fadeIn}>
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight">
                Stop Prospecting.
                <br />
                <span className="text-white/90">Start Writing.</span>
              </h1>
            </motion.div>

            {/* Subheadline */}
            <motion.div variants={fadeIn}>
              <p className="text-xl lg:text-2xl text-white/80 leading-relaxed">
                Oslira automates Instagram prospecting so copywriters spend{' '}
                <span className="font-semibold text-white">90% of their time writing</span>, not selling.
              </p>
            </motion.div>

            {/* Value Props */}
            <motion.div variants={fadeIn} className="space-y-4">
              {[
                { icon: 'mdi:clock-fast', text: '30 seconds per prospect – 20x faster than manual' },
                { icon: 'mdi:brain', text: 'Comprehensive AI analysis of business fit, not just follower count' },
                { icon: 'mdi:message-text', text: 'Personalized outreach messages tailored to each lead' }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                    <Icon icon={item.icon} className="text-white text-sm" />
                  </div>
                  <span className="text-white/90">{item.text}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={handleGetStarted}
                className="px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg hover:bg-neutral-50 transition-colors shadow-lg"
              >
                Get 25 Free Credits
              </button>
              <button
                onClick={() => {
                  const demoEl = document.getElementById('demo-input');
                  demoEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
                className="px-8 py-4 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/20"
              >
                See Demo
              </button>
            </motion.div>

            {/* Social Proof */}
            <motion.div variants={fadeIn} className="pt-6 border-t border-white/20">
              <div className="flex items-center gap-6">
                <div className="text-white/80 text-sm">
                  <div className="font-semibold text-white text-lg">100+</div>
                  <div>Profiles/Hour</div>
                </div>
                <div className="text-white/80 text-sm">
                  <div className="font-semibold text-white text-lg">20x</div>
                  <div>Faster</div>
                </div>
                <div className="text-white/80 text-sm">
                  <div className="font-semibold text-white text-lg">+43%</div>
                  <div>Reply Rate Increase</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* ===================================================================
              RIGHT COLUMN - UPGRADED DEMO CARD
              =================================================================== */}
          
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            className="relative"
          >
            {/* Glow effect behind card */}
            <div className="absolute -inset-4 bg-gradient-to-br from-white/40 via-secondary-300/40 to-primary-300/40 rounded-3xl blur-2xl opacity-60" />
            
            <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-white/50">
              
              {/* Demo Header - macOS style */}
              <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-200">
                <div className="flex items-center gap-2">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-error-500"></div>
                    <div className="w-3 h-3 rounded-full bg-warning-500"></div>
                    <div className="w-3 h-3 rounded-full bg-success-500"></div>
                  </div>
                  <div className="ml-4 text-sm text-neutral-600 font-mono">app.oslira.com</div>
                </div>
              </div>

              {/* Demo Content */}
              <div className="p-8 space-y-6 bg-gradient-to-br from-white to-neutral-50/30">
                
                <div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">Try it yourself</h3>
                  <p className="text-neutral-600 text-sm">Paste any Instagram username to see Oslira's analysis</p>
                </div>

                {/* Input with better styling */}
                <div id="demo-input" className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-500">
                    <Icon icon="mdi:instagram" className="text-xl" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="@username"
                    className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-neutral-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none transition-all text-neutral-900 placeholder-neutral-400 shadow-sm"
                  />
                </div>

                <button
                  onClick={handleAnalysis}
                  disabled={!username.trim() || isAnalyzing}
                  className="w-full py-3.5 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30"
                >
                  {isAnalyzing ? (
                    <span className="flex items-center justify-center gap-2">
                      <Icon icon="mdi:loading" className="animate-spin" />
                      Analyzing...
                    </span>
                  ) : (
                    'Analyze Profile'
                  )}
                </button>

                {/* Demo Result */}
                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4 pt-4 border-t border-neutral-200"
                  >
                    {/* Score */}
                    <div className="flex items-center justify-between p-4 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg border border-primary-100">
                      <div>
                        <div className="text-sm text-neutral-600 mb-1">Lead Score</div>
                        <div className="font-bold text-neutral-900">@{result.username}</div>
                        <div className="text-xs text-neutral-500 mt-1">{result.niche} • {result.followers}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-4xl font-bold bg-gradient-to-br from-primary-600 to-secondary-600 bg-clip-text text-transparent">{result.score}%</div>
                        <div className="text-xs text-neutral-500 font-medium">Partnership Fit</div>
                      </div>
                    </div>

                    {/* Signals */}
                    <div className="space-y-2">
                      <div className="text-sm font-semibold text-neutral-700">Key Signals</div>
                      {result.signals.map((signal, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-neutral-600 bg-white p-2 rounded border border-neutral-100">
                          <Icon icon="mdi:check-circle" className="text-success-500 flex-shrink-0" />
                          <span>{signal}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <div className="pt-4">
                      <button
                        onClick={handleGetStarted}
                        className="w-full py-3 bg-gradient-to-r from-neutral-900 to-neutral-800 text-white font-semibold rounded-lg hover:from-neutral-800 hover:to-neutral-700 transition-all shadow-lg"
                      >
                        See Full Analysis →
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

export default HeroSection;
