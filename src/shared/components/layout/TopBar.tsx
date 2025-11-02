// src/shared/components/layout/TopBar.tsx

import { useState, useRef, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/core/theme/ThemeProvider';

export function TopBar() {
  const { theme, toggleTheme } = useTheme();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  // Mock notifications - replace with real data
  const notifications = [
    { id: 1, text: 'New lead analyzed', time: '2 min ago', unread: true },
    { id: 2, text: 'Campaign completed', time: '1 hour ago', unread: true },
    { id: 3, text: 'Credits running low', time: '3 hours ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  // Keyboard shortcut for search (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === 'Escape') {
        searchRef.current?.blur();
        setSearchQuery('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {/* Top border line */}
      <div className="fixed top-0 left-0 right-0 h-[1px] bg-border z-50" />
      
      {/* Main TopBar */}
      <header className="fixed top-[1px] left-0 right-0 h-14 bg-background border-b border-border z-40">
        <div className="h-full px-6 flex items-center justify-between">
          
          {/* Left: Search Bar */}
          <div className="flex-1 max-w-xl">
            <div className={`
              relative group
              ${isSearchFocused ? 'w-full' : 'w-full'}
            `}>
              {/* Search Input */}
              <div className={`
                relative flex items-center
                ${isSearchFocused 
                  ? 'ring-2 ring-primary/20 bg-muted/50' 
                  : 'bg-muted/30 hover:bg-muted/50'
                }
                rounded-lg transition-all duration-200
              `}>
                <Icon 
                  icon="ph:magnifying-glass" 
                  className="absolute left-3 w-4 h-4 text-muted-foreground"
                />
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  placeholder="Search"
                  className="w-full pl-10 pr-20 py-2 bg-transparent text-sm text-foreground placeholder-muted-foreground focus:outline-none"
                />
                {/* Keyboard shortcut hint */}
                {!isSearchFocused && !searchQuery && (
                  <div className="absolute right-3 flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 text-xs font-medium text-muted-foreground bg-background border border-border rounded">
                      ⌘K
                    </kbd>
                  </div>
                )}
                {/* Clear button */}
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 p-1 hover:bg-muted rounded transition-colors"
                  >
                    <Icon icon="ph:x" className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}
              </div>

              {/* Search Results Dropdown */}
              <AnimatePresence>
                {isSearchFocused && searchQuery && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full mt-2 w-full bg-background border border-border rounded-lg shadow-xl overflow-hidden"
                  >
                    <div className="p-2">
                      <div className="px-3 py-2 text-xs font-medium text-muted-foreground">
                        No results found
                      </div>
                      <div className="px-3 py-2 text-xs text-muted-foreground">
                        Try searching for leads, campaigns, or settings
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right: Utility Icons */}
          <div className="flex items-center gap-1 ml-6">
            
            {/* Help Button */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowHelp(!showHelp);
                  setShowNotifications(false);
                }}
                className="p-2 hover:bg-muted rounded-lg transition-colors relative"
              >
                <Icon icon="ph:question" className="w-5 h-5 text-muted-foreground" />
              </button>

              {/* Help Dropdown */}
              <AnimatePresence>
                {showHelp && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setShowHelp(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-64 bg-background border border-border rounded-lg shadow-xl z-40"
                    >
                      <div className="p-2">
                        <a href="#" className="block px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg transition-colors">
                          <div className="flex items-center gap-3">
                            <Icon icon="ph:book-open" className="w-4 h-4 text-muted-foreground" />
                            Documentation
                          </div>
                        </a>
                        <a href="#" className="block px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg transition-colors">
                          <div className="flex items-center gap-3">
                            <Icon icon="ph:chat-circle" className="w-4 h-4 text-muted-foreground" />
                            Contact Support
                          </div>
                        </a>
                        <a href="#" className="block px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg transition-colors">
                          <div className="flex items-center gap-3">
                            <Icon icon="ph:keyboard" className="w-4 h-4 text-muted-foreground" />
                            Keyboard Shortcuts
                          </div>
                        </a>
                        <div className="my-1 border-t border-border" />
                        <a href="#" className="block px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg transition-colors">
                          <div className="flex items-center gap-3">
                            <Icon icon="ph:sparkle" className="w-4 h-4 text-muted-foreground" />
                            What's New
                          </div>
                        </a>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Notifications Button */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowHelp(false);
                }}
                className="p-2 hover:bg-muted rounded-lg transition-colors relative"
              >
                <Icon icon="ph:bell" className="w-5 h-5 text-muted-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
                )}
              </button>

              {/* Notifications Dropdown */}
              <AnimatePresence>
                {showNotifications && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setShowNotifications(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-80 bg-background border border-border rounded-lg shadow-xl z-40"
                    >
                      <div className="p-4 border-b border-border">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
                          {unreadCount > 0 && (
                            <button className="text-xs text-primary hover:text-primary/80 transition-colors">
                              Mark all as read
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`
                              px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer
                              ${notification.unread ? 'bg-muted/20' : ''}
                            `}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`
                                w-2 h-2 rounded-full mt-1.5 flex-shrink-0
                                ${notification.unread ? 'bg-primary' : 'bg-transparent'}
                              `} />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-foreground">
                                  {notification.text}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {notification.time}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 border-t border-border">
                        <button className="text-xs text-primary hover:text-primary/80 transition-colors">
                          View all notifications
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Settings Button */}
            <button
              onClick={() => {/* Navigate to settings */}}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <Icon icon="ph:gear" className="w-5 h-5 text-muted-foreground" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <Icon 
                icon={theme === 'dark' ? 'ph:sun' : 'ph:moon'} 
                className="w-5 h-5 text-muted-foreground" 
              />
            </button>
          </div>
        </div>
      </header>

      {/* Spacer to push content down */}
      <div className="h-[57px]" />
    </>
  );
}
