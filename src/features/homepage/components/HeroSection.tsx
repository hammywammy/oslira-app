/**
 * @file Hero Section
 * @description Complete hero with demo and CTA
 */

import { useState } from 'react';

export function HeroSection() {
  const [demoHandle, setDemoHandle] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleDemoAnalysis = async () => {
    if (!demoHandle.trim()) return;
    
    setIsAnalyzing(true);
    // Simulate analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsAnalyzing(false);
    
    // Redirect to signup with demo data
    window.location.href = `/auth/signup?demo=${encodeURIComponent(demoHandle)}`;
  };

  const handleGetStarted = () => {
    window.location.href = '/auth/signup';
  };

  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 -z-10" />
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-blue-100/50 to-transparent rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Copy & CTA */}
          <div className="text-center lg:text-left">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
              Turn Hours of Instagram{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Prospecting into Minutes
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl">
              Paste an Instagram link and Oslira grades the profile, gives you a clear debrief, crafts personalized outreach, and suggests your next leads. Get 25 free credits — no card required.
            </p>

            {/* Demo Input */}
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
              <p className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
                Try AI Analysis Below:
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={demoHandle}
                  onChange={(e) => setDemoHandle(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleDemoAnalysis()}
                  placeholder="@instagram_handle"
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  disabled={isAnalyzing}
                />
                <button
                  onClick={handleDemoAnalysis}
                  disabled={isAnalyzing || !demoHandle.trim()}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 transition-all whitespace-nowrap"
                >
                  {isAnalyzing ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Analyzing...
                    </span>
                  ) : 'Quick Analysis'}
                </button>
              </div>
            </div>

            {/* Primary CTA */}
            <div className="space-y-4">
              <button
                onClick={handleGetStarted}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-bold rounded-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all"
              >
                Get 25 Free Credits Now →
              </button>
              <p className="text-sm text-gray-500">
                ✓ No credit card needed • ✓ 2-minute setup
              </p>
            </div>

            {/* Social Proof Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-gray-200">
              <div>
                <div className="text-3xl font-bold text-gray-900">1,200+</div>
                <div className="text-sm text-gray-600">Copywriters</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">43%</div>
                <div className="text-sm text-gray-600">Response Rate</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">5 hrs</div>
                <div className="text-sm text-gray-600">Saved/Week</div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Demo */}
          <div className="hidden lg:block">
            <div className="relative">
              {/* Floating animation */}
              <div className="animate-float">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
                  {/* Browser Chrome */}
                  <div className="bg-gray-100 px-4 py-3 flex items-center gap-2 border-b border-gray-200">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <div className="flex-1 bg-white rounded px-3 py-1 text-xs text-gray-500">
                      oslira.com/dashboard
                    </div>
                  </div>

                  {/* Dashboard Preview */}
                  <div className="p-6 bg-gradient-to-br from-gray-50 to-white">
                    <h3 className="font-bold text-lg mb-4">AI Lead Analysis</h3>
                    <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                          JD
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">@jane_designer</h4>
                          <p className="text-sm text-gray-600">UI/UX Designer • 8.2K followers</p>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                          92% match
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium">
                          Needs copy help
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium">
                          High engagement
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium">
                          Business owner
                        </span>
                      </div>
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3">
                        <p className="text-sm text-gray-700 italic">
                          "Hi Jane! Your portfolio caught my eye - especially the fintech project..."
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}

export default HeroSection;
