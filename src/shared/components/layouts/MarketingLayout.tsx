/**
 * @file Marketing Layout
 * @description Complete layout with header and footer
 */

import { ReactNode } from 'react';
import { MarketingHeader } from '@/features/homepage/components/MarketingHeader';
import { MarketingFooter } from '@/features/homepage/components/MarketingFooter';

interface MarketingLayoutProps {
  children: ReactNode;
  showUrgencyBanner?: boolean;
  showMobileCTA?: boolean;
}

export function MarketingLayout({
  children,
  showUrgencyBanner: _showUrgencyBanner = false,
  showMobileCTA: _showMobileCTA = false,
}: MarketingLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Skip to main content (accessibility) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg"
      >
        Skip to main content
      </a>

      {/* Header */}
      <MarketingHeader />

      {/* Main Content */}
      <main id="main-content" className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <MarketingFooter />
    </div>
  );
}

export default MarketingLayout;
