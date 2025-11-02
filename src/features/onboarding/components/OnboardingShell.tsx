// src/features/onboarding/components/OnboardingShell.tsx

/**
 * ONBOARDING SHELL - LIGHT MODE REDESIGN
 * 
 * Clean container with:
 * - White card background
 * - Subtle shadow for depth
 * - Professional spacing
 */

import { ReactNode } from 'react';

interface OnboardingShellProps {
  children: ReactNode;
}

export function OnboardingShell({ children }: OnboardingShellProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-24 pb-24">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl shadow-neutral-200/50 border border-neutral-100 p-8 md:p-12">
          {children}
        </div>
      </div>
    </div>
  );
}
