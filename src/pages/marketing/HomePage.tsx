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
  return (
    <MarketingLayout>
      {/* ✅ TEST BLOCK - Remove after verification */}
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="bg-white p-8 rounded-2xl shadow-2xl border-4 border-blue-500">
          <h1 className="text-4xl font-bold gradient-brand bg-clip-text text-transparent mb-4">
            Tailwind v4 is Working! ✅
          </h1>
          <p className="text-gray-600 mb-4">
            If you see this styled correctly, Tailwind is active.
          </p>
          <button className="gradient-brand text-white px-6 py-3 rounded-lg shadow-brand hover:shadow-brand-lg transition-all animate-float">
            Test Button
          </button>
        </div>
      </div>
      
      {/* Your actual homepage content below */}
      <HeroSection />
      <BenefitsSection />
      {/* ... etc */}
    </MarketingLayout>
  );
}

export default HomePage;
