// src/shared/components/layout/Sidebar.tsx

import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSidebarStore } from '@/shared/stores/sidebarStore';
import { useAuth } from '@/features/auth/contexts/AuthProvider';
import { useTheme } from '@/core/theme/ThemeProvider';

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
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isHoveringToggle, setIsHoveringToggle] = useState(false);
  const [isHoveringHeader, setIsHoveringHeader] = useState(false);

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

  return (
    <>
      <aside
        className={`
          fixed top-0 left-0 h-screen bg-background border-r border-border
          transition-all duration-200 flex flex-col z-30
          ${isCollapsed ? 'w-16' : 'w-60'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* LOGO SECTION */}
          <div 
            className="h-16 flex items-center justify-between px-4 border-b border-border relative group"
            onMouseEnter={() => setIsHoveringHeader(true)}
            onMouseLeave={() => setIsHoveringHeader(false)}
          >
            {/* Toggle Button - Always present but conditionally visible */}
            <button
              onClick={toggleCollapse}
              className={`
                p-1.5 rounded-lg transition-all duration-200 z-10
                ${isCollapsed && !isHoveringHeader ? 'opacity-0 pointer-events-none' : 'opacity-100'}
                ${isHoveringHeader || !isCollapsed ? 'hover:bg-muted' : ''}
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

            {/* Logo and Text */}
            {!isCollapsed ? (
              // Expanded: Logo and text on right
              <div className="flex items-center gap-2.5 ml-auto">
                <img 
                  src={theme === 'dark' ? '/logo-dark.svg' : '/logo-light.svg'}
                  alt="Oslira"
                  className="h-7 w-7"
                />
                <span className="text-lg font-semibold text-foreground">
                  Oslira
                </span>
              </div>
            ) : (
              // Collapsed: Logo centered, hidden on hover
              <div className={`
                absolute inset-0 flex items-center justify-center pointer-events-none
                transition-opacity duration-200
                ${isHoveringHeader ? 'opacity-0' : 'opacity-100'}
              `}>
                <img 
                  src={theme === 'dark' ? '/logo-dark.svg' : '/logo-light.svg'}
                  alt="Oslira"
                  className="h-7 w-7"
                />
              </div>
            )}
          </div>

          {/* NAVIGATION */}
          <div className="flex-1 overflow-y-auto py-4">
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
                        <div className="absolute left-full ml-2 px-2 py-1 bg-foreground text-background text-xs font-medium rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-50">
                          {item.label}
                        </div>
                      )}
                    </NavLink>
                  ))}
                </nav>
              </div>
            ))}
          </div>

          {/* BOTTOM SECTION - Credits & User */}
          <div className="border-t border-border p-3 space-y-3">
            {/* Simple Credits Display */}
            {!isCollapsed && (
              <div className="px-3 py-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Credits remaining</span>
                  <span className="text-sm font-semibold text-foreground">
                    {user?.account?.credit_balance || 0}
                  </span>
                </div>
              </div>
            )}

            {/* Collapsed Credits Display */}
            {isCollapsed && (
              <div className="flex justify-center">
                <div className="text-center">
                  <Icon icon="ph:coins" className="w-4 h-4 text-muted-foreground mb-1" />
                  <span className="text-xs font-semibold text-foreground">
                    {user?.account?.credit_balance || 0}
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
                {/* Avatar with image or fallback */}
                {user?.avatar_url ? (
                  <img 
                    src={user.avatar_url} 
                    alt={user.full_name || 'User'}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-white">
                      {getUserInitial()}
                    </span>
                  </div>
                )}

                {!isCollapsed && (
                  <>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-foreground truncate">
                        {user?.full_name || 'User'}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user?.email || 'user@example.com'}
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

      {/* USER DROPDOWN MENU - Outside sidebar for proper z-index */}
      <AnimatePresence>
        {showUserMenu && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowUserMenu(false)}
            />

            {/* Claude-style Dropdown */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className={`
                fixed z-50 bg-white dark:bg-neutral-900 rounded-xl shadow-2xl border border-neutral-200 dark:border-neutral-800
                ${isCollapsed ? 'left-20 bottom-6' : 'left-64 bottom-6'}
                w-72
              `}
              style={{
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
              }}
            >
              {/* User Info Header - Shows name and plan */}
              <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                      {user?.full_name || 'User'}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {user?.subscription?.plan_type || 'Free Plan'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                <button className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center gap-3">
                  <Icon icon="ph:gear" className="w-4 h-4 text-neutral-500" />
                  <span>Settings</span>
                </button>

                <button className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center gap-3">
                  <Icon icon="ph:question" className="w-4 h-4 text-neutral-500" />
                  <span>Get help</span>
                </button>

                <div className="my-1.5 border-t border-neutral-200 dark:border-neutral-800" />

                <button className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center gap-3">
                  <Icon icon="ph:crown-simple" className="w-4 h-4 text-neutral-500" />
                  <span>Upgrade plan</span>
                </button>

                <button className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center gap-3">
                  <Icon icon="ph:book-open" className="w-4 h-4 text-neutral-500" />
                  <span>Learn more</span>
                </button>

                <div className="my-1.5 border-t border-neutral-200 dark:border-neutral-800" />

                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center gap-3"
                >
                  <Icon icon="ph:sign-out" className="w-4 h-4 text-neutral-500" />
                  <span>Log out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
