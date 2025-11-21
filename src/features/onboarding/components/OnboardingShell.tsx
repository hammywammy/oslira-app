// src/features/onboarding/components/OnboardingShell.tsx

/**
 * ONBOARDING SHELL - MODERN PROFESSIONAL
 * 
 * Clean container with subtle gradient background
 * Modern card with better shadows
 */

import { ReactNode } from 'react';

interface OnboardingShellProps {
  children: ReactNode;
}

export function OnboardingShell({ children }: OnboardingShellProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-28 pb-24">
      {/* Background Pattern - Subtle */}
      <div className="fixed inset-0 z-background">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-100 rounded-full blur-3xl opacity-20" />
      </div>

      {/* Main Card */}
      <div className="w-full max-w-2xl">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl shadow-neutral-200/30 border border-neutral-100 p-8 md:p-12">
          {children}
        </div>
      </div>
    </div>
  );
}
