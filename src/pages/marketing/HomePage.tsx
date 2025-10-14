/**
 * @file Home Page
 * @description Complete homepage with all sections
 */

// import { useEffect } from 'react'; // ❌ Remove - not using yet
import { MarketingLayout } from '@/shared/components/layouts/MarketingLayout';
import { HeroSection } from '@/features/homepage/components/HeroSection';
import { BenefitsSection } from '@/features/homepage/components/BenefitsSection';
// import { HowItWorksSection } from '@/features/homepage/components/HowItWorksSection'; // ❌ Comment out
// import { TestimonialsSection } from '@/features/homepage/components/TestimonialsSection'; // ❌ Comment out
// import { FinalCTASection } from '@/features/homepage/components/FinalCTASection'; // ❌ Comment out

export function HomePage() {
  // Remove useEffect block temporarily since we're not using it
  
  return (
    <MarketingLayout>
      {/* Tailwind Test Block */}
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="bg-white p-8 rounded-2xl shadow-2xl border-4 border-blue-500">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Tailwind v4 is Working! ✅
          </h1>
          <p className="text-gray-600 mb-4">
            If you see this styled correctly, Tailwind is active.
          </p>
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all">
            Test Button
          </button>
        </div>
      </div>
      
      {/* Actual sections - currently commented out */}
      <HeroSection />
      <BenefitsSection />
      {/* <HowItWorksSection /> */}
      {/* <TestimonialsSection /> */}
      {/* <FinalCTASection /> */}
    </MarketingLayout>
  );
}

export default HomePage;
