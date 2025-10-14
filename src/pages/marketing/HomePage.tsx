/**
 * @file HomePage
 * @description Main marketing homepage - assembles all sections
 * Path: src/pages/marketing/HomePage.tsx
 */

import { MarketingHeader } from '@/features/homepage/components/MarketingHeader';
import { MarketingFooter } from '@/shared/components/ui/MarketingFooter';
import { HeroSection } from '@/features/homepage/components/HeroSection';
import { BenefitsSection } from '@/features/homepage/components/BenefitsSection';
import { HowItWorksSection } from '@/features/homepage/components/HowItWorksSection';
import { TestimonialsSection } from '@/features/homepage/components/TestimonialsSection';
import { FinalCTASection } from '@/features/homepage/components/FinalCTASection';
import { SocialProofNotifications } from '@/features/homepage/components/SocialProofNotifications';

// =============================================================================
// COMPONENT
// =============================================================================

export function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Skip to main content (accessibility) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg"
      >
        Skip to main content
      </a>

      {/* Header (Fixed) */}
      <MarketingHeader />

      {/* Social Proof Notifications (Fixed Position) */}
      <SocialProofNotifications />

      {/* Main Content */}
      <main id="main-content">
        {/* Hero Section */}
        <HeroSection />

        {/* Benefits Section */}
        <BenefitsSection />

        {/* How It Works */}
        <HowItWorksSection />

        {/* Testimonials */}
        <TestimonialsSection />

        {/* Final CTA */}
        <FinalCTASection />
      </main>

      {/* Footer */}
      <MarketingFooter />
    </div>
  );
}

export default HomePage;
