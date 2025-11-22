// src/pages/settings/SettingsPage.tsx

/**
 * SETTINGS PAGE - CLAUDE-STYLE ARCHITECTURE
 * 
 * Professional settings interface with tab navigation.
 * All tabs are placeholders for now—real data integration comes later.
 * 
 * ARCHITECTURE:
 * - Left sidebar: Tab navigation (General, Account, Privacy, Billing, Usage)
 * - Right panel: Active tab content
 * - Nested routes: /settings/general, /settings/account, etc.
 * - Default route: /settings redirects to /settings/general
 * 
 * DESIGN PHILOSOPHY:
 * "Concert hall, not arcade"
 * - Clean, minimal interface
 * - Professional spacing and typography
 * - Natural dark mode support
 * - Subtle hover states
 * 
 * INTEGRATION POINTS (FUTURE):
 * - User profile data from AuthProvider
 * - Business profile data from backend
 * - Subscription data from billing system
 * - Usage stats from analytics
 */

import { Navigate, Outlet, useLocation, NavLink } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { TopBar } from '@/shared/components/layout/TopBar';
import { Sidebar } from '@/shared/components/layout/Sidebar';
import { useSidebarStore } from '@/shared/stores/sidebarStore';

// =============================================================================
// TAB CONFIGURATION
// =============================================================================

interface SettingsTab {
  id: string;
  label: string;
  path: string;
  icon: string;
  description: string;
}

const SETTINGS_TABS: SettingsTab[] = [
  {
    id: 'general',
    label: 'General',
    path: '/settings/general',
    icon: 'ph:gear',
    description: 'Basic preferences and display settings',
  },
  {
    id: 'account',
    label: 'Account',
    path: '/settings/account',
    icon: 'ph:user',
    description: 'Profile information and authentication',
  },
  {
    id: 'privacy',
    label: 'Privacy',
    path: '/settings/privacy',
    icon: 'ph:shield-check',
    description: 'Data privacy and security settings',
  },
  {
    id: 'billing',
    label: 'Billing',
    path: '/settings/billing',
    icon: 'ph:credit-card',
    description: 'Subscription and payment management',
  },
  {
    id: 'usage',
    label: 'Usage',
    path: '/settings/usage',
    icon: 'ph:chart-bar',
    description: 'Credit usage and analytics',
  },
];

// =============================================================================
// COMPONENT
// =============================================================================

export function SettingsPage() {
  const location = useLocation();
  const { isCollapsed } = useSidebarStore();

  // Redirect /settings to /settings/general
  if (location.pathname === '/settings') {
    return <Navigate to="/settings/general" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Global TopBar - Fixed top, spans full width */}
      <TopBar />

      {/* Sidebar - Fixed left */}
      <Sidebar />

      {/* Main Content - Respects sidebar width */}
      <div className={`
        transition-[margin] duration-200 pt-20
        ${isCollapsed ? 'ml-16' : 'ml-60'}
      `}>
        <div className="max-w-7xl mx-auto p-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Settings Layout: Sidebar + Content */}
        <div className="flex gap-8">
          {/* Left Sidebar - Tab Navigation */}
          <aside className="w-64 shrink-0">
            <nav className="space-y-1">
              {SETTINGS_TABS.map((tab) => {
                const isActive = location.pathname === tab.path;

                return (
                  <NavLink
                    key={tab.id}
                    to={tab.path}
                    className={`
                      group flex items-start gap-3 px-4 py-3 rounded-lg
                      transition-colors duration-200
                      ${isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }
                    `}
                  >
                    <Icon
                      icon={tab.icon}
                      className={`w-5 h-5 shrink-0 mt-0.5 ${
                        isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium ${isActive ? 'text-primary' : ''}`}>
                        {tab.label}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5 leading-tight">
                        {tab.description}
                      </div>
                    </div>
                  </NavLink>
                );
              })}
            </nav>
          </aside>

          {/* Right Panel - Active Tab Content */}
          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
