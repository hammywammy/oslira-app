// src/features/onboarding/components/OnboardingShell.tsx

/**
 * ONBOARDING SHELL - FLEXIBLE LAYOUT
 * 
 * FIXED:
 * ✅ No scroll bars (overflow-y-auto removed)
 * ✅ Content expands vertically as needed (no height restrictions)
 * ✅ Always centered horizontally
 * ✅ Vertically centered when content is small
 * ✅ Top-aligned when content is large
 * 
 * ARCHITECTURE:
 * - Outer: Full viewport, gradient background
 * - Middle: Responsive max-width container
 * - Inner: Flexible content area (grows with content)
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center py-12 px-4 sm:px-6">
      {/* 
        Responsive container:
        - w-full: Take full width up to max-width
        - max-w-3xl: Constrain maximum width for readability
        - No height constraints: Allows natural content expansion
      */}
      <div className="w-full max-w-3xl">
        {/* 
          Content wrapper:
          - py-8: Vertical padding for breathing room
          - NO fixed height or min-height
          - NO overflow restrictions
          - Content determines height naturally
        */}
        <div className="py-8">
          {children}
        </div>
      </div>
    </div>
  );
}
