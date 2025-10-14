/**
 * @file Home Page - Tailwind v4 Showcase
 * @description Complete demonstration of Tailwind CSS v4 capabilities
 * 
 * Path: src/pages/marketing/HomePage.tsx
 */

import React from 'react';

export function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      
      {/* Hero Section with Animated Gradient */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Mesh Gradient Background */}
        <div className="absolute inset-0 bg-linear-135 from-violet-600/20 via-fuchsia-600/20 to-orange-600/20 bg-[length:_400%_400%] animate-[background-move_15s_ease_infinite]" />
        
        {/* Glassmorphism Card */}
        <div className="relative z-10 max-w-4xl mx-auto p-8">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-12 shadow-2xl">
            <h1 className="text-7xl font-black mb-6 bg-linear-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent animate-[background-move_8s_ease_infinite] bg-[length:_200%_200%]">
              Tailwind CSS v4
            </h1>
            <p className="text-2xl text-gray-300 mb-8">
              A comprehensive showcase of cutting-edge features and capabilities
            </p>
            <div className="flex gap-4">
              <div className="px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full text-white font-semibold shadow-lg hover:shadow-violet-500/50 transition-all duration-300 hover:scale-105">
                Explore Features
              </div>
            </div>
          </div>
        </div>

        {/* Floating 3D Elements */}
        <div className="absolute top-20 right-20 perspective-distant">
          <div className="w-32 h-32 bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30 rounded-2xl backdrop-blur-sm border border-white/10 transform-3d rotate-x-12 rotate-y-12 animate-[spin_20s_linear_infinite]" />
        </div>
      </section>

      {/* Typography Showcase */}
      <section className="py-24 px-8 border-y border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="backdrop-blur-lg bg-white/5 p-8 rounded-2xl border border-white/10">
              <h2 className="text-5xl font-black mb-4 bg-linear-to-br from-cyan-400 to-blue-600 bg-clip-text text-transparent">
                Typography
              </h2>
              <p className="text-lg text-gray-400 mb-4">
                Dynamic text styles with gradient effects
              </p>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Small Text • 14px</p>
                <p className="text-base text-gray-400">Base Text • 16px</p>
                <p className="text-lg text-gray-300">Large Text • 18px</p>
                <p className="text-xl font-semibold text-gray-200">XL Text • 20px</p>
                <p className="text-2xl font-bold bg-linear-to-r from-orange-400 to-pink-600 bg-clip-text text-transparent">
                  Gradient Text
                </p>
              </div>
            </div>

            <div className="backdrop-blur-lg bg-white/5 p-8 rounded-2xl border border-white/10">
              <h2 className="text-5xl font-black mb-4 bg-linear-to-br from-green-400 to-emerald-600 bg-clip-text text-transparent">
                Colors
              </h2>
              <p className="text-lg text-gray-400 mb-4">
                Wide-gamut OKLCH color space
              </p>
              <div className="grid grid-cols-5 gap-2">
                <div className="h-16 rounded-lg bg-red-500" />
                <div className="h-16 rounded-lg bg-orange-500" />
                <div className="h-16 rounded-lg bg-yellow-500" />
                <div className="h-16 rounded-lg bg-green-500" />
                <div className="h-16 rounded-lg bg-blue-500" />
                <div className="h-16 rounded-lg bg-indigo-500" />
                <div className="h-16 rounded-lg bg-violet-500" />
                <div className="h-16 rounded-lg bg-purple-500" />
                <div className="h-16 rounded-lg bg-fuchsia-500" />
                <div className="h-16 rounded-lg bg-pink-500" />
              </div>
            </div>

            <div className="backdrop-blur-lg bg-white/5 p-8 rounded-2xl border border-white/10">
              <h2 className="text-5xl font-black mb-4 bg-linear-to-br from-pink-400 to-rose-600 bg-clip-text text-transparent">
                Gradients
              </h2>
              <p className="text-lg text-gray-400 mb-4">
                Linear, radial & conic variations
              </p>
              <div className="space-y-3">
                <div className="h-12 rounded-lg bg-linear-to-r from-violet-600 via-purple-600 to-fuchsia-600" />
                <div className="h-12 rounded-lg bg-linear-135 from-cyan-500 via-blue-500 to-indigo-600" />
                <div className="h-12 rounded-lg bg-radial from-orange-400 to-rose-600" />
                <div className="h-12 rounded-lg bg-conic from-green-400 via-cyan-400 to-blue-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Glassmorphism Gallery */}
      <section className="py-24 px-8 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-linear-to-br from-indigo-900/20 via-purple-900/20 to-pink-900/20" />
        
        <div className="relative max-w-7xl mx-auto">
          <h2 className="text-6xl font-black text-center mb-16 bg-linear-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
            Glassmorphism Effects
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { blur: 'sm', opacity: '10', name: 'Subtle Glass' },
              { blur: 'md', opacity: '15', name: 'Medium Glass' },
              { blur: 'lg', opacity: '20', name: 'Heavy Glass' },
              { blur: 'xl', opacity: '25', name: 'Extra Glass' },
              { blur: '2xl', opacity: '30', name: 'Ultra Glass' },
              { blur: '3xl', opacity: '35', name: 'Maximum Glass' },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`backdrop-blur-${item.blur} bg-white/${item.opacity} border border-white/20 rounded-2xl p-8 hover:scale-105 transition-all duration-300 shadow-xl`}
              >
                <div className="text-2xl font-bold mb-2 text-white">{item.name}</div>
                <div className="text-sm text-gray-300">backdrop-blur-{item.blur}</div>
                <div className="mt-4 h-24 bg-linear-to-br from-violet-500/30 to-fuchsia-500/30 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3D Transforms Showcase */}
      <section className="py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-6xl font-black text-center mb-16 bg-linear-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
            3D Transforms & Perspective
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="perspective-normal flex items-center justify-center h-64">
              <div className="w-32 h-32 bg-linear-to-br from-violet-500 to-purple-600 rounded-2xl shadow-2xl transform-3d rotate-x-12 rotate-y-12 hover:rotate-x-24 hover:rotate-y-24 transition-all duration-500 flex items-center justify-center text-white font-bold">
                Rotate X/Y
              </div>
            </div>

            <div className="perspective-normal flex items-center justify-center h-64">
              <div className="w-32 h-32 bg-linear-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-2xl transform-3d translate-z-12 hover:translate-z-24 transition-all duration-500 flex items-center justify-center text-white font-bold">
                Translate Z
              </div>
            </div>

            <div className="perspective-dramatic flex items-center justify-center h-64">
              <div className="w-32 h-32 bg-linear-to-br from-orange-500 to-red-600 rounded-2xl shadow-2xl transform-3d rotate-y-30 hover:rotate-y-60 transition-all duration-500 flex items-center justify-center text-white font-bold">
                Dramatic
              </div>
            </div>

            <div className="perspective-distant flex items-center justify-center h-64">
              <div className="w-32 h-32 bg-linear-to-br from-green-500 to-emerald-600 rounded-2xl shadow-2xl transform-3d rotate-x-20 rotate-y-20 rotate-z-20 hover:rotate-x-40 hover:rotate-y-40 hover:rotate-z-40 transition-all duration-500 flex items-center justify-center text-white font-bold text-center text-sm">
                All Axes
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Container Queries Demo */}
      <section className="py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-6xl font-black text-center mb-16 bg-linear-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Container Queries
          </h2>
          
          <div className="@container backdrop-blur-lg bg-white/5 p-8 rounded-2xl border border-white/10">
            <div className="grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-3 @xl:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <div
                  key={num}
                  className="backdrop-blur-md bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-xl p-6 border border-white/10 hover:scale-105 transition-all"
                >
                  <div className="text-4xl font-bold text-white mb-2">{num}</div>
                  <div className="text-sm text-gray-400">Responsive card</div>
                </div>
              ))}
            </div>
            <p className="text-center text-gray-400 mt-8">
              Resize this container to see responsive behavior based on container size, not viewport
            </p>
          </div>
        </div>
      </section>

      {/* Grid Subgrid Example */}
      <section className="py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-6xl font-black text-center mb-16 bg-linear-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
            Advanced Grid & Subgrid
          </h2>
          
          <div className="grid grid-cols-4 gap-4 backdrop-blur-lg bg-white/5 p-8 rounded-2xl border border-white/10">
            <div className="col-span-4 h-24 bg-linear-to-r from-violet-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
              Header (Span 4)
            </div>
            
            <div className="col-span-1 h-32 bg-linear-to-br from-cyan-600 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
              Sidebar
            </div>
            
            <div className="col-span-3 grid grid-cols-subgrid gap-4">
              <div className="h-32 bg-linear-to-br from-orange-600 to-red-600 rounded-xl flex items-center justify-center text-white font-bold">
                Sub 1
              </div>
              <div className="h-32 bg-linear-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold">
                Sub 2
              </div>
              <div className="h-32 bg-linear-to-br from-pink-600 to-rose-600 rounded-xl flex items-center justify-center text-white font-bold">
                Sub 3
              </div>
            </div>

            <div className="col-span-2 h-24 bg-linear-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
              Footer Left
            </div>
            <div className="col-span-2 h-24 bg-linear-to-r from-fuchsia-600 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold">
              Footer Right
            </div>
          </div>
        </div>
      </section>

      {/* Animated Border Gradient */}
      <section className="py-24 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-6xl font-black mb-8 bg-linear-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
            Animated Gradients
          </h2>
          
          <div className="inline-block rounded-full bg-linear-to-r from-violet-500 via-fuchsia-500 to-pink-500 p-1 bg-[length:_400%_400%] animate-[background-move_6s_ease_infinite]">
            <div className="rounded-full bg-slate-950 px-12 py-6">
              <span className="text-2xl font-bold text-white">
                Animated Border Gradient
              </span>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="backdrop-blur-xl bg-linear-to-br from-blue-500/10 to-cyan-500/10 p-8 rounded-2xl border border-blue-500/30 animate-pulse">
              <div className="text-4xl mb-2">⚡</div>
              <div className="text-xl font-bold text-white mb-2">Lightning Fast</div>
              <div className="text-gray-400">5x faster builds</div>
            </div>

            <div className="backdrop-blur-xl bg-linear-to-br from-violet-500/10 to-purple-500/10 p-8 rounded-2xl border border-violet-500/30 animate-pulse [animation-delay:_0.2s]">
              <div className="text-4xl mb-2">🎨</div>
              <div className="text-xl font-bold text-white mb-2">Modern CSS</div>
              <div className="text-gray-400">Latest features</div>
            </div>

            <div className="backdrop-blur-xl bg-linear-to-br from-green-500/10 to-emerald-500/10 p-8 rounded-2xl border border-green-500/30 animate-pulse [animation-delay:_0.4s]">
              <div className="text-4xl mb-2">🚀</div>
              <div className="text-xl font-bold text-white mb-2">Zero Config</div>
              <div className="text-gray-400">Just one import</div>
            </div>
          </div>
        </div>
      </section>

      {/* Complex Shadow & Effects */}
      <section className="py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-6xl font-black text-center mb-16 bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Shadows & Complex Effects
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="backdrop-blur-lg bg-white/5 p-8 rounded-3xl border border-white/10 shadow-2xl shadow-violet-500/20 hover:shadow-violet-500/40 transition-all duration-300 hover:-translate-y-2">
              <div className="text-5xl mb-4">🌟</div>
              <h3 className="text-2xl font-bold text-white mb-2">Color Shadows</h3>
              <p className="text-gray-400">Vibrant glowing effects with colored shadows</p>
            </div>

            <div className="backdrop-blur-lg bg-white/5 p-8 rounded-3xl border border-white/10 shadow-2xl shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all duration-300 hover:-translate-y-2">
              <div className="text-5xl mb-4">💎</div>
              <h3 className="text-2xl font-bold text-white mb-2">Multi-Layer</h3>
              <p className="text-gray-400">Complex shadow compositions for depth</p>
            </div>

            <div className="backdrop-blur-lg bg-white/5 p-8 rounded-3xl border border-white/10 shadow-2xl shadow-fuchsia-500/20 hover:shadow-fuchsia-500/40 transition-all duration-300 hover:-translate-y-2">
              <div className="text-5xl mb-4">✨</div>
              <h3 className="text-2xl font-bold text-white mb-2">Inner Glow</h3>
              <p className="text-gray-400">Sophisticated inner shadow effects</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-4xl font-black mb-4 bg-linear-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
            Tailwind CSS v4 Showcase
          </div>
          <p className="text-gray-400 mb-8">
            Demonstrating the full power of modern CSS features
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <span className="px-4 py-2 backdrop-blur-lg bg-white/5 rounded-full text-sm text-gray-300 border border-white/10">
              3D Transforms
            </span>
            <span className="px-4 py-2 backdrop-blur-lg bg-white/5 rounded-full text-sm text-gray-300 border border-white/10">
              Container Queries
            </span>
            <span className="px-4 py-2 backdrop-blur-lg bg-white/5 rounded-full text-sm text-gray-300 border border-white/10">
              Glassmorphism
            </span>
            <span className="px-4 py-2 backdrop-blur-lg bg-white/5 rounded-full text-sm text-gray-300 border border-white/10">
              OKLCH Colors
            </span>
            <span className="px-4 py-2 backdrop-blur-lg bg-white/5 rounded-full text-sm text-gray-300 border border-white/10">
              CSS Variables
            </span>
            <span className="px-4 py-2 backdrop-blur-lg bg-white/5 rounded-full text-sm text-gray-300 border border-white/10">
              Grid Subgrid
            </span>
          </div>
        </div>
      </footer>

      {/* Custom Keyframe Animations */}
      <style>{`
        @keyframes background-move {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </div>
  );
}

export default HomePage;
