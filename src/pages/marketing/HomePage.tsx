/**
 * @file Home Page
 * @description Complete homepage with all sections
 * 
 * Path: src/pages/marketing/HomePage.tsx
 */

import { useEffect } from 'react';
import { MarketingLayout } from '@/shared/components/layouts/MarketingLayout';
import { HeroSection } from '@/features/homepage/components/HeroSection';
import { BenefitsSection } from '@/features/homepage/components/BenefitsSection';
import { HowItWorksSection } from '@/features/homepage/components/HowItWorksSection';
import { TestimonialsSection } from '@/features/homepage/components/TestimonialsSection';
import { FinalCTASection } from '@/features/homepage/components/FinalCTASection';

export function HomePage() {
  useEffect(() => {
    // Set page metadata
    document.title = 'Oslira - Turn Hours of Instagram Prospecting into Minutes';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        'Paste an Instagram link and Oslira grades the profile, gives you a clear debrief, crafts personalized outreach, and suggests your next leads. Get 25 free credits — no card required.'
      );
    }

    // Smooth scroll for anchor links
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLAnchorElement;
      
      if (target.tagName === 'A' && target.hash) {
        const href = target.getAttribute('href');
        
        if (href?.startsWith('#')) {
          e.preventDefault();
          const element = document.querySelector(href);
          
          if (element) {
            element.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  return (
    <MarketingLayout>
      <HeroSection />
      <BenefitsSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <FinalCTASection />
    </MarketingLayout>
  );
}

export default HomePage;
