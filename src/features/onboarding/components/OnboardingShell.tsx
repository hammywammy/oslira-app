// src/features/onboarding/components/OnboardingShell.tsx

/**
 * ONBOARDING SHELL
 * 
 * Layout wrapper with:
 * - Fixed container size (no scrollbar overflow)
 * - Centered max-w-2xl content
 * - Black gradient background
 * - Progress bar at top
 * - Navigation bar at bottom
 */

import { ReactNode } from 'react';

// =============================================================================
// TYPES
// =============================================================================

interface OnboardingShellProps {
  children: ReactNode;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function OnboardingShell({ children }: OnboardingShellProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-6">
      {/* Fixed-size container - prevents scrollbar */}
      <div className="w-full max-w-2xl h-[600px] flex flex-col">
        {/* Content area with consistent height */}
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
