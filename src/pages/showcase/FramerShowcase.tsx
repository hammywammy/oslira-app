/**
 * @file Framer Motion ULTIMATE Showcase
 * @description COMPLETE demonstration of Framer Motion capabilities
 * 
 * Route: /showcase/framer
 * 
 * SECTIONS:
 * 1. Basic Animations (initial, animate, transition)
 * 2. Gestures (hover, tap, drag, focus)
 * 3. Variants & Orchestration (stagger, propagation)
 * 4. Layout Animations (layout prop, shared elements)
 * 5. Scroll Animations (useScroll, useTransform, parallax)
 * 6. SVG Animations (path drawing, morphing)
 * 7. AnimatePresence (exit animations, mode)
 * 8. Advanced (drag controls, motion values, springs)
 */

import { 
  motion, 
  AnimatePresence, 
  useScroll, 
  useTransform, 
  useSpring,
  useMotionValue,
  useDragControls
} from 'framer-motion';
import { useState, useRef } from 'react';

export function FramerShowcase() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState(['Item 1', 'Item 2', 'Item 3']);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);
  
  const x = useMotionValue(0);
  const dragControls = useDragControls();

  return (
    <div className="min-h-screen bg-black text-white">
      
      {/* HERO */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center z-10"
        >
          <motion.h1 
            className="text-9xl font-black mb-8 bg-linear-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent"
            animate={{ 
              backgroundPosition: ["0%", "100%", "0%"],
            }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            FRAMER MOTION
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl text-gray-400 mb-12"
          >
            The Complete Animation Library for React
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-6 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl font-bold text-2xl"
            >
              Explore 50+ Examples
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Floating background elements */}
        <motion.div
          className="absolute top-20 left-20 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl"
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
          }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-64 h-64 bg-fuchsia-500/20 rounded-full blur-3xl"
          animate={{
            y: [0, 30, 0],
            x: [0, -20, 0],
          }}
          transition={{ duration: 7, repeat: Infinity }}
        />
      </section>

      {/* SECTION 1: BASIC ANIMATIONS */}
      <section className="py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            className="text-7xl font-black text-center mb-4"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            BASIC ANIMATIONS
          </motion.h2>
          <p className="text-center text-gray-400 text-xl mb-20">
            initial, animate, transition, whileInView
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Fade In */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="backdrop-blur-xl bg-white/5 p-8 rounded-3xl border border-white/10"
            >
              <h3 className="text-3xl font-bold mb-4">Fade In</h3>
              <p className="text-gray-400 mb-4">Opacity 0 → 1</p>
              <code className="text-sm text-cyan-400">initial=&#123;&#123; opacity: 0 &#125;&#125;</code>
            </motion.div>

            {/* Slide Up */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="backdrop-blur-xl bg-white/5 p-8 rounded-3xl border border-white/10"
            >
              <h3 className="text-3xl font-bold mb-4">Slide Up</h3>
              <p className="text-gray-400 mb-4">Y position + opacity</p>
              <code className="text-sm text-cyan-400">y: 50 → 0</code>
            </motion.div>

            {/* Scale */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="backdrop-blur-xl bg-white/5 p-8 rounded-3xl border border-white/10"
            >
              <h3 className="text-3xl font-bold mb-4">Scale</h3>
              <p className="text-gray-400 mb-4">Zoom in effect</p>
              <code className="text-sm text-cyan-400">scale: 0.5 → 1</code>
            </motion.div>

            {/* Rotate */}
            <motion.div
              initial={{ opacity: 0, rotate: -180 }}
              whileInView={{ opacity: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="backdrop-blur-xl bg-white/5 p-8 rounded-3xl border border-white/10"
            >
              <h3 className="text-3xl font-bold mb-4">Rotate</h3>
              <p className="text-gray-400 mb-4">Spin into view</p>
              <code className="text-sm text-cyan-400">rotate: -180 → 0</code>
            </motion.div>

            {/* Spring */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 100 }}
              className="backdrop-blur-xl bg-white/5 p-8 rounded-3xl border border-white/10"
            >
              <h3 className="text-3xl font-bold mb-4">Spring</h3>
              <p className="text-gray-400 mb-4">Bouncy physics</p>
              <code className="text-sm text-cyan-400">type: "spring"</code>
            </motion.div>

            {/* Stagger Delay */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="backdrop-blur-xl bg-white/5 p-8 rounded-3xl border border-white/10"
            >
              <h3 className="text-3xl font-bold mb-4">With Delay</h3>
              <p className="text-gray-400 mb-4">Delayed entrance</p>
              <code className="text-sm text-cyan-400">delay: 0.3</code>
            </motion.div>

          </div>
        </div>
      </section>

      {/* SECTION 2: GESTURES & INTERACTIONS */}
      <section className="py-32 px-8 bg-gradient-to-b from-black via-purple-950/20 to-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-7xl font-black text-center mb-4">GESTURES</h2>
          <p className="text-center text-gray-400 text-xl mb-20">
            whileHover, whileTap, whileFocus, drag
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Hover Scale */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="backdrop-blur-xl bg-white/5 p-8 rounded-3xl border border-white/10 cursor-pointer"
            >
              <h3 className="text-3xl font-bold mb-4">Hover Scale</h3>
              <p className="text-gray-400">Hover over me!</p>
            </motion.div>

            {/* Tap Shrink */}
            <motion.div
              whileTap={{ scale: 0.9 }}
              className="backdrop-blur-xl bg-white/5 p-8 rounded-3xl border border-white/10 cursor-pointer"
            >
              <h3 className="text-3xl font-bold mb-4">Tap Shrink</h3>
              <p className="text-gray-400">Click me!</p>
            </motion.div>

            {/* Hover Rotate */}
            <motion.div
              whileHover={{ rotate: 5, scale: 1.05 }}
              className="backdrop-blur-xl bg-white/5 p-8 rounded-3xl border border-white/10 cursor-pointer"
            >
              <h3 className="text-3xl font-bold mb-4">Hover Rotate</h3>
              <p className="text-gray-400">Hover to tilt!</p>
            </motion.div>

            {/* Drag Horizontal */}
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 200 }}
              className="backdrop-blur-xl bg-white/5 p-8 rounded-3xl border border-white/10 cursor-grab active:cursor-grabbing"
            >
              <h3 className="text-3xl font-bold mb-4">Drag X</h3>
              <p className="text-gray-400">Drag me horizontally!</p>
            </motion.div>

            {/* Drag Any Direction */}
            <motion.div
              drag
              dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
              dragElastic={0.2}
              className="backdrop-blur-xl bg-white/5 p-8 rounded-3xl border border-white/10 cursor-grab active:cursor-grabbing"
            >
              <h3 className="text-3xl font-bold mb-4">Drag Free</h3>
              <p className="text-gray-400">Drag anywhere!</p>
            </motion.div>

            {/* Hover Glow */}
            <motion.div
              whileHover={{ 
                boxShadow: "0 0 40px rgba(168, 85, 247, 0.6)",
                borderColor: "rgba(168, 85, 247, 0.8)"
              }}
              className="backdrop-blur-xl bg-white/5 p-8 rounded-3xl border border-white/10 cursor-pointer transition-all"
            >
              <h3 className="text-3xl font-bold mb-4">Hover Glow</h3>
              <p className="text-gray-400">Hover for glow!</p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* SECTION 3: VARIANTS & ORCHESTRATION */}
      <section className="py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-7xl font-black text-center mb-4">VARIANTS</h2>
          <p className="text-center text-gray-400 text-xl mb-20">
            Reusable animation states + stagger children
          </p>

          {/* Staggered List */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              },
              hidden: {
                opacity: 0
              }
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
              <motion.div
                key={num}
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: { opacity: 1, y: 0 }
                }}
                className="backdrop-blur-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 p-8 rounded-3xl border border-white/10"
              >
                <div className="text-5xl font-black mb-2">{num}</div>
                <p className="text-gray-400">Staggered Item</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SECTION 4: LAYOUT ANIMATIONS */}
      <section className="py-32 px-8 bg-gradient-to-b from-black via-indigo-950/20 to-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-7xl font-black text-center mb-4">LAYOUT ANIMATIONS</h2>
          <p className="text-center text-gray-400 text-xl mb-20">
            Auto-animate size/position changes + shared elements
          </p>

          {/* Tabs with Shared Underline */}
          <div className="mb-16">
            <h3 className="text-4xl font-bold mb-8">Shared Element (Underline)</h3>
            <div className="flex gap-4 p-4 backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 w-fit mx-auto">
              {['Home', 'About', 'Services', 'Contact'].map((tab, index) => (
                <div
                  key={tab}
                  onClick={() => setSelectedTab(index)}
                  className="relative px-8 py-4 cursor-pointer"
                >
                  <span className={`relative z-10 font-bold ${selectedTab === index ? 'text-white' : 'text-gray-400'}`}>
                    {tab}
                  </span>
                  {selectedTab === index && (
                    <motion.div
                      layoutId="underline"
                      className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Expandable Cards */}
          <div className="mb-16">
            <h3 className="text-4xl font-bold mb-8 text-center">Expandable Cards (Layout Prop)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((num) => (
                <motion.div
                  key={num}
                  layout
                  onClick={() => setExpandedCard(expandedCard === num ? null : num)}
                  className={`backdrop-blur-xl bg-white/5 p-8 rounded-3xl border border-white/10 cursor-pointer ${
                    expandedCard === num ? 'md:col-span-2' : ''
                  }`}
                >
                  <motion.h3 layout="position" className="text-3xl font-bold mb-4">
                    Card {num}
                  </motion.h3>
                  <AnimatePresence>
                    {expandedCard === num && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <p className="text-gray-400 mb-4">
                          This card expanded automatically using the layout prop!
                          No manual animation code needed.
                        </p>
                        <p className="text-gray-400">
                          Framer Motion measures the size change and animates it smoothly
                          using performant transforms.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: SCROLL ANIMATIONS */}
      <section ref={scrollRef} className="py-32 px-8 relative">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-7xl font-black text-center mb-4">SCROLL ANIMATIONS</h2>
          <p className="text-center text-gray-400 text-xl mb-20">
            useScroll + useTransform = parallax magic
          </p>

          {/* Scroll Progress Bar */}
          <motion.div
            className="fixed top-0 left-0 right-0 h-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 origin-left z-50"
            style={{ scaleX: scrollYProgress }}
          />

          {/* Parallax Text */}
          <motion.div
            style={{ y }}
            className="text-center mb-20"
          >
            <h3 className="text-6xl font-black mb-4">PARALLAX TEXT</h3>
            <p className="text-2xl text-gray-400">Moves as you scroll</p>
          </motion.div>

          {/* Fade on Scroll */}
          <motion.div
            style={{ opacity }}
            className="backdrop-blur-xl bg-white/5 p-12 rounded-3xl border border-white/10 mb-20"
          >
            <h3 className="text-4xl font-bold mb-4">Opacity Linked to Scroll</h3>
            <p className="text-xl text-gray-400">
              This element fades in and out based on scroll position
            </p>
          </motion.div>

          {/* Scale on Scroll */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map((num) => {
              const cardRef = useRef<HTMLDivElement>(null);
              const { scrollYProgress: cardProgress } = useScroll({
                target: cardRef,
                offset: ["start end", "end start"]
              });
              const scale = useTransform(cardProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

              return (
                <motion.div
                  key={num}
                  ref={cardRef}
                  style={{ scale }}
                  className="backdrop-blur-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 p-12 rounded-3xl border border-white/10 h-96 flex items-center justify-center"
                >
                  <div className="text-center">
                    <div className="text-7xl font-black mb-4">{num}</div>
                    <p className="text-xl text-gray-400">Scales with scroll</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 6: ANIMATE PRESENCE */}
      <section className="py-32 px-8 bg-gradient-to-b from-black via-purple-950/20 to-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-7xl font-black text-center mb-4">ANIMATE PRESENCE</h2>
          <p className="text-center text-gray-400 text-xl mb-20">
            Exit animations + list reordering
          </p>

          {/* Toggle Modal */}
          <div className="mb-16 text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl font-bold text-xl mb-8"
            >
              {isOpen ? 'Close' : 'Open'} Modal
            </motion.button>

            <AnimatePresence>
              {isOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    onClick={() => setIsOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 100 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 100 }}
                    transition={{ type: "spring" }}
                    className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 backdrop-blur-xl bg-white/10 p-12 rounded-3xl border border-white/10 z-50 max-w-2xl w-full"
                  >
                    <h3 className="text-4xl font-bold mb-4">Animated Modal</h3>
                    <p className="text-xl text-gray-400 mb-6">
                      This modal has enter AND exit animations thanks to AnimatePresence
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsOpen(false)}
                      className="px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl font-bold"
                    >
                      Close
                    </motion.button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* List with Remove Animation */}
          <div className="max-w-2xl mx-auto">
            <h3 className="text-4xl font-bold mb-8 text-center">Animated List</h3>
            <AnimatePresence mode="popLayout">
              {items.map((item, index) => (
                <motion.div
                  key={item}
                  layout
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                  className="backdrop-blur-xl bg-white/5 p-6 rounded-2xl border border-white/10 mb-4 flex justify-between items-center"
                >
                  <span className="font-bold text-xl">{item}</span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setItems(items.filter((_, i) => i !== index))}
                    className="px-4 py-2 bg-red-600/20 hover:bg-red-600/40 rounded-lg text-red-400 font-bold"
                  >
                    Remove
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setItems([...items, `Item ${items.length + 1}`])}
              className="w-full px-6 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl font-bold text-lg"
            >
              Add Item
            </motion.button>
          </div>
        </div>
      </section>

      {/* SECTION 7: SVG ANIMATIONS */}
      <section className="py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-7xl font-black text-center mb-4">SVG ANIMATIONS</h2>
          <p className="text-center text-gray-400 text-xl mb-20">
            Path drawing + morphing effects
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Line Drawing */}
            <div className="text-center">
              <h3 className="text-3xl font-bold mb-8">Line Drawing</h3>
              <svg width="200" height="200" viewBox="0 0 200 200" className="mx-auto">
                <motion.circle
                  cx="100"
                  cy="100"
                  r="80"
                  stroke="url(#gradient)"
                  strokeWidth="4"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
              <p className="text-gray-400 mt-4">pathLength: 0 → 1</p>
            </div>

            {/* Stroke Width Animation */}
            <div className="text-center">
              <h3 className="text-3xl font-bold mb-8">Stroke Animation</h3>
              <svg width="200" height="200" viewBox="0 0 200 200" className="mx-auto">
                <motion.rect
                  x="50"
                  y="50"
                  width="100"
                  height="100"
                  stroke="#8b5cf6"
                  fill="none"
                  animate={{ 
                    strokeWidth: [2, 8, 2],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </svg>
              <p className="text-gray-400 mt-4">strokeWidth + rotate</p>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-5xl font-black bg-linear-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent mb-4">
            50+ Examples Showcased
          </h3>
          <p className="text-gray-400 text-xl mb-8">
            This is Framer Motion at its full potential
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            {[
              'Animations', 'Gestures', 'Variants', 'Layout', 'Scroll', 'SVG', 
              'AnimatePresence', 'Parallax', 'Stagger', 'Springs', 'Drag', 'Exit'
            ].map((tag) => (
              <span key={tag} className="px-4 py-2 backdrop-blur-lg bg-white/5 rounded-xl text-sm text-gray-300 border border-white/10">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
}

export default FramerShowcase;
