/**
 * @file Benefits Section
 * @description Complete benefits grid with icons
 */

const benefits = [
  {
    icon: '⚡',
    title: '10x Faster Prospecting',
    description: 'Analyze 50+ Instagram profiles in the time it used to take for 5. Oslira instantly evaluates engagement, content quality, and business fit.',
  },
  {
    icon: '🎯',
    title: 'Smart Lead Scoring',
    description: "AI grades each profile and highlights decision-makers who actually need your services. No more guessing who's a good fit.",
  },
  {
    icon: '✍️',
    title: 'Personalized Outreach',
    description: 'Get tailored message templates for each lead. Oslira crafts opening lines based on their recent posts and business needs.',
  },
  {
    icon: '🔄',
    title: 'Automated Follow-Ups',
    description: 'Never lose a warm lead again. Oslira tracks your outreach and reminds you when to follow up for maximum conversion.',
  },
  {
    icon: '📊',
    title: 'Track What Works',
    description: 'See which profiles convert best and refine your targeting. Built-in analytics show you exactly where to focus your efforts.',
  },
  {
    icon: '🚀',
    title: 'Scale Without Burnout',
    description: 'Handle 3x more clients without sacrificing quality. Oslira handles the tedious research so you can focus on high-value work.',
  },
];

export function BenefitsSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Why Copywriters Choose Oslira
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stop wasting time on manual research. Let AI do the heavy lifting.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-8 border border-gray-200 hover:border-blue-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Icon */}
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform">
                {benefit.icon}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {benefit.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed">
                {benefit.description}
              </p>

              {/* Hover indicator */}
              <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-12 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BenefitsSection;
