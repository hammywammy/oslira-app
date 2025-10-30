// src/features/dashboard/layout/DashboardShell.tsx

/**
 * DASHBOARD SHELL - OSLIRA PRODUCTION
 * 
 * Outer container that assembles the dashboard layout.
 * Sidebar + main content area with proper spacing.
 * 
 * LAYOUT:
 * - Sidebar: Fixed left (240px, collapses to 64px)
 * - Main: Fills remaining space, adjusts margin
 * 
 * USAGE:
 * <DashboardShell>
 *   <YourPageContent />
 * </DashboardShell>
 */

import { ReactNode } from 'react';
import { Sidebar } from '@/shared/components/layout/Sidebar';
import { useSidebarStore } from '@/shared/stores/sidebarStore';

// =============================================================================
// TYPES
// =============================================================================

interface DashboardShellProps {
  children: ReactNode;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function DashboardShell({ children }: DashboardShellProps) {
  const { isCollapsed } = useSidebarStore();

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content - Adjusts margin based on sidebar state */}
      <main
        className={`
          min-h-screen p-6 transition-[margin] duration-200
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
