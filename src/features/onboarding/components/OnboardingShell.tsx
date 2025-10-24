// src/features/onboarding/components/OnboardingShell.tsx

/**
 * ONBOARDING SHELL - FLEXIBLE VERTICAL LAYOUT
 * 
 * ARCHITECTURAL PRINCIPLES:
 * ✅ NO height constraints whatsoever (no h-[600px], no min-h, no max-h)
 * ✅ Content expands vertically as needed
 * ✅ No scrollbars (content flows naturally)
 * ✅ Horizontally centered always
 * ✅ Vertically starts at top (items-start)
 * ✅ Single source of truth for layout
 * 
 * LAYOUT HIERARCHY:
 * 1. Outer container: min-h-screen + gradient background + flex centering
 * 2. Content wrapper: max-w-2xl width constraint ONLY
 * 3. Children: Auto height, expands with content
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
        CRITICAL: Width constraint ONLY - NO height properties
        - w-full: Take full width within parent
        - max-w-2xl: Constrain width for readability (matches NavigationBar)
        - NO h-[...], NO min-h-[...], NO max-h-[...], NO flex-col
        - Height is 100% determined by children content
      */}
      <div className="w-full max-w-2xl">
        {children}
      </div>
    </div>
  );
}
