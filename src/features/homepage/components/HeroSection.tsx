/**
 * @file Hero Section
 * @description Main hero with Instagram demo - Elegant Professional Design
 * Path: src/features/homepage/components/HeroSection.tsx
 */

import { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Icon } from '@iconify/react';

// =============================================================================
// TYPES
// =============================================================================

interface AnalysisResult {
  username: string;
  score: number;
  niche: string;
  category: string;
  followers: string;
  outreach: string;
}

// =============================================================================
// ANIMATION VARIANTS - Subtle & Smooth
// =============================================================================

const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.8, 
      ease: [0.22, 1, 0.36, 1] // Smooth easing
    }
  }
};

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1
    }
  }
};

// =============================================================================
// COMPONENT
// =============================================================================

export function HeroSection() {
  const [username, setUsername] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, 100]);

  // =============================================================================
  // HANDLERS
  // =============================================================================

  const handleAnalysis = async () => {
    const cleanUsername = username.trim().replace('@', '');
    
    if (!cleanUsername) {
      setError('Please enter an Instagram username');
      setTimeout(() => setError(null), 3000);
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      // Simulate API call - replace with real endpoint
      await new Promise(resolve => setTimeout(resolve, 2000));

      const demoData: AnalysisResult = {
        username: cleanUsername,
        score: Math.floor(Math.random() * 25 + 70),
        niche: 'Content Creator',
        category: 'Business',
        followers: `${(Math.random() * 50 + 5).toFixed(1)}K`,
        outreach: `Hi ${cleanUsername}! Loved your recent content. I help creators like you scale their online presence...`
      };

      setResult(demoData);
    } catch (err) {
      setError('Unable to analyze profile. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAnalysis();
    }
  };

  // =============================================================================
  // RENDER
  // =============================================================================

  return (
    <motion.section 
      style={{ opacity: heroOpacity, y: heroY }}
      className="relative min-h-screen flex items-center justify-center px-6 pt-32 pb-24 bg-gradient-to-b from-slate-50 via-white to-slate-50/50"
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.015]">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(0 0 0) 1px, transparent 0)',
          backgroundSize: '48px 48px'
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column - Copy & Demo */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="space-y-10"
          >
            {/* Headline */}
            <motion.div variants={fadeIn} className="space-y-6">
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-900 leading-[1.1] tracking-tight">
                Turn Hours of Instagram{' '}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 bg-clip-text text-transparent">
                    Prospecting into Minutes
                  </span>
                  <motion.div
                    className="absolute -bottom-2 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-600/40 via-blue-700/40 to-purple-600/40 rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1.2, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  />
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-slate-600 leading-relaxed font-light">
                Paste an Instagram link and Oslira grades the profile, gives you a clear debrief, 
                crafts personalized outreach, and suggests your next leads.
              </p>

              <p className="text-lg text-slate-500 font-medium">
                Get 25 free credits — no card required.
              </p>
            </motion.div>

            {/* Demo Input */}
            <motion.div variants={fadeIn} className="space-y-4">
              <p className="text-sm font-semibold text-slate-700 tracking-wide uppercase">
                Try the AI Analysis
              </p>
              
              <div className="flex gap-3">
                <div className="flex-1 relative group">
                  <Icon 
                    icon="mdi:instagram" 
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl transition-colors group-focus-within:text-blue-600"
                  />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="@instagram_handle"
                    className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 
                    focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-300
                    hover:border-slate-300"
                    disabled={isAnalyzing}
                  />
                </div>
                
                <motion.button
                  onClick={handleAnalysis}
                  disabled={isAnalyzing || !username.trim()}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 bg-slate-900 text-white font-semibold rounded-xl 
                  hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed 
                  transition-all duration-300 flex items-center gap-2 shadow-lg shadow-slate-900/10
                  hover:shadow-xl hover:shadow-slate-900/20"
                >
                  {isAnalyzing ? (
                    <>
                      <Icon icon="mdi:loading" className="text-xl animate-spin" />
                      <span className="hidden sm:inline">Analyzing</span>
                    </>
                  ) : (
                    <>
                      <span>Analyze</span>
                      <Icon icon="mdi:arrow-right" className="text-xl" />
                    </>
                  )}
                </motion.button>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3"
                >
                  <Icon icon="mdi:alert-circle-outline" className="text-red-500 text-xl flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </motion.div>
              )}

              {/* Analysis Result */}
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="p-6 bg-white border border-slate-200 rounded-2xl shadow-lg shadow-slate-900/5"
                >
                  <div className="space-y-5">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-5 border-b border-slate-100">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-slate-900 to-slate-700 rounded-full flex items-center justify-center text-white font-bold text-xl">
                          {result.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-slate-900">@{result.username}</h4>
                          <p className="text-sm text-slate-500">{result.niche} • {result.category} • {result.followers} followers</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-blue-600">{result.score}%</div>
                        <div className="text-xs text-slate-500 font-medium">Match Score</div>
                      </div>
                    </div>
                    
                    {/* Outreach Preview */}
                    <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                      <h5 className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-3">Suggested Outreach</h5>
                      <p className="text-slate-700 leading-relaxed italic">"{result.outreach}"</p>
                    </div>
                    
                    {/* CTA */}
                    <div className="pt-4 border-t border-slate-100">
                      <p className="text-center text-sm text-slate-500 mb-4">
                        See full analysis & 24 more leads like this with your free trial
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="w-full py-4 bg-slate-900 text-white font-semibold rounded-xl 
                        hover:bg-slate-800 transition-all duration-300 shadow-lg shadow-slate-900/10
                        hover:shadow-xl hover:shadow-slate-900/20"
                      >
                        Get Full Analysis Report →
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Stats */}
            <motion.div 
              variants={fadeIn} 
              className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-200"
            >
              {[
                { number: '1,200+', label: 'Copywriters' },
                { number: '43%', label: 'Response Rate' },
                { number: '5 hrs', label: 'Saved/Week' }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-slate-900 mb-1">{stat.number}</div>
                  <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column - Visual Demo */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ 
                duration: 6, 
                repeat: Infinity, 
                ease: "easeInOut",
                repeatType: "reverse"
              }}
              className="relative"
            >
              <div className="bg-white rounded-2xl shadow-2xl shadow-slate-900/10 overflow-hidden border border-slate-200">
                {/* Browser Chrome */}
                <div className="bg-slate-50 px-4 py-3 flex items-center gap-3 border-b border-slate-200">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-slate-300 rounded-full"></div>
                    <div className="w-3 h-3 bg-slate-300 rounded-full"></div>
                    <div className="w-3 h-3 bg-slate-300 rounded-full"></div>
                  </div>
                  <div className="flex-1 px-3 py-1.5 bg-white rounded-md text-xs text-slate-400 text-center border border-slate-200">
                    oslira.com/dashboard
                  </div>
                </div>
                
                {/* Dashboard Preview */}
                <div className="p-8 space-y-5 bg-gradient-to-br from-slate-50 to-white">
                  <h3 className="text-lg font-bold text-slate-900">AI Lead Analysis</h3>
                  
                  <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-slate-900 to-slate-700 rounded-full flex items-center justify-center text-white font-bold">
                          JD
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">@jane_designer</h4>
                          <p className="text-xs text-slate-500">UI/UX Designer • 8.2K followers</p>
                        </div>
                      </div>
                      <div className="px-3 py-1 bg-green-50 text-green-700 border border-green-100 rounded-full text-sm font-semibold">
                        92%
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {['Needs copy help', 'High engagement', 'Business owner'].map((tag) => (
                        <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-full text-xs font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg">
                      <p className="text-sm text-slate-600 italic leading-relaxed">
                        "Hi Jane! Your portfolio caught my eye..."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

export default HeroSection;
