// src/features/dashboard/layout/TableViewLayout.tsx

/**
 * TABLE VIEW LAYOUT - SUPABASE STYLE
 * 
 * Dedicated layout for database-style table views.
 * Zero padding, zero containers, full viewport integration.
 * 
 * STRUCTURE:
 * - TopBar (h-14, fixed top, z-50)
 * - Sidebar (w-60/w-16, fixed left, z-30)
 * - Hotbar (h-14, fixed below TopBar, z-40)
 * - Table (fills remaining viewport, scrollable)
 * - Pagination (h-11, fixed bottom, z-30)
 * 
 * This component ONLY handles layout positioning.
 * All business logic lives in child components.
 */

import { ReactNode } from 'react';
import { TopBar } from '@/shared/components/layout/TopBar';
import { Sidebar } from '@/shared/components/layout/Sidebar';
import { useSidebarStore } from '@/shared/stores/sidebarStore';

interface TableViewLayoutProps {
  hotbar: ReactNode;
  table: ReactNode;
  pagination: ReactNode;
}

export function TableViewLayout({ hotbar, table, pagination }: TableViewLayoutProps) {
  const { isCollapsed } = useSidebarStore();

  return (
    <div className="min-h-screen bg-background">
      {/* Global TopBar - Fixed top, spans full width */}
      <TopBar />
      
      {/* Sidebar - Fixed left */}
      <Sidebar />

      {/* Hotbar - Fixed below TopBar, respects sidebar */}
      <div className={`
        fixed top-14 right-0 z-40
        transition-[left] duration-200
        ${isCollapsed ? 'left-16' : 'left-60'}
      `}>
        {hotbar}
      </div>

      {/* Table Container - Fills viewport between hotbar and pagination */}
      <div className={`
        fixed top-28 bottom-11 right-0
        overflow-auto
        transition-[left] duration-200
        ${isCollapsed ? 'left-16' : 'left-60'}
      `}>
        {table}
      </div>

      {/* Pagination - Fixed bottom, respects sidebar */}
      <div className={`
        fixed bottom-0 right-0 z-30
        transition-[left] duration-200
        ${isCollapsed ? 'left-16' : 'left-60'}
      `}>
        {pagination}
      </div>
    </div>
  );
}
