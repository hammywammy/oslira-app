// src/features/onboarding/components/OnboardingShell.tsx

/**
 * ONBOARDING SHELL - FLEXIBLE VERTICAL LAYOUT WITH CENTERING
 * 
 * FIXES:
 * ✅ Content expands vertically as needed (no height constraints)
 * ✅ Short content is vertically centered
 * ✅ Long content flows naturally from top
 * ✅ No scrollbars on content
 * 
 * ARCHITECTURE:
 * - Outer: min-h-screen with gradient, flex for centering
 * - Middle: max-width constraint + min-height for centering
 * - Inner: Auto height, expands with content
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center py-16 px-4 sm:px-6">
      {/* 
        Container with smart centering:
        - w-full: Take full width
        - max-w-2xl: Constrain width for readability
        - min-h-[calc(100vh-8rem)]: Minimum height for centering (100vh - py-16)
        - flex items-center: Vertically center when content is short
        - NO max-h: Content can grow beyond viewport
      */}
      <div className="w-full max-w-2xl min-h-[calc(100vh-8rem)] flex items-center">
        <div className="w-full">
          {children}
        </div>
      </div>
    </div>
  );
}
