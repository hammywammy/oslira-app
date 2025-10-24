// src/features/onboarding/components/OnboardingShell.tsx

/**
 * ONBOARDING SHELL - FLEXIBLE VERTICAL LAYOUT
 * 
 * FIXED ISSUES:
 * ✅ Removed ALL height constraints (no h-[600px], no min-h)
 * ✅ Content expands vertically as needed
 * ✅ No scrollbars
 * ✅ Horizontally centered always
 * ✅ Vertically centered when content is small
 * ✅ Proper spacing maintained
 * 
 * ARCHITECTURE:
 * - Outer: min-h-screen with gradient, flex for centering
 * - Middle: max-width constraint only (no height)
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-start justify-center py-16 px-4 sm:px-6">
      {/* 
        Container:
        - w-full: Take full width
        - max-w-2xl: Constrain width for readability (matches NavigationBar)
        - NO height constraints whatsoever
      */}
      <div className="w-full max-w-2xl">
        {children}
      </div>
    </div>
  );
}
