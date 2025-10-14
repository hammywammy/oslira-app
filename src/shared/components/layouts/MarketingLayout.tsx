import { ReactNode } from 'react';

interface MarketingLayoutProps {
  children: ReactNode;
  showUrgencyBanner?: boolean;
  showMobileCTA?: boolean;
}

export function MarketingLayout({
  children,
  showUrgencyBanner = false,
  showMobileCTA = false,
}: MarketingLayoutProps) {
  return (
    <div className="home">
      <main id="main-content">{children}</main>
    </div>
  );
}
