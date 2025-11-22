// src/shared/components/layout/TopBar.tsx

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSidebarStore } from '@/shared/stores/sidebarStore';
import { DropdownPortal } from '@/shared/components/ui/DropdownPortal';
import { NotificationBell } from '@/features/notifications';
import { QueueIndicator, useQueueSSE } from '@/features/analysis-queue';

export function TopBar() {
  const navigate = useNavigate();
  const { isCollapsed } = useSidebarStore();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const helpButtonRef = useRef<HTMLButtonElement>(null);

  // Initialize SSE connection for analysis queue
  useQueueSSE();

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
      {/* Top border line - spans full width */}
      <div className="fixed top-0 left-0 right-0 h-[1px] bg-border z-topBarBorder" />

      {/* Main TopBar - respects Sidebar width */}
      <header className={`
        fixed top-[1px] right-0 h-14 bg-background border-b border-border z-topBar
        transition-[left] duration-200
        ${isCollapsed ? 'left-16' : 'left-60'}
      `}>
        <div className="h-full px-6 flex items-center justify-between">
          
          {/* Left: Search Bar */}
          <div className="flex-1 max-w-xl">
            <div className={`
              relative group
              ${isSearchFocused ? 'w-full' : 'w-full'}
            `}>
              {/* Search Input - ENHANCED CONTRAST */}
              <div className={`
                relative flex items-center
                ${isSearchFocused 
                  ? 'ring-2 ring-primary/30 bg-muted border border-border' 
                  : 'bg-muted border border-border hover:border-muted-foreground/20'
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
                    className="absolute right-3 p-1 hover:bg-background rounded transition-colors"
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
                ref={helpButtonRef}
                onClick={() => setShowHelp(!showHelp)}
                className="p-2 hover:bg-muted rounded-lg transition-colors relative"
              >
                <Icon icon="ph:question" className="w-5 h-5 text-muted-foreground" />
              </button>

              {/* Help Dropdown */}
              <DropdownPortal
                isOpen={showHelp}
                onClose={() => setShowHelp(false)}
                triggerRef={helpButtonRef}
                width={256}
                alignment="right"
              >
                <div className="p-2">
                  <a href="#" className="block px-3 py-2 text-sm hover:bg-muted rounded-lg transition-colors">
                    Documentation
                  </a>
                  <a href="#" className="block px-3 py-2 text-sm hover:bg-muted rounded-lg transition-colors">
                    Keyboard Shortcuts
                  </a>
                  <a href="#" className="block px-3 py-2 text-sm hover:bg-muted rounded-lg transition-colors">
                    Support
                  </a>
                  <div className="h-px bg-border my-2" />
                  <a href="#" className="block px-3 py-2 text-sm hover:bg-muted rounded-lg transition-colors">
                    What's New
                  </a>
                </div>
              </DropdownPortal>
            </div>

            {/* Analysis Queue Indicator */}
            <QueueIndicator />

            {/* Notifications */}
            <NotificationBell />

            {/* Settings Button - NAVIGATION ENABLED */}
            <button 
              onClick={() => navigate('/settings')}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <Icon icon="ph:gear" className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
