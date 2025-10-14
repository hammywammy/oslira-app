import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';

interface ShowcaseItem {
  name: string;
  path: string;
  title: string;
}

// Manually define showcases
const SHOWCASES: ShowcaseItem[] = [
  { name: 'TailwindShowcase', path: '/showcase/tailwind', title: 'Tailwind' },
  { name: 'FramerShowcase', path: '/showcase/framer', title: 'Framer' },
  { name: 'ComponentLab', path: '/showcase/component', title: 'Component Lab' },
  { name: 'DarkModeShowcase', path: '/showcase/darkmode', title: 'Dark Mode' },
];

export function ShowcaseNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPath, setCurrentPath] = useState('');
  const [isShowcasePage, setIsShowcasePage] = useState(false);

  useEffect(() => {
    const path = window.location.pathname;
    setCurrentPath(path);
    setIsShowcasePage(path.startsWith('/showcase'));
  }, []);

  // Don't render anything if not on a showcase page
  if (!isShowcasePage) {
    return null;
  }

  const filteredShowcases = SHOWCASES.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Toggle Button - Fixed in corner */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[100] w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-2xl flex items-center justify-center"
        whileHover={{ scale: 1.1, rotate: 180 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Icon 
          icon={isOpen ? "mdi:close" : "mdi:view-dashboard"} 
          className="text-2xl text-white"
        />
      </motion.button>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
          />
        )}
      </AnimatePresence>

      {/* Slide-out Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 shadow-2xl z-[95] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                  <Icon icon="mdi:palette" className="text-purple-500" />
                  Showcases
                </h2>
                <motion.button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  whileHover={{ rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon icon="mdi:close" className="text-xl text-gray-400" />
                </motion.button>
              </div>

              {/* Search */}
              <div className="relative">
                <Icon 
                  icon="mdi:magnify" 
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search showcases..."
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              {/* Count */}
              <p className="text-sm text-gray-400 mt-3">
                {filteredShowcases.length} showcase{filteredShowcases.length !== 1 ? 's' : ''} available
              </p>
            </div>

            {/* Showcase List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {filteredShowcases.length === 0 ? (
                <div className="text-center py-12">
                  <Icon icon="mdi:magnify" className="text-6xl text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No showcases found</p>
                </div>
              ) : (
                filteredShowcases.map((item, index) => {
                  const isActive = currentPath === item.path;
                  
                  return (
                    <motion.a
                      key={item.name}
                      href={item.path}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`block p-4 rounded-xl border transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500/50'
                          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                      }`}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className={`font-bold mb-1 ${
                            isActive ? 'text-purple-400' : 'text-white'
                          }`}>
                            {item.title}
                          </h3>
                          <p className="text-xs text-gray-500 font-mono">
                            {item.path}
                          </p>
                        </div>
                        
                        {isActive && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="ml-3"
                          >
                            <Icon 
                              icon="mdi:check-circle" 
                              className="text-xl text-purple-500"
                            />
                          </motion.div>
                        )}
                      </div>
                    </motion.a>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Showcase navigation</span>
                <span className="font-mono">{SHOWCASES.length} pages</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
