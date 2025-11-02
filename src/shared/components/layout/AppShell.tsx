// src/shared/components/layout/AppShell.tsx

/**
 * APP SHELL - MAIN APPLICATION LAYOUT
 * 
 * Core layout wrapper for all authenticated application pages.
 * Provides consistent navigation and layout structure.
 * 
 * COMPONENTS:
 * - TopBar: Global search, notifications, settings
 * - Sidebar: Main navigation
 * - Main: Content area with responsive margins
 */

import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { useSidebarStore } from '@/shared/stores/sidebarStore';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { isCollapsed } = useSidebarStore();

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Sidebar />
      <main
        className={`
          min-h-screen transition-[margin] duration-200
          pt-20 p-6
          ${isCollapsed ? 'ml-16' : 'ml-60'}
        `}
      >
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
