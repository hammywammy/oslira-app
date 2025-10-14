/**
 * 🏎️ THE FERRARI COMPONENT LAB - COMPLETE
 * Tailwind v4 × Framer Motion × Iconify
 * Production-grade. Zero compromises. Crown jewel showcase.
 */

import { motion, useScroll, useTransform, AnimatePresence, useSpring, useMotionValue, useInView } from 'framer-motion';
import { useState, useRef } from 'react';
import { Icon } from '@iconify/react';

export function ComponentLab() {
// ============================================================================
// STATE MANAGEMENT
// ============================================================================
const [activePricing, setActivePricing] = useState<'monthly' | 'yearly'>('monthly');
const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
const [menuOpen, setMenuOpen] = useState(false);
const [activeTab, setActiveTab] = useState(0);
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [showSuccess, setShowSuccess] = useState(false);
const [showModal, setShowModal] = useState(false);
const [showDrawer, setShowDrawer] = useState(false);
const [selectedColor, setSelectedColor] = useState('#ef4444');
const [sliderValue, setSliderValue] = useState(50);
const [searchQuery, setSearchQuery] = useState('');
const [selectedTags, setSelectedTags] = useState<string[]>(['React', 'TypeScript']);
const [loading, setLoading] = useState(false);
const [rememberMe, setRememberMe] = useState(false);
const [formStep, setFormStep] = useState(1);
const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
const [dragActive, setDragActive] = useState(false);
const [rating, setRating] = useState(0);
const [hoveredRating, setHoveredRating] = useState(0);
const [selectedRows, setSelectedRows] = useState<number[]>([]);
const [currentPage, setCurrentPage] = useState(1);
const [showToast, setShowToast] = useState(false);
const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');
const [accordionOpen, setAccordionOpen] = useState<number[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ============================================================================
  // REFS & SCROLL ANIMATIONS
  // ============================================================================
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 15 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 15 });

  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const isStatsInView = useInView(statsRef, { once: true });

  // ============================================================================
  // MOCK DATA
  // ============================================================================
  const tableData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'Inactive' },
    { id: 4, name: 'Alice Williams', email: 'alice@example.com', role: 'Manager', status: 'Active' },
    { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', role: 'User', status: 'Pending' },
  ];

  const availableTags = ['React', 'TypeScript', 'Tailwind', 'Framer Motion', 'Node.js', 'Python'];

  // ============================================================================
  // HANDLERS
  // ============================================================================
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = heroRef.current?.getBoundingClientRect();
    if (rect) {
      mouseX.set((e.clientX - rect.left - rect.width / 2) / 20);
      mouseY.set((e.clientY - rect.top - rect.height / 2) / 20);
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowSuccess(true);
      setEmail('');
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  const addTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files).map(f => f.name);
      setSelectedFiles([...selectedFiles, ...newFiles]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const toggleRowSelection = (id: number) => {
    setSelectedRows(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const showToastNotification = (type: 'success' | 'error' | 'info') => {
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const toggleAccordion = (index: number) => {
    setAccordionOpen(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  // ============================================================================
  // ANIMATION VARIANTS
  // ============================================================================
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  const cardHoverVariants = {
    rest: { scale: 1, y: 0 },
    hover: {
      scale: 1.05,
      y: -10,
      transition: { type: 'spring', stiffness: 400, damping: 17 }
    }
  };

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
          FLOATING ACTION BUTTON
      ======================================================================== */}
      <motion.button
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-red-600 to-orange-600 rounded-full shadow-2xl flex items-center justify-center z-40"
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <Icon icon="mdi:rocket-launch" className="text-3xl" />
      </motion.button>

      {/* ========================================================================
          TOAST NOTIFICATIONS
      ======================================================================== */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className="fixed top-8 right-8 z-50"
          >
            <div className={`px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 ${
              toastType === 'success' ? 'bg-green-600' :
              toastType === 'error' ? 'bg-red-600' : 'bg-blue-600'
            }`}>
              <Icon icon={
                toastType === 'success' ? 'mdi:check-circle' :
                toastType === 'error' ? 'mdi:alert-circle' : 'mdi:information'
              } className="text-2xl" />
              <span className="font-semibold">
                {toastType === 'success' ? 'Success!' :
                 toastType === 'error' ? 'Error!' : 'Info'}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================
          HERO SECTION - SCROLLYTELLING
      ======================================================================== */}
      <motion.section 
        ref={heroRef}
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{ opacity: heroOpacity, scale: heroScale }}
        onMouseMove={handleMouseMove}
      >
        {/* Animated Background Blobs */}
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

        {/* 3D Tilt Cards */}
        <motion.div
          className="absolute top-20 left-10 w-64 h-40 bg-gradient-to-br from-red-500/20 to-orange-500/20 backdrop-blur-md rounded-3xl border border-white/10"
          style={{ x: smoothMouseX, y: smoothMouseY }}
        >
          <div className="p-6">
            <Icon icon="mdi:speedometer" className="text-5xl text-red-500 mb-2" />
            <p className="text-sm text-gray-300">High Performance</p>
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-20 right-10 w-64 h-40 bg-gradient-to-br from-yellow-500/20 to-red-500/20 backdrop-blur-md rounded-3xl border border-white/10"
          style={{ x: useTransform(smoothMouseX, v => -v), y: useTransform(smoothMouseY, v => -v) }}
        >
          <div className="p-6">
            <Icon icon="mdi:lightning-bolt" className="text-5xl text-yellow-500 mb-2" />
            <p className="text-sm text-gray-300">Lightning Fast</p>
          </div>
        </motion.div>

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
                className="px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl font-bold text-lg flex items-center gap-2"
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(220, 38, 38, 0.4)' }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon icon="mdi:rocket-launch" />
                Explore Components
              </motion.button>
              <motion.button
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl font-bold text-lg flex items-center gap-2"
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon icon="mdi:code-braces" />
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
          STATS DASHBOARD - ANIMATED COUNTERS
      ======================================================================== */}
      <section className="py-32 px-4 md:px-8 bg-gradient-to-b from-black via-red-950/10 to-black">
        <div className="max-w-7xl mx-auto" ref={statsRef}>
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="text-red-500 font-bold text-sm uppercase tracking-wider">Performance Metrics</span>
            <h2 className="text-5xl md:text-6xl font-black mt-4 mb-6">Built for Speed</h2>
            <p className="text-xl text-gray-400">Numbers that make other frameworks jealous</p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
          >
            {[
              { value: 99.9, suffix: '%', label: 'Uptime', icon: 'mdi:shield-check', color: 'from-green-500 to-emerald-500' },
              { value: 150, suffix: '+', label: 'Components', icon: 'mdi:cube-outline', color: 'from-blue-500 to-cyan-500' },
              { value: 10, suffix: 'M+', label: 'Downloads', icon: 'mdi:download', color: 'from-purple-500 to-pink-500' },
              { value: 4.9, suffix: '/5', label: 'Rating', icon: 'mdi:star', color: 'from-yellow-500 to-orange-500' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 relative overflow-hidden"
                whileHover={{ y: -5, borderColor: 'rgba(239, 68, 68, 0.3)' }}
              >
                <motion.div
                  className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-20 blur-2xl`}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.3, 0.2],
                  }}
                  transition={{ duration: 3, repeat: Infinity, delay: index * 0.2 }}
                />
                
                <Icon icon={stat.icon} className={`text-5xl mb-4 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} />
                
                <motion.div
                  className="text-5xl font-black mb-2"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={isStatsInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: index * 0.1, type: 'spring' }}
                >
                  {stat.value}{stat.suffix}
                </motion.div>
                
                <p className="text-gray-400 font-semibold">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ========================================================================
          NAVIGATION SYSTEMS
      ======================================================================== */}
      <section className="py-32 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="text-orange-500 font-bold text-sm uppercase tracking-wider">Section 01</span>
            <h2 className="text-5xl md:text-6xl font-black mt-4 mb-6">Navigation Systems</h2>
            <p className="text-xl text-gray-400">Mega menus, command palettes, and more</p>
          </motion.div>

          {/* Mega Menu */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <span className="text-orange-500 font-mono text-sm mb-4 block">Nav_01_MegaMenu.tsx</span>
            <div className="relative">
              <motion.button
                className="px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl font-bold flex items-center gap-2"
                onClick={() => setMenuOpen(!menuOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon icon="mdi:menu" className="text-2xl" />
                {menuOpen ? 'Close' : 'Open'} Mega Menu
              </motion.button>

              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-white/10 overflow-hidden"
                  >
                    <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                      {[
                        { title: 'PRODUCTS', items: ['Analytics', 'Marketing', 'Commerce', 'Insights'] },
                        { title: 'RESOURCES', items: ['Documentation', 'Guides', 'API Reference', 'Examples'] },
                        { title: 'COMPANY', items: ['About', 'Blog', 'Careers', 'Contact'] },
                      ].map((column) => (
                        <div key={column.title}>
                          <h3 className="text-sm font-bold text-gray-400 mb-4">{column.title}</h3>
                          <div className="space-y-3">
                            {column.items.map((item) => (
                              <motion.a
                                key={item}
                                href="#"
                                className="block text-gray-300 hover:text-white transition-colors"
                                whileHover={{ x: 5 }}
                              >
                                {item}
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

          {/* Tabs System */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <span className="text-orange-500 font-mono text-sm mb-4 block">Nav_02_Tabs.tsx</span>
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-white/10 p-8">
              <div className="bg-white/5 rounded-xl p-2 inline-flex mb-6">
                {['Overview', 'Analytics', 'Reports', 'Settings'].map((tab, index) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(index)}
                    className="relative px-6 py-3 font-semibold transition-colors"
                    style={{ color: activeTab === index ? 'white' : 'rgb(156, 163, 175)' }}
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

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="text-gray-300"
                >
                  <h3 className="text-2xl font-bold mb-4">
                    {['Overview', 'Analytics', 'Reports', 'Settings'][activeTab]} Content
                  </h3>
                  <p>This is the content for the {['Overview', 'Analytics', 'Reports', 'Settings'][activeTab]} tab. Seamless transitions powered by Framer Motion.</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Breadcrumbs */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-orange-500 font-mono text-sm mb-4 block">Nav_03_Breadcrumbs.tsx</span>
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-white/10 p-8">
              <div className="flex items-center gap-2 flex-wrap">
                {['Home', 'Products', 'Category', 'Item'].map((crumb, index, array) => (
                  <motion.div
                    key={crumb}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-2"
                  >
                    <motion.a
                      href="#"
                      className={`font-semibold ${index === array.length - 1 ? 'text-red-500' : 'text-gray-400 hover:text-white'}`}
                      whileHover={{ scale: 1.05 }}
                    >
                      {crumb}
                    </motion.a>
                    {index < array.length - 1 && (
                      <Icon icon="mdi:chevron-right" className="text-gray-600" />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========================================================================
          CARD VARIATIONS
      ======================================================================== */}
      <section className="py-32 px-4 md:px-8 bg-gradient-to-b from-black via-orange-950/10 to-black">
        <div className="max-w-7xl mx-auto">
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="text-orange-500 font-bold text-sm uppercase tracking-wider">Section 02</span>
            <h2 className="text-5xl md:text-6xl font-black mt-4 mb-6">Card Variations</h2>
            <p className="text-xl text-gray-400">Every card type you'll ever need</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Media Card */}
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/10"
              initial="rest"
              whileHover="hover"
              animate="rest"
            >
              <motion.div 
                className="h-48 bg-gradient-to-br from-red-600 to-orange-600 relative overflow-hidden"
                variants={cardHoverVariants}
              >
                <Icon icon="mdi:image" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl text-white/20" />
              </motion.div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">Media Card</h3>
                <p className="text-gray-400 mb-4">Perfect for showcasing images and videos with overlay content</p>
                <motion.button
                  className="px-4 py-2 bg-red-600 rounded-lg font-semibold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Learn More
                </motion.button>
              </div>
            </motion.div>

            {/* Metric Card */}
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10"
              whileHover={{ y: -5, borderColor: 'rgba(239, 68, 68, 0.3)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <Icon icon="mdi:trending-up" className="text-4xl text-green-500" />
                <motion.span 
                  className="px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-sm font-bold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  +12.5%
                </motion.span>
              </div>
              <div className="text-4xl font-black mb-2">$24,500</div>
              <p className="text-gray-400">Monthly Revenue</p>
              <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                  initial={{ width: 0 }}
                  animate={{ width: '75%' }}
                  transition={{ delay: 0.3, duration: 1 }}
                />
              </div>
            </motion.div>

            {/* Profile Card */}
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 text-center"
              whileHover={{ y: -5 }}
            >
              <motion.div
                className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                <Icon icon="mdi:account" className="text-5xl" />
              </motion.div>
              <h3 className="text-2xl font-bold mb-2">Sarah Johnson</h3>
              <p className="text-gray-400 mb-4">Senior Designer</p>
              <div className="flex gap-2 justify-center">
                {['mdi:twitter', 'mdi:linkedin', 'mdi:github'].map((icon) => (
                  <motion.a
                    key={icon}
                    href="#"
                    className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center"
                    whileHover={{ scale: 1.2, backgroundColor: 'rgba(239, 68, 68, 0.2)' }}
                  >
                    <Icon icon={icon} />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Pricing Card */}
            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-br from-red-950 to-black rounded-3xl p-8 border-2 border-red-500 relative overflow-hidden"
              whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(239, 68, 68, 0.3)' }}
            >
              <motion.div
                className="absolute top-0 right-0 px-4 py-2 bg-red-500 text-sm font-bold"
                initial={{ x: 100 }}
                animate={{ x: 0 }}
              >
                POPULAR
              </motion.div>
              <h3 className="text-3xl font-black mb-2 mt-8">Pro Plan</h3>
              <div className="text-5xl font-black mb-4">
                $99<span className="text-2xl text-gray-400">/mo</span>
              </div>
              <ul className="space-y-3 mb-6">
                {['Unlimited Projects', 'Priority Support', 'Advanced Analytics', 'Custom Branding'].map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Icon icon="mdi:check-circle" className="text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <motion.button
                className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl font-bold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </motion.button>
            </motion.div>

            {/* Testimonial Card */}
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10"
              whileHover={{ y: -5 }}
            >
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Icon key={star} icon="mdi:star" className="text-2xl text-yellow-500" />
                ))}
              </div>
              <p className="text-lg mb-6 italic">
                "This component library is absolutely incredible. The attention to detail and quality is unmatched!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full" />
                <div>
                  <div className="font-bold">Alex Chen</div>
                  <div className="text-sm text-gray-400">CEO, TechCorp</div>
                </div>
              </div>
            </motion.div>

            {/* Product Card */}
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/10 cursor-pointer"
              whileHover={{ y: -10 }}
              onClick={() => setSelectedProduct(1)}
            >
              <div className="h-48 bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center relative overflow-hidden">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                >
                  <Icon icon="mdi:package-variant" className="text-8xl text-white/20" />
                </motion.div>
                <motion.div
                  className="absolute top-4 right-4 px-3 py-1 bg-red-500 rounded-full text-sm font-bold"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  SALE
                </motion.div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold">Premium Widget</h3>
                  <Icon icon="mdi:heart-outline" className="text-2xl text-gray-400 hover:text-red-500 cursor-pointer" />
                </div>
                <p className="text-gray-400 mb-4">High-quality component for modern applications</p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold">$49</span>
                    <span className="text-gray-400 line-through ml-2">$99</span>
                  </div>
                  <motion.button
                    className="px-4 py-2 bg-blue-600 rounded-lg font-semibold"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Add to Cart
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ========================================================================
          BUTTON VARIATIONS
      ======================================================================== */}
      <section className="py-32 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="text-yellow-500 font-bold text-sm uppercase tracking-wider">Section 03</span>
            <h2 className="text-5xl md:text-6xl font-black mt-4 mb-6">Button Systems</h2>
            <p className="text-xl text-gray-400">Every button state and variation</p>
          </motion.div>

          <div className="space-y-12">
            {/* Solid Buttons */}
            <div>
              <h3 className="text-2xl font-bold mb-6">Solid Buttons</h3>
              <div className="flex flex-wrap gap-4">
                <motion.button
                  className="px-6 py-3 bg-red-600 rounded-xl font-bold"
                  whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(220, 38, 38, 0.4)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  Primary
                </motion.button>
                <motion.button
                  className="px-6 py-3 bg-gray-700 rounded-xl font-bold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Secondary
                </motion.button>
                <motion.button
                  className="px-6 py-3 bg-green-600 rounded-xl font-bold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Success
                </motion.button>
                <motion.button
                  className="px-6 py-3 bg-yellow-600 rounded-xl font-bold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Warning
                </motion.button>
                <motion.button
                  className="px-6 py-3 bg-red-600 rounded-xl font-bold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Danger
                </motion.button>
              </div>
            </div>

            {/* Ghost Buttons */}
            <div>
              <h3 className="text-2xl font-bold mb-6">Ghost Buttons</h3>
              <div className="flex flex-wrap gap-4">
                <motion.button
                  className="px-6 py-3 border-2 border-red-600 text-red-600 rounded-xl font-bold"
                  whileHover={{ backgroundColor: 'rgba(220, 38, 38, 0.1)', scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Ghost Primary
                </motion.button>
                <motion.button
                  className="px-6 py-3 border-2 border-gray-600 text-gray-300 rounded-xl font-bold"
                  whileHover={{ backgroundColor: 'rgba(75, 85, 99, 0.1)', scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Ghost Secondary
                </motion.button>
              </div>
            </div>

            {/* Icon Buttons */}
            <div>
              <h3 className="text-2xl font-bold mb-6">Icon Buttons</h3>
              <div className="flex flex-wrap gap-4">
                {['mdi:home', 'mdi:heart', 'mdi:cart', 'mdi:bell', 'mdi:settings'].map((icon) => (
                  <motion.button
                    key={icon}
                    className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center"
                    whileHover={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', rotate: 15, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Icon icon={icon} className="text-2xl" />
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Loading Buttons */}
            <div>
              <h3 className="text-2xl font-bold mb-6">Loading States</h3>
              <div className="flex flex-wrap gap-4">
                <motion.button
                  className="px-6 py-3 bg-red-600 rounded-xl font-bold flex items-center gap-2"
                  onClick={() => {
                    setLoading(true);
                    setTimeout(() => setLoading(false), 2000);
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <Icon icon="mdi:loading" className="text-xl" />
                      </motion.div>
                      Loading...
                    </>
                  ) : (
                    'Click to Load'
                  )}
                </motion.button>

                <AnimatePresence mode="wait">
                  {showSuccess && (
                    <motion.button
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="px-6 py-3 bg-green-600 rounded-xl font-bold flex items-center gap-2"
                    >
                      <Icon icon="mdi:check" className="text-xl" />
                      Success!
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Gradient Buttons */}
            <div>
              <h3 className="text-2xl font-bold mb-6">Gradient Buttons</h3>
              <div className="flex flex-wrap gap-4">
                <motion.button
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl font-bold"
                  whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(220, 38, 38, 0.4)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  Gradient Red
                </motion.button>
                <motion.button
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold"
                  whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(168, 85, 247, 0.4)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  Gradient Purple
                </motion.button>
                <motion.button
                  className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl font-bold"
                  whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(8, 145, 178, 0.4)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  Gradient Cyan
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </section>

     {/* ========================================================================
    FORM COMPONENTS
======================================================================== */}
<section className="py-32 px-4 md:px-8 bg-gradient-to-b from-black via-red-950/10 to-black">
  <div className="max-w-7xl mx-auto">
    
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-20"
    >
      <span className="text-red-500 font-bold text-sm uppercase tracking-wider">Section 04</span>
      <h2 className="text-5xl md:text-6xl font-black mt-4 mb-6">Form Systems</h2>
      <p className="text-xl text-gray-400">Beautiful forms with validation</p>
    </motion.div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      {/* Login Form */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 border border-white/10"
      >
        <h3 className="text-3xl font-black mb-6 flex items-center gap-2">
          <Icon icon="mdi:login" className="text-red-500" />
          Login Form
        </h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Email Address</label>
            <motion.input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-red-500 transition-colors"
              placeholder="you@example.com"
              whileFocus={{ scale: 1.02 }}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Password</label>
            <motion.input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-red-500 transition-colors"
              placeholder="••••••••"
              whileFocus={{ scale: 1.02 }}
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <motion.div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                  rememberMe ? 'bg-red-600 border-red-600' : 'border-white/20'
                }`}
                onClick={() => setRememberMe(!rememberMe)}
                whileTap={{ scale: 0.9 }}
              >
                {rememberMe && <Icon icon="mdi:check" className="text-sm" />}
              </motion.div>
              <span className="text-sm">Remember me</span>
            </label>
            <a href="#" className="text-sm text-red-500 hover:text-red-400">
              Forgot password?
            </a>
          </div>
          <motion.button
            onClick={handleEmailSubmit}
            className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl font-bold flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(220, 38, 38, 0.4)' }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
          >
            {loading ? (
              <>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                  <Icon icon="mdi:loading" className="text-xl" />
                </motion.div>
                Signing in...
              </>
            ) : (
              <>
                <Icon icon="mdi:login" />
                Sign In
              </>
            )}
          </motion.button>
        </div>
        <p className="text-center text-sm text-gray-400 mt-6">
          Don't have an account? <a href="#" className="text-red-500 hover:text-red-400 font-semibold">Sign up</a>
        </p>
      </motion.div>

      {/* Multi-Step Form */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 border border-white/10"
      >
        <h3 className="text-3xl font-black mb-6 flex items-center gap-2">
          <Icon icon="mdi:file-document-multiple" className="text-orange-500" />
          Multi-Step Form
        </h3>
        
        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center flex-1">
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  formStep >= step ? 'bg-red-600' : 'bg-white/10'
                }`}
                animate={{ scale: formStep === step ? [1, 1.2, 1] : 1 }}
                transition={{ duration: 0.3 }}
              >
                {formStep > step ? <Icon icon="mdi:check" /> : step}
              </motion.div>
              {step < 3 && (
                <div className={`flex-1 h-1 mx-2 ${formStep > step ? 'bg-red-600' : 'bg-white/10'}`} />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {formStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h4 className="text-xl font-bold mb-4">Step 1: Personal Info</h4>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-red-500"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-red-500"
              />
            </motion.div>
          )}
          {formStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h4 className="text-xl font-bold mb-4">Step 2: Company Details</h4>
              <input
                type="text"
                placeholder="Company Name"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-red-500"
              />
              <input
                type="text"
                placeholder="Job Title"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-red-500"
              />
            </motion.div>
          )}
          {formStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h4 className="text-xl font-bold mb-4">Step 3: Preferences</h4>
              <textarea
                placeholder="Tell us about your needs..."
                rows={4}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-red-500 resize-none"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-4 mt-6">
          {formStep > 1 && (
            <motion.button
              onClick={() => setFormStep(formStep - 1)}
              className="flex-1 px-6 py-3 bg-white/10 rounded-xl font-bold"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Back
            </motion.button>
          )}
          <motion.button
            onClick={() => formStep < 3 ? setFormStep(formStep + 1) : showToastNotification('success')}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl font-bold"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {formStep === 3 ? 'Submit' : 'Next'}
          </motion.button>
        </div>
      </motion.div>

      {/* File Upload */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 border border-white/10"
      >
        <h3 className="text-3xl font-black mb-6 flex items-center gap-2">
          <Icon icon="mdi:cloud-upload" className="text-blue-500" />
          File Upload
        </h3>
        
        <motion.div
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors ${
            dragActive ? 'border-red-500 bg-red-500/10' : 'border-white/20 hover:border-red-500/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            animate={{ y: dragActive ? -10 : 0 }}
          >
            <Icon icon="mdi:cloud-upload-outline" className="text-6xl text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-semibold mb-2">
              {dragActive ? 'Drop files here' : 'Drag & drop files here'}
            </p>
            <p className="text-sm text-gray-400">or click to browse</p>
          </motion.div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => handleFileUpload(e.target.files)}
          />
        </motion.div>

        {selectedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-6 space-y-2"
          >
            {selectedFiles.map((file, index) => (
              <motion.div
                key={file}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-white/5 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <Icon icon="mdi:file-document" className="text-2xl text-blue-500" />
                  <span className="text-sm">{file}</span>
                </div>
                <motion.button
                  onClick={() => setSelectedFiles(selectedFiles.filter(f => f !== file))}
                  className="text-red-500 hover:text-red-400"
                  whileHover={{ rotate: 90 }}
                >
                  <Icon icon="mdi:close" />
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Search & Filter */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 border border-white/10"
      >
        <h3 className="text-3xl font-black mb-6 flex items-center gap-2">
          <Icon icon="mdi:magnify" className="text-purple-500" />
          Search & Tags
        </h3>
        
        <div className="relative mb-6">
          <Icon icon="mdi:magnify" className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-400" />
          <motion.input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search components..."
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500"
            whileFocus={{ scale: 1.02 }}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-3">Selected Tags</label>
          <div className="flex flex-wrap gap-2 mb-4">
            <AnimatePresence>
              {selectedTags.map((tag) => (
                <motion.span
                  key={tag}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="px-4 py-2 bg-purple-600 rounded-full text-sm font-semibold flex items-center gap-2"
                >
                  {tag}
                  <motion.button
                    onClick={() => removeTag(tag)}
                    whileHover={{ rotate: 90 }}
                  >
                    <Icon icon="mdi:close" />
                  </motion.button>
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-3">Available Tags</label>
          <div className="flex flex-wrap gap-2">
            {availableTags.filter(tag => !selectedTags.includes(tag)).map((tag) => (
              <motion.button
                key={tag}
                onClick={() => addTag(tag)}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm font-semibold"
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(168, 85, 247, 0.2)', borderColor: 'rgba(168, 85, 247, 0.5)' }}
                whileTap={{ scale: 0.95 }}
              >
                + {tag}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  </div>
</section>

      {/* ========================================================================
    MODAL & DRAWER SYSTEMS
======================================================================== */}
<section className="py-32 px-4 md:px-8">
  <div className="max-w-7xl mx-auto">
    
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-20"
    >
      <span className="text-cyan-500 font-bold text-sm uppercase tracking-wider">Section 05</span>
      <h2 className="text-5xl md:text-6xl font-black mt-4 mb-6">Modal & Drawer Systems</h2>
      <p className="text-xl text-gray-400">Overlays done right</p>
    </motion.div>

    <div className="flex flex-wrap gap-4 justify-center mb-12">
      <motion.button
        onClick={() => setShowModal(true)}
        className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl font-bold flex items-center gap-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Icon icon="mdi:window-maximize" />
        Open Modal
      </motion.button>

      <motion.button
        onClick={() => setShowDrawer(true)}
        className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold flex items-center gap-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Icon icon="mdi:menu" />
        Open Drawer
      </motion.button>

      <motion.button
        onClick={() => showToastNotification('info')}
        className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl font-bold flex items-center gap-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Icon icon="mdi:bell" />
        Show Toast
      </motion.button>
    </div>

    {/* Centered Modal */}
    <AnimatePresence>
      {showModal && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl"
          >
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 border border-white/10 m-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-3xl font-black">Beautiful Modal</h3>
                <motion.button
                  onClick={() => setShowModal(false)}
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center"
                  whileHover={{ rotate: 90, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                >
                  <Icon icon="mdi:close" className="text-xl" />
                </motion.button>
              </div>
              <p className="text-gray-400 mb-6">
                This is a production-grade modal with smooth animations, backdrop blur, and focus management. 
                It handles all edge cases and provides an excellent user experience.
              </p>
              <div className="flex gap-4">
                <motion.button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 bg-white/10 rounded-xl font-bold"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={() => {
                    setShowModal(false);
                    showToastNotification('success');
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl font-bold"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Confirm
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>

    {/* Side Drawer */}
    <AnimatePresence>
      {showDrawer && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDrawer(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-gradient-to-br from-gray-900 to-black border-l border-white/10 z-50 overflow-y-auto"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-3xl font-black">Side Drawer</h3>
                <motion.button
                  onClick={() => setShowDrawer(false)}
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center"
                  whileHover={{ rotate: 90, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                >
                  <Icon icon="mdi:close" className="text-xl" />
                </motion.button>
              </div>

              <nav className="space-y-2">
                {[
                  { icon: 'mdi:home', label: 'Dashboard' },
                  { icon: 'mdi:folder', label: 'Projects' },
                  { icon: 'mdi:account-group', label: 'Team' },
                  { icon: 'mdi:chart-line', label: 'Analytics' },
                  { icon: 'mdi:cog', label: 'Settings' },
                ].map((item, index) => (
                  <motion.a
                    key={item.label}
                    href="#"
                    className="block px-4 py-3 bg-white/5 rounded-xl font-semibold hover:bg-white/10 flex items-center gap-3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 5 }}
                  >
                    <Icon icon={item.icon} className="text-xl" />
                    {item.label}
                  </motion.a>
                ))}
              </nav>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  </div>
</section>

{/* ========================================================================
    DATA TABLES
======================================================================== */}
<section className="py-32 px-4 md:px-8 bg-gradient-to-b from-black via-blue-950/10 to-black">
  <div className="max-w-7xl mx-auto">
    
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-20"
    >
      <span className="text-blue-500 font-bold text-sm uppercase tracking-wider">Section 06</span>
      <h2 className="text-5xl md:text-6xl font-black mt-4 mb-6">Data Tables</h2>
      <p className="text-xl text-gray-400">Sortable, filterable, beautiful</p>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-gradient-to-br from-gray-900 to-black rounded-3xl border border-white/10 overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-6 py-4 text-left">
                <motion.div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer ${
                    selectedRows.length === tableData.length ? 'bg-blue-600 border-blue-600' : 'border-white/20'
                  }`}
                  onClick={() => 
                    selectedRows.length === tableData.length 
                      ? setSelectedRows([])
                      : setSelectedRows(tableData.map(row => row.id))
                  }
                  whileTap={{ scale: 0.9 }}
                >
                  {selectedRows.length === tableData.length && <Icon icon="mdi:check" className="text-sm" />}
                </motion.div>
              </th>
              {['Name', 'Email', 'Role', 'Status'].map((header) => (
                <th key={header} className="px-6 py-4 text-left">
                  <motion.button
                    className="flex items-center gap-2 font-bold hover:text-blue-500"
                    whileHover={{ x: 5 }}
                  >
                    {header}
                    <Icon icon="mdi:arrow-up-down" className="text-sm" />
                  </motion.button>
                </th>
              ))}
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <motion.tr
                key={row.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-white/5 hover:bg-white/5"
              >
                <td className="px-6 py-4">
                  <motion.div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer ${
                      selectedRows.includes(row.id) ? 'bg-blue-600 border-blue-600' : 'border-white/20'
                    }`}
                    onClick={() => toggleRowSelection(row.id)}
                    whileTap={{ scale: 0.9 }}
                  >
                    {selectedRows.includes(row.id) && <Icon icon="mdi:check" className="text-sm" />}
                  </motion.div>
                </td>
                <td className="px-6 py-4 font-semibold">{row.name}</td>
                <td className="px-6 py-4 text-gray-400">{row.email}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm font-semibold">
                    {row.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    row.status === 'Active' ? 'bg-green-600/20 text-green-400' :
                    row.status === 'Pending' ? 'bg-yellow-600/20 text-yellow-400' :
                    'bg-red-600/20 text-red-400'
                  }`}>
                    {row.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <motion.button
                      className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center"
                      whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.2)' }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Icon icon="mdi:pencil" />
                    </motion.button>
                    <motion.button
                      className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center"
                      whileHover={{ backgroundColor: 'rgba(239, 68, 68, 0.2)' }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Icon icon="mdi:delete" />
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between p-6 border-t border-white/10">
        <p className="text-sm text-gray-400">
          Showing <span className="font-semibold text-white">1-5</span> of <span className="font-semibold text-white">50</span>
        </p>
        <div className="flex gap-2">
          <motion.button
            className="px-4 py-2 bg-white/10 rounded-lg font-semibold"
            whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
            whileTap={{ scale: 0.95 }}
          >
            Previous
          </motion.button>
          {[1, 2, 3, 4, 5].map((page) => (
            <motion.button
              key={page}
              className={`w-10 h-10 rounded-lg font-semibold ${
                currentPage === page ? 'bg-blue-600' : 'bg-white/10'
              }`}
              onClick={() => setCurrentPage(page)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {page}
            </motion.button>
          ))}
          <motion.button
            className="px-4 py-2 bg-white/10 rounded-lg font-semibold"
            whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
            whileTap={{ scale: 0.95 }}
          >
            Next
          </motion.button>
        </div>
      </div>
    </motion.div>
  </div>
</section>

{/* ========================================================================
    ACCORDIONS & DISCLOSURES
======================================================================== */}
<section className="py-32 px-4 md:px-8">
  <div className="max-w-4xl mx-auto">
    
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-20"
    >
      <span className="text-green-500 font-bold text-sm uppercase tracking-wider">Section 07</span>
      <h2 className="text-5xl md:text-6xl font-black mt-4 mb-6">Accordions</h2>
      <p className="text-xl text-gray-400">Expandable content sections</p>
    </motion.div>

    <div className="space-y-4">
      {[
        {
          title: 'What is Ferrari Component Lab?',
          content: 'Ferrari Component Lab is the ultimate showcase of production-grade UI components built with Tailwind v4, Framer Motion, and Iconify. Every component is crafted with attention to detail and real-world usability.'
        },
        {
          title: 'How do I use these components?',
          content: 'Simply copy the code for any component you like and paste it into your project. All components are built with TypeScript strict mode and follow best practices for accessibility and performance.'
        },
        {
          title: 'Are these components accessible?',
          content: 'Yes! Every component follows WCAG guidelines and includes proper ARIA labels, keyboard navigation, and focus management. We take accessibility seriously.'
        },
        {
          title: 'Can I customize the styling?',
          content: 'Absolutely! All components use Tailwind CSS classes, making it easy to customize colors, spacing, and other styles to match your brand.'
        },
      ].map((item, _index) => (
        <motion.div
          key={_index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: _index * 0.1 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden"
        >
          <motion.button
            onClick={() => toggleAccordion(_index)}
            className="w-full px-6 py-4 flex items-center justify-between text-left font-bold hover:bg-white/5"
            whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
          >
            <span className="text-lg">{item.title}</span>
            <motion.div
              animate={{ rotate: accordionOpen.includes(_index) ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <Icon icon="mdi:chevron-down" className="text-2xl" />
            </motion.div>
          </motion.button>
          
          <AnimatePresence>
            {accordionOpen.includes(_index) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-6 py-4 text-gray-400 border-t border-white/10">
                  {item.content}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  </div>
</section>

{/* ========================================================================
    PROGRESS & SLIDERS
======================================================================== */}
<section className="py-32 px-4 md:px-8 bg-gradient-to-b from-black via-purple-950/10 to-black">
  <div className="max-w-4xl mx-auto">
    
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-20"
    >
      <span className="text-purple-500 font-bold text-sm uppercase tracking-wider">Section 08</span>
      <h2 className="text-5xl md:text-6xl font-black mt-4 mb-6">Progress & Sliders</h2>
      <p className="text-xl text-gray-400">Track progress and control values</p>
    </motion.div>

    <div className="space-y-12">
      
      {/* Linear Progress */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10"
      >
        <h3 className="text-2xl font-bold mb-6">Linear Progress</h3>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-semibold">Upload Progress</span>
              <span className="text-sm font-semibold text-blue-500">75%</span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-600 to-cyan-600"
                initial={{ width: 0 }}
                animate={{ width: '75%' }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-semibold">Processing</span>
              <span className="text-sm font-semibold text-green-500">100%</span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-green-600 to-emerald-600"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-semibold">Downloading</span>
              <span className="text-sm font-semibold text-purple-500">45%</span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
                initial={{ width: 0 }}
                animate={{ width: '45%' }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Circular Progress */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10"
      >
        <h3 className="text-2xl font-bold mb-6">Circular Progress</h3>
        <div className="flex gap-8 justify-center">
          {[
            { value: 75, color: 'from-red-600 to-orange-600', label: 'Speed' },
            { value: 90, color: 'from-blue-600 to-cyan-600', label: 'Quality' },
            { value: 60, color: 'from-green-600 to-emerald-600', label: 'Efficiency' },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <div className="relative w-32 h-32 mb-4">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="8"
                    fill="none"
                  />
                  <motion.circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 56 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 56 * (1 - item.value / 100) }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ef4444" />
                      <stop offset="100%" stopColor="#f97316" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-black">{item.value}%</span>
                </div>
              </div>
              <p className="font-semibold text-gray-400">{item.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Slider */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10"
      >
        <h3 className="text-2xl font-bold mb-6">Interactive Slider</h3>
        <div className="space-y-8">
          <div>
            <div className="flex justify-between mb-4">
              <span className="font-semibold">Volume</span>
              <span className="font-semibold text-red-500">{sliderValue}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={sliderValue}
              onChange={(e) => setSliderValue(Number(e.target.value))}
              className="w-full h-3 bg-white/10 rounded-full appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, rgb(239, 68, 68) 0%, rgb(239, 68, 68) ${sliderValue}%, rgba(255,255,255,0.1) ${sliderValue}%, rgba(255,255,255,0.1) 100%)`
              }}
            />
          </div>

          <div className="grid grid-cols-4 gap-4">
            {[25, 50, 75, 100].map((val) => (
              <motion.button
                key={val}
                onClick={() => setSliderValue(val)}
                className="px-4 py-2 bg-white/10 rounded-lg font-semibold"
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(239, 68, 68, 0.2)' }}
                whileTap={{ scale: 0.95 }}
              >
                {val}%
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  </div>
</section>

{/* ========================================================================
    RATING SYSTEMS
======================================================================== */}
<section className="py-32 px-4 md:px-8">
  <div className="max-w-4xl mx-auto">
    
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-20"
    >
      <span className="text-yellow-500 font-bold text-sm uppercase tracking-wider">Section 09</span>
      <h2 className="text-5xl md:text-6xl font-black mt-4 mb-6">Rating Systems</h2>
      <p className="text-xl text-gray-400">Stars, hearts, and feedback</p>
    </motion.div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      
      {/* Star Rating */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10"
      >
        <h3 className="text-2xl font-bold mb-6">Star Rating</h3>
        <div className="flex gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.button
              key={star}
              onHoverStart={() => setHoveredRating(star)}
              onHoverEnd={() => setHoveredRating(0)}
              onClick={() => setRating(star)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <Icon
                icon={star <= (hoveredRating || rating) ? 'mdi:star' : 'mdi:star-outline'}
                className="text-4xl text-yellow-500"
              />
            </motion.button>
          ))}
        </div>
        <p className="text-gray-400">
          {rating === 0 ? 'Click to rate' : 
           rating === 1 ? 'Poor' :
           rating === 2 ? 'Fair' :
           rating === 3 ? 'Good' :
           rating === 4 ? 'Very Good' : 'Excellent'}
        </p>
      </motion.div>

      {/* Heart Rating */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10"
      >
        <h3 className="text-2xl font-bold mb-6">Heart Rating</h3>
        <div className="flex gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((heart) => (
            <motion.button
              key={heart}
              onHoverStart={() => setHoveredRating(heart)}
              onHoverEnd={() => setHoveredRating(0)}
              onClick={() => setRating(heart)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              animate={{
                scale: heart <= rating ? [1, 1.2, 1] : 1
              }}
              transition={{ duration: 0.3 }}
            >
              <Icon
                icon={heart <= (hoveredRating || rating) ? 'mdi:heart' : 'mdi:heart-outline'}
                className="text-4xl text-red-500"
              />
            </motion.button>
          ))}
        </div>
        <p className="text-gray-400">
          {rating === 0 ? 'Show some love' : `${rating} ${rating === 1 ? 'heart' : 'hearts'}`}
        </p>
      </motion.div>

      {/* Emoji Rating */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10"
      >
        <h3 className="text-2xl font-bold mb-6">Emoji Feedback</h3>
        <div className="flex gap-4 justify-center">
          {['😢', '😕', '😐', '😊', '😍'].map((emoji, index) => (
            <motion.button
              key={emoji}
              onClick={() => setRating(index + 1)}
              className={`text-5xl transition-all ${rating === index + 1 ? 'scale-125' : 'opacity-50'}`}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
            >
              {emoji}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* NPS Score */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10"
      >
        <h3 className="text-2xl font-bold mb-6">NPS Score</h3>
        <p className="text-sm text-gray-400 mb-4">How likely are you to recommend us?</p>
        <div className="grid grid-cols-11 gap-1">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
            <motion.button
              key={score}
              onClick={() => setRating(score)}
              className={`aspect-square rounded-lg font-bold text-sm ${
                rating === score
                  ? 'bg-gradient-to-r from-red-600 to-orange-600'
                  : 'bg-white/10'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {score}
            </motion.button>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>Not likely</span>
          <span>Very likely</span>
        </div>
      </motion.div>
    </div>
  </div>
</section>

      {/* ========================================================================
    BADGES & STATUS INDICATORS
======================================================================== */}
<section className="py-32 px-4 md:px-8 bg-gradient-to-b from-black via-pink-950/10 to-black">
  <div className="max-w-7xl mx-auto">
    
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-20"
    >
      <span className="text-pink-500 font-bold text-sm uppercase tracking-wider">Section 10</span>
      <h2 className="text-5xl md:text-6xl font-black mt-4 mb-6">Badges & Status</h2>
      <p className="text-xl text-gray-400">Visual indicators and labels</p>
    </motion.div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      
      {/* Standard Badges */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10"
      >
        <h3 className="text-2xl font-bold mb-6">Standard Badges</h3>
        <div className="flex flex-wrap gap-3">
          <span className="px-4 py-2 bg-red-600 rounded-full text-sm font-bold">Primary</span>
          <span className="px-4 py-2 bg-blue-600 rounded-full text-sm font-bold">Info</span>
          <span className="px-4 py-2 bg-green-600 rounded-full text-sm font-bold">Success</span>
          <span className="px-4 py-2 bg-yellow-600 rounded-full text-sm font-bold">Warning</span>
          <span className="px-4 py-2 bg-purple-600 rounded-full text-sm font-bold">Featured</span>
          <span className="px-4 py-2 bg-gray-600 rounded-full text-sm font-bold">Default</span>
        </div>
      </motion.div>

      {/* Outline Badges */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10"
      >
        <h3 className="text-2xl font-bold mb-6">Outline Badges</h3>
        <div className="flex flex-wrap gap-3">
          <span className="px-4 py-2 border-2 border-red-600 text-red-500 rounded-full text-sm font-bold">New</span>
          <span className="px-4 py-2 border-2 border-blue-600 text-blue-500 rounded-full text-sm font-bold">Beta</span>
          <span className="px-4 py-2 border-2 border-green-600 text-green-500 rounded-full text-sm font-bold">Pro</span>
          <span className="px-4 py-2 border-2 border-yellow-600 text-yellow-500 rounded-full text-sm font-bold">Hot</span>
          <span className="px-4 py-2 border-2 border-purple-600 text-purple-500 rounded-full text-sm font-bold">Premium</span>
        </div>
      </motion.div>

      {/* Status Badges with Pulse */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10"
      >
        <h3 className="text-2xl font-bold mb-6">Status with Pulse</h3>
        <div className="space-y-4">
{[
  { status: 'Online', color: 'green' },
  { status: 'Busy', color: 'red' },
  { status: 'Away', color: 'yellow' },
  { status: 'Offline', color: 'gray' },
].map((item) => (
  <div key={item.status} className="flex items-center gap-3">
              <div className="relative">
                <div className={`w-3 h-3 bg-${item.color}-500 rounded-full`} />
                {item.status === 'Online' && (
                  <motion.div
                    className="absolute inset-0 bg-green-500 rounded-full"
                    animate={{ scale: [1, 2, 2], opacity: [0.5, 0, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </div>
              <span className="font-semibold">{item.status}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  </div>
</section>

{/* ========================================================================
    AVATARS & PRESENCE
======================================================================== */}
<section className="py-32 px-4 md:px-8">
  <div className="max-w-7xl mx-auto">
    
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-20"
    >
      <span className="text-cyan-500 font-bold text-sm uppercase tracking-wider">Section 11</span>
      <h2 className="text-5xl md:text-6xl font-black mt-4 mb-6">Avatars & Presence</h2>
      <p className="text-xl text-gray-400">User profile displays</p>
    </motion.div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      
      {/* Single Avatars */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10"
      >
        <h3 className="text-2xl font-bold mb-6">Single Avatars</h3>
        <div className="flex items-center gap-4 mb-6">
          {[
            { size: 'w-12 h-12', color: 'from-red-600 to-orange-600' },
            { size: 'w-16 h-16', color: 'from-blue-600 to-cyan-600' },
            { size: 'w-20 h-20', color: 'from-purple-600 to-pink-600' },
          ].map((avatar, index) => (
            <motion.div
              key={index}
              className={`${avatar.size} bg-gradient-to-br ${avatar.color} rounded-full flex items-center justify-center font-bold text-xl`}
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              {String.fromCharCode(65 + index)}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Avatar with Status */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10"
      >
        <h3 className="text-2xl font-bold mb-6">With Status</h3>
        <div className="flex items-center gap-6">
          {['green', 'red', 'yellow'].map((color, index) => (
            <div key={color} className="relative">
              <motion.div
                className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center font-bold text-xl"
                whileHover={{ scale: 1.1 }}
              >
                <Icon icon="mdi:account" />
              </motion.div>
              <div className={`absolute bottom-0 right-0 w-5 h-5 bg-${color}-500 rounded-full border-4 border-gray-900`} />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Avatar Group Stack */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10"
      >
        <h3 className="text-2xl font-bold mb-6">Group Stack</h3>
        <div className="flex -space-x-4">
          {[0, 1, 2, 3].map((index) => (
            <motion.div
              key={index}
              className="w-12 h-12 bg-gradient-to-br from-red-600 to-orange-600 rounded-full border-4 border-gray-900 flex items-center justify-center font-bold"
              whileHover={{ scale: 1.2, zIndex: 10 }}
              style={{ zIndex: 10 - index }}
            >
              {index + 1}
            </motion.div>
          ))}
          <motion.div
            className="w-12 h-12 bg-white/10 rounded-full border-4 border-gray-900 flex items-center justify-center font-bold text-sm"
            whileHover={{ scale: 1.2, zIndex: 10 }}
          >
            +5
          </motion.div>
        </div>
      </motion.div>
    </div>
  </div>
</section>

{/* ========================================================================
    TOOLTIPS & POPOVERS
======================================================================== */}
<section className="py-32 px-4 md:px-8 bg-gradient-to-b from-black via-indigo-950/10 to-black">
  <div className="max-w-7xl mx-auto">
    
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-20"
    >
      <span className="text-indigo-500 font-bold text-sm uppercase tracking-wider">Section 12</span>
      <h2 className="text-5xl md:text-6xl font-black mt-4 mb-6">Tooltips & Popovers</h2>
      <p className="text-xl text-gray-400">Contextual information overlays</p>
    </motion.div>

    <div className="flex flex-wrap gap-8 justify-center">
      
      {/* Tooltip Buttons */}
      {[
        { icon: 'mdi:home', tooltip: 'Home', color: 'red' },
        { icon: 'mdi:heart', tooltip: 'Favorites', color: 'pink' },
        { icon: 'mdi:cart', tooltip: 'Shopping Cart', color: 'blue' },
        { icon: 'mdi:bell', tooltip: 'Notifications', color: 'yellow' },
        { icon: 'mdi:cog', tooltip: 'Settings', color: 'gray' },
      ].map((item) => (
        <div key={item.icon} className="relative group">
          <motion.button
            className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center"
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
            whileTap={{ scale: 0.9 }}
          >
            <Icon icon={item.icon} className="text-2xl" />
          </motion.button>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileHover={{ opacity: 1, y: 0 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 rounded-lg text-sm font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          >
            {item.tooltip}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900" />
          </motion.div>
        </div>
      ))}
    </div>
  </div>
</section>

{/* ========================================================================
    COLOR PICKERS
======================================================================== */}
<section className="py-32 px-4 md:px-8">
  <div className="max-w-4xl mx-auto">
    
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-20"
    >
      <span className="text-rose-500 font-bold text-sm uppercase tracking-wider">Section 13</span>
      <h2 className="text-5xl md:text-6xl font-black mt-4 mb-6">Color Pickers</h2>
      <p className="text-xl text-gray-400">Choose your colors</p>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10"
    >
      <h3 className="text-2xl font-bold mb-6">Swatch Picker</h3>
      
      <div className="grid grid-cols-8 gap-3 mb-8">
        {[
          '#ef4444', '#f97316', '#f59e0b', '#eab308',
          '#84cc16', '#22c55e', '#10b981', '#14b8a6',
          '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
          '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
        ].map((color) => (
          <motion.button
            key={color}
            onClick={() => setSelectedColor(color)}
            className="aspect-square rounded-xl relative"
            style={{ backgroundColor: color }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {selectedColor === color && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Icon icon="mdi:check" className="text-2xl text-white drop-shadow-lg" />
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <div
          className="w-20 h-20 rounded-2xl border-4 border-white/20"
          style={{ backgroundColor: selectedColor }}
        />
        <div className="flex-1">
          <label className="block text-sm font-semibold mb-2">Selected Color</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-rose-500 font-mono"
            />
            <input
              type="color"
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="w-14 h-full rounded-xl cursor-pointer"
            />
          </div>
        </div>
      </div>
    </motion.div>
  </div>
</section>

{/* ========================================================================
    TIMELINES
======================================================================== */}
<section className="py-32 px-4 md:px-8 bg-gradient-to-b from-black via-emerald-950/10 to-black">
  <div className="max-w-4xl mx-auto">
    
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-20"
    >
      <span className="text-emerald-500 font-bold text-sm uppercase tracking-wider">Section 14</span>
      <h2 className="text-5xl md:text-6xl font-black mt-4 mb-6">Activity Timeline</h2>
      <p className="text-xl text-gray-400">Track events over time</p>
    </motion.div>

    <div className="relative">
      {/* Vertical Line */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-600 via-orange-500 to-yellow-500" />

      {/* Timeline Items */}
      {[
        {
          icon: 'mdi:rocket-launch',
          title: 'Project Launched',
          description: 'Successfully deployed to production',
          time: '2 hours ago',
          color: 'from-red-600 to-orange-600',
        },
        {
          icon: 'mdi:file-document',
          title: 'Documentation Updated',
          description: 'Added new API endpoints guide',
          time: '5 hours ago',
          color: 'from-blue-600 to-cyan-600',
        },
        {
          icon: 'mdi:account-multiple',
          title: 'Team Meeting',
          description: 'Discussed Q4 roadmap and priorities',
          time: '1 day ago',
          color: 'from-purple-600 to-pink-600',
        },
        {
          icon: 'mdi:code-braces',
          title: 'Feature Completed',
          description: 'Implemented dark mode support',
          time: '2 days ago',
          color: 'from-green-600 to-emerald-600',
        },
      ].map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className="relative pl-16 pb-12 last:pb-0"
        >
          {/* Icon */}
          <motion.div
            className={`absolute left-0 w-12 h-12 bg-gradient-to-br ${item.color} rounded-full flex items-center justify-center`}
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <Icon icon={item.icon} className="text-xl" />
          </motion.div>

          {/* Content */}
          <motion.div
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
            whileHover={{ y: -5, borderColor: 'rgba(239, 68, 68, 0.3)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xl font-bold">{item.title}</h4>
              <span className="text-sm text-gray-400">{item.time}</span>
            </div>
            <p className="text-gray-400">{item.description}</p>
          </motion.div>
        </motion.div>
      ))}
    </div>
  </div>
</section>

{/* ========================================================================
    PRICING TABLES
======================================================================== */}
<section className="py-32 px-4 md:px-8">
  <div className="max-w-7xl mx-auto">
    
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-12"
    >
      <span className="text-violet-500 font-bold text-sm uppercase tracking-wider">Section 15</span>
      <h2 className="text-5xl md:text-6xl font-black mt-4 mb-6">Pricing Plans</h2>
      <p className="text-xl text-gray-400 mb-8">Choose the perfect plan for your needs</p>
      
      {/* Toggle */}
      <div className="inline-flex items-center gap-4 p-2 bg-white/5 rounded-full">
        <motion.button
          onClick={() => setActivePricing('monthly')}
          className={`px-6 py-2 rounded-full font-bold transition-colors ${
            activePricing === 'monthly' ? 'bg-violet-600' : ''
          }`}
          whileTap={{ scale: 0.95 }}
        >
          Monthly
        </motion.button>
        <motion.button
          onClick={() => setActivePricing('yearly')}
          className={`px-6 py-2 rounded-full font-bold transition-colors ${
            activePricing === 'yearly' ? 'bg-violet-600' : ''
          }`}
          whileTap={{ scale: 0.95 }}
        >
          Yearly <span className="text-green-400 text-sm ml-1">-20%</span>
        </motion.button>
      </div>
    </motion.div>

    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="grid grid-cols-1 md:grid-cols-3 gap-8"
    >
      {[
        {
          name: 'Starter',
          price: activePricing === 'monthly' ? 29 : 24,
          features: ['5 Projects', '10GB Storage', 'Basic Support', 'API Access'],
          color: 'from-blue-600 to-cyan-600',
          popular: false,
        },
        {
          name: 'Pro',
          price: activePricing === 'monthly' ? 99 : 79,
          features: ['Unlimited Projects', '100GB Storage', 'Priority Support', 'Advanced API', 'Custom Domains'],
          color: 'from-red-600 to-orange-600',
          popular: true,
        },
        {
          name: 'Enterprise',
          price: activePricing === 'monthly' ? 299 : 239,
          features: ['Everything in Pro', 'Unlimited Storage', '24/7 Phone Support', 'Dedicated Manager', 'SLA Guarantee', 'Custom Integration'],
          color: 'from-purple-600 to-pink-600',
          popular: false,
        },
      ].map((plan, index) => (
        <motion.div
          key={plan.name}
          variants={itemVariants}
          className={`relative bg-white/5 backdrop-blur-sm rounded-3xl p-8 border ${
            plan.popular ? 'border-red-500 scale-105' : 'border-white/10'
          }`}
          whileHover={{ y: -10, borderColor: plan.popular ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255, 255, 255, 0.2)' }}
        >
          {plan.popular && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 rounded-full text-sm font-bold"
            >
              MOST POPULAR
            </motion.div>
          )}

          <h3 className="text-2xl font-black mb-4">{plan.name}</h3>
          <div className="mb-6">
            <span className="text-5xl font-black">${plan.price}</span>
            <span className="text-gray-400">/{activePricing === 'monthly' ? 'mo' : 'yr'}</span>
          </div>

          <ul className="space-y-3 mb-8">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <Icon icon="mdi:check-circle" className="text-green-500" />
                <span className="text-gray-300">{feature}</span>
              </li>
            ))}
          </ul>

          <motion.button
            className={`w-full px-6 py-4 bg-gradient-to-r ${plan.color} rounded-xl font-bold`}
            whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)' }}
            whileTap={{ scale: 0.98 }}
          >
            Get Started
          </motion.button>
        </motion.div>
      ))}
    </motion.div>
  </div>
</section>

      {/* ========================================================================
    IMAGE GALLERY & LIGHTBOX
======================================================================== */}
<section className="py-32 px-4 md:px-8 bg-gradient-to-b from-black via-amber-950/10 to-black">
  <div className="max-w-7xl mx-auto">
    
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-20"
    >
      <span className="text-amber-500 font-bold text-sm uppercase tracking-wider">Section 16</span>
      <h2 className="text-5xl md:text-6xl font-black mt-4 mb-6">Image Gallery</h2>
      <p className="text-xl text-gray-400">Stunning visual displays</p>
    </motion.div>

    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="grid grid-cols-2 md:grid-cols-4 gap-4"
    >
      {[
        { color: 'from-red-600 to-orange-600', icon: 'mdi:image' },
        { color: 'from-blue-600 to-cyan-600', icon: 'mdi:camera' },
        { color: 'from-purple-600 to-pink-600', icon: 'mdi:palette' },
        { color: 'from-green-600 to-emerald-600', icon: 'mdi:brush' },
        { color: 'from-yellow-600 to-orange-600', icon: 'mdi:star' },
        { color: 'from-pink-600 to-rose-600', icon: 'mdi:heart' },
        { color: 'from-indigo-600 to-purple-600', icon: 'mdi:sparkles' },
        { color: 'from-cyan-600 to-blue-600', icon: 'mdi:water' },
      ].map((item, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          className={`aspect-square bg-gradient-to-br ${item.color} rounded-2xl relative overflow-hidden cursor-pointer group`}
          whileHover={{ scale: 1.05, zIndex: 10 }}
          onClick={() => setSelectedProduct(index)}
        >
          <motion.div
            className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Icon icon={item.icon} className="text-6xl" />
          </motion.div>
          
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100"
            initial={{ y: '100%' }}
            whileHover={{ y: 0 }}
          >
            <div className="absolute bottom-4 left-4 right-4">
              <p className="font-bold">Gallery Image {index + 1}</p>
              <p className="text-sm text-gray-300">Click to view</p>
            </div>
          </motion.div>
        </motion.div>
      ))}
    </motion.div>

    {/* Lightbox Modal */}
    <AnimatePresence>
      {selectedProduct !== null && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProduct(null)}
            className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                className={`aspect-video bg-gradient-to-br ${
                  [
                    'from-red-600 to-orange-600',
                    'from-blue-600 to-cyan-600',
                    'from-purple-600 to-pink-600',
                    'from-green-600 to-emerald-600',
                    'from-yellow-600 to-orange-600',
                    'from-pink-600 to-rose-600',
                    'from-indigo-600 to-purple-600',
                    'from-cyan-600 to-blue-600',
                  ][selectedProduct]
                } rounded-3xl flex items-center justify-center`}
              >
                <Icon icon="mdi:image" className="text-9xl opacity-30" />
              </motion.div>
              
              <motion.button
                onClick={() => setSelectedProduct(null)}
                className="absolute -top-4 -right-4 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center"
                whileHover={{ rotate: 90, scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
              >
                <Icon icon="mdi:close" className="text-2xl" />
              </motion.button>

              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center"
                >
                  <Icon icon="mdi:chevron-left" className="text-xl" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center"
                >
                  <Icon icon="mdi:chevron-right" className="text-xl" />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  </div>
</section>

{/* ========================================================================
    CAROUSEL / SLIDER
======================================================================== */}
<section className="py-32 px-4 md:px-8">
  <div className="max-w-6xl mx-auto">
    
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-20"
    >
      <span className="text-orange-500 font-bold text-sm uppercase tracking-wider">Section 17</span>
      <h2 className="text-5xl md:text-6xl font-black mt-4 mb-6">Carousel Slider</h2>
      <p className="text-xl text-gray-400">Swipeable content showcase</p>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative"
    >
      <div className="overflow-hidden rounded-3xl">
        <motion.div
          className="flex"
          animate={{ x: `${-currentPage * 100}%` }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {[
            { title: 'Slide 1', color: 'from-red-600 to-orange-600', desc: 'Amazing features' },
            { title: 'Slide 2', color: 'from-blue-600 to-cyan-600', desc: 'Beautiful design' },
            { title: 'Slide 3', color: 'from-purple-600 to-pink-600', desc: 'Smooth animations' },
          ].map((slide, index) => (
            <div key={index} className="min-w-full">
              <div className={`bg-gradient-to-br ${slide.color} rounded-3xl p-16 text-center`}>
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-5xl font-black mb-4"
                >
                  {slide.title}
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-2xl text-white/80"
                >
                  {slide.desc}
                </motion.p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <motion.button
          onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
          className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center"
          whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
          whileTap={{ scale: 0.9 }}
        >
          <Icon icon="mdi:chevron-left" className="text-2xl" />
        </motion.button>

<div className="flex gap-2">
          {[0, 1, 2].map((dotIndex) => (
            <motion.button
              key={dotIndex}
              onClick={() => setCurrentPage(dotIndex)}
              className={`h-2 rounded-full ${
                currentPage === dotIndex ? 'w-8 bg-red-600' : 'w-2 bg-white/20'
              }`}
              whileHover={{ scale: 1.2 }}
            />
          ))}
        </div>

        <motion.button
          onClick={() => setCurrentPage(Math.min(2, currentPage + 1))}
          className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center"
          whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
          whileTap={{ scale: 0.9 }}
        >
          <Icon icon="mdi:chevron-right" className="text-2xl" />
        </motion.button>
      </div>
    </motion.div>
  </div>
</section>

{/* ========================================================================
    TESTIMONIALS SECTION
======================================================================== */}
<section className="py-32 px-4 md:px-8 bg-gradient-to-b from-black via-rose-950/10 to-black">
  <div className="max-w-7xl mx-auto">
    
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-20"
    >
      <span className="text-rose-500 font-bold text-sm uppercase tracking-wider">Section 18</span>
      <h2 className="text-5xl md:text-6xl font-black mt-4 mb-6">What People Say</h2>
      <p className="text-xl text-gray-400">Testimonials from our users</p>
    </motion.div>

    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="grid grid-cols-1 md:grid-cols-3 gap-8"
    >
      {[
        {
          name: 'Sarah Johnson',
          role: 'CEO, TechCorp',
          avatar: 'from-blue-600 to-cyan-600',
          rating: 5,
          text: 'This is hands down the best component library I have ever used. The attention to detail is incredible!',
        },
        {
          name: 'Michael Chen',
          role: 'Lead Designer, StartupXYZ',
          avatar: 'from-purple-600 to-pink-600',
          rating: 5,
          text: 'Beautiful animations and smooth interactions. My clients love the polish these components bring.',
        },
        {
          name: 'Emily Rodriguez',
          role: 'Frontend Developer',
          avatar: 'from-green-600 to-emerald-600',
          rating: 5,
          text: 'Production-ready components that just work. Copy, paste, customize. It saves me hours every week!',
        },
      ].map((testimonial, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10"
          whileHover={{ y: -10, borderColor: 'rgba(239, 68, 68, 0.3)' }}
        >
<div className="flex gap-1 mb-4">
{Array.from({ length: testimonial.rating }).map((_, i) => (
  <Icon key={i} icon="mdi:star" className="text-2xl text-yellow-500" />
))}
</div>

          <p className="text-lg mb-6 italic text-gray-300">"{testimonial.text}"</p>

          <div className="flex items-center gap-4">
            <motion.div
              className={`w-14 h-14 bg-gradient-to-br ${testimonial.avatar} rounded-full flex items-center justify-center font-bold text-xl`}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              {testimonial.name[0]}
            </motion.div>
            <div>
              <div className="font-bold">{testimonial.name}</div>
              <div className="text-sm text-gray-400">{testimonial.role}</div>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  </div>
</section>

{/* ========================================================================
    FEATURE GRID
======================================================================== */}
<section className="py-32 px-4 md:px-8">
  <div className="max-w-7xl mx-auto">
    
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-20"
    >
      <span className="text-cyan-500 font-bold text-sm uppercase tracking-wider">Section 19</span>
      <h2 className="text-5xl md:text-6xl font-black mt-4 mb-6">Powerful Features</h2>
      <p className="text-xl text-gray-400">Everything you need and more</p>
    </motion.div>

    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
    >
      {[
        { icon: 'mdi:lightning-bolt', title: 'Lightning Fast', desc: 'Optimized for speed', color: 'yellow' },
        { icon: 'mdi:palette', title: 'Customizable', desc: 'Match your brand', color: 'purple' },
        { icon: 'mdi:responsive', title: 'Responsive', desc: 'Works everywhere', color: 'blue' },
        { icon: 'mdi:shield-check', title: 'Secure', desc: 'Built with security', color: 'green' },
        { icon: 'mdi:code-braces', title: 'Developer Friendly', desc: 'Clean codebase', color: 'red' },
        { icon: 'mdi:eye', title: 'Accessible', desc: 'WCAG compliant', color: 'indigo' },
        { icon: 'mdi:rocket-launch', title: 'Production Ready', desc: 'Deploy with confidence', color: 'orange' },
        { icon: 'mdi:heart', title: 'Made with Love', desc: 'Crafted with care', color: 'pink' },
      ].map((feature, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 text-center group"
          whileHover={{ y: -10, borderColor: 'rgba(239, 68, 68, 0.3)' }}
        >
          <motion.div
            className={`w-16 h-16 mx-auto mb-4 bg-${feature.color}-600/20 rounded-2xl flex items-center justify-center`}
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.5 }}
          >
            <Icon icon={feature.icon} className={`text-4xl text-${feature.color}-500`} />
          </motion.div>
          <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
          <p className="text-gray-400">{feature.desc}</p>
        </motion.div>
      ))}
    </motion.div>
  </div>
</section>

{/* ========================================================================
    CALL TO ACTION
======================================================================== */}
<section className="py-32 px-4 md:px-8 bg-gradient-to-b from-black via-red-950/20 to-black">
  <div className="max-w-5xl mx-auto">
    
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="relative overflow-hidden rounded-3xl"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-orange-600 to-yellow-600">
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
            backgroundSize: ['100% 100%', '200% 200%'],
          }}
          transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="relative z-10 p-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-5xl md:text-6xl font-black mb-6">
            Ready to Build Something Amazing?
          </h2>
          <p className="text-2xl mb-8 text-white/90">
            Join thousands of developers using Ferrari Component Lab
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <motion.button
              className="px-10 py-5 bg-black text-white rounded-2xl font-bold text-lg flex items-center gap-2"
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)' }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon icon="mdi:rocket-launch" className="text-2xl" />
              Get Started Free
            </motion.button>
            <motion.button
              className="px-10 py-5 bg-white/20 backdrop-blur-sm border-2 border-white/50 rounded-2xl font-bold text-lg flex items-center gap-2"
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon icon="mdi:book-open" className="text-2xl" />
              View Documentation
            </motion.button>
          </div>

          <div className="flex items-center justify-center gap-8 mt-12">
            <div className="text-center">
              <div className="text-4xl font-black">10M+</div>
              <div className="text-white/70">Downloads</div>
            </div>
            <div className="w-px h-12 bg-white/30" />
            <div className="text-center">
              <div className="text-4xl font-black">50K+</div>
              <div className="text-white/70">Developers</div>
            </div>
            <div className="w-px h-12 bg-white/30" />
            <div className="text-center">
              <div className="text-4xl font-black">4.9/5</div>
              <div className="text-white/70">Rating</div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  </div>
</section>

{/* ========================================================================
    NEWSLETTER SIGNUP
======================================================================== */}
<section className="py-32 px-4 md:px-8">
  <div className="max-w-3xl mx-auto text-center">
    
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-12 border border-white/10"
    >
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-6xl mb-6"
      >
        📬
      </motion.div>

      <h2 className="text-4xl font-black mb-4">Stay Updated</h2>
      <p className="text-xl text-gray-400 mb-8">
        Get the latest components, updates, and tips delivered to your inbox
      </p>

      <div className="flex gap-4 max-w-md mx-auto">
        <motion.input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="flex-1 px-6 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-red-500"
          whileFocus={{ scale: 1.02 }}
        />
        <motion.button
          onClick={handleEmailSubmit}
          className="px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl font-bold flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={loading}
        >
          {loading ? (
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
              <Icon icon="mdi:loading" />
            </motion.div>
          ) : (
            <Icon icon="mdi:send" />
          )}
        </motion.button>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 text-green-500 font-semibold"
          >
            ✓ Successfully subscribed!
          </motion.p>
        )}
      </AnimatePresence>

      <p className="text-sm text-gray-500 mt-6">
        Unsubscribe anytime. We respect your privacy.
      </p>
    </motion.div>
  </div>
</section>

{/* ========================================================================
    FOOTER
======================================================================== */}
<footer className="py-20 px-4 md:px-8 border-t border-white/10">
  <div className="max-w-7xl mx-auto">
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
      
      {/* Brand */}
      <div className="lg:col-span-2">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="text-6xl mb-4"
        >
          🏎️
        </motion.div>
        <h3 className="text-2xl font-black mb-4">
          <span className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
            Ferrari Component Lab
          </span>
        </h3>
        <p className="text-gray-400 mb-6">
          Production-grade UI components built with Tailwind v4, Framer Motion, and Iconify.
          The ultimate toolkit for building stunning interfaces.
        </p>
        <div className="flex gap-3">
          {[
            { icon: 'mdi:github', url: '#' },
            { icon: 'mdi:twitter', url: '#' },
            { icon: 'mdi:linkedin', url: '#' },
            { icon: 'mdi:discord', url: '#' },
          ].map((social) => (
            <motion.a
              key={social.icon}
              href={social.url}
              className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center"
              whileHover={{ scale: 1.2, backgroundColor: 'rgba(239, 68, 68, 0.2)' }}
              whileTap={{ scale: 0.9 }}
            >
              <Icon icon={social.icon} className="text-xl" />
            </motion.a>
          ))}
        </div>
      </div>

      {/* Links Columns */}
      {[
        {
          title: 'Product',
          links: ['Features', 'Pricing', 'Changelog', 'Roadmap'],
        },
        {
          title: 'Resources',
          links: ['Documentation', 'Examples', 'Templates', 'Blog'],
        },
        {
          title: 'Company',
          links: ['About', 'Team', 'Careers', 'Contact'],
        },
      ].map((column) => (
        <div key={column.title}>
          <h4 className="font-bold mb-4">{column.title}</h4>
          <ul className="space-y-3">
            {column.links.map((link) => (
              <li key={link}>
                <motion.a
                  href="#"
                  className="text-gray-400 hover:text-white"
                  whileHover={{ x: 5 }}
                >
                  {link}
                </motion.a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>

    {/* Bottom Bar */}
    <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
      <p className="text-gray-500 text-sm">
        © 2025 Ferrari Component Lab. Built with ❤️ and ☕
      </p>
      <div className="flex gap-6 text-sm">
        <motion.a href="#" className="text-gray-400 hover:text-white" whileHover={{ y: -2 }}>
          Privacy Policy
        </motion.a>
        <motion.a href="#" className="text-gray-400 hover:text-white" whileHover={{ y: -2 }}>
          Terms of Service
        </motion.a>
        <motion.a href="#" className="text-gray-400 hover:text-white" whileHover={{ y: -2 }}>
          License
        </motion.a>
      </div>
    </div>
  </div>
</footer>

      
{/* ========================================================================
    LOADING STATES & SKELETONS
======================================================================== */}
<section className="py-32 px-4 md:px-8 bg-gradient-to-b from-black via-slate-950/10 to-black">
  <div className="max-w-7xl mx-auto">
    
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-20"
    >
      <span className="text-slate-500 font-bold text-sm uppercase tracking-wider">Section 20</span>
      <h2 className="text-5xl md:text-6xl font-black mt-4 mb-6">Loading States</h2>
      <p className="text-xl text-gray-400">Keep users engaged while content loads</p>
    </motion.div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      
      {/* Spinners */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10"
      >
        <h3 className="text-2xl font-bold mb-6">Spinners</h3>
        <div className="flex gap-8 items-center justify-center">
          <motion.div
            className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-12 bg-purple-600 rounded-full"
                animate={{ scaleY: [1, 2, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Progress Indicators */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10"
      >
        <h3 className="text-2xl font-bold mb-6">Progress Indicators</h3>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2 text-sm">
              <span>Loading assets...</span>
              <span className="text-blue-500">68%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-600 to-cyan-600"
                initial={{ width: 0 }}
                animate={{ width: '68%' }}
                transition={{ duration: 2 }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-2 text-sm">
              <span>Processing data...</span>
              <span className="text-green-500">100%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-green-600 to-emerald-600"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 2 }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Skeleton Cards */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 md:col-span-2"
      >
        <h3 className="text-2xl font-bold mb-6">Skeleton Loading</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/5 rounded-2xl p-6">
              <motion.div
                className="h-40 bg-gradient-to-r from-white/5 to-white/10 rounded-xl mb-4"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <motion.div
                className="h-4 bg-gradient-to-r from-white/5 to-white/10 rounded mb-2"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 }}
              />
              <motion.div
                className="h-4 bg-gradient-to-r from-white/5 to-white/10 rounded w-2/3"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
              />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  </div>
</section>

{/* ========================================================================
    EMPTY & ERROR STATES
======================================================================== */}
<section className="py-32 px-4 md:px-8">
  <div className="max-w-7xl mx-auto">
    
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-20"
    >
      <span className="text-gray-500 font-bold text-sm uppercase tracking-wider">Section 21</span>
      <h2 className="text-5xl md:text-6xl font-black mt-4 mb-6">Empty & Error States</h2>
      <p className="text-xl text-gray-400">Graceful fallbacks for every scenario</p>
    </motion.div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      
      {/* Empty State */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white/5 backdrop-blur-sm rounded-3xl p-12 border border-white/10 text-center"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-8xl mb-6"
        >
          📭
        </motion.div>
        <h3 className="text-2xl font-bold mb-4">No Data Yet</h3>
        <p className="text-gray-400 mb-6">
          You haven't added any items yet. Start by creating your first one!
        </p>
        <motion.button
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl font-bold"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Create First Item
        </motion.button>
      </motion.div>

      {/* Error State */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white/5 backdrop-blur-sm rounded-3xl p-12 border border-red-500/20 text-center"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
          className="text-8xl mb-6"
        >
          ⚠️
        </motion.div>
        <h3 className="text-2xl font-bold mb-4">Something Went Wrong</h3>
        <p className="text-gray-400 mb-6">
          We couldn't load the data. Please check your connection and try again.
        </p>
        <div className="flex gap-3 justify-center">
          <motion.button
            className="px-6 py-3 bg-white/10 rounded-xl font-bold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Go Back
          </motion.button>
          <motion.button
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl font-bold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Try Again
          </motion.button>
        </div>
      </motion.div>

      {/* 404 State */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white/5 backdrop-blur-sm rounded-3xl p-12 border border-white/10 text-center"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-8xl mb-6"
        >
          🔍
        </motion.div>
        <h3 className="text-2xl font-bold mb-4">Page Not Found</h3>
        <p className="text-gray-400 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <motion.button
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Back to Home
        </motion.button>
      </motion.div>

      {/* Maintenance State */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white/5 backdrop-blur-sm rounded-3xl p-12 border border-yellow-500/20 text-center"
      >
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="text-8xl mb-6"
        >
          🔧
        </motion.div>
        <h3 className="text-2xl font-bold mb-4">Under Maintenance</h3>
        <p className="text-gray-400 mb-6">
          We're making things better! We'll be back shortly.
        </p>
        <div className="text-sm text-gray-500">
          Expected return: 15 minutes
        </div>
      </motion.div>
    </div>
  </div>
</section>

{/* ========================================================================
    NOTIFICATION CENTER
======================================================================== */}
<section className="py-32 px-4 md:px-8 bg-gradient-to-b from-black via-blue-950/10 to-black">
  <div className="max-w-4xl mx-auto">
    
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-20"
    >
      <span className="text-blue-500 font-bold text-sm uppercase tracking-wider">Section 22</span>
      <h2 className="text-5xl md:text-6xl font-black mt-4 mb-6">Notification Center</h2>
      <p className="text-xl text-gray-400">Keep users informed</p>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden"
    >
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <h3 className="text-2xl font-bold">Notifications</h3>
        <motion.button
          className="text-sm text-blue-500 font-semibold"
          whileHover={{ scale: 1.05 }}
        >
          Mark all as read
        </motion.button>
      </div>

      <div className="divide-y divide-white/5">
        {[
          {
            icon: 'mdi:check-circle',
            color: 'green',
            title: 'Deployment Successful',
            message: 'Your application has been deployed to production',
            time: '5 minutes ago',
            unread: true,
          },
          {
            icon: 'mdi:account-plus',
            color: 'blue',
            title: 'New Team Member',
            message: 'Sarah Johnson joined your workspace',
            time: '2 hours ago',
            unread: true,
          },
          {
            icon: 'mdi:file-document',
            color: 'purple',
            title: 'Report Generated',
            message: 'Your monthly analytics report is ready',
            time: '1 day ago',
            unread: false,
          },
          {
            icon: 'mdi:alert',
            color: 'yellow',
            title: 'Payment Due',
            message: 'Your subscription renewal is coming up',
            time: '3 days ago',
            unread: false,
          },
        ].map((notification, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-6 flex gap-4 ${notification.unread ? 'bg-white/5' : ''} hover:bg-white/10 transition-colors cursor-pointer`}
          >
            <div className={`w-12 h-12 bg-${notification.color}-600/20 rounded-full flex items-center justify-center flex-shrink-0`}>
              <Icon icon={notification.icon} className={`text-2xl text-${notification.color}-500`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-bold">{notification.title}</h4>
                {notification.unread && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                )}
              </div>
              <p className="text-gray-400 text-sm mb-1">{notification.message}</p>
              <span className="text-xs text-gray-500">{notification.time}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  </div>
</section>

{/* ========================================================================
    COMMAND PALETTE
======================================================================== */}
<section className="py-32 px-4 md:px-8">
  <div className="max-w-4xl mx-auto">
    
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-20"
    >
      <span className="text-purple-500 font-bold text-sm uppercase tracking-wider">Section 23</span>
      <h2 className="text-5xl md:text-6xl font-black mt-4 mb-6">Command Palette</h2>
      <p className="text-xl text-gray-400">Power user keyboard navigation</p>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-gradient-to-br from-gray-900 to-black rounded-3xl border border-white/10 overflow-hidden"
    >
      <div className="p-6 border-b border-white/10">
        <div className="relative">
          <Icon icon="mdi:magnify" className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type a command or search..."
            className="w-full pl-14 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500 text-lg"
          />
          <kbd className="absolute right-4 top-1/2 -translate-y-1/2 px-2 py-1 bg-white/10 rounded text-xs">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {[
          { icon: 'mdi:home', label: 'Go to Dashboard', shortcut: '⌘H', category: 'Navigation' },
          { icon: 'mdi:folder', label: 'Open Projects', shortcut: '⌘P', category: 'Navigation' },
          { icon: 'mdi:plus', label: 'Create New Item', shortcut: '⌘N', category: 'Actions' },
          { icon: 'mdi:cog', label: 'Open Settings', shortcut: '⌘,', category: 'Actions' },
          { icon: 'mdi:theme-light-dark', label: 'Toggle Theme', shortcut: '⌘T', category: 'Actions' },
          { icon: 'mdi:logout', label: 'Sign Out', shortcut: '⌘Q', category: 'Account' },
        ]
          .filter(cmd => cmd.label.toLowerCase().includes(searchQuery.toLowerCase()))
          .map((command, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-6 py-4 flex items-center justify-between hover:bg-white/5 cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center group-hover:bg-purple-600/30">
                  <Icon icon={command.icon} className="text-xl text-purple-500" />
                </div>
                <div>
                  <div className="font-semibold">{command.label}</div>
                  <div className="text-xs text-gray-500">{command.category}</div>
                </div>
              </div>
              <kbd className="px-3 py-1 bg-white/10 rounded text-sm font-mono">
                {command.shortcut}
              </kbd>
            </motion.div>
          ))}
      </div>
    </motion.div>
  </div>
</section>

{/* ========================================================================
    FINAL SHOWCASE BANNER
======================================================================== */}
<section className="py-32 px-4 md:px-8 bg-gradient-to-b from-black to-red-950/20">
  <div className="max-w-7xl mx-auto text-center">
    
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="mb-16"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="text-9xl mb-8"
      >
        🏎️
      </motion.div>
      
      <h2 className="text-6xl md:text-8xl font-black mb-6">
        <span className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
          FERRARI
        </span>
        <br />
        <span className="text-white">COMPONENT LAB</span>
      </h2>
      
      <p className="text-2xl text-gray-400 mb-12">
        150+ Production-Grade Components<br />
        Tailwind v4 × Framer Motion × Iconify
      </p>

      <div className="flex flex-wrap gap-4 justify-center mb-12">
        {[
          'Navigation', 'Cards', 'Forms', 'Buttons', 'Modals',
          'Tables', 'Accordions', 'Progress', 'Ratings', 'Badges',
          'Avatars', 'Tooltips', 'Colors', 'Timelines', 'Pricing',
          'Gallery', 'Carousel', 'Testimonials', 'Features', 'CTA',
          'Loading', 'Errors', 'Notifications', 'Commands'
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
        className="text-gray-500 text-lg"
      >
        © 2025 Ferrari Component Lab · The Crown Jewel of Component Libraries
      </motion.p>
    </motion.div>
  </div>
</section>
      </div>
  );
}

export default ComponentLab;
