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
      className="relative min-h-screen flex items-center justify-center px-6 pt-32 pb-24 bg-gradient-to-br from-blue-600 via-violet-600 to-purple-700 overflow-hidden"
    >
      {/* Animated mesh gradient overlay */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(255, 255, 255, 0.15) 0%, transparent 50%)',
            backgroundSize: '200% 200%'
          }}
        />
      </div>

      {/* Subtle noise texture for depth */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")',
      }} />

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
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] tracking-tight">
                Turn Hours of Instagram{' '}
                <span className="relative inline-block">
                  <span className="text-white/95">
                    Prospecting into Minutes
                  </span>
                  <motion.div
                    className="absolute -bottom-2 left-0 right-0 h-1 bg-white/40 rounded-full"
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    transition={{ duration: 1.2, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  />
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-white/90 leading-relaxed font-light">
                Paste an Instagram link and Oslira grades the profile, gives you a clear debrief, 
                crafts personalized outreach, and suggests your next leads.
              </p>

              <p className="text-lg text-white/80 font-medium">
                Get 25 free credits — no card required.
              </p>
            </motion.div>

            {/* Demo Input */}
            <motion.div variants={fadeIn} className="space-y-4">
              <p className="text-sm font-semibold text-white/90 tracking-wide uppercase">
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
                    className="w-full pl-12 pr-4 py-4 bg-white/95 backdrop-blur-sm border-2 border-white/20 rounded-xl text-slate-900 placeholder-slate-400 
                    focus:border-white focus:ring-4 focus:ring-white/20 outline-none transition-all duration-300
                    hover:bg-white"
                    disabled={isAnalyzing}
                  />
                </div>
                
                <motion.button
                  onClick={handleAnalysis}
                  disabled={isAnalyzing || !username.trim()}
                  whileHover={{ scale: 1.02, boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl 
                  disabled:opacity-40 disabled:cursor-not-allowed 
                  transition-all duration-300 flex items-center gap-2 shadow-xl shadow-black/10
                  hover:shadow-2xl hover:bg-blue-50"
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
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="p-6 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-2xl shadow-2xl shadow-blue-500/20"
                >
                  <div className="space-y-5">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-5 border-b border-blue-100">
                      <div className="flex items-center gap-4">
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                          className="w-14 h-14 bg-gradient-to-br from-blue-600 via-violet-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/30"
                        >
                          {result.username.charAt(0).toUpperCase()}
                        </motion.div>
                        <div>
                          <h4 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            @{result.username}
                          </h4>
                          <p className="text-sm text-slate-600">{result.niche} • {result.category} • {result.followers} followers</p>
                        </div>
                      </div>
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                        className="text-right"
                      >
                        <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{result.score}%</div>
                        <div className="text-xs text-slate-500 font-medium">Match Score</div>
                      </motion.div>
                    </div>
                    
                    {/* Outreach Preview */}
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="p-5 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-100"
                    >
                      <h5 className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-3">Suggested Outreach</h5>
                      <p className="text-slate-700 leading-relaxed italic">"{result.outreach}"</p>
                    </motion.div>
                    
                    {/* CTA */}
                    <div className="pt-4 border-t border-blue-100">
                      <p className="text-center text-sm text-slate-600 mb-4">
                        See full analysis & 24 more leads like this with your free trial
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.02, boxShadow: "0 20px 40px -12px rgba(59, 130, 246, 0.5)" }}
                        whileTap={{ scale: 0.99 }}
                        className="w-full py-4 bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 text-white font-semibold rounded-xl 
                        transition-all duration-300 shadow-lg shadow-blue-500/30
                        hover:shadow-2xl hover:shadow-blue-500/40"
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
              className="grid grid-cols-3 gap-6 pt-6 border-t border-white/20"
            >
              {[
                { number: '1,200+', label: 'Copywriters' },
                { number: '43%', label: 'Response Rate' },
                { number: '5 hrs', label: 'Saved/Week' }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
                  <div className="text-sm text-white/70 font-medium">{stat.label}</div>
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
              <div className="bg-white rounded-2xl shadow-2xl shadow-black/20 overflow-hidden border border-white/20">
                {/* Browser Chrome */}
                <div className="bg-slate-100 px-4 py-3 flex items-center gap-3 border-b border-slate-200">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="flex-1 px-3 py-1.5 bg-white rounded-md text-xs text-slate-600 font-medium text-center border border-slate-200">
                    app.oslira.com/dashboard
                  </div>
                </div>
                
                {/* Dashboard Preview */}
                <div className="p-8 space-y-5 bg-slate-50">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      AI Lead Analysis
                    </h3>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                      <Icon icon="mdi:atom" className="text-2xl text-blue-500" />
                    </motion.div>
                  </div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="p-6 bg-white rounded-xl border border-blue-200 shadow-lg shadow-blue-500/10 space-y-4 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-violet-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/30">
                          JD
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">@jane_designer</h4>
                          <p className="text-xs text-slate-500">UI/UX Designer • 8.2K followers</p>
                        </div>
                      </div>
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="px-3 py-1 bg-gradient-to-r from-green-400 to-emerald-500 text-white border border-green-200 rounded-full text-sm font-semibold shadow-lg shadow-green-500/30"
                      >
                        92%
                      </motion.div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {['Needs copy help', 'High engagement', 'Business owner'].map((tag, i) => (
                        <motion.span 
                          key={tag}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.1 * i }}
                          className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border border-blue-200 rounded-full text-xs font-medium"
                        >
                          {tag}
                        </motion.span>
                      ))}
                    </div>
                    
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 rounded-lg">
                      <p className="text-sm text-slate-700 italic leading-relaxed">
                        "Hi Jane! Your portfolio caught my eye..."
                      </p>
                    </div>
                  </motion.div>
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
