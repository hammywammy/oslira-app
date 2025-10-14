/**
 * @file Testimonials Section
 * @description Complete customer testimonials
 */

const testimonials = [
  {
    name: 'Marcus Johnson',
    role: 'Freelance Copywriter',
    avatar: 'MJ',
    rating: 5,
    text: "Oslira cut my prospecting time from 10 hours to under 2 hours per week. I'm landing 3x more clients with half the effort.",
    color: 'from-blue-500 to-blue-600',
  },
  {
    name: 'Sarah Park',
    role: 'B2B Copy Specialist',
    avatar: 'SP',
    rating: 5,
    text: 'The AI-generated outreach templates are shockingly good. My response rate jumped from 12% to 43% in the first month.',
    color: 'from-purple-500 to-purple-600',
  },
  {
    name: 'Kevin Lee',
    role: 'SaaS Copywriter',
    avatar: 'KL',
    rating: 5,
    text: "Finally, a tool that actually understands my niche. Oslira finds perfect-fit leads I would've missed manually.",
    color: 'from-pink-500 to-pink-600',
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Success Stories
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real results from copywriters using Oslira
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-700 text-lg leading-relaxed mb-6 italic">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-bold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Social Proof Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">1,200+</div>
            <div className="text-gray-600">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">50K+</div>
            <div className="text-gray-600">Leads Analyzed</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">43%</div>
            <div className="text-gray-600">Avg Response Rate</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">5 hrs</div>
            <div className="text-gray-600">Saved Per Week</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;
