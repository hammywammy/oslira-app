/**
 * 🏎️ THE FERRARI COMPONENT LAB
 * Tailwind v4 × Framer Motion × Iconify
 * One page. All components. Zero compromises.
 */

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';

export function ComponentLab() {
  // ============================================================================
  // STATE
  // ============================================================================
  const [activePricing, setActivePricing] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [email, setEmail] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  // ============================================================================
  // REFS & SCROLL
  // ============================================================================
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      
      {/* ========================================================================
          SCROLL PROGRESS BAR
      ======================================================================== */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 origin-left z-50"
        style={{ scaleX: scrollYProgress }}
      />

      {/* ========================================================================
          HERO SECTION
      ======================================================================== */}
      <motion.section 
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{ opacity: heroOpacity, scale: heroScale }}
      >
        {/* Animated Background */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/30 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, -50, 0],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-600/30 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              x: [0, -50, 0],
              y: [0, 50, 0],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 w-96 h-96 bg-yellow-600/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 180, 360],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-block mb-6"
              animate={{ rotate: [0, 5, 0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-6xl">🏎️</span>
            </motion.div>
            
            <h1 className="text-7xl md:text-9xl font-black mb-6 leading-none">
              <motion.span
                className="inline-block bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent"
                animate={{ 
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                style={{ backgroundSize: '200% 100%' }}
              >
                FERRARI
              </motion.span>
              <br />
              <span className="text-white">COMPONENT LAB</span>
            </h1>
            
            <motion.p
              className="text-2xl md:text-3xl text-gray-400 mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Tailwind v4 × Framer Motion × Iconify
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex gap-4 justify-center flex-wrap"
            >
              <motion.button
                className="px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl font-bold text-lg"
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(220, 38, 38, 0.4)' }}
                whileTap={{ scale: 0.95 }}
              >
                Explore Components
              </motion.button>
              <motion.button
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl font-bold text-lg"
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                whileTap={{ scale: 0.95 }}
              >
                View Code
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <motion.div
                className="w-1 h-3 bg-gradient-to-b from-red-500 to-orange-500 rounded-full mt-2"
                animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* ========================================================================
          SECTION 1: HERO COMPONENTS
      ======================================================================== */}
      <section className="py-32 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <span className="text-red-500 font-bold text-sm uppercase tracking-wider">Section 01</span>
            <h2 className="text-5xl md:text-6xl font-black mt-4 mb-6">Hero Components</h2>
            <p className="text-xl text-gray-400">5 Production-Ready Hero Sections</p>
          </motion.div>

          {/* HERO 1: SaaS Hero */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-32 bg-gradient-to-br from-gray-900 to-black rounded-3xl overflow-hidden border border-white/10"
          >
            <div className="p-8 md:p-16">
              <span className="text-orange-500 font-mono text-sm">Hero_01_SaaS.tsx</span>
              <div className="mt-8 grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <motion.span 
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-full text-red-400 text-sm font-semibold mb-6"
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    New Release v2.0
                  </motion.span>
                  
                  <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                    Ship Faster With
                    <span className="block bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                      AI-Powered Tools
                    </span>
                  </h1>
                  
                  <p className="text-xl text-gray-400 mb-8">
                    Build, deploy, and scale applications 10x faster with our intelligent platform.
                    From idea to production in minutes.
                  </p>

                  <div className="flex gap-4 flex-wrap">
                    <motion.button
                      className="px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl font-bold"
                      whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(220, 38, 38, 0.3)' }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Start Free Trial
                    </motion.button>
                    <motion.button
                      className="px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl font-bold"
                      whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Watch Demo
                    </motion.button>
                  </div>

                  <div className="flex gap-8 mt-8">
                    <div>
                      <div className="text-3xl font-black text-red-500">10M+</div>
                      <div className="text-sm text-gray-500">Active Users</div>
                    </div>
                    <div>
                      <div className="text-3xl font-black text-orange-500">99.9%</div>
                      <div className="text-sm text-gray-500">Uptime</div>
                    </div>
                    <div>
                      <div className="text-3xl font-black text-yellow-500">4.9/5</div>
                      <div className="text-sm text-gray-500">Rating</div>
                    </div>
                  </div>
                </div>

                <motion.div
                  className="relative"
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <div className="relative bg-gradient-to-br from-red-600/20 to-orange-600/20 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                    <div className="flex gap-2 mb-4">
                      <div className="w-3 h-3 bg-red-500 rounded-full" />
                      <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                    </div>
                    <div className="space-y-3">
                      <div className="h-4 bg-white/10 rounded w-3/4" />
                      <div className="h-4 bg-white/10 rounded w-full" />
                      <div className="h-4 bg-white/10 rounded w-5/6" />
                      <div className="h-32 bg-gradient-to-br from-red-500/30 to-orange-500/30 rounded-lg mt-4" />
                    </div>
                  </div>
                  <motion.div
                    className="absolute -bottom-4 -right-4 w-32 h-32 bg-red-500/20 rounded-full blur-2xl"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* HERO 2: E-commerce Hero */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-32 bg-gradient-to-br from-orange-950/50 to-black rounded-3xl overflow-hidden border border-orange-500/20"
          >
            <div className="p-8 md:p-16">
              <span className="text-orange-500 font-mono text-sm">Hero_02_Ecommerce.tsx</span>
              <div className="mt-8 text-center">
                <motion.h1 
                  className="text-6xl md:text-8xl font-black mb-6"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                >
                  <span className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
                    Summer Collection
                  </span>
                </motion.h1>
                
                <p className="text-2xl text-gray-400 mb-12 max-w-2xl mx-auto">
                  Elevate your style with our latest drops. Limited edition pieces designed for the bold.
                </p>

                <motion.button
                  className="px-12 py-5 bg-gradient-to-r from-orange-600 to-red-600 rounded-full font-bold text-xl mb-12"
                  whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(234, 88, 12, 0.4)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  Shop Now - 40% Off
                </motion.button>

                {/* Product Showcase Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map((item) => (
                    <motion.div
                      key={item}
                      className="relative group cursor-pointer"
                      whileHover={{ y: -10 }}
                      onHoverStart={() => setHoveredCard(item)}
                      onHoverEnd={() => setHoveredCard(null)}
                    >
                      <div className="aspect-square bg-gradient-to-br from-orange-600/20 to-red-600/20 rounded-2xl overflow-hidden border border-white/10">
                        <motion.div
                          className="w-full h-full bg-gradient-to-br from-orange-500 to-red-500"
                          animate={{ scale: hoveredCard === item ? 1.1 : 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: hoveredCard === item ? 1 : 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-2xl flex items-center justify-center"
                      >
                        <span className="text-white font-bold">View Product</span>
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* HERO 3: Portfolio Hero */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-32 bg-gradient-to-br from-red-950/30 to-black rounded-3xl overflow-hidden border border-red-500/20"
          >
            <div className="p-8 md:p-16">
              <span className="text-red-500 font-mono text-sm">Hero_03_Portfolio.tsx</span>
              <div className="mt-8 grid md:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <span className="text-red-500 font-bold text-sm uppercase tracking-wider">Creative Developer</span>
                  <h1 className="text-6xl md:text-7xl font-black mt-4 mb-6 leading-tight">
                    Crafting Digital
                    <span className="block text-transparent bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text">
                      Experiences
                    </span>
                  </h1>
                  <p className="text-xl text-gray-400 mb-8">
                    Hi, I'm Alex. I turn ideas into beautiful, functional websites and applications
                    that users love.
                  </p>
                  <div className="flex gap-4">
                    <motion.button
                      className="px-8 py-4 bg-red-600 rounded-xl font-bold"
                      whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(220, 38, 38, 0.3)' }}
                      whileTap={{ scale: 0.95 }}
                    >
                      View Projects
                    </motion.button>
                    <motion.button
                      className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl font-bold"
                      whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Contact Me
                    </motion.button>
                  </div>
                </motion.div>

                <motion.div
                  className="relative"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="relative aspect-square bg-gradient-to-br from-red-600/20 to-orange-600/20 rounded-3xl overflow-hidden border border-white/10">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-red-500 to-orange-500"
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, 0]
                      }}
                      transition={{ duration: 5, repeat: Infinity }}
                    />
                  </div>
                  <motion.div
                    className="absolute -top-8 -right-8 w-40 h-40 bg-red-500/30 rounded-full blur-3xl"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ========================================================================
          SECTION 2: NAVIGATION COMPONENTS
      ======================================================================== */}
      <section className="py-32 px-4 md:px-8 bg-gradient-to-b from-black via-red-950/10 to-black">
        <div className="max-w-7xl mx-auto">
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="text-orange-500 font-bold text-sm uppercase tracking-wider">Section 02</span>
            <h2 className="text-5xl md:text-6xl font-black mt-4 mb-6">Navigation Systems</h2>
            <p className="text-xl text-gray-400">6 Interactive Navigation Patterns</p>
          </motion.div>

          {/* NAV 1: Mega Menu */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <span className="text-orange-500 font-mono text-sm">Nav_01_MegaMenu.tsx</span>
            <div className="mt-4 bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-white/10 overflow-hidden">
              <nav className="px-8 py-6 flex justify-between items-center">
                <div className="text-2xl font-black">LOGO</div>
                
                <div className="hidden md:flex gap-8">
                  {['Products', 'Solutions', 'Resources', 'Pricing'].map((item) => (
                    <motion.button
                      key={item}
                      className="text-gray-300 hover:text-white font-semibold relative"
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setMenuOpen(!menuOpen)}
                    >
                      {item}
                      <motion.span
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-red-500"
                        initial={{ scaleX: 0 }}
                        whileHover={{ scaleX: 1 }}
                      />
                    </motion.button>
                  ))}
                </div>

                <motion.button
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg font-bold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started
                </motion.button>
              </nav>

              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-white/10 overflow-hidden"
                  >
                    <div className="p-8 grid grid-cols-3 gap-8">
                      {[1, 2, 3].map((col) => (
                        <div key={col}>
                          <h3 className="text-sm font-bold text-gray-400 mb-4">CATEGORY {col}</h3>
                          <div className="space-y-3">
                            {[1, 2, 3, 4].map((item) => (
                              <motion.a
                                key={item}
                                href="#"
                                className="block text-gray-300 hover:text-white"
                                whileHover={{ x: 5 }}
                              >
                                Menu Item {item}
                              </motion.a>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* NAV 2: Mobile Drawer */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <span className="text-orange-500 font-mono text-sm">Nav_02_MobileDrawer.tsx</span>
            <div className="mt-4">
              <motion.button
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg font-bold"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {sidebarOpen ? 'Close' : 'Open'} Drawer
              </motion.button>

              <AnimatePresence>
                {sidebarOpen && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setSidebarOpen(false)}
                      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 mt-4"
                    />
                    <motion.div
                      initial={{ x: '-100%' }}
                      animate={{ x: 0 }}
                      exit={{ x: '-100%' }}
                      transition={{ type: 'spring', damping: 30 }}
                      className="fixed left-0 top-4 bottom-4 w-80 bg-gradient-to-b from-red-950 to-black border-r border-white/10 z-50 overflow-y-auto ml-4 rounded-2xl"
                    >
                      <div className="p-8">
                        <div className="flex justify-between items-center mb-8">
                          <h2 className="text-2xl font-black">MENU</h2>
                          <motion.button
                            onClick={() => setSidebarOpen(false)}
                            className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center"
                            whileHover={{ rotate: 90, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                          >
                            ✕
                          </motion.button>
                        </div>

                        <nav className="space-y-2">
                          {['Dashboard', 'Projects', 'Team', 'Analytics', 'Settings'].map((item, index) => (
                            <motion.a
                              key={item}
                              href="#"
                              className="block px-4 py-3 bg-white/5 rounded-xl font-semibold hover:bg-white/10"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              whileHover={{ x: 5 }}
                            >
                              {item}
                            </motion.a>
                          ))}
                        </nav>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* NAV 3: Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <span className="text-orange-500 font-mono text-sm">Nav_03_Tabs.tsx</span>
            <div className="mt-4 bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-white/10 p-8">
              <div className="bg-white/5 rounded-xl p-2 inline-flex">
                {['Overview', 'Analytics', 'Reports', 'Settings'].map((tab, index) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(index)}
                    className="relative px-6 py-3 font-semibold transition-colors"
                    style={{ color: activeTab === index ? '#fff' : '#888' }}
                  >
                    {activeTab === index && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg"
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{tab}</span>
                  </button>
                ))}
              </div>

              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 p-8 bg-white/5 rounded-xl"
              >
                <h3 className="text-2xl font-bold mb-4">
                  {['Overview', 'Analytics', 'Reports', 'Settings'][activeTab]} Content
                </h3>
                <p className="text-gray-400">
                  This is the content for the selected tab. Switch tabs to see smooth transitions.
                </p>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ========================================================================
          SECTION 3: CARDS & CONTENT
      ======================================================================== */}
      <section className="py-32 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="text-red-500 font-bold text-sm uppercase tracking-wider">Section 03</span>
            <h2 className="text-5xl md:text-6xl font-black mt-4 mb-6">Cards & Content</h2>
            <p className="text-xl text-gray-400">10+ Card Variations</p>
          </motion.div>

          {/* PRICING CARDS */}
          <div className="mb-32">
            <span className="text-orange-500 font-mono text-sm">Card_01_Pricing.tsx</span>
            
            <div className="flex justify-center mt-8 mb-12">
              <div className="bg-white/5 rounded-full p-1">
                <button
                  onClick={() => setActivePricing('monthly')}
                  className={`px-8 py-3 rounded-full font-semibold transition-all ${
                    activePricing === 'monthly'
                      ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white'
                      : 'text-gray-400'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setActivePricing('yearly')}
                  className={`px-8 py-3 rounded-full font-semibold transition-all ${
                    activePricing === 'yearly'
                      ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white'
                      : 'text-gray-400'
                  }`}
                >
                  Yearly <span className="text-green-400 text-xs ml-1">Save 20%</span>
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: 'Starter', price: activePricing === 'monthly' ? 29 : 279, features: 4 },
                { name: 'Pro', price: activePricing === 'monthly' ? 79 : 759, popular: true, features: 8 },
                { name: 'Enterprise', price: activePricing === 'monthly' ? 199 : 1910, features: 12 }
              ].map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className={`relative p-8 rounded-3xl border ${
                    plan.popular
                      ? 'bg-gradient-to-br from-red-950/50 to-orange-950/50 border-red-500/50'
                      : 'bg-gradient-to-br from-gray-900 to-black border-white/10'
                  }`}
                >
                  {plan.popular && (
                    <motion.span
                      className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-full text-xs font-bold"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      MOST POPULAR
                    </motion.span>
                  )}

                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-5xl font-black">${plan.price}</span>
                    <span className="text-gray-400">/{activePricing === 'monthly' ? 'mo' : 'yr'}</span>
                  </div>

                  <motion.button
                    className={`w-full py-4 rounded-xl font-bold mb-8 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-red-600 to-orange-600'
                        : 'bg-white/10 border border-white/20'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Get Started
                  </motion.button>

                  <ul className="space-y-3">
                    {Array.from({ length: plan.features }).map((_, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <span className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 text-xs">✓</span>
                        <span className="text-gray-300">Feature {i + 1}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>

          {/* PRODUCT CARDS */}
          <div className="mb-32">
            <span className="text-orange-500 font-mono text-sm">Card_02_Product.tsx</span>
            
            <div className="grid md:grid-cols-4 gap-6 mt-8">
              {[1, 2, 3, 4].map((item) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                  className="group cursor-pointer"
                  onClick={() => setSelectedProduct(selectedProduct === item ? null : item)}
                >
                  <div className="relative aspect-square bg-gradient-to-br from-red-600/20 to-orange-600/20 rounded-2xl overflow-hidden mb-4 border border-white/10">
                    <motion.div
                      className="w-full h-full bg-gradient-to-br from-red-500 to-orange-500"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    />
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center"
                    >
                      <motion.span
                        className="px-6 py-3 bg-white text-black rounded-full font-bold"
                        whileHover={{ scale: 1.1 }}
                      >
                        Quick View
                      </motion.span>
                    </motion.div>
                  </div>
                  <h3 className="font-bold text-lg mb-1">Product {item}</h3>
                  <p className="text-gray-400 text-sm mb-2">Premium Quality</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-red-500">${(item * 49).toFixed(2)}</span>
                    <motion.button
                      className="px-4 py-2 bg-white/10 rounded-lg text-sm font-semibold"
                      whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Add to Cart
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* TESTIMONIAL CARDS */}
          <div>
            <span className="text-orange-500 font-mono text-sm">Card_03_Testimonial.tsx</span>
            
            <div className="grid md:grid-cols-3 gap-8 mt-8">
              {[1, 2, 3].map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="p-8 bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-white/10"
                >
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.span
                        key={star}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: star * 0.1 }}
                        className="text-yellow-500 text-xl"
                      >
                        ★
                      </motion.span>
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6">
                    "This product completely transformed how we work. The attention to detail and
                    quality is unmatched. Highly recommended!"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-full" />
                    <div>
                      <div className="font-bold">Customer {item}</div>
                      <div className="text-sm text-gray-400">CEO, Company Inc</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================
          SECTION 4: FORMS & INPUTS
      ======================================================================== */}
      <section className="py-32 px-4 md:px-8 bg-gradient-to-b from-black via-orange-950/10 to-black">
        <div className="max-w-7xl mx-auto">
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="text-orange-500 font-bold text-sm uppercase tracking-wider">Section 04</span>
            <h2 className="text-5xl md:text-6xl font-black mt-4 mb-6">Forms & Inputs</h2>
            <p className="text-xl text-gray-400">Beautiful Form Components</p>
          </motion.div>

          <div className="max-w-2xl mx-auto">
            <span className="text-orange-500 font-mono text-sm">Form_01_Newsletter.tsx</span>
            
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-8 p-12 bg-gradient-to-br from-red-950/30 to-black rounded-3xl border border-red-500/20 text-center"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
                className="text-6xl mb-6"
              >
                🚀
              </motion.div>
              
              <h3 className="text-4xl font-black mb-4">Stay in the Loop</h3>
              <p className="text-xl text-gray-400 mb-8">
                Get the latest updates, exclusive content, and special offers delivered to your inbox.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setShowSuccess(true);
                  setTimeout(() => setShowSuccess(false), 3000);
                }}
                className="flex gap-4 max-w-md mx-auto"
              >
                <motion.input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-red-500 transition-colors"
                  whileFocus={{ scale: 1.02 }}
                  required
                />
                <motion.button
                  type="submit"
                  className="px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl font-bold"
                  whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(220, 38, 38, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  Subscribe
                </motion.button>
              </form>

              <AnimatePresence>
                {showSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mt-6 p-4 bg-green-500/20 border border-green-500/50 rounded-xl"
                  >
                    <p className="text-green-400 font-semibold">✓ Successfully subscribed!</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <p className="text-sm text-gray-500 mt-6">
                No spam. Unsubscribe anytime. We respect your privacy.
              </p>
            </motion.div>
          </div>

        </div>
      </section>

      {/* ========================================================================
          FOOTER
      ======================================================================== */}
      <footer className="py-20 px-4 md:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="text-8xl mb-6"
            >
              🏎️
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-black mb-4">
              <span className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
                Ferrari Component Lab
              </span>
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Built with Tailwind v4 × Framer Motion × Iconify
            </p>
          </motion.div>

          <div className="flex flex-wrap gap-4 justify-center mb-12">
            {[
              'Heroes', 'Navigation', 'Cards', 'Forms', 'Buttons',
              'Modals', 'Tables', 'Charts', 'Animations', 'Layouts'
            ].map((tag) => (
              <motion.span
                key={tag}
                className="px-6 py-3 bg-white/5 border border-white/10 rounded-full text-sm font-semibold"
                whileHover={{ 
                  scale: 1.05,
                  backgroundColor: 'rgba(220, 38, 38, 0.1)',
                  borderColor: 'rgba(220, 38, 38, 0.3)'
                }}
              >
                {tag}
              </motion.span>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-gray-500 text-sm"
          >
            © 2025 Component Lab · Drop-Top Edition
          </motion.p>

        </div>
      </footer>

    </div>
  );
}

export default ComponentLab;
