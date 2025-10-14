/**
 * @file Home Page - Tailwind v4 EXTREME Showcase
 * @description Pushing Tailwind CSS v4 to its absolute limits
 * 
 * Path: src/pages/marketing/HomePage.tsx
 */

import { useState, useRef, useEffect } from 'react';

export function HomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (spotlightRef.current) {
        const rect = spotlightRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    const current = spotlightRef.current;
    if (current) {
      current.addEventListener('mousemove', handleMouseMove);
      return () => current.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  return (
    <div className="min-h-screen bg-black">
      
      {/* SECTION 1: NEON CYBERPUNK HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
        {/* Animated Mesh Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-[120px] animate-pulse [animation-delay:_1s]" />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-violet-500/20 rounded-full blur-[120px] animate-pulse [animation-delay:_2s]" />
        </div>

        {/* Main Content */}
        <div className="relative z-10 text-center px-8 max-w-6xl">
          <h1 className="text-8xl font-black mb-8 text-white text-shadow-lg text-shadow-cyan-500/50 animate-[glow_3s_ease-in-out_infinite]">
            TAILWIND v4
          </h1>
          <p className="text-2xl text-cyan-400 mb-12 text-shadow-sm text-shadow-cyan-500/30">
            The most powerful CSS framework unleashed
          </p>

          {/* Neon Button with Spinning Border */}
          <div className="inline-block relative group">
            <div className="absolute inset-0 bg-conic from-cyan-500 via-fuchsia-500 to-cyan-500 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 animate-spin [animation-duration:_3s]" />
            <button className="relative px-12 py-6 bg-black text-white text-xl font-bold rounded-2xl border-2 border-cyan-500 shadow-[0_0_2px_#fff,inset_0_0_2px_#fff,0_0_10px_#0ff,0_0_40px_#0ff,0_0_80px_#0ff] hover:shadow-[0_0_2px_#fff,inset_0_0_2px_#fff,0_0_20px_#0ff,0_0_80px_#0ff,0_0_160px_#0ff] transition-all duration-300">
              EXPLORE THE FUTURE
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 2: TEXT SHADOWS & MASKS */}
      <section className="py-32 px-8 bg-gradient-to-b from-black via-slate-950 to-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-6xl font-black text-center mb-20 text-white text-shadow-lg text-shadow-violet-500/50">
            Text Shadow & Masking
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Embossed Text */}
            <div className="backdrop-blur-xl bg-gradient-to-br from-white/5 to-white/0 p-12 rounded-3xl border border-white/10">
              <h3 className="text-5xl font-black text-gray-900 text-shadow-2xs text-shadow-white/70 mb-4">
                EMBOSSED EFFECT
              </h3>
              <p className="text-gray-400 text-lg">Dark text with light shadow creates depth</p>
            </div>

            {/* Glowing Neon Text */}
            <div className="backdrop-blur-xl bg-gradient-to-br from-white/5 to-white/0 p-12 rounded-3xl border border-white/10">
              <h3 className="text-5xl font-black text-cyan-400 text-shadow-lg text-shadow-cyan-500/70 mb-4">
                NEON GLOW
              </h3>
              <p className="text-gray-400 text-lg">Cyberpunk-style glowing text</p>
            </div>

            {/* Gradient Mask on Image */}
            <div className="relative h-64 rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-r from-violet-600 to-fuchsia-600" />
              <div className="absolute inset-0 mask-radial mask-radial-from-70% flex items-center justify-center">
                <p className="text-4xl font-black text-white">MASKED FADE</p>
              </div>
            </div>

            {/* Conic Gradient Mask Progress */}
            <div className="backdrop-blur-xl bg-gradient-to-br from-white/5 to-white/0 p-12 rounded-3xl border border-white/10">
              <div className="grid grid-cols-1 grid-rows-1 w-24 h-24 mb-4">
                <div className="col-start-1 row-start-1 border-8 border-white/10 rounded-full" />
                <div className="col-start-1 row-start-1 border-8 border-emerald-500 rounded-full mask-conic mask-conic-from-75% mask-conic-to-75%" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Progress: 75%</h3>
              <p className="text-gray-400">Conic gradient mask for loading states</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: MOUSE-TRACKING SPOTLIGHT CARDS */}
      <section 
        ref={spotlightRef}
        className="py-32 px-8 bg-black relative"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-6xl font-black text-center mb-20 text-white text-shadow-lg text-shadow-fuchsia-500/50">
            Interactive Spotlight Effect
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                className="group relative p-8 rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/50 to-slate-900/20 overflow-hidden"
              >
                {/* Spotlight effect layer */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(99, 102, 241, 0.1), transparent 40%)`,
                  }}
                />
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="text-6xl mb-4">{['⚡', '🔥', '✨'][num - 1]}</div>
                  <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors">
                    Feature {num}
                  </h3>
                  <p className="text-gray-400 text-lg">
                    Move your mouse over this card to see the spotlight effect in action
                  </p>
                </div>

                {/* Border glow on hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[inset_0_0_20px_rgba(99,102,241,0.3)]" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: MORPHING BLOB BACKGROUNDS */}
      <section className="py-32 px-8 bg-gradient-to-b from-black via-indigo-950/20 to-black relative overflow-hidden">
        {/* Animated Morphing Blobs */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-96 h-96 bg-radial from-violet-500/40 to-transparent blur-3xl animate-[float_8s_ease-in-out_infinite]" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-radial from-fuchsia-500/40 to-transparent blur-3xl animate-[float_10s_ease-in-out_infinite] [animation-delay:_1s]" />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-radial from-cyan-500/40 to-transparent blur-3xl animate-[float_12s_ease-in-out_infinite] [animation-delay:_2s]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="text-6xl font-black text-center mb-20 text-white text-shadow-lg text-shadow-violet-500/50">
            Morphing Blob Atmospheres
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="backdrop-blur-2xl bg-white/5 p-12 rounded-3xl border border-white/10 hover:border-violet-500/50 transition-all duration-500">
              <h3 className="text-4xl font-bold text-white mb-4">Organic Motion</h3>
              <p className="text-gray-300 text-lg">Floating blob animations create depth and atmosphere</p>
            </div>

            <div className="backdrop-blur-2xl bg-white/5 p-12 rounded-3xl border border-white/10 hover:border-fuchsia-500/50 transition-all duration-500">
              <h3 className="text-4xl font-bold text-white mb-4">Layered Depth</h3>
              <p className="text-gray-300 text-lg">Multiple animated layers with different timing</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: 3D TRANSFORM SHOWCASE */}
      <section className="py-32 px-8 bg-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-6xl font-black text-center mb-20 text-white text-shadow-lg text-shadow-cyan-500/50">
            3D Transforms & Perspective
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Rotating Cube */}
            <div className="perspective-dramatic h-64 flex items-center justify-center">
              <div className="relative w-32 h-32 transform-3d animate-[spin3d_10s_linear_infinite] [transform-style:preserve-3d]">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl [backface-visibility:hidden] flex items-center justify-center text-white font-bold text-xl">
                  FRONT
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl [backface-visibility:hidden] [transform:rotateY(180deg)] flex items-center justify-center text-white font-bold text-xl">
                  BACK
                </div>
              </div>
            </div>

            {/* Tilting Card */}
            <div className="perspective-normal h-64 flex items-center justify-center">
              <div className="w-40 h-56 bg-gradient-to-br from-fuchsia-500 to-pink-600 rounded-xl shadow-2xl transform-3d rotate-y-12 hover:rotate-y-24 hover:rotate-x-12 transition-all duration-500 flex items-center justify-center text-white font-bold">
                HOVER ME
              </div>
            </div>

            {/* Floating with Z-axis */}
            <div className="perspective-normal h-64 flex items-center justify-center">
              <div className="w-40 h-40 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-2xl transform-3d translate-z-12 animate-[float_4s_ease-in-out_infinite] flex items-center justify-center text-white font-bold">
                FLOATING
              </div>
            </div>

            {/* Multi-axis Rotation */}
            <div className="perspective-distant h-64 flex items-center justify-center">
              <div className="w-40 h-40 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl shadow-2xl transform-3d rotate-x-20 rotate-y-20 hover:rotate-x-45 hover:rotate-y-45 hover:scale-110 transition-all duration-500 flex items-center justify-center text-white font-bold text-center p-4">
                ALL AXES
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: GRADIENT BORDER ANIMATIONS */}
      <section className="py-32 px-8 bg-gradient-to-b from-black via-purple-950/20 to-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-6xl font-black text-center mb-20 text-white text-shadow-lg text-shadow-purple-500/50">
            Animated Gradient Borders
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Spinning Gradient Border */}
            <div className="relative group">
              <div className="absolute inset-0 bg-conic from-cyan-500 via-blue-500 to-purple-500 rounded-2xl blur-sm animate-spin [animation-duration:_4s]" />
              <div className="relative bg-black p-8 rounded-2xl border border-white/10 group-hover:border-white/20 transition-colors">
                <h3 className="text-2xl font-bold text-white mb-2">Spinning Gradient</h3>
                <p className="text-gray-400">Conic gradient with spin animation</p>
              </div>
            </div>

            {/* Pulsing Gradient Border */}
            <div className="relative group">
              <div className="absolute inset-0 bg-linear-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-2xl blur-sm animate-pulse" />
              <div className="relative bg-black p-8 rounded-2xl border border-white/10 group-hover:border-white/20 transition-colors">
                <h3 className="text-2xl font-bold text-white mb-2">Pulsing Gradient</h3>
                <p className="text-gray-400">Linear gradient with pulse effect</p>
              </div>
            </div>

            {/* Moving Gradient Border */}
            <div className="relative group overflow-hidden rounded-2xl">
              <div className="absolute inset-0 bg-linear-135 from-orange-500 via-red-500 to-pink-500 bg-[length:_400%_400%] animate-[background-move_6s_ease_infinite]" />
              <div className="relative bg-black m-[2px] p-8 rounded-2xl">
                <h3 className="text-2xl font-bold text-white mb-2">Moving Gradient</h3>
                <p className="text-gray-400">Background position animation</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: DROP SHADOWS WITH COLOR */}
      <section className="py-32 px-8 bg-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-6xl font-black text-center mb-20 text-white text-shadow-lg text-shadow-green-500/50">
            Colored Drop Shadows
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-block p-8 bg-black rounded-2xl drop-shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:drop-shadow-[0_0_50px_rgba(6,182,212,0.8)] transition-all">
                <div className="text-6xl">💎</div>
              </div>
              <p className="text-white mt-4 font-bold">Cyan Glow</p>
            </div>

            <div className="text-center">
              <div className="inline-block p-8 bg-black rounded-2xl drop-shadow-[0_0_30px_rgba(236,72,153,0.6)] hover:drop-shadow-[0_0_50px_rgba(236,72,153,0.8)] transition-all">
                <div className="text-6xl">🔥</div>
              </div>
              <p className="text-white mt-4 font-bold">Pink Glow</p>
            </div>

            <div className="text-center">
              <div className="inline-block p-8 bg-black rounded-2xl drop-shadow-[0_0_30px_rgba(168,85,247,0.6)] hover:drop-shadow-[0_0_50px_rgba(168,85,247,0.8)] transition-all">
                <div className="text-6xl">⚡</div>
              </div>
              <p className="text-white mt-4 font-bold">Purple Glow</p>
            </div>

            <div className="text-center">
              <div className="inline-block p-8 bg-black rounded-2xl drop-shadow-[0_0_30px_rgba(34,197,94,0.6)] hover:drop-shadow-[0_0_50px_rgba(34,197,94,0.8)] transition-all">
                <div className="text-6xl">✨</div>
              </div>
              <p className="text-white mt-4 font-bold">Green Glow</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: CONTAINER QUERIES DEMO */}
      <section className="py-32 px-8 bg-gradient-to-b from-black via-slate-950 to-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-6xl font-black text-center mb-20 text-white text-shadow-lg text-shadow-blue-500/50">
            Container Queries (Resize Me!)
          </h2>

          <div className="@container backdrop-blur-xl bg-white/5 p-8 rounded-3xl border border-white/10">
            <div className="grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-3 @xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="backdrop-blur-md bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-xl p-6 border border-white/10 hover:scale-105 hover:border-white/30 transition-all"
                >
                  <div className="text-4xl font-bold text-white mb-2">{i + 1}</div>
                  <div className="text-sm text-gray-400">Container aware</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Custom Keyframes */}
      <style>{`
        @keyframes glow {
          0%, 100% {
            text-shadow: 0 0 20px rgba(6, 182, 212, 0.5),
                         0 0 40px rgba(6, 182, 212, 0.3);
          }
          50% {
            text-shadow: 0 0 30px rgba(6, 182, 212, 0.8),
                         0 0 60px rgba(6, 182, 212, 0.5),
                         0 0 80px rgba(6, 182, 212, 0.3);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          33% {
            transform: translateY(-20px) translateX(10px);
          }
          66% {
            transform: translateY(10px) translateX(-10px);
          }
        }

        @keyframes spin3d {
          0% {
            transform: rotateX(0) rotateY(0);
          }
          100% {
            transform: rotateX(360deg) rotateY(360deg);
          }
        }

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
