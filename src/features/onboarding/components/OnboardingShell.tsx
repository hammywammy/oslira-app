// src/features/onboarding/components/OnboardingShell.tsx

/**
 * ONBOARDING SHELL - BULLETPROOF LAYOUT
 * 
 * FIXES:
 * - Proper min-height instead of fixed height
 * - Allows content to expand vertically (no crushing)
 * - Prevents horizontal overflow
 * - Centers content properly
 * 
 * ARCHITECTURE:
 * - Outer: Full viewport height, gradient background
 * - Middle: Responsive container with max-width
 * - Inner: Content wrapper with proper overflow
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 sm:p-6">
      {/* Responsive container - expands with content */}
      <div className="w-full max-w-3xl">
        {/* 
          Content area:
          - min-h-[600px]: Ensures minimum height for consistency
          - py-8: Vertical padding for breathing room
          - No fixed height: Allows content to expand naturally
        */}
        <div className="min-h-[600px] py-8 flex items-start justify-center">
          <div className="w-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
