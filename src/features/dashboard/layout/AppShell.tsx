// src/features/dashboard/layout/DashboardShell.tsx

/**
 * DASHBOARD SHELL WITH TOPBAR - UPDATED
 * 
 * This is how you integrate the TopBar into your existing layout.
 * The TopBar will appear on all pages that use DashboardShell.
 */

import { ReactNode } from 'react';
import { Sidebar } from '@/shared/components/layout/Sidebar';
import { TopBar } from '@/shared/components/layout/TopBar'; // ADD THIS IMPORT
import { useSidebarStore } from '@/shared/stores/sidebarStore';

interface DashboardShellProps {
  children: ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const { isCollapsed } = useSidebarStore();

  return (
    <div className="min-h-screen bg-background">
      {/* TopBar - Fixed at top of screen */}
      <TopBar />
      
      {/* Sidebar - Fixed on left side */}
      <Sidebar />

      {/* Main Content Area */}
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
