/**
 * @file How It Works Section
 * @description Complete 3-step process explanation
 */

const steps = [
  {
    number: 1,
    title: 'Paste Instagram Link',
    description: 'Drop any Instagram profile URL into Oslira. Our AI instantly analyzes their content, engagement patterns, and business indicators.',
    color: 'from-blue-500 to-blue-600',
  },
  {
    number: 2,
    title: 'Get Smart Recommendations',
    description: 'Oslira scores the lead, highlights key insights, and suggests similar high-potential prospects. See exactly who needs your services most.',
    color: 'from-purple-500 to-purple-600',
  },
  {
    number: 3,
    title: 'Send Personalized Outreach',
    description: 'Use AI-generated message templates tailored to each lead. Copy, customize, and send - all in under 2 minutes per prospect.',
    color: 'from-pink-500 to-pink-600',
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            How Oslira Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Three simple steps to transform your prospecting process
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Connector Line (desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-blue-200 to-purple-200 -z-10 transform -translate-x-1/2" />
              )}

              {/* Step Card */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 relative">
                {/* Step Number Badge */}
                <div className={`absolute -top-6 left-8 w-12 h-12 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg`}>
                  {step.number}
                </div>

                {/* Content */}
                <div className="mt-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Visual Indicator */}
                <div className="mt-6 flex items-center gap-2">
                  <div className={`w-8 h-1 bg-gradient-to-r ${step.color} rounded-full`} />
                  <div className="w-4 h-1 bg-gray-200 rounded-full" />
                  <div className="w-2 h-1 bg-gray-200 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Below Steps */}
        <div className="mt-16 text-center">
          <button
            onClick={() => window.location.href = '/auth/signup'}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-bold rounded-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all"
          >
            Start Your Free Trial →
          </button>
          <p className="mt-4 text-sm text-gray-600">
            25 free credits • No credit card required
          </p>
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;
