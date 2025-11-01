// src/shared/components/layout/Sidebar.tsx

import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSidebarStore } from '@/shared/stores/sidebarStore';
import { useAuth } from '@/features/auth/contexts/AuthProvider';

interface NavItem {
  label: string;
  path: string;
  icon: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

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

export function Sidebar() {
  const { isCollapsed, toggleCollapse } = useSidebarStore();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Mock data - replace with real API data
  const subscription = {
    plan_name: 'Pro',
    credits_remaining: 847,
    credits_total: 1000,
    renewal_date: '2025-02-01',
  };

  const creditsPercentage = (subscription.credits_remaining / subscription.credits_total) * 100;
  const daysUntilRenewal = Math.ceil(
    (new Date(subscription.renewal_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

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
      {/* HEADER */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border flex-shrink-0">
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

      {/* NAVIGATION */}
      <nav className="flex-1 px-2 py-4 overflow-y-auto scrollbar-thin">
        {NAV_SECTIONS.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-6">
            {!isCollapsed && (
              <h3 className="px-3 mb-2 text-xs font-semibold text-text-secondary uppercase tracking-wide">
                {section.title}
              </h3>
            )}

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

      {/* FOOTER */}
      <div className="flex-shrink-0 border-t border-border p-2 space-y-2">
        {/* CREDIT BALANCE CARD */}
        {!isCollapsed && (
          <div className="px-3 py-3 bg-surface-raised rounded-lg border border-border">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Icon icon="mdi:lightning-bolt" width={14} className="text-primary" />
                <span className="text-xs font-semibold text-text">
                  {subscription.plan_name} Plan
                </span>
              </div>
              <button 
                className="text-xs text-primary hover:text-primary-600 font-medium"
                onClick={() => {/* Navigate to upgrade */}}
              >
                Upgrade
              </button>
            </div>

            {/* Credit Count */}
            <div className="mb-2">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-text">
                  {subscription.credits_remaining}
                </span>
                <span className="text-sm text-text-secondary">
                  / {subscription.credits_total}
                </span>
              </div>
              <p className="text-xs text-text-secondary">credits remaining</p>
            </div>

            {/* Progress Bar */}
            <div className="mb-2">
              <div className="h-1.5 bg-muted-light rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${creditsPercentage}%` }}
                />
              </div>
            </div>

            {/* Renewal Date */}
            <p className="text-xs text-text-secondary">
              Resets in {daysUntilRenewal} days
            </p>
          </div>
        )}

        {/* Collapsed Credit Display */}
        {isCollapsed && (
          <div className="px-2 py-2 bg-primary-light rounded-lg">
            <div className="flex flex-col items-center">
              <Icon icon="mdi:lightning-bolt" width={16} className="text-primary mb-1" />
              <span className="text-xs font-bold text-primary">
                {subscription.credits_remaining}
              </span>
            </div>
          </div>
        )}

        {/* USER MENU */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className={`
              w-full flex items-center gap-3 px-3 py-2 rounded-lg
              hover:bg-muted-light transition-colors
              ${isCollapsed ? 'justify-center' : ''}
            `}
          >
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-semibold text-white">
                {user?.full_name?.charAt(0).toUpperCase() ?? 'U'}
              </span>
            </div>

            {!isCollapsed && (
              <>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium text-text truncate">
                    {user?.full_name ?? 'User'}
                  </p>
                  <p className="text-xs text-text-secondary truncate">
                    {user?.email}
                  </p>
                </div>
                <Icon icon="mdi:chevron-down" width={16} className="text-text-secondary flex-shrink-0" />
              </>
            )}
          </button>

          {/* DROPDOWN MENU */}
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
                  onClick={() => setShowUserMenu(false)}
                  className="w-full px-4 py-2 text-left text-sm text-text hover:bg-muted-light transition-colors flex items-center gap-2"
                >
                  <Icon icon="mdi:cog-outline" width={16} />
                  Settings
                </button>
                <button
                  onClick={() => setShowUserMenu(false)}
                  className="w-full px-4 py-2 text-left text-sm text-text hover:bg-muted-light transition-colors flex items-center gap-2"
                >
                  <Icon icon="mdi:credit-card-outline" width={16} />
                  Usage & Billing
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
