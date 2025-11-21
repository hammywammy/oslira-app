// src/features/dashboard/layout/Header.tsx
/**
 * HEADER COMPONENT
 * 
 * Fixed 64px height
 * Business selector dropdown
 * Credit balance display
 * User avatar menu
 */

import { useState } from 'react';
import { Icon } from '@iconify/react';
import { useAuth } from '@/features/auth/contexts/AuthProvider';
import { motion, AnimatePresence } from 'framer-motion';

// =============================================================================
// COMPONENT
// =============================================================================

export function Header() {
  const { user, account, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="fixed top-0 left-60 right-0 h-16 bg-surface-raised border-b border-border z-fixedNav">
      <div className="h-full flex items-center justify-between px-6">
        {/* Left: Business Selector (Placeholder) */}
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted-light transition-colors">
            <Icon icon="mdi:office-building" width={20} className="text-text-secondary" />
            <span className="text-sm font-medium text-text">My Business</span>
            <Icon icon="mdi:chevron-down" width={16} className="text-text-secondary" />
          </button>
        </div>

        {/* Right: Credits + User Menu */}
        <div className="flex items-center gap-4">
          {/* Credits Display */}
          <div className="flex items-center gap-2 px-3 py-2 bg-primary-light rounded-lg">
            <Icon icon="mdi:lightning-bolt" width={16} className="text-primary" />
            <span className="text-sm font-semibold text-primary">
              {account?.credit_balance ?? 0} credits
            </span>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-sm font-semibold text-white">
                  {user?.full_name?.charAt(0).toUpperCase() ?? 'U'}
                </span>
              </div>
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {showUserMenu && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-dropdownBackdrop"
                    onClick={() => setShowUserMenu(false)}
                  />

                  {/* Menu */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-surface-raised border border-border rounded-lg shadow-lg z-dropdown"
                  >
                    {/* User Info */}
                    <div className="p-4 border-b border-border">
                      <p className="text-sm font-semibold text-text">
                        {user?.full_name ?? 'User'}
                      </p>
                      <p className="text-xs text-text-secondary mt-0.5">
                        {user?.email}
                      </p>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2">
                      <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted-light text-sm text-text transition-colors">
                        <Icon icon="mdi:account-circle" width={18} />
                        <span>Profile</span>
                      </button>
                      <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted-light text-sm text-text transition-colors">
                        <Icon icon="mdi:cog" width={18} />
                        <span>Settings</span>
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-danger-light text-sm text-danger transition-colors"
                      >
                        <Icon icon="mdi:logout" width={18} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
