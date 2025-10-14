/**
 * @file Marketing Layout
 * @description Layout wrapper for marketing pages
 * 
 * Path: src/shared/components/layouts/MarketingLayout.tsx
 */

import { ReactNode } from 'react';

// =============================================================================
// TYPES
// =============================================================================

interface MarketingLayoutProps {
  children: ReactNode;
  showUrgencyBanner?: boolean;
  showMobileCTA?: boolean;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function MarketingLayout({
  children,
  // Prefix with underscore to mark as intentionally unused (for future use)
  showUrgencyBanner: _showUrgencyBanner = false,
  showMobileCTA: _showMobileCTA = false,
}: MarketingLayoutProps) {
  // TODO: Add UrgencyBanner and MobileStickyCTA components when ready
  // For now, just render children
  
  return (
    <div className="home">
      {/* Skip to main content (accessibility) */}
      <a href="#main-content" className="skip-to-main">
        Skip to main content
      </a>

      {/* Main Content */}
      <main id="main-content">{children}</main>

      {/* Global Styles */}
      <style>{`
        /* Accessibility: Skip to main content link */
        .skip-to-main {
          position: absolute;
          left: -9999px;
          width: 1px;
          height: 1px;
          overflow: hidden;
        }
        .skip-to-main:focus {
          position: fixed;
          left: 1rem;
          top: 1rem;
          width: auto;
          height: auto;
          z-index: 9999;
          background: #2563eb;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          text-decoration: none;
        }
      `}</style>
    </div>
  );
}

export default MarketingLayout;
