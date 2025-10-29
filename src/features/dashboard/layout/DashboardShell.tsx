// src/features/dashboard/layout/DashboardShell.tsx
/**
 * DASHBOARD SHELL
 * 
 * Outer container that assembles:
 * - Sidebar (240px fixed left)
 * - Header (64px fixed top)
 * - Main content area (fills remaining space)
 * - Subtle background gradient overlay
 */

import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { WaveOverlay } from './WaveOverlay';

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
  return (
    <div className="min-h-screen bg-background">
      {/* Background Overlay */}
      <WaveOverlay />

      {/* Sidebar */}
      <Sidebar />

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="ml-60 mt-16 p-6 min-h-[calc(100vh-4rem)]">
        {children}
      </main>
    </div>
  );
}
