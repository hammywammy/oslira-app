// src/features/dashboard/layout/DashboardShell.tsx

/**
 * DASHBOARD SHELL - UPDATED
 * 
 * Outer container that assembles:
 * - Sidebar (240px fixed left, collapsible to 64px)
 * - Main content area (fills remaining space)
 * 
 * CHANGES:
 * - Now uses shared Sidebar component
 * - Removed old separate Sidebar import
 * - Removed Header (functionality moved to Sidebar)
 * - Simplified to just Sidebar + main content
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
          min-h-screen p-6 transition-[margin] duration-300
          ${isCollapsed ? 'ml-16' : 'ml-60'}
        `}
      >
        {children}
      </main>
    </div>
  );
}
