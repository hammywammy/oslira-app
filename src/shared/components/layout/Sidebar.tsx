// src/shared/components/layout/Sidebar.tsx

import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSidebarStore } from '@/shared/stores/sidebarStore';
import { useAuth } from '@/features/auth/contexts/AuthProvider';
import { useTheme } from '@/core/theme/ThemeProvider';
import { useCurrentBalance, useLightBalance } from '@/features/credits/store/creditsStore';
import { useSubscriptionPlan } from '@/core/store/selectors';
import { Portal } from '@/shared/components/ui/Portal';
import { env } from '@/core/auth/environment';

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
    title: 'MAIN',
    items: [
      { label: 'Dashboard', path: '/dashboard', icon: 'ph:squares-four' },
      { label: 'Lead Research', path: '/leads', icon: 'ph:magnifying-glass' },
      { label: 'Analytics', path: '/analytics', icon: 'ph:chart-line' },
    ],
  },
  {
    title: 'TOOLS',
    items: [
      { label: 'Campaigns', path: '/campaigns', icon: 'ph:target' },
      { label: 'Messages', path: '/messages', icon: 'ph:chat-circle' },
      { label: 'Integrations', path: '/integrations', icon: 'ph:puzzle-piece' },
    ],
  },
];

export function Sidebar() {
  const { isCollapsed, toggleCollapse } = useSidebarStore();
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const creditBalance = useCurrentBalance();
  const lightBalance = useLightBalance();
  const planType = useSubscriptionPlan();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isHoveringToggle, setIsHoveringToggle] = useState(false);
  const [isHoveringSidebar, setIsHoveringSidebar] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  // Get user initials for fallback avatar
  const getUserInitial = () => {
    if (user?.full_name) {
      return user.full_name.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  // Get user's subscription plan
  const getUserPlan = () => {
    if (!planType) return 'Free Plan';

    // Capitalize first letter of plan type
    return planType.charAt(0).toUpperCase() + planType.slice(1) + ' Plan';
  };

  return (
    <>
      <aside
        className={`
          fixed top-[1px] left-0 bottom-0 bg-background border-r border-border
          transition-all duration-200 flex flex-col z-sidebar
          ${isCollapsed ? 'w-16' : 'w-60'}
          ${isCollapsed ? 'overflow-hidden' : 'overflow-visible'}
        `}
        onMouseEnter={() => setIsHoveringSidebar(true)}
        onMouseLeave={() => setIsHoveringSidebar(false)}
      >
        <div className="flex flex-col h-full">
          {/* LOGO SECTION - SAME HEIGHT AS TOPBAR (56px) */}
          <div className="h-14 flex items-center justify-between px-4 relative">
            {/* Logo and Text - Left side, clickable */}
            {!isCollapsed ? (
              // Expanded: Logo and text on left
              <a
                href={env.marketingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
              >
                <img
                  src={theme === 'dark' ? '/logo-dark.svg' : '/logo-light.svg'}
                  alt="Oslira"
                  className="h-7 w-7"
                />
                <span className="text-lg font-semibold text-foreground">
                  Oslira
                </span>
              </a>
            ) : (
              // Collapsed: Logo only on left, hidden on hover
              <a
                href={env.marketingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`
                  absolute left-4 top-1/2 -translate-y-1/2
                  transition-opacity duration-200
                  ${isHoveringSidebar ? 'opacity-0 pointer-events-none' : 'opacity-100'}
                `}
              >
                <img
                  src={theme === 'dark' ? '/logo-dark.svg' : '/logo-light.svg'}
                  alt="Oslira"
                  className="h-7 w-7"
                />
              </a>
            )}

            {/* Toggle Button - Right side, shows on hover when collapsed */}
            <button
              onClick={toggleCollapse}
              className={`
                ml-auto p-1.5 rounded-lg transition-all duration-200 z-10
                ${isCollapsed && !isHoveringSidebar ? 'opacity-0 pointer-events-none' : 'opacity-100'}
                ${isHoveringSidebar || !isCollapsed ? 'hover:bg-muted' : ''}
              `}
              style={{ backgroundColor: 'transparent' }}
              onMouseEnter={() => setIsHoveringToggle(true)}
              onMouseLeave={() => setIsHoveringToggle(false)}
            >
              <img 
                src={
                  !isCollapsed && isHoveringToggle 
                    ? theme === 'dark' 
                      ? '/sidebar-toggle-close-dark.svg' 
                      : '/sidebar-toggle-close-light.svg'
                    : theme === 'dark'
                      ? '/sidebar-toggle-dark.svg'
                      : '/sidebar-toggle-light.svg'
                }
                alt="Toggle sidebar"
                className="w-5 h-5"
                style={{ backgroundColor: 'transparent' }}
              />
            </button>
          </div>

          {/* NAVIGATION */}
          <div className={`flex-1 py-4 ${isCollapsed ? '' : 'overflow-y-auto'}`}>
            {NAV_SECTIONS.map((section) => (
              <div key={section.title} className="mb-6">
                {!isCollapsed && (
                  <h3 className="text-xs font-semibold text-muted-foreground mb-2 px-6 tracking-wider">
                    {section.title}
                  </h3>
                )}
                <nav className="px-3 space-y-1">
                  {section.items.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) => `
                        flex items-center gap-3 px-3 py-2.5 rounded-lg
                        transition-all duration-200 group relative
                        ${isActive 
                          ? 'bg-primary text-white' 
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        }
                        ${isCollapsed ? 'justify-center' : ''}
                      `}
                    >
                      <Icon icon={item.icon} className="w-5 h-5 flex-shrink-0" />
                      {!isCollapsed && (
                        <span className="text-sm font-medium">{item.label}</span>
                      )}
                      
                      {/* Tooltip for collapsed state */}
                      {isCollapsed && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-foreground text-background text-xs font-medium rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-tooltip">
                          {item.label}
                        </div>
                      )}
                    </NavLink>
                  ))}
                </nav>
              </div>
            ))}
          </div>

          {/* BOTTOM SECTION - Credits & Analysis & User */}
          <div className="border-t border-border p-3 space-y-2">
            {/* Credits Display */}
            {!isCollapsed && (
              <div className="px-3 py-2.5 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-center gap-2 mb-1">
                  <Icon icon="ph:lightning" className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-xs font-medium text-muted-foreground">Credits</span>
                </div>
                <div className="text-xl font-bold text-primary">
                  {creditBalance}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">remaining this month</div>
              </div>
            )}

            {/* Light Analysis Display */}
            {!isCollapsed && (
              <div className="px-3 py-2.5 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-2 mb-1">
                  <Icon icon="ph:chart-line" className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                  <span className="text-xs font-medium text-muted-foreground">Light Analysis</span>
                </div>
                <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                  {lightBalance}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">remaining this month</div>
              </div>
            )}

            {/* Collapsed State */}
            {isCollapsed && (
              <div className="flex flex-col items-center gap-2 py-2">
                <div className="text-center">
                  <Icon icon="ph:lightning" className="w-4 h-4 text-primary mx-auto mb-1" />
                  <span className="text-xs font-bold text-primary">
                    {creditBalance}
                  </span>
                </div>
                <div className="text-center">
                  <Icon icon="ph:chart-line" className="w-4 h-4 text-purple-600 dark:text-purple-400 mx-auto mb-1" />
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                    {lightBalance}
                  </span>
                </div>
              </div>
            )}

            {/* User Menu Button */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                  hover:bg-muted transition-colors
                  ${isCollapsed ? 'justify-center' : ''}
                `}
              >
                {/* Avatar - Always show initials, never broken image */}
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold text-white">
                    {getUserInitial()}
                  </span>
                </div>

                {!isCollapsed && (
                  <>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-foreground truncate">
                        {user?.full_name || 'User'}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {getUserPlan()}
                      </p>
                    </div>
                    <Icon 
                      icon={showUserMenu ? 'ph:caret-up' : 'ph:caret-down'} 
                      className="w-4 h-4 text-muted-foreground flex-shrink-0" 
                    />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* USER DROPDOWN MENU - Portal for proper z-index layering */}
      <Portal>
        <AnimatePresence>
          {showUserMenu && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-dropdownBackdrop"
                onClick={() => setShowUserMenu(false)}
              />

              {/* Claude-style Dropdown */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.15 }}
                className={`
                  fixed z-dropdown bg-white dark:bg-neutral-900 rounded-xl shadow-2xl border border-neutral-200 dark:border-neutral-800
                  ${isCollapsed ? 'left-20 bottom-20' : 'left-64 bottom-20'}
                  w-64
                `}
              >
                {/* User Info Header */}
                <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <span className="text-base font-semibold text-white">
                        {getUserInitial()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                        {user?.full_name || 'User'}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="p-2">
                  <NavLink
                    to="/settings"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-700 dark:text-neutral-300"
                  >
                    <Icon icon="ph:gear" className="w-5 h-5" />
                    <span className="text-sm font-medium">Settings</span>
                  </NavLink>

                  <NavLink
                    to="/upgrade"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-700 dark:text-neutral-300"
                  >
                    <Icon icon="ph:arrow-up" className="w-5 h-5" />
                    <span className="text-sm font-medium">Upgrade</span>
                  </NavLink>

                  <div className="h-px bg-neutral-200 dark:bg-neutral-800 my-2" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400"
                  >
                    <Icon icon="ph:sign-out" className="w-5 h-5" />
                    <span className="text-sm font-medium">Log out</span>
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </Portal>
    </>
  );
}
