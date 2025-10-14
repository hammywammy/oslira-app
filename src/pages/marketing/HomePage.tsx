/**
 * @file HomePage
 * @description Main marketing homepage - assembles all sections
 * Path: src/pages/marketing/HomePage.tsx
 */

import { HeroSection } from '@/features/homepage/components/HeroSection';
import { BenefitsSection } from '@/features/homepage/components/BenefitsSection';
import { HowItWorksSection } from '@/features/homepage/components/HowItWorksSection';
import { TestimonialsSection } from '@/features/homepage/components/TestimonialsSection';
import { FinalCTASection } from '@/features/homepage/components/FinalCTASection';
import { SocialProofNotifications } from '@/features/homepage/components/SocialProofNotifications';
import { MarketingLayout } from '@/shared/components/layouts/MarketingLayout';

// =============================================================================
// COMPONENT
// =============================================================================

export function HomePage() {
  return (
    <MarketingLayout>
      {/* Social Proof Notifications (Fixed Position) */}
      <SocialProofNotifications />

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
    </MarketingLayout>
  );
}

export default HomePage;
