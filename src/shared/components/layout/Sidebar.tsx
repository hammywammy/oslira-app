// src/shared/components/layout/Sidebar.tsx

/**
 * SIDEBAR - OSLIRA PRODUCTION
 * 
 * Linear-inspired minimalist sidebar.
 * Fixed 240px width, collapses to 64px.
 * 
 * FEATURES:
 * - Collapsible (240px → 64px)
 * - Active route highlighting
 * - Keyboard accessible
 * - Smooth transitions
 * - Logo + navigation + user section
 * 
 * USAGE:
 * <Sidebar />
 */

import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSidebarStore } from '@/shared/stores/sidebarStore';
import { useAuth } from '@/features/auth/contexts/AuthProvider';

// =============================================================================
// TYPES
// =============================================================================

interface NavItem {
  label: string;
  path: string;
  icon: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

// =============================================================================
// NAVIGATION CONFIGURATION
// =============================================================================

const NAV_SECTIONS: NavSection[] = [
  {
    title: 'Main',
    items: [
      { label: 'Dashboard', path: '/dashboard', icon: 'mdi:view-dashboard-outline' },
      { label: 'Lead Research', path: '/leads', icon: 'mdi:account-search-outline' },
      { label: 'Analytics', path: '/analytics', icon: 'mdi:chart-line' },
    ],
  },
  {
    title: 'Tools',
    items: [
      { label: 'Campaigns', path: '/campaigns', icon: 'mdi:bullseye-arrow' },
      { label: 'Messages', path: '/messages', icon: 'mdi:message-text-outline' },
      { label: 'Integrations', path: '/integrations', icon: 'mdi:puzzle-outline' },
    ],
  },
];

// =============================================================================
// COMPONENT
// =============================================================================

export function Sidebar() {
  const { isCollapsed, toggleCollapse } = useSidebarStore();
  const { user, account, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <aside
      className={`
        fixed top-0 left-0 h-screen bg-surface-base border-r border-border
        transition-all duration-200 flex flex-col z-30
        ${isCollapsed ? 'w-16' : 'w-60'}
      `}
    >
      {/* ===== HEADER ===== */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border flex-shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">O</span>
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="font-semibold text-text text-lg"
              >
                Oslira
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Collapse Toggle */}
        {!isCollapsed && (
          <button
            onClick={toggleCollapse}
            className="p-1.5 hover:bg-muted-light rounded transition-colors"
            aria-label="Collapse sidebar"
          >
            <Icon icon="mdi:chevron-left" width={18} className="text-text-secondary" />
          </button>
        )}
      </div>

      {/* ===== NAVIGATION ===== */}
      <nav className="flex-1 px-2 py-4 overflow-y-auto scrollbar-thin">
        {NAV_SECTIONS.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-6">
            {/* Section Title */}
            {!isCollapsed && (
              <h3 className="px-3 mb-2 text-xs font-semibold text-text-secondary uppercase tracking-wide">
                {section.title}
              </h3>
            )}

            {/* Section Items */}
            <div className="space-y-1">
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3 py-2 rounded-lg
                    transition-all duration-150 text-sm font-medium
                    ${isActive
                      ? 'bg-primary text-white'
                      : 'text-text-secondary hover:bg-muted-light hover:text-text'
                    }
                    ${isCollapsed ? 'justify-center' : ''}
                  `}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon icon={item.icon} width={20} className="flex-shrink-0" />
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </NavLink>
              ))}
            </div>
          </div>
        ))}

        {/* Expand Button (when collapsed) */}
        {isCollapsed && (
          <button
            onClick={toggleCollapse}
            className="w-full flex items-center justify-center p-2 hover:bg-muted-light rounded-lg transition-colors"
            aria-label="Expand sidebar"
          >
            <Icon icon="mdi:chevron-right" width={20} className="text-text-secondary" />
          </button>
        )}
      </nav>

      {/* ===== FOOTER (User + Credits) ===== */}
      <div className="flex-shrink-0 border-t border-border p-2">
        {/* Credits Display */}
        {!isCollapsed && account && (
          <div className="mb-2 px-3 py-2 bg-primary-light rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon icon="mdi:lightning-bolt" width={14} className="text-primary" />
                <span className="text-xs font-semibold text-primary">
                  {account.credit_balance ?? 0} credits
                </span>
              </div>
            </div>
          </div>
        )}

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className={`
              w-full flex items-center gap-3 px-3 py-2 rounded-lg
              hover:bg-muted-light transition-colors
              ${isCollapsed ? 'justify-center' : ''}
            `}
          >
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-semibold text-white">
                {user?.full_name?.charAt(0).toUpperCase() ?? 'U'}
              </span>
            </div>

            {/* User Info */}
            {!isCollapsed && (
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium text-text truncate">
                  {user?.full_name ?? 'User'}
                </p>
                <p className="text-xs text-text-secondary truncate">
                  {user?.email}
                </p>
              </div>
            )}

            {/* Dropdown Icon */}
            {!isCollapsed && (
              <Icon icon="mdi:chevron-down" width={16} className="text-text-secondary flex-shrink-0" />
            )}
          </button>

          {/* User Dropdown Menu */}
          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className={`
                  absolute bottom-full mb-2 bg-surface-raised border border-border
                  rounded-lg shadow-lg py-1 z-50
                  ${isCollapsed ? 'left-full ml-2 w-48' : 'left-0 right-0'}
                `}
              >
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    // Navigate to settings
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-text hover:bg-muted-light transition-colors flex items-center gap-2"
                >
                  <Icon icon="mdi:cog-outline" width={16} />
                  Settings
                </button>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    // Navigate to billing
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-text hover:bg-muted-light transition-colors flex items-center gap-2"
                >
                  <Icon icon="mdi:credit-card-outline" width={16} />
                  Billing
                </button>
                <div className="my-1 border-t border-border" />
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm text-danger hover:bg-danger-light transition-colors flex items-center gap-2"
                >
                  <Icon icon="mdi:logout" width={16} />
                  Sign out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </aside>
  );
}
