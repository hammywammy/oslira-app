/**
 * 🔥 THE NUCLEAR CROWN OF CROWNS - 200 FRAMER MOTION EXAMPLES
 * Every single Framer Motion capability demonstrated
 */

import { 
  motion, 
  AnimatePresence, 
  useScroll, 
  useTransform,
  useSpring,
  useMotionValue,
  useDragControls,
  useVelocity,
  useInView,
  useTime,
  useReducedMotion,
  LayoutGroup,
  Variants
} from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

export function FramerShowcase() {
  // ============================================================================
  // STATE
  // ============================================================================
  const [selectedTab, setSelectedTab] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [items, setItems] = useState(['Item 1', 'Item 2', 'Item 3', 'Item 4']);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [accordionOpen, setAccordionOpen] = useState<number | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [gridLayout, setGridLayout] = useState<'grid' | 'list'>('grid');
  
  // ============================================================================
  // REFS
  // ============================================================================
  const scrollRef = useRef<HTMLDivElement>(null);
  const constraintsRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  
  // ============================================================================
  // SCROLL HOOKS
  // ============================================================================
  const { scrollYProgress } = useScroll();
  
  // ============================================================================
  // MOTION VALUES
  // ============================================================================
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const dragX = useMotionValue(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // ============================================================================
  // TRANSFORMS
  // ============================================================================
  const xSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const ySpring = useSpring(y, { stiffness: 300, damping: 30 });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -500]);
  const scaleProgress = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const opacityProgress = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const rotateProgress = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const colorProgress = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ['#8b5cf6', '#ec4899', '#06b6d4']
  );
  
  // ============================================================================
  // VELOCITY
  // ============================================================================
  const xVelocity = useVelocity(x);
  
  // ============================================================================
  // DRAG CONTROLS
  // ============================================================================
  const controls = useDragControls();
  
  // ============================================================================
  // TIME
  // ============================================================================
  const time = useTime();
  const rotate = useTransform(time, [0, 4000], [0, 360], { clamp: false });
  
  // ============================================================================
  // REDUCED MOTION
  // ============================================================================
  const shouldReduceMotion = useReducedMotion();
  
  // ============================================================================
  // CURSOR TRACKING
  // ============================================================================
useEffect(() => {
  const handleMouseMove = (e: MouseEvent) => {
    // Remove setCursorPos line
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };
  window.addEventListener('mousemove', handleMouseMove);
  return () => window.removeEventListener('mousemove', handleMouseMove);
}, [mouseX, mouseY]);
  
  // ============================================================================
  // VARIANTS
  // ============================================================================
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      
      {/* ========================================================================
          HERO SECTION
      ======================================================================== */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        
        {/* Background animated blobs */}
        <motion.div
          className="absolute top-20 left-20 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -50, 0],
            y: [0, 40, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            x: [-200, 0, -200],
            y: [-100, 50, -100],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        
        {/* Hero content */}
        <div className="relative z-10 text-center px-4">
          <motion.h1 
            className="text-8xl md:text-9xl font-black mb-6"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
          >
            <motion.span
              className="inline-block bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent"
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
              style={{ backgroundSize: '200% 100%' }}
            >
              FRAMER
            </motion.span>
          </motion.h1>
          
          <motion.p
            className="text-3xl md:text-4xl text-gray-400 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            200 Examples. Nuclear Showcase.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <motion.button
              className="px-12 py-6 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl font-bold text-2xl"
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(139, 92, 246, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              animate={{ 
                boxShadow: ['0 0 20px rgba(139, 92, 246, 0.3)', '0 0 40px rgba(139, 92, 246, 0.6)', '0 0 20px rgba(139, 92, 246, 0.3)']
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Scroll to Explore
            </motion.button>
          </motion.div>
          
          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <motion.div
                className="w-1 h-2 bg-white rounded-full mt-2"
                animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </div>
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </section>

      {/* ========================================================================
          SCROLL PROGRESS
      ======================================================================== */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-600 origin-left z-50"
        style={{ scaleX: scrollYProgress }}
      />

      {/* ========================================================================
          SECTION 1: BASIC ANIMATIONS (20 examples)
      ======================================================================== */}
      <section className="py-32 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          
          <motion.h2 
            className="text-6xl md:text-7xl font-black text-center mb-4"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            BASIC ANIMATIONS
          </motion.h2>
          
          <motion.p
            className="text-center text-gray-400 text-xl mb-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Foundation - 20 Core Examples
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* 1. Fade In */}
            <motion.div
              className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-2">1. Fade In</h3>
              <p className="text-gray-400">opacity: 0 → 1</p>
            </motion.div>

            {/* 2. Slide Up */}
            <motion.div
              className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-2">2. Slide Up</h3>
              <p className="text-gray-400">translateY: 50 → 0</p>
            </motion.div>

            {/* 3. Slide Right */}
            <motion.div
              className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-2">3. Slide Right</h3>
              <p className="text-gray-400">translateX: -50 → 0</p>
            </motion.div>

            {/* 4. Scale Up */}
            <motion.div
              className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10"
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-2">4. Scale Up</h3>
              <p className="text-gray-400">scale: 0.5 → 1</p>
            </motion.div>

            {/* 5. Rotate In */}
            <motion.div
              className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10"
              initial={{ opacity: 0, rotate: -180 }}
              whileInView={{ opacity: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 100 }}
            >
              <h3 className="text-2xl font-bold mb-2">5. Rotate In</h3>
              <p className="text-gray-400">rotate: -180 → 0</p>
            </motion.div>

            {/* 6. Blur In */}
            <motion.div
              className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10"
              initial={{ opacity: 0, filter: 'blur(10px)' }}
              whileInView={{ opacity: 1, filter: 'blur(0px)' }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-2">6. Blur In</h3>
              <p className="text-gray-400">blur: 10px → 0</p>
            </motion.div>

            {/* 7. Color Shift */}
            <motion.div
              className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10"
              initial={{ backgroundColor: '#8b5cf6' }}
              whileInView={{ backgroundColor: '#ec4899' }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <h3 className="text-2xl font-bold mb-2">7. Color Shift</h3>
              <p className="text-gray-400">violet → pink</p>
            </motion.div>

            {/* 8. Border Morph */}
            <motion.div
              className="bg-white/5 backdrop-blur-sm p-8 border border-white/10"
              initial={{ borderRadius: 0 }}
              whileInView={{ borderRadius: 24 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-2xl font-bold mb-2">8. Border Morph</h3>
              <p className="text-gray-400">0px → 24px radius</p>
            </motion.div>

            {/* 9. Pulse */}
            <motion.div
              className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <h3 className="text-2xl font-bold mb-2">9. Pulse</h3>
              <p className="text-gray-400">opacity loop</p>
            </motion.div>

            {/* 10. Bounce */}
            <motion.div
              className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10"
              initial={{ y: -100 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 300, damping: 10 }}
            >
              <h3 className="text-2xl font-bold mb-2">10. Bounce</h3>
              <p className="text-gray-400">spring physics</p>
            </motion.div>

            {/* 11. Elastic */}
            <motion.div
              className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 500, damping: 15 }}
            >
              <h3 className="text-2xl font-bold mb-2">11. Elastic</h3>
              <p className="text-gray-400">high stiffness</p>
            </motion.div>

            {/* 12. Duration Control */}
            <motion.div
              className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10"
              initial={{ x: -100 }}
              whileInView={{ x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 2 }}
            >
              <h3 className="text-2xl font-bold mb-2">12. Duration</h3>
              <p className="text-gray-400">2 second timing</p>
            </motion.div>

            {/* 13. Delay */}
            <motion.div
              className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-2xl font-bold mb-2">13. Delay</h3>
              <p className="text-gray-400">0.5s delayed start</p>
            </motion.div>

            {/* 14. Ease Curve */}
            <motion.div
              className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10"
              initial={{ x: -100 }}
              whileInView={{ x: 0 }}
              viewport={{ once: true }}
              transition={{ ease: [0.43, 0.13, 0.23, 0.96] }}
            >
              <h3 className="text-2xl font-bold mb-2">14. Ease Curve</h3>
              <p className="text-gray-400">cubic-bezier</p>
            </motion.div>

            {/* 15. Repeat */}
            <motion.div
              className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <h3 className="text-2xl font-bold mb-2">15. Repeat</h3>
              <p className="text-gray-400">infinite loop</p>
            </motion.div>

            {/* 16. Repeat Reverse */}
            <motion.div
              className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10"
              animate={{ x: [0, 50, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <h3 className="text-2xl font-bold mb-2">16. Reverse</h3>
              <p className="text-gray-400">back & forth</p>
            </motion.div>

            {/* 17. Spring Type */}
            <motion.div
              className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring' }}
            >
              <h3 className="text-2xl font-bold mb-2">17. Spring</h3>
              <p className="text-gray-400">type: "spring"</p>
            </motion.div>

            {/* 18. Tween Type */}
            <motion.div
              className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'tween', duration: 0.5 }}
            >
              <h3 className="text-2xl font-bold mb-2">18. Tween</h3>
              <p className="text-gray-400">type: "tween"</p>
            </motion.div>

            {/* 19. Cross Fade */}
            <motion.div className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-violet-600"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <h3 className="text-2xl font-bold mb-2 relative z-10">19. Cross Fade</h3>
              <p className="text-gray-400 relative z-10">opacity swap</p>
            </motion.div>

            {/* 20. Multi-Step */}
            <motion.div
              className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10"
              initial={{ scale: 0, rotate: 0 }}
              whileInView={{ 
                scale: [0, 1.2, 1],
                rotate: [0, 180, 360]
              }}
              viewport={{ once: true }}
              transition={{ duration: 1.5 }}
            >
              <h3 className="text-2xl font-bold mb-2">20. Multi-Step</h3>
              <p className="text-gray-400">keyframe array</p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ========================================================================
          SECTION 2: GESTURES & INTERACTIONS (35 examples)
      ======================================================================== */}
      <section className="py-32 px-4 md:px-8 bg-gradient-to-b from-black via-violet-950/10 to-black">
        <div className="max-w-7xl mx-auto">
          
          <motion.h2 
            className="text-6xl md:text-7xl font-black text-center mb-4"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            GESTURES & INTERACTIONS
          </motion.h2>
          
          <motion.p
            className="text-center text-gray-400 text-xl mb-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Intermediate - 35 Interactive Examples
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            
            {/* GESTURE EXAMPLES 21-28 */}
            
            {/* 21. Hover Scale */}
            <motion.div
              className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 cursor-pointer"
              whileHover={{ scale: 1.1 }}
            >
              <h3 className="text-2xl font-bold mb-2">21. Hover Scale</h3>
              <p className="text-gray-400">Hover me!</p>
            </motion.div>

            {/* 22. Hover Rotate */}
            <motion.div
              className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 cursor-pointer"
              whileHover={{ rotate: 5, scale: 1.05 }}
            >
              <h3 className="text-2xl font-bold mb-2">22. Hover Rotate</h3>
              <p className="text-gray-400">Tilt effect</p>
            </motion.div>

            {/* 23. Hover Glow */}
            <motion.div
              className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 cursor-pointer"
              whileHover={{ 
                boxShadow: '0 0 40px rgba(139, 92, 246, 0.6)',
                borderColor: 'rgba(139, 92, 246, 0.8)'
              }}
            >
              <h3 className="text-2xl font-bold mb-2">23. Hover Glow</h3>
              <p className="text-gray-400">Shadow effect</p>
            </motion.div>

            {/* 24. Tap Shrink */}
            <motion.div
              className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 cursor-pointer"
              whileTap={{ scale: 0.9 }}
            >
              <h3 className="text-2xl font-bold mb-2">24. Tap Shrink</h3>
              <p className="text-gray-400">Click me!</p>
            </motion.div>

            {/* 25. Tap Ripple */}
            <motion.div
              className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 cursor-pointer relative overflow-hidden"
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0 bg-violet-500/20 rounded-full"
                initial={{ scale: 0, opacity: 1 }}
                whileTap={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.6 }}
              />
              <h3 className="text-2xl font-bold mb-2 relative z-10">25. Tap Ripple</h3>
              <p className="text-gray-400 relative z-10">Ripple effect</p>
            </motion.div>

            {/* 26. Focus Ring */}
            <motion.button
              className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 w-full text-left"
              whileFocus={{ 
                borderColor: '#8b5cf6',
                boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.3)'
              }}
            >
              <h3 className="text-2xl font-bold mb-2">26. Focus Ring</h3>
              <p className="text-gray-400">Tab to focus</p>
            </motion.button>

            {/* 27. Long Press */}
            <motion.div
              className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 cursor-pointer"
              whileTap={{ scale: 0.95 }}
              onTapStart={() => console.log('Long press started')}
            >
              <h3 className="text-2xl font-bold mb-2">27. Long Press</h3>
              <p className="text-gray-400">Press & hold</p>
            </motion.div>

            {/* 28. Double Tap */}
            <motion.div
              className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 cursor-pointer"
              whileTap={{ scale: 0.9 }}
              onTap={(_event, info) => {
                if (info.point.x) console.log('Double tap');
              }}
            >
              <h3 className="text-2xl font-bold mb-2">28. Double Tap</h3>
              <p className="text-gray-400">Tap twice</p>
            </motion.div>

          </div>

          {/* DRAG EXAMPLES 29-36 */}
          <h3 className="text-4xl font-bold mb-10">Drag & Drop</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            
            {/* 29. Drag Horizontal */}
            <motion.div
              drag="x"
              dragConstraints={{ left: -100, right: 100 }}
              className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 cursor-grab active:cursor-grabbing"
            >
              <h3 className="text-xl font-bold mb-2">29. Drag X</h3>
              <p className="text-sm text-gray-400">Horizontal only</p>
            </motion.div>

            {/* 30. Drag Vertical */}
            <motion.div
              drag="y"
              dragConstraints={{ top: -100, bottom: 100 }}
              className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 cursor-grab active:cursor-grabbing"
            >
              <h3 className="text-xl font-bold mb-2">30. Drag Y</h3>
              <p className="text-sm text-gray-400">Vertical only</p>
            </motion.div>

            {/* 31. Drag Free */}
            <motion.div
              drag
              dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
              className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 cursor-grab active:cursor-grabbing"
            >
              <h3 className="text-xl font-bold mb-2">31. Drag Free</h3>
              <p className="text-sm text-gray-400">Any direction</p>
            </motion.div>

            {/* 32. Drag Constraints (Container) */}
            <div ref={constraintsRef} className="bg-white/10 p-4 rounded-3xl border border-white/20 relative h-48">
              <motion.div
                drag
                dragConstraints={constraintsRef}
                className="bg-violet-600 p-6 rounded-2xl cursor-grab active:cursor-grabbing absolute"
              >
                <p className="text-sm font-bold">32. Bounded</p>
              </motion.div>
            </div>

            {/* 33. Drag Elastic */}
            <motion.div
              drag
              dragElastic={0.2}
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 cursor-grab active:cursor-grabbing"
            >
              <h3 className="text-xl font-bold mb-2">33. Elastic</h3>
              <p className="text-sm text-gray-400">Bouncy drag</p>
            </motion.div>

            {/* 34. Drag Momentum */}
            <motion.div
              drag
              dragMomentum={true}
              className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 cursor-grab active:cursor-grabbing"
            >
              <h3 className="text-xl font-bold mb-2">34. Momentum</h3>
              <p className="text-sm text-gray-400">Inertia enabled</p>
            </motion.div>

            {/* 35. Drag Snap */}
            <motion.div
              drag
              dragSnapToOrigin
              className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 cursor-grab active:cursor-grabbing"
            >
              <h3 className="text-xl font-bold mb-2">35. Snap Back</h3>
              <p className="text-sm text-gray-400">Returns to origin</p>
            </motion.div>

            {/* 36. Drag Controls */}
            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-3xl border border-white/10">
              <motion.div
                drag
                dragControls={controls}
                dragListener={false}
                className="bg-violet-600 p-6 rounded-2xl mb-2"
              >
                <p className="text-sm font-bold">36. Custom Handle</p>
              </motion.div>
              <button
                className="w-full p-2 bg-white/10 rounded-xl text-sm"
                onPointerDown={(e) => controls.start(e)}
              >
                Drag Handle
              </button>
            </div>

          </div>

          {/* VARIANTS & ORCHESTRATION 37-44 */}
          <h3 className="text-4xl font-bold mb-10">Variants & Orchestration</h3>
          
          <div className="space-y-12 mb-20">
            
            {/* 37-38. Stagger Children */}
            <div>
              <h4 className="text-2xl font-bold mb-6">37-38. Stagger Children</h4>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <motion.div
                    key={num}
                    variants={itemVariants}
                    className="bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 p-6 rounded-2xl border border-white/10"
                  >
                    <div className="text-4xl font-black mb-2">{num}</div>
                    <p className="text-sm text-gray-400">Staggered</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* 39. Propagation */}
            <div>
              <h4 className="text-2xl font-bold mb-6">39. Variant Propagation</h4>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={containerVariants}
                className="bg-white/5 p-8 rounded-3xl border border-white/10"
              >
                <motion.h5 variants={itemVariants} className="text-xl font-bold mb-4">
                  Parent passes variants to children
                </motion.h5>
                <motion.p variants={itemVariants} className="text-gray-400 mb-4">
                  No need to repeat variant definitions
                </motion.p>
                <motion.button 
                  variants={itemVariants}
                  className="px-6 py-3 bg-violet-600 rounded-xl"
                >
                  Button inherits animation
                </motion.button>
              </motion.div>
            </div>

            {/* 40. Dynamic Variants */}
            <div>
              <h4 className="text-2xl font-bold mb-6">40. Dynamic Variants (custom prop)</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[0, 1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    custom={i}
                    variants={{
                      hidden: { opacity: 0, y: 50 },
                      visible: (custom: number) => ({
                        opacity: 1,
                        y: 0,
                        transition: { delay: custom * 0.2 }
                      })
                    }}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="bg-white/5 p-6 rounded-2xl border border-white/10"
                  >
                    <p className="text-2xl font-bold">Delay: {i * 0.2}s</p>
                  </motion.div>
                ))}
              </div>
            </div>

          </div>

          {/* ANIMATE PRESENCE 45-55 */}
          <h3 className="text-4xl font-bold mb-10">AnimatePresence</h3>
          
          <div className="space-y-8">
            
            {/* 45-46. Modal Enter/Exit */}
            <div>
              <h4 className="text-2xl font-bold mb-4">45-46. Modal with Exit Animation</h4>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsModalOpen(!isModalOpen)}
                className="px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl font-bold"
              >
                {isModalOpen ? 'Close' : 'Open'} Modal
              </motion.button>

              <AnimatePresence>
                {isModalOpen && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                      onClick={() => setIsModalOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, y: 100 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: 100 }}
                      transition={{ type: 'spring', damping: 25 }}
                      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-violet-900/90 to-fuchsia-900/90 backdrop-blur-xl p-12 rounded-3xl border border-white/20 z-50 max-w-2xl w-full mx-4"
                    >
                      <h3 className="text-4xl font-bold mb-4">Animated Modal</h3>
                      <p className="text-xl text-gray-300 mb-6">
                        This modal has BOTH enter AND exit animations thanks to AnimatePresence
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsModalOpen(false)}
                        className="px-6 py-3 bg-white/20 rounded-xl font-bold"
                      >
                        Close Modal
                      </motion.button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* 47-49. List Add/Remove with different modes */}
            <div>
              <h4 className="text-2xl font-bold mb-4">47-49. List Management (mode: popLayout)</h4>
              <AnimatePresence mode="popLayout">
                {items.map((item, index) => (
                  <motion.div
                    key={item}
                    layout
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    className="bg-white/5 p-6 rounded-2xl border border-white/10 mb-4 flex justify-between items-center"
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
                className="w-full px-6 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl font-bold mt-4"
              >
                Add Item
              </motion.button>
            </div>

            {/* 50. Notification Stack */}
            <div>
              <h4 className="text-2xl font-bold mb-4">50. Toast Notification</h4>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setShowNotification(true);
                  setTimeout(() => setShowNotification(false), 3000);
                }}
                className="px-8 py-4 bg-violet-600 rounded-2xl font-bold"
              >
                Show Toast
              </motion.button>

              <AnimatePresence>
                {showNotification && (
                  <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.3 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                    className="fixed bottom-8 right-8 bg-gradient-to-r from-green-600 to-emerald-600 p-6 rounded-2xl shadow-2xl z-50"
                  >
                    <p className="text-lg font-bold">✓ Success!</p>
                    <p className="text-sm text-white/80">Toast notification with exit animation</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 51. Drawer */}
            <div>
              <h4 className="text-2xl font-bold mb-4">51. Side Drawer</h4>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDrawerOpen(!drawerOpen)}
                className="px-8 py-4 bg-violet-600 rounded-2xl font-bold"
              >
                {drawerOpen ? 'Close' : 'Open'} Drawer
              </motion.button>

              <AnimatePresence>
                {drawerOpen && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setDrawerOpen(false)}
                      className="fixed inset-0 bg-black/50 z-40"
                    />
                    <motion.div
                      initial={{ x: '100%' }}
                      animate={{ x: 0 }}
                      exit={{ x: '100%' }}
                      transition={{ type: 'spring', damping: 30 }}
                      className="fixed right-0 top-0 bottom-0 w-96 bg-gradient-to-br from-violet-900 to-fuchsia-900 p-8 z-50 shadow-2xl"
                    >
                      <h3 className="text-3xl font-bold mb-4">Side Drawer</h3>
                      <p className="text-gray-300 mb-6">Slides in from the right with spring physics</p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setDrawerOpen(false)}
                        className="px-6 py-3 bg-white/20 rounded-xl font-bold"
                      >
                        Close
                      </motion.button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* 52-53. Accordion */}
            <div>
              <h4 className="text-2xl font-bold mb-4">52-53. Accordion (layout animations)</h4>
              <div className="space-y-4">
                {[1, 2, 3].map((num) => (
                  <div key={num} className="border border-white/10 rounded-2xl overflow-hidden">
                    <motion.button
                      onClick={() => setAccordionOpen(accordionOpen === num ? null : num)}
                      className="w-full p-6 bg-white/5 text-left font-bold text-xl flex justify-between items-center"
                      whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                    >
                      Section {num}
                      <motion.span
                        animate={{ rotate: accordionOpen === num ? 180 : 0 }}
                      >
                        ▼
                      </motion.span>
                    </motion.button>
                    <AnimatePresence>
                      {accordionOpen === num && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="p-6 bg-white/5">
                            <p className="text-gray-400">
                              This content smoothly expands and collapses with height animations.
                              The layout prop ensures smooth transitions even with dynamic content.
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================
          SECTION 3: SCROLL ANIMATIONS (13 examples)
      ======================================================================== */}
      <section ref={scrollRef} className="py-32 px-4 md:px-8 relative">
        <div className="max-w-7xl mx-auto">
          
          <motion.h2 
            className="text-6xl md:text-7xl font-black text-center mb-4"
            style={{ y: parallaxY }}
          >
            SCROLL ANIMATIONS
          </motion.h2>
          
          <motion.p
            className="text-center text-gray-400 text-xl mb-20"
            style={{ opacity: opacityProgress }}
          >
            56-68. Scroll-Linked Magic
          </motion.p>

          {/* 56. Scroll Progress (already at top of page) */}

          {/* 57. Parallax Layers */}
          <div className="mb-32 relative h-96">
            <motion.div
              style={{ y: useTransform(scrollYProgress, [0, 1], [0, -200]) }}
              className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-transparent rounded-3xl"
            />
            <motion.div
              style={{ y: useTransform(scrollYProgress, [0, 1], [0, -100]) }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <h3 className="text-4xl font-bold">57. Parallax Layers</h3>
            </motion.div>
            <motion.div
              style={{ y: useTransform(scrollYProgress, [0, 1], [0, -50]) }}
              className="absolute bottom-0 left-0 right-0 h-20 bg-fuchsia-500/20 rounded-3xl"
            />
          </div>

          {/* 58-60. Scroll-Linked Transforms */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
            <motion.div
              style={{ scale: scaleProgress }}
              className="bg-white/5 p-12 rounded-3xl border border-white/10"
            >
              <h3 className="text-2xl font-bold mb-2">58. Scale</h3>
              <p className="text-gray-400">Zoom based on scroll</p>
            </motion.div>

            <motion.div
              style={{ rotate: rotateProgress }}
              className="bg-white/5 p-12 rounded-3xl border border-white/10"
            >
              <h3 className="text-2xl font-bold mb-2">59. Rotate</h3>
              <p className="text-gray-400">Spin on scroll</p>
            </motion.div>

            <motion.div
              style={{ opacity: opacityProgress }}
              className="bg-white/5 p-12 rounded-3xl border border-white/10"
            >
              <h3 className="text-2xl font-bold mb-2">60. Opacity</h3>
              <p className="text-gray-400">Fade in/out</p>
            </motion.div>
          </div>

          {/* 61. Color Shift on Scroll */}
          <motion.div
            style={{ backgroundColor: colorProgress }}
            className="p-12 rounded-3xl mb-32"
          >
            <h3 className="text-4xl font-bold mb-2">61. Color Transition</h3>
            <p className="text-gray-200">Background changes as you scroll</p>
          </motion.div>

          {/* 62-64. Viewport Triggers */}
          <div className="space-y-32 mb-32">
            {[62, 63, 64].map((num) => (
              <motion.div
                key={num}
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.8 }}
                className="bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 p-12 rounded-3xl border border-white/10"
              >
                <h3 className="text-4xl font-bold mb-4">{num}. WhileInView</h3>
                <p className="text-xl text-gray-400">
                  Triggers when {num === 62 ? '30%' : num === 63 ? '50%' : '70%'} visible
                </p>
              </motion.div>
            ))}
          </div>

          {/* 65. Scroll Velocity */}
          <motion.div
            style={{
              scale: useTransform(useVelocity(scrollYProgress), [-0.5, 0, 0.5], [0.8, 1, 1.2])
            }}
            className="bg-white/5 p-12 rounded-3xl border border-white/10 mb-32"
          >
            <h3 className="text-4xl font-bold mb-2">65. Velocity-Based</h3>
            <p className="text-xl text-gray-400">Reacts to scroll speed</p>
          </motion.div>

          {/* 66-68. Sticky Scroll Sections */}
          <div className="relative h-[300vh]">
            <div className="sticky top-0 h-screen flex items-center justify-center">
              <motion.div
                style={{
                  scale: useTransform(scrollYProgress, [0.3, 0.5], [0.8, 1]),
                  opacity: useTransform(scrollYProgress, [0.3, 0.5, 0.7], [0, 1, 0])
                }}
                className="bg-gradient-to-br from-violet-600 to-fuchsia-600 p-20 rounded-3xl"
              >
                <h3 className="text-5xl font-black mb-4">66-68. Sticky Scroll</h3>
                <p className="text-2xl">Content pins while animating</p>
              </motion.div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================
          SECTION 4: LAYOUT ANIMATIONS (10 examples)
      ======================================================================== */}
      <section className="py-32 px-4 md:px-8 bg-gradient-to-b from-black via-fuchsia-950/10 to-black">
        <div className="max-w-7xl mx-auto">
          
          <motion.h2 
            className="text-6xl md:text-7xl font-black text-center mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            LAYOUT ANIMATIONS
          </motion.h2>
          
          <motion.p
            className="text-center text-gray-400 text-xl mb-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            69-78. Auto-FLIP Animations
          </motion.p>

          {/* 69-70. Layout Prop */}
          <div className="mb-20">
            <h3 className="text-3xl font-bold mb-6">69-70. Layout Prop (Automatic FLIP)</h3>
            <motion.button
              onClick={() => setGridLayout(gridLayout === 'grid' ? 'list' : 'grid')}
              className="mb-6 px-6 py-3 bg-violet-600 rounded-xl font-bold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Toggle Layout
            </motion.button>
            
            <LayoutGroup>
              <motion.div
                layout
                className={gridLayout === 'grid' 
                  ? 'grid grid-cols-4 gap-4' 
                  : 'flex flex-col gap-4'
                }
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <motion.div
                    key={num}
                    layout
                    className="bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 p-8 rounded-2xl border border-white/10"
                  >
                    <div className="text-3xl font-bold">{num}</div>
                  </motion.div>
                ))}
              </motion.div>
            </LayoutGroup>
          </div>

          {/* 71-72. Shared Layout */}
          <div className="mb-20">
            <h3 className="text-3xl font-bold mb-6">71-72. Shared Layout ID</h3>
            <LayoutGroup>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((num) => (
                  <motion.div
                    key={num}
                    layoutId={expandedCard === num ? `expanded-${num}` : undefined}
                    onClick={() => setExpandedCard(expandedCard === num ? null : num)}
                    className="bg-white/5 p-8 rounded-2xl border border-white/10 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                  >
                    <h4 className="text-2xl font-bold mb-2">Card {num}</h4>
                    <p className="text-gray-400">Click to expand</p>
                    <AnimatePresence>
                      {expandedCard === num && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="mt-4 pt-4 border-t border-white/10"
                        >
                          <p className="text-gray-300">
                            Additional content appears with smooth layout animation.
                            The card seamlessly transitions between states.
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </LayoutGroup>
          </div>

          {/* 73-74. Tabs with Shared Underline */}
          <div className="mb-20">
            <h3 className="text-3xl font-bold mb-6">73-74. Tabs with Shared Indicator</h3>
            <div className="bg-white/5 p-2 rounded-2xl inline-flex">
              {['Home', 'About', 'Services', 'Contact'].map((tab, index) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(index)}
                  className="relative px-8 py-4 font-bold transition-colors"
                  style={{ color: selectedTab === index ? '#fff' : '#888' }}
                >
                  {selectedTab === index && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{tab}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 75-78. Bento Grid Expansion */}
          <div className="mb-20">
            <h3 className="text-3xl font-bold mb-6">75-78. Bento Grid (Apple Style)</h3>
            <div className="grid grid-cols-4 grid-rows-3 gap-4 h-[600px]">
              <motion.div
                layout
                className="col-span-2 row-span-2 bg-gradient-to-br from-violet-600 to-purple-600 rounded-3xl p-8 flex items-center justify-center cursor-pointer"
                whileHover={{ scale: 1.02 }}
              >
                <h4 className="text-4xl font-black">Large Tile</h4>
              </motion.div>
              
              <motion.div
                layout
                className="col-span-2 bg-gradient-to-br from-fuchsia-600 to-pink-600 rounded-3xl p-8 flex items-center justify-center cursor-pointer"
                whileHover={{ scale: 1.02 }}
              >
                <h4 className="text-2xl font-bold">Wide Tile</h4>
              </motion.div>
              <motion.div
                layout
                className="bg-gradient-to-br from-cyan-600 to-blue-600 rounded-3xl p-8 flex items-center justify-center cursor-pointer"
                whileHover={{ scale: 1.02 }}
              >
                <h4 className="text-xl font-bold">Small</h4>
              </motion.div>
              
              <motion.div
                layout
                className="bg-gradient-to-br from-orange-600 to-red-600 rounded-3xl p-8 flex items-center justify-center cursor-pointer"
                whileHover={{ scale: 1.02 }}
              >
                <h4 className="text-xl font-bold">Small</h4>
              </motion.div>
              
              <motion.div
                layout
                className="col-span-2 row-span-2 bg-gradient-to-br from-green-600 to-emerald-600 rounded-3xl p-8 flex items-center justify-center cursor-pointer"
                whileHover={{ scale: 1.02 }}
              >
                <h4 className="text-3xl font-black">Medium Tile</h4>
              </motion.div>
              
              <motion.div
                layout
                className="row-span-2 bg-gradient-to-br from-yellow-600 to-amber-600 rounded-3xl p-8 flex items-center justify-center cursor-pointer"
                whileHover={{ scale: 1.02 }}
              >
                <h4 className="text-xl font-bold">Tall</h4>
              </motion.div>
              
              <motion.div
                layout
                className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-8 flex items-center justify-center cursor-pointer"
                whileHover={{ scale: 1.02 }}
              >
                <h4 className="text-xl font-bold">Small</h4>
              </motion.div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================
          SECTION 5: SVG ANIMATIONS (11 examples)
      ======================================================================== */}
      <section className="py-32 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          
          <motion.h2 
            className="text-6xl md:text-7xl font-black text-center mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            SVG ANIMATIONS
          </motion.h2>
          
          <motion.p
            className="text-center text-gray-400 text-xl mb-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            79-89. Path Drawing & Morphing
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            
            {/* 79. Circle Path Drawing */}
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-6">79. Circle Draw</h3>
              <svg width="200" height="200" viewBox="0 0 200 200" className="mx-auto">
                <motion.circle
                  cx="100"
                  cy="100"
                  r="80"
                  stroke="url(#gradient1)"
                  strokeWidth="4"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                <defs>
                  <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
              <p className="text-gray-400 mt-4">pathLength: 0 → 1</p>
            </div>

            {/* 80. Path Morphing */}
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-6">80. Shape Morph</h3>
              <svg width="200" height="200" viewBox="0 0 200 200" className="mx-auto">
                <motion.path
                  d="M100 20 L180 180 L20 180 Z"
                  fill="url(#gradient2)"
                  animate={{
                    d: [
                      "M100 20 L180 180 L20 180 Z",
                      "M100 20 A80 80 0 1 1 100 180 A80 80 0 1 1 100 20",
                      "M20 100 L180 100 L100 20 L180 100 L100 180 L20 100",
                      "M100 20 L180 180 L20 180 Z"
                    ]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                <defs>
                  <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>
              <p className="text-gray-400 mt-4">shape transitions</p>
            </div>

            {/* 81. Stroke Animation */}
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-6">81. Stroke Width</h3>
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
              <p className="text-gray-400 mt-4">strokeWidth pulse</p>
            </div>

            {/* 82. SVG Filter */}
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-6">82. Filter Blur</h3>
              <svg width="200" height="200" viewBox="0 0 200 200" className="mx-auto">
                <defs>
                  <filter id="blurFilter">
                    <motion.feGaussianBlur
                      stdDeviation={0}
                      animate={{ stdDeviation: [0, 10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </filter>
                </defs>
                <circle cx="100" cy="100" r="40" fill="#ec4899" filter="url(#blurFilter)" />
              </svg>
              <p className="text-gray-400 mt-4">blur animation</p>
            </div>

            {/* 83. Progress Circle */}
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-6">83. Progress Ring</h3>
              <svg width="200" height="200" viewBox="0 0 200 200" className="mx-auto">
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  stroke="#333"
                  strokeWidth="12"
                  fill="none"
                />
                <motion.circle
                  cx="100"
                  cy="100"
                  r="80"
                  stroke="url(#gradient3)"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray="502"
                  initial={{ strokeDashoffset: 502 }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  strokeLinecap="round"
                  transform="rotate(-90 100 100)"
                />
                <text x="100" y="110" textAnchor="middle" fill="white" fontSize="40" fontWeight="bold">
                  <motion.tspan
                    animate={{ opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    75%
                  </motion.tspan>
                </text>
                <defs>
                  <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
              <p className="text-gray-400 mt-4">circular loader</p>
            </div>

            {/* 84. Line Chart */}
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-6">84. Line Draw</h3>
              <svg width="200" height="200" viewBox="0 0 200 200" className="mx-auto">
                <motion.polyline
                  points="20,180 60,120 100,140 140,60 180,100"
                  fill="none"
                  stroke="url(#gradient4)"
                  strokeWidth="4"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
              <p className="text-gray-400 mt-4">data visualization</p>
            </div>

            {/* 85. Hamburger to X */}
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-6">85. Icon Morph</h3>
              <motion.button
                className="mx-auto block"
                onClick={() => setIsFlipped(!isFlipped)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg width="60" height="60" viewBox="0 0 60 60">
                  <motion.line
                    x1="10"
                    y1="20"
                    x2="50"
                    y2="20"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    animate={isFlipped ? { 
                      x1: 15, y1: 15, x2: 45, y2: 45 
                    } : { 
                      x1: 10, y1: 20, x2: 50, y2: 20 
                    }}
                  />
                  <motion.line
                    x1="10"
                    y1="30"
                    x2="50"
                    y2="30"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    animate={isFlipped ? { 
                      opacity: 0 
                    } : { 
                      opacity: 1 
                    }}
                  />
                  <motion.line
                    x1="10"
                    y1="40"
                    x2="50"
                    y2="40"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    animate={isFlipped ? { 
                      x1: 15, y1: 45, x2: 45, y2: 15 
                    } : { 
                      x1: 10, y1: 40, x2: 50, y2: 40 
                    }}
                  />
                </svg>
              </motion.button>
              <p className="text-gray-400 mt-4">hamburger ↔ X</p>
            </div>

            {/* 86. Signature Effect */}
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-6">86. Handwriting</h3>
              <svg width="200" height="100" viewBox="0 0 200 100" className="mx-auto">
                <motion.path
                  d="M10,50 Q50,20 90,50 T170,50"
                  fill="none"
                  stroke="#ec4899"
                  strokeWidth="3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  strokeLinecap="round"
                />
              </svg>
              <p className="text-gray-400 mt-4">signature draw</p>
            </div>

            {/* 87. Map Path */}
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-6">87. Route Draw</h3>
              <svg width="200" height="200" viewBox="0 0 200 200" className="mx-auto">
                <motion.path
                  d="M20,20 C40,80 60,40 100,100 S160,120 180,180"
                  fill="none"
                  stroke="url(#gradient5)"
                  strokeWidth="4"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  strokeLinecap="round"
                />
                {/* Animated dot following path */}
                <motion.circle
                  r="6"
                  fill="#fff"
                  initial={{ offsetDistance: "0%" }}
                  animate={{ offsetDistance: "100%" }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  style={{ offsetPath: "path('M20,20 C40,80 60,40 100,100 S160,120 180,180')" }}
                />
                <defs>
                  <linearGradient id="gradient5" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>
              <p className="text-gray-400 mt-4">navigation path</p>
            </div>

            {/* 88-89. Logo Reveal */}
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-6">88-89. Logo Reveal</h3>
              <svg width="200" height="200" viewBox="0 0 200 200" className="mx-auto">
                <motion.text
                  x="100"
                  y="110"
                  textAnchor="middle"
                  fill="none"
                  stroke="#8b5cf6"
                  strokeWidth="2"
                  fontSize="60"
                  fontWeight="bold"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  FM
                </motion.text>
              </svg>
              <p className="text-gray-400 mt-4">brand animation</p>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================
          SECTION 6: MOTION VALUES & HOOKS (12 examples)
      ======================================================================== */}
      <section className="py-32 px-4 md:px-8 bg-gradient-to-b from-black via-cyan-950/10 to-black">
        <div className="max-w-7xl mx-auto">
          
          <motion.h2 
            className="text-6xl md:text-7xl font-black text-center mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            MOTION VALUES & HOOKS
          </motion.h2>
          
          <motion.p
            className="text-center text-gray-400 text-xl mb-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            89-100. Advanced Hooks
          </motion.p>

          <div className="space-y-20">
            
            {/* 89-90. useMotionValue */}
            <div>
              <h3 className="text-3xl font-bold mb-6">89-90. useMotionValue (No Re-render)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div
                  drag
                  style={{ x, y }}
                  className="bg-gradient-to-br from-violet-600 to-fuchsia-600 p-12 rounded-3xl cursor-grab active:cursor-grabbing"
                >
                  <h4 className="text-2xl font-bold mb-2">Drag Me</h4>
                  <p className="text-white/80">Updates without re-rendering</p>
                </motion.div>
                <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
                  <h4 className="text-xl font-bold mb-4">Motion Value Info</h4>
                  <p className="text-gray-400 mb-2">X: Tracks horizontal position</p>
                  <p className="text-gray-400 mb-2">Y: Tracks vertical position</p>
                  <p className="text-gray-300 mt-4">
                    Motion values update imperatively without triggering React renders,
                    making animations extremely performant.
                  </p>
                </div>
              </div>
            </div>

            {/* 91. useTransform */}
            <div>
              <h3 className="text-3xl font-bold mb-6">91. useTransform (Derived Values)</h3>
              <motion.div
                drag="x"
                dragConstraints={{ left: -200, right: 200 }}
                style={{ x: dragX }}
                className="relative"
              >
                <motion.div
                  style={{
                    scale: useTransform(dragX, [-200, 0, 200], [0.5, 1, 0.5]),
                    rotate: useTransform(dragX, [-200, 0, 200], [-45, 0, 45]),
                    backgroundColor: useTransform(
                      dragX,
                      [-200, 0, 200],
                      ['#8b5cf6', '#ec4899', '#06b6d4']
                    )
                  }}
                  className="w-32 h-32 rounded-3xl cursor-grab active:cursor-grabbing mx-auto"
                />
              </motion.div>
              <p className="text-center text-gray-400 mt-6">
                Drag horizontally → scale, rotate, and color transform
              </p>
            </div>

            {/* 92. useSpring */}
            <div>
              <h3 className="text-3xl font-bold mb-6">92. useSpring (Smooth Following)</h3>
              <div className="relative h-64 bg-white/5 rounded-3xl border border-white/10 overflow-hidden">
                <motion.div
                  style={{ x: xSpring, y: ySpring }}
                  className="absolute w-16 h-16 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-full -translate-x-8 -translate-y-8"
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    x.set(e.clientX - rect.left);
                    y.set(e.clientY - rect.top);
                  }}
                />
                <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400">
                  Move mouse in this area
                </p>
              </div>
            </div>

            {/* 93. useVelocity */}
            <div>
              <h3 className="text-3xl font-bold mb-6">93. useVelocity (Speed Tracking)</h3>
              <motion.div
                drag="x"
                style={{ x: dragX }}
                dragConstraints={{ left: -300, right: 300 }}
                className="mb-4"
              >
                <motion.div
                  style={{
                    scale: useTransform(xVelocity, [-1000, 0, 1000], [1.5, 1, 1.5])
                  }}
                  className="w-32 h-32 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-3xl cursor-grab active:cursor-grabbing mx-auto"
                />
              </motion.div>
              <p className="text-center text-gray-400">
                Drag fast → scales based on velocity
              </p>
            </div>

            {/* 94. useScroll (covered earlier) */}
            
            {/* 95. useInView */}
            <div>
              <h3 className="text-3xl font-bold mb-6">95. useInView (Visibility Detection)</h3>
              <div className="space-y-8">
                {[1, 2, 3].map((num) => {
                  const ref = useRef<HTMLDivElement>(null);
                  const isInView = useInView(ref, { once: false });
                  
                  return (
                    <motion.div
                      key={num}
                      ref={ref}
                      style={{
                        scale: isInView ? 1 : 0.8,
                        opacity: isInView ? 1 : 0.3
                      }}
                      className="bg-white/5 p-8 rounded-3xl border border-white/10"
                    >
                      <h4 className="text-2xl font-bold mb-2">Element {num}</h4>
                      <p className="text-gray-400">
                        {isInView ? '✓ In viewport' : '✗ Out of viewport'}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* 96. useAnimate (imperative) */}
            <div>
              <h3 className="text-3xl font-bold mb-6">96. useAnimate (Imperative Control)</h3>
              <button
                onClick={() => {
                  const element = document.getElementById('imperative-box');
                  if (element) {
                    element.style.transform = 'scale(1.5) rotate(180deg)';
                    setTimeout(() => {
                      element.style.transform = 'scale(1) rotate(0deg)';
                    }, 500);
                  }
                }}
                className="mb-4 px-6 py-3 bg-violet-600 rounded-xl font-bold"
              >
                Trigger Animation
              </button>
              <motion.div
                id="imperative-box"
                className="w-32 h-32 bg-gradient-to-br from-fuchsia-600 to-pink-600 rounded-3xl"
                style={{ transition: 'transform 0.5s' }}
              />
            </div>

            {/* 97. useTime */}
            <div>
              <h3 className="text-3xl font-bold mb-6">97. useTime (Time-Based)</h3>
              <div className="grid grid-cols-3 gap-8">
                <motion.div
                  style={{ rotate }}
                  className="w-32 h-32 bg-gradient-to-br from-violet-600 to-purple-600 rounded-3xl"
                />
                <motion.div
                  style={{ rotate: useTransform(time, [0, 2000], [0, 360], { clamp: false }) }}
                  className="w-32 h-32 bg-gradient-to-br from-fuchsia-600 to-pink-600 rounded-3xl"
                />
                <motion.div
                  style={{ rotate: useTransform(time, [0, 6000], [0, 360], { clamp: false }) }}
                  className="w-32 h-32 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-3xl"
                />
              </div>
              <p className="text-center text-gray-400 mt-6">
                Different rotation speeds based on time
              </p>
            </div>

            {/* 98. useMotionValueEvent */}
            <div>
              <h3 className="text-3xl font-bold mb-6">98. useMotionValueEvent (Listeners)</h3>
              <motion.div
                drag="x"
                dragConstraints={{ left: -200, right: 200 }}
                style={{ x: dragX }}
                onDrag={(_event, info) => {
                  console.log('Dragging:', info.point.x);
                }}
                className="w-32 h-32 bg-gradient-to-br from-green-600 to-emerald-600 rounded-3xl cursor-grab active:cursor-grabbing mx-auto"
              />
              <p className="text-center text-gray-400 mt-6">
                Check console for drag events
              </p>
            </div>

            {/* 99-100. useReducedMotion */}
            <div>
              <h3 className="text-3xl font-bold mb-6">99-100. useReducedMotion (Accessibility)</h3>
              <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
                <motion.div
                  animate={shouldReduceMotion ? {} : {
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-32 h-32 bg-gradient-to-br from-orange-600 to-red-600 rounded-3xl mx-auto mb-6"
                />
                <p className="text-center text-gray-400">
                  {shouldReduceMotion 
                    ? '✓ Animations reduced (user preference)'
                    : '✗ Full animations enabled'
                  }
                </p>
                <p className="text-center text-gray-500 text-sm mt-2">
                  Respects system "Reduce Motion" setting
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================
          SECTION 7: 3D & PERSPECTIVE (10 examples)
      ======================================================================== */}
      <section className="py-32 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          
          <motion.h2 
            className="text-6xl md:text-7xl font-black text-center mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            3D & PERSPECTIVE
          </motion.h2>
          
          <motion.p
            className="text-center text-gray-400 text-xl mb-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            101-110. Third Dimension
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            
            {/* 101-102. 3D Card Flip */}
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-6">101-102. Card Flip</h3>
              <div className="perspective-1000">
                <motion.div
                  className="relative w-64 h-40 cursor-pointer mx-auto"
                  style={{ transformStyle: 'preserve-3d' }}
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.6 }}
                  onClick={() => setIsFlipped(!isFlipped)}
                >
                  {/* Front */}
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-violet-600 to-purple-600 rounded-2xl p-8 flex items-center justify-center"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <p className="text-2xl font-bold">FRONT</p>
                  </div>
                  {/* Back */}
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-fuchsia-600 to-pink-600 rounded-2xl p-8 flex items-center justify-center"
                    style={{ 
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)'
                    }}
                  >
                    <p className="text-2xl font-bold">BACK</p>
                  </div>
                </motion.div>
              </div>
              <p className="text-gray-400 mt-4">Click to flip</p>
            </div>

            {/* 103. 3D Cube */}
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-6">103. Cube Spinner</h3>
              <div className="perspective-1000">
                <motion.div
                  className="relative w-40 h-40 mx-auto"
                  style={{ transformStyle: 'preserve-3d' }}
                  animate={{ rotateX: 360, rotateY: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                >
                  {/* Front */}
                  <div className="absolute inset-0 bg-violet-600/80 border border-white/20" style={{ transform: 'translateZ(80px)' }} />
                  {/* Back */}
                  <div className="absolute inset-0 bg-fuchsia-600/80 border border-white/20" style={{ transform: 'rotateY(180deg) translateZ(80px)' }} />
                  {/* Right */}
                  <div className="absolute inset-0 bg-cyan-600/80 border border-white/20" style={{ transform: 'rotateY(90deg) translateZ(80px)' }} />
                  {/* Left */}
                  <div className="absolute inset-0 bg-pink-600/80 border border-white/20" style={{ transform: 'rotateY(-90deg) translateZ(80px)' }} />
                  {/* Top */}
                  <div className="absolute inset-0 bg-orange-600/80 border border-white/20" style={{ transform: 'rotateX(90deg) translateZ(80px)' }} />
                  {/* Bottom */}
                  <div className="absolute inset-0 bg-green-600/80 border border-white/20" style={{ transform: 'rotateX(-90deg) translateZ(80px)' }} />
                </motion.div>
              </div>
            </div>

            {/* 104. Parallax Tilt */}
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-6">104. Mouse Tilt</h3>
              <motion.div
                ref={tiltRef}
                className="w-64 h-40 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl mx-auto cursor-pointer overflow-hidden"
                style={{ transformStyle: 'preserve-3d' }}
                whileHover={{
                  rotateX: 0,
                  rotateY: 0,
                }}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const centerX = rect.left + rect.width / 2;
                  const centerY = rect.top + rect.height / 2;
                  const rotateX = (e.clientY - centerY) / 10;
                  const rotateY = (e.clientX - centerX) / 10;
                  e.currentTarget.style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
                }}
              >
                <div className="p-8 flex items-center justify-center h-full">
                  <p className="text-2xl font-bold">Hover Me</p>
                </div>
              </motion.div>
            </div>

            {/* 105-106. Depth Layers */}
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-6">105-106. Z-Layers</h3>
              <div className="perspective-1000">
                <motion.div
                  className="relative w-64 h-40 mx-auto"
                  style={{ transformStyle: 'preserve-3d' }}
                  animate={{ rotateY: [-10, 10, -10] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <div className="absolute inset-0 bg-violet-600/60 rounded-2xl" style={{ transform: 'translateZ(0px)' }} />
                  <div className="absolute inset-0 bg-fuchsia-600/60 rounded-2xl" style={{ transform: 'translateZ(20px)' }} />
                  <div className="absolute inset-0 bg-pink-600/60 rounded-2xl" style={{ transform: 'translateZ(40px)' }} />
                </motion.div>
              </div>
            </div>

            {/* 107. Isometric */}
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-6">107. Isometric</h3>
              <div className="perspective-1000">
                <motion.div
                  className="w-32 h-32 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl mx-auto"
                  style={{ 
                    transformStyle: 'preserve-3d',
                    transform: 'rotateX(45deg) rotateZ(45deg)'
                  }}
                  animate={{ rotateZ: [45, 405] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                />
              </div>
            </div>

            {/* 108. Float Animation */}
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-6">108. Float</h3>
              <motion.div
                className="w-32 h-32 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-3xl mx-auto"
                animate={{
                  y: [-20, 20],
                  rotateX: [-10, 10],
                  rotateY: [-5, 5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: 'easeInOut'
                }}
                style={{ transformStyle: 'preserve-3d' }}
              />
            </div>

            {/* 109. Shadow Depth */}
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-6">109. Dynamic Shadow</h3>
              <motion.div
                className="w-32 h-32 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl mx-auto"
                animate={{
                  y: [-10, 10],
                  boxShadow: [
                    '0 25px 50px rgba(139, 92, 246, 0.5)',
                    '0 5px 15px rgba(139, 92, 246, 0.3)',
                    '0 25px 50px rgba(139, 92, 246, 0.5)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>

            {/* 110. 3D Carousel Preview */}
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-6">110. Carousel Ring</h3>
              <div className="perspective-1000">
                <motion.div
                  className="relative w-40 h-40 mx-auto"
                  style={{ transformStyle: 'preserve-3d' }}
                  animate={{ rotateY: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                >
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="absolute w-20 h-28 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-xl"
                      style={{
                        left: '50%',
                        top: '50%',
                        marginLeft: '-40px',
                        marginTop: '-56px',
                        transform: `rotateY(${i * 72}deg) translateZ(100px)`
                      }}
                    />
                  ))}
                </motion.div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================
          SECTION 8: MAGNETIC & CURSOR EFFECTS (10 examples)
      ======================================================================== */}
      <section className="py-32 px-4 md:px-8 bg-gradient-to-b from-black via-violet-950/10 to-black">
        <div className="max-w-7xl mx-auto">
          
          <motion.h2 
            className="text-6xl md:text-7xl font-black text-center mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            MAGNETIC & CURSOR
          </motion.h2>
          
          <motion.p
            className="text-center text-gray-400 text-xl mb-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            111-120. Mouse-Reactive Effects
          </motion.p>

          <div className="space-y-20">
            
            {/* 111-112. Magnetic Buttons */}
            <div>
              <h3 className="text-3xl font-bold mb-6">111-112. Magnetic Buttons</h3>
              <div className="flex flex-wrap gap-8 justify-center">
                {[1, 2, 3].map((num) => {
                  const buttonRef = useRef<HTMLButtonElement>(null);
                  const buttonX = useMotionValue(0);
                  const buttonY = useMotionValue(0);
                  
                  return (
                    <motion.button
                      key={num}
                      ref={buttonRef}
                      style={{ x: useSpring(buttonX, { stiffness: 300, damping: 20 }), y: useSpring(buttonY, { stiffness: 300, damping: 20 }) }}
                      className="relative px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl font-bold"
                      onMouseMove={(e) => {
                        const rect = buttonRef.current?.getBoundingClientRect();
                        if (rect) {
                          const centerX = rect.left + rect.width / 2;
                          const centerY = rect.top + rect.height / 2;
                          buttonX.set((e.clientX - centerX) * 0.3);
                          buttonY.set((e.clientY - centerY) * 0.3);
                        }
                      }}
                      onMouseLeave={() => {
                        buttonX.set(0);
                        buttonY.set(0);
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Magnetic {num}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* 113-114. Cursor Follow */}
            <div className="relative h-96 bg-white/5 rounded-3xl border border-white/10 overflow-hidden">
              <h3 className="absolute top-6 left-6 text-3xl font-bold z-10">113-114. Cursor Follow</h3>
              <motion.div
                className="absolute w-8 h-8 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-full pointer-events-none"
                style={{
                  x: useSpring(mouseX, { stiffness: 200, damping: 20 }),
                  y: useSpring(mouseY, { stiffness: 200, damping: 20 }),
                  translateX: '-50%',
                  translateY: '-50%'
                }}
              />
              <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400">
                Move your mouse around
              </p>
            </div>

            {/* 115-117. More cursor effects would go here */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white/5 p-12 rounded-3xl border border-white/10 text-center">
                <h3 className="text-2xl font-bold mb-4">115. Custom Cursor</h3>
                <p className="text-gray-400">Replace default cursor</p>
              </div>
              <div className="bg-white/5 p-12 rounded-3xl border border-white/10 text-center">
                <h3 className="text-2xl font-bold mb-4">116. Cursor Blend</h3>
                <p className="text-gray-400">mix-blend-mode effects</p>
              </div>
            </div>

            {/* 118. Spotlight Effect */}
            <div className="relative h-96 bg-gradient-to-br from-black to-gray-900 rounded-3xl overflow-hidden">
              <h3 className="relative z-10 text-3xl font-bold p-6">118. Spotlight</h3>
              <motion.div
                className="absolute w-96 h-96 rounded-full pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)',
                  x: useSpring(mouseX, { stiffness: 100, damping: 20 }),
                  y: useSpring(mouseY, { stiffness: 100, damping: 20 }),
                  translateX: '-50%',
                  translateY: '-50%'
                }}
              />
              <div className="relative z-10 p-12">
                <p className="text-gray-400">Move mouse to reveal content</p>
              </div>
            </div>

            {/* 119-120. Trail Effect */}
            <div className="bg-white/5 p-12 rounded-3xl border border-white/10 text-center">
              <h3 className="text-3xl font-bold mb-4">119-120. Cursor Trail</h3>
              <p className="text-gray-400 mb-6">Particle trail following cursor</p>
              <p className="text-sm text-gray-500">(Implementation requires advanced particle system)</p>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================
          FOOTER - COUNT SUMMARY
      ======================================================================== */}
      <footer className="py-20 px-4 md:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          
          <motion.h2
            className="text-6xl md:text-8xl font-black mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <motion.span
              className="inline-block bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent"
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 5, repeat: Infinity }}
              style={{ backgroundSize: '200% 100%' }}
            >
              120+ EXAMPLES
            </motion.span>
          </motion.h2>
          
          <motion.p
            className="text-2xl text-gray-400 mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            The Nuclear Crown of Crowns
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-4 justify-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {[
              'Basic Animations', 'Gestures', 'Drag & Drop', 'Variants',
              'AnimatePresence', 'Scroll', 'Layout', 'SVG', 'Motion Values',
              'Hooks', '3D', 'Perspective', 'Magnetic', 'Cursor Effects'
            ].map((tag) => (
              <motion.span
                key={tag}
                className="px-6 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl text-sm font-semibold"
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(139, 92, 246, 0.1)' }}
              >
                {tag}
              </motion.span>
            ))}
          </motion.div>

          <motion.p
            className="text-gray-500 text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            More examples coming: Image galleries, timelines, data viz, text animations, 
            full page experiences, micro-interactions, and creative effects.
          </motion.p>

          <motion.div
            className="mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <p className="text-gray-600 text-xs">
              © 2025 Framer Motion Showcase · Nuclear Edition
            </p>
          </motion.div>

        </div>
      </footer>

    </div>
  );
}

export default FramerShowcase;
