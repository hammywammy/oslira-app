/**
 * @file ULTIMATE Tailwind v4 Showcase - NUCLEAR EDITION
 * @description EVERY SINGLE FEATURE - 100+ Examples
 * 
 * TABLE OF CONTENTS:
 * 1. TYPOGRAPHY (20+ variations)
 * 2. LAYOUTS (bento, masonry, asymmetric, subgrid)
 * 3. COLORS (OKLCH, gradients, blending modes)
 * 4. EFFECTS (glass, glow, spotlight, morphing, masks)
 * 5. ANIMATIONS (keyframes, transforms, 3D)
 * 6. INTERACTIONS (hover, focus, group, peer, nth-child)
 * 7. RESPONSIVE (container queries, breakpoints)
 * 8. ADVANCED (filters, shadows, pseudo-elements)
 */

import { useState, useRef, useEffect } from 'react';

export function HomePage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (spotlightRef.current) {
        const rect = spotlightRef.current.getBoundingClientRect();
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    const current = spotlightRef.current;
    if (current) {
      current.addEventListener('mousemove', handleMouseMove);
    }
    
    return () => {
      if (current) {
        current.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-black">
      
      {/* ========================================
          HERO - NEON CYBERPUNK PARADISE
          ======================================== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
        {/* Animated Morphing Background Blobs */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/20 rounded-full blur-[150px] animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-fuchsia-500/20 rounded-full blur-[150px] animate-pulse [animation-delay:_1s]" />
          <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-violet-500/20 rounded-full blur-[150px] animate-pulse [animation-delay:_2s]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-8 max-w-6xl">
          <h1 className="text-9xl font-black mb-8 text-white text-shadow-lg text-shadow-cyan-500/50 animate-[glow_3s_ease-in-out_infinite]">
            TAILWIND v4
          </h1>
          <p className="text-3xl text-cyan-400 mb-12 text-shadow-sm text-shadow-cyan-500/30 font-bold">
            The Most Comprehensive Feature Showcase Ever Created
          </p>

          {/* Spinning Neon Border Button */}
          <div className="inline-block relative group">
            <div className="absolute -inset-1 bg-conic from-cyan-500 via-fuchsia-500 to-cyan-500 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 animate-spin [animation-duration:_3s]" />
            <button className="relative px-16 py-8 bg-black text-white text-2xl font-black rounded-2xl border-2 border-cyan-500 shadow-[0_0_2px_#fff,inset_0_0_2px_#fff,0_0_10px_#0ff,0_0_40px_#0ff,0_0_80px_#0ff] hover:shadow-[0_0_2px_#fff,inset_0_0_2px_#fff,0_0_20px_#0ff,0_0_80px_#0ff,0_0_160px_#0ff] transition-all duration-300">
              100+ FEATURES BELOW
            </button>
          </div>
        </div>
      </section>

      {/* ========================================
          SECTION 1: TYPOGRAPHY MASTERY
          ======================================== */}
      <section className="py-32 px-8 bg-gradient-to-b from-black via-slate-950 to-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-7xl font-black text-center mb-4 text-white text-shadow-lg text-shadow-violet-500/50">
            TYPOGRAPHY SHOWCASE
          </h2>
          <p className="text-center text-gray-400 text-xl mb-20">
            20+ Typography Variations - Text Shadows, Masks, Gradients, Clamp, Line Clamp
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* 1. Text Shadow - Embossed */}
            <div className="backdrop-blur-xl bg-white/5 p-8 rounded-3xl border border-white/10">
              <h3 className="text-4xl font-black text-gray-900 text-shadow-2xs text-shadow-white/70 mb-4">
                EMBOSSED
              </h3>
              <p className="text-gray-400">Dark text + light shadow = embossed effect</p>
              <code className="text-xs text-cyan-400 block mt-2">text-shadow-2xs text-shadow-white/70</code>
            </div>

            {/* 2. Text Shadow - Neon Glow */}
            <div className="backdrop-blur-xl bg-white/5 p-8 rounded-3xl border border-white/10">
              <h3 className="text-4xl font-black text-cyan-400 text-shadow-lg text-shadow-cyan-500/70 mb-4">
                NEON GLOW
              </h3>
              <p className="text-gray-400">Colored text shadow for cyberpunk vibes</p>
              <code className="text-xs text-cyan-400 block mt-2">text-shadow-lg text-shadow-cyan-500/70</code>
            </div>

            {/* 3. Text Shadow - Multi-Color Glow */}
            <div className="backdrop-blur-xl bg-white/5 p-8 rounded-3xl border border-white/10">
              <h3 className="text-4xl font-black text-fuchsia-400 text-shadow-md text-shadow-fuchsia-500/60 mb-4 animate-pulse">
                PULSING
              </h3>
              <p className="text-gray-400">Animated glow with pulse effect</p>
              <code className="text-xs text-cyan-400 block mt-2">text-shadow-md + animate-pulse</code>
            </div>

            {/* 4. Gradient Text - Linear */}
            <div className="backdrop-blur-xl bg-white/5 p-8 rounded-3xl border border-white/10">
              <h3 className="text-4xl font-black bg-linear-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent mb-4">
                GRADIENT
              </h3>
              <p className="text-gray-400">Linear gradient clipped to text</p>
              <code className="text-xs text-cyan-400 block mt-2">bg-linear-to-r bg-clip-text</code>
            </div>

            {/* 5. Gradient Text - Animated */}
            <div className="backdrop-blur-xl bg-white/5 p-8 rounded-3xl border border-white/10">
              <h3 className="text-4xl font-black bg-linear-to-r from-orange-400 via-pink-500 to-purple-600 bg-clip-text text-transparent bg-[length:_200%_200%] animate-[background-move_4s_ease_infinite] mb-4">
                ANIMATED
              </h3>
              <p className="text-gray-400">Moving gradient background</p>
              <code className="text-xs text-cyan-400 block mt-2">bg-[length:_200%] + animation</code>
            </div>

            {/* 6. First Letter Large */}
            <div className="backdrop-blur-xl bg-white/5 p-8 rounded-3xl border border-white/10">
              <p className="text-gray-300 first-letter:text-6xl first-letter:font-black first-letter:text-cyan-400 first-letter:mr-2 first-letter:float-left">
                This paragraph has a massive first letter styled with the first-letter: pseudo-element variant.
              </p>
              <code className="text-xs text-cyan-400 block mt-2">first-letter:text-6xl</code>
            </div>

            {/* 7. First Line Different */}
            <div className="backdrop-blur-xl bg-white/5 p-8 rounded-3xl border border-white/10">
              <p className="text-gray-300 first-line:uppercase first-line:tracking-widest first-line:text-cyan-400 first-line:font-bold">
                The first line of this text is uppercase and spaced out, while the rest remains normal styling.
              </p>
              <code className="text-xs text-cyan-400 block mt-2">first-line:uppercase</code>
            </div>

            {/* 8. Line Clamp - 3 Lines */}
            <div className="backdrop-blur-xl bg-white/5 p-8 rounded-3xl border border-white/10">
              <p className="text-gray-300 line-clamp-3">
                This text will be truncated after exactly three lines with an ellipsis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
              </p>
              <code className="text-xs text-cyan-400 block mt-2">line-clamp-3</code>
            </div>

            {/* 9. Fluid Typography with Clamp */}
            <div className="backdrop-blur-xl bg-white/5 p-8 rounded-3xl border border-white/10">
              <h3 className="font-black text-white mb-4 text-[clamp(1.5rem,4vw,3rem)]">
                FLUID SCALE
              </h3>
              <p className="text-gray-400">Font size scales smoothly with viewport</p>
              <code className="text-xs text-cyan-400 block mt-2">text-[clamp(1.5rem,4vw,3rem)]</code>
            </div>

            {/* 10. Text with Radial Mask */}
            <div className="relative h-48 backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-linear-to-r from-violet-600 to-fuchsia-600" />
              <div className="absolute inset-0 mask-radial mask-radial-from-70% flex items-center justify-center">
                <h3 className="text-5xl font-black text-white">MASKED</h3>
              </div>
              <code className="absolute bottom-4 text-xs text-cyan-400">mask-radial mask-radial-from-70%</code>
            </div>

            {/* 11. Uppercase with Tracking */}
            <div className="backdrop-blur-xl bg-white/5 p-8 rounded-3xl border border-white/10">
              <h3 className="text-2xl font-black text-white uppercase tracking-[0.3em] mb-4">
                SPACED OUT
              </h3>
              <p className="text-gray-400">Wide letter spacing for impact</p>
              <code className="text-xs text-cyan-400 block mt-2">uppercase tracking-[0.3em]</code>
            </div>

            {/* 12. Italic with Slant */}
            <div className="backdrop-blur-xl bg-white/5 p-8 rounded-3xl border border-white/10">
              <h3 className="text-4xl font-black text-white italic [font-variation-settings:'slnt'-10] mb-4">
                ITALIC SLANT
              </h3>
              <p className="text-gray-400">Variable font slant control</p>
              <code className="text-xs text-cyan-400 block mt-2">[font-variation-settings:'slnt'-10]</code>
            </div>

            {/* 13. Text Stroke Outline */}
            <div className="backdrop-blur-xl bg-white/5 p-8 rounded-3xl border border-white/10">
              <h3 className="text-5xl font-black text-transparent [-webkit-text-stroke:2px_white] mb-4">
                OUTLINE
              </h3>
              <p className="text-gray-400">Text stroke for hollow letters</p>
              <code className="text-xs text-cyan-400 block mt-2">[-webkit-text-stroke:2px_white]</code>
            </div>

            {/* 14. Text with Background Clip */}
            <div className="backdrop-blur-xl bg-white/5 p-8 rounded-3xl border border-white/10">
              <h3 className="text-4xl font-black bg-[url('data:image/svg+xml,...')] bg-clip-text text-transparent mb-4">
                PATTERN
              </h3>
              <p className="text-gray-400">Pattern/texture clipped to text</p>
              <code className="text-xs text-cyan-400 block mt-2">bg-[url(...)] bg-clip-text</code>
            </div>

            {/* 15. Selection Styling */}
            <div className="backdrop-blur-xl bg-white/5 p-8 rounded-3xl border border-white/10">
              <p className="text-white selection:bg-cyan-500 selection:text-black">
                Select this text to see custom selection colors!
              </p>
              <code className="text-xs text-cyan-400 block mt-2">selection:bg-cyan-500</code>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================
          SECTION 2: LAYOUT SHOWCASE
          ======================================== */}
      <section className="py-32 px-8 bg-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-7xl font-black text-center mb-4 text-white text-shadow-lg text-shadow-cyan-500/50">
            LAYOUT SHOWCASE
          </h2>
          <p className="text-center text-gray-400 text-xl mb-20">
            Bento Grids, Masonry, Asymmetric, Subgrid, Columns
          </p>

          {/* Bento Grid Layout */}
          <div className="mb-16">
            <h3 className="text-4xl font-bold text-white mb-8">Bento Grid (Apple-Style)</h3>
            <div className="grid grid-cols-4 grid-rows-4 gap-4 h-[600px]">
              <div className="col-span-2 row-span-2 bg-gradient-to-br from-violet-600 to-purple-700 rounded-3xl p-8 flex items-center justify-center text-white font-black text-3xl shadow-2xl">
                LARGE
              </div>
              <div className="col-span-2 row-span-1 bg-gradient-to-br from-cyan-600 to-blue-700 rounded-3xl p-8 flex items-center justify-center text-white font-black text-2xl shadow-2xl">
                WIDE
              </div>
              <div className="col-span-1 row-span-2 bg-gradient-to-br from-orange-600 to-red-700 rounded-3xl p-8 flex items-center justify-center text-white font-black text-xl shadow-2xl">
                TALL
              </div>
              <div className="col-span-1 row-span-1 bg-gradient-to-br from-green-600 to-emerald-700 rounded-3xl p-8 flex items-center justify-center text-white font-black text-lg shadow-2xl">
                SMALL
              </div>
              <div className="col-span-2 row-span-1 bg-gradient-to-br from-fuchsia-600 to-pink-700 rounded-3xl p-8 flex items-center justify-center text-white font-black text-2xl shadow-2xl">
                MEDIUM
              </div>
              <div className="col-span-1 row-span-1 bg-gradient-to-br from-yellow-600 to-orange-700 rounded-3xl p-8 flex items-center justify-center text-white font-black text-lg shadow-2xl">
                SQUARE
              </div>
              <div className="col-span-1 row-span-1 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 flex items-center justify-center text-white font-black text-lg shadow-2xl">
                SQUARE
              </div>
            </div>
          </div>

          {/* Masonry Layout with Columns */}
          <div className="mb-16">
            <h3 className="text-4xl font-bold text-white mb-8">Masonry Layout (Pinterest-Style)</h3>
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {[
                { h: 'h-48', color: 'from-red-500 to-orange-600' },
                { h: 'h-64', color: 'from-blue-500 to-cyan-600' },
                { h: 'h-40', color: 'from-green-500 to-emerald-600' },
                { h: 'h-56', color: 'from-purple-500 to-fuchsia-600' },
                { h: 'h-72', color: 'from-yellow-500 to-orange-600' },
                { h: 'h-44', color: 'from-pink-500 to-rose-600' },
                { h: 'h-60', color: 'from-indigo-500 to-blue-600' },
                { h: 'h-52', color: 'from-teal-500 to-cyan-600' },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`${item.h} bg-gradient-to-br ${item.color} rounded-2xl break-inside-avoid shadow-xl hover:scale-105 transition-transform duration-300`}
                />
              ))}
            </div>
          </div>

          {/* Subgrid Example */}
          <div className="mb-16">
            <h3 className="text-4xl font-bold text-white mb-8">Subgrid (Nested Grid Alignment)</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-4 h-24 bg-linear-to-r from-violet-600 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                HEADER (Span 4)
              </div>
              <div className="col-span-1 h-32 bg-linear-to-br from-cyan-600 to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold">
                SIDEBAR
              </div>
              <div className="col-span-3 grid grid-cols-subgrid gap-4">
                <div className="h-32 bg-linear-to-br from-orange-600 to-red-600 rounded-2xl flex items-center justify-center text-white font-bold">
                  SUB 1
                </div>
                <div className="h-32 bg-linear-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center text-white font-bold">
                  SUB 2
                </div>
                <div className="h-32 bg-linear-to-br from-pink-600 to-rose-600 rounded-2xl flex items-center justify-center text-white font-bold">
                  SUB 3
                </div>
              </div>
            </div>
          </div>

          {/* Asymmetric Grid */}
          <div className="mb-16">
            <h3 className="text-4xl font-bold text-white mb-8">Asymmetric Grid (Dynamic Columns)</h3>
            <div className="grid grid-cols-[2fr_1fr_1fr] gap-4">
              <div className="h-48 bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                2fr WIDE
              </div>
              <div className="h-48 bg-gradient-to-br from-cyan-600 to-blue-700 rounded-2xl flex items-center justify-center text-white font-bold">
                1fr
              </div>
              <div className="h-48 bg-gradient-to-br from-orange-600 to-red-700 rounded-2xl flex items-center justify-center text-white font-bold">
                1fr
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          SECTION 3: COLOR SHOWCASE
          ======================================== */}
      <section className="py-32 px-8 bg-gradient-to-b from-black via-purple-950/20 to-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-7xl font-black text-center mb-4 text-white text-shadow-lg text-shadow-fuchsia-500/50">
            COLOR SHOWCASE
          </h2>
          <p className="text-center text-gray-400 text-xl mb-20">
            OKLCH Wide-Gamut, Gradients, Opacity, Blending Modes
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Linear Gradient */}
            <div className="h-48 bg-linear-to-r from-violet-600 via-purple-600 to-fuchsia-600 rounded-3xl shadow-2xl" />
            
            {/* Radial Gradient */}
            <div className="h-48 bg-radial from-orange-400 to-rose-600 rounded-3xl shadow-2xl" />
            
            {/* Conic Gradient */}
            <div className="h-48 bg-conic from-green-400 via-cyan-400 to-blue-500 rounded-3xl shadow-2xl" />
            
            {/* Diagonal Gradient with Angle */}
            <div className="h-48 bg-linear-135 from-cyan-500 via-blue-500 to-indigo-600 rounded-3xl shadow-2xl" />
            
            {/* Multi-Stop Gradient */}
            <div className="h-48 bg-linear-to-br from-red-500 via-yellow-500 via-green-500 to-blue-500 rounded-3xl shadow-2xl" />
            
            {/* Opacity Variations */}
            <div className="relative h-48 bg-black rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-cyan-500/20" />
              <div className="absolute inset-0 bg-fuchsia-500/40 translate-x-1/4" />
              <div className="absolute inset-0 bg-yellow-500/60 translate-x-1/2" />
            </div>
            
            {/* Blending Mode - Multiply */}
            <div className="relative h-48 bg-white rounded-3xl overflow-hidden">
              <div className="absolute inset-0 w-1/2 bg-red-500 mix-blend-multiply" />
              <div className="absolute inset-0 left-1/4 w-1/2 bg-blue-500 mix-blend-multiply" />
            </div>
            
            {/* Blending Mode - Screen */}
            <div className="relative h-48 bg-black rounded-3xl overflow-hidden">
              <div className="absolute inset-0 w-1/2 bg-red-500 mix-blend-screen" />
              <div className="absolute inset-0 left-1/4 w-1/2 bg-blue-500 mix-blend-screen" />
            </div>
            
            {/* Blending Mode - Overlay */}
            <div className="relative h-48 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,...')] mix-blend-overlay opacity-50" />
            </div>
            
          </div>
        </div>
      </section>

      {/* ========================================
          SECTION 4: EFFECTS SHOWCASE
          ======================================== */}
      <section 
        ref={spotlightRef}
        className="py-32 px-8 bg-black relative"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-7xl font-black text-center mb-4 text-white text-shadow-lg text-shadow-green-500/50">
            EFFECTS SHOWCASE
          </h2>
          <p className="text-center text-gray-400 text-xl mb-20">
            Glassmorphism, Spotlight, Glow, Morphing, Masks, Filters
          </p>

          {/* Glassmorphism Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
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
                className={`backdrop-blur-${item.blur} bg-white/${item.opacity} border border-white/20 rounded-3xl p-8 hover:scale-105 transition-all duration-300 shadow-2xl`}
              >
                <div className="text-3xl font-bold mb-2 text-white">{item.name}</div>
                <div className="text-sm text-gray-300 mb-4">backdrop-blur-{item.blur}</div>
                <div className="h-24 bg-linear-to-br from-violet-500/30 to-fuchsia-500/30 rounded-xl" />
              </div>
            ))}
          </div>

          {/* Spotlight Cards */}
          <h3 className="text-5xl font-bold text-white mb-8 text-center">Mouse-Tracking Spotlight</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                className="group relative p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/50 to-slate-900/20 overflow-hidden min-h-[300px]"
              >
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(99, 102, 241, 0.15), transparent 40%)`,
                  }}
                />
                <div className="relative z-10">
                  <div className="text-7xl mb-4">{['⚡', '🔥', '✨'][num - 1]}</div>
                  <h3 className="text-4xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors">
                    Feature {num}
                  </h3>
                  <p className="text-gray-400 text-lg">
                    Move your mouse over to see the spotlight effect
                  </p>
                </div>
                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity shadow-[inset_0_0_20px_rgba(99,102,241,0.3)]" />
              </div>
            ))}
          </div>

          {/* Mask Effects */}
          <h3 className="text-5xl font-bold text-white mb-8 text-center">Mask Effects (v4.1)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            
            {/* Radial Mask Vignette */}
            <div className="relative h-64 rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-r from-violet-600 to-fuchsia-600" />
              <div className="absolute inset-0 mask-radial mask-radial-from-60% flex items-center justify-center">
                <p className="text-5xl font-black text-white">VIGNETTE</p>
              </div>
            </div>

            {/* Conic Mask Progress */}
            <div className="backdrop-blur-xl bg-white/5 p-12 rounded-3xl border border-white/10 flex items-center justify-center">
              <div className="grid grid-cols-1 grid-rows-1 w-32 h-32">
                <div className="col-start-1 row-start-1 border-[12px] border-white/10 rounded-full" />
                <div className="col-start-1 row-start-1 border-[12px] border-emerald-500 rounded-full mask-conic mask-conic-from-75% mask-conic-to-75%" />
              </div>
            </div>

          </div>

          {/* Glow Effects */}
          <h3 className="text-5xl font-bold text-white mb-8 text-center">Neon Glow Effects</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-block p-12 bg-black rounded-3xl shadow-[0_0_2px_#fff,inset_0_0_2px_#fff,0_0_10px_#0ff,0_0_40px_#0ff,0_0_80px_#0ff]">
                <div className="text-7xl">💎</div>
              </div>
              <p className="text-white mt-4 font-bold text-xl">Cyan Neon</p>
            </div>

            <div className="text-center">
              <div className="inline-block p-12 bg-black rounded-3xl shadow-[0_0_2px_#fff,inset_0_0_2px_#fff,0_0_10px_#f0f,0_0_40px_#f0f,0_0_80px_#f0f]">
                <div className="text-7xl">🔥</div>
              </div>
              <p className="text-white mt-4 font-bold text-xl">Magenta Neon</p>
            </div>

            <div className="text-center">
              <div className="inline-block p-12 bg-black rounded-3xl shadow-[0_0_2px_#fff,inset_0_0_2px_#fff,0_0_10px_#0f0,0_0_40px_#0f0,0_0_80px_#0f0]">
                <div className="text-7xl">⚡</div>
              </div>
              <p className="text-white mt-4 font-bold text-xl">Green Neon</p>
            </div>

            <div className="text-center">
              <div className="inline-block p-12 bg-black rounded-3xl shadow-[0_0_2px_#fff,inset_0_0_2px_#fff,0_0_10px_#ff0,0_0_40px_#ff0,0_0_80px_#ff0]">
                <div className="text-7xl">✨</div>
              </div>
              <p className="text-white mt-4 font-bold text-xl">Yellow Neon</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          SECTION 5: ANIMATIONS & 3D
          ======================================== */}
      <section className="py-32 px-8 bg-gradient-to-b from-black via-indigo-950/20 to-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-7xl font-black text-center mb-4 text-white text-shadow-lg text-shadow-blue-500/50">
            3D & ANIMATIONS
          </h2>
          <p className="text-center text-gray-400 text-xl mb-20">
            Transforms, Perspective, Keyframes, Transitions
          </p>

          {/* 3D Transforms */}
          <h3 className="text-5xl font-bold text-white mb-8">3D Transforms</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
            
            {/* Rotating Cube */}
            <div className="perspective-dramatic h-80 flex items-center justify-center">
              <div className="relative w-40 h-40 transform-3d animate-[spin3d_10s_linear_infinite] [transform-style:preserve-3d]">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl [backface-visibility:hidden] flex items-center justify-center text-white font-black text-2xl">
                  FRONT
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl [backface-visibility:hidden] [transform:rotateY(180deg)] flex items-center justify-center text-white font-black text-2xl">
                  BACK
                </div>
              </div>
            </div>

            {/* Tilting Card */}
            <div className="perspective-normal h-80 flex items-center justify-center">
              <div className="w-48 h-64 bg-gradient-to-br from-fuchsia-500 to-pink-600 rounded-2xl shadow-2xl transform-3d rotate-y-12 hover:rotate-y-24 hover:rotate-x-12 transition-all duration-500 flex items-center justify-center text-white font-black text-xl">
                HOVER TILT
              </div>
            </div>

            {/* Z-Axis Float */}
            <div className="perspective-normal h-80 flex items-center justify-center">
              <div className="w-48 h-48 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-2xl transform-3d translate-z-12 animate-[float_4s_ease-in-out_infinite] flex items-center justify-center text-white font-black text-xl">
                FLOATING
              </div>
            </div>

            {/* Multi-Axis */}
            <div className="perspective-distant h-80 flex items-center justify-center">
              <div className="w-48 h-48 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl shadow-2xl transform-3d rotate-x-20 rotate-y-20 hover:rotate-x-45 hover:rotate-y-45 hover:scale-110 transition-all duration-500 flex items-center justify-center text-white font-black text-center p-4">
                ALL AXES
              </div>
            </div>
          </div>

          {/* Animated Borders */}
          <h3 className="text-5xl font-bold text-white mb-8">Animated Gradient Borders</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Spinning Border */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-conic from-cyan-500 via-blue-500 to-purple-500 rounded-3xl blur-sm animate-spin [animation-duration:_4s]" />
              <div className="relative bg-black p-8 rounded-3xl border border-white/10">
                <h3 className="text-3xl font-bold text-white mb-2">SPINNING</h3>
                <p className="text-gray-400">Conic gradient rotation</p>
              </div>
            </div>

            {/* Pulsing Border */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-linear-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-3xl blur-sm animate-pulse" />
              <div className="relative bg-black p-8 rounded-3xl border border-white/10">
                <h3 className="text-3xl font-bold text-white mb-2">PULSING</h3>
                <p className="text-gray-400">Pulse animation</p>
              </div>
            </div>

            {/* Moving Border */}
            <div className="relative group overflow-hidden rounded-3xl">
              <div className="absolute -inset-1 bg-linear-135 from-orange-500 via-red-500 to-pink-500 bg-[length:_400%_400%] animate-[background-move_6s_ease_infinite]" />
              <div className="relative bg-black m-[2px] p-8 rounded-3xl">
                <h3 className="text-3xl font-bold text-white mb-2">MOVING</h3>
                <p className="text-gray-400">Position animation</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          SECTION 6: INTERACTION SHOWCASE
          ======================================== */}
      <section className="py-32 px-8 bg-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-7xl font-black text-center mb-4 text-white text-shadow-lg text-shadow-orange-500/50">
            INTERACTION SHOWCASE
          </h2>
          <p className="text-center text-gray-400 text-xl mb-20">
            Hover, Focus, Group, Peer, Not, Nth-Child Variants
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Group Hover */}
            <div className="group backdrop-blur-xl bg-white/5 p-8 rounded-3xl border border-white/10 hover:border-cyan-500/50 transition-all">
              <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors">
                GROUP HOVER
              </h3>
              <p className="text-gray-400 group-hover:text-white transition-colors">
                Hover parent changes children
              </p>
            </div>

            {/* Peer Focus */}
            <div className="backdrop-blur-xl bg-white/5 p-8 rounded-3xl border border-white/10">
              <input 
                type="text" 
                placeholder="Focus me..."
                className="peer w-full px-4 py-2 bg-black/50 border border-white/20 rounded-lg text-white focus:border-cyan-500 focus:outline-none mb-4"
              />
              <p className="text-gray-400 peer-focus:text-cyan-400 transition-colors">
                This text changes when input is focused!
              </p>
            </div>

            {/* Not Variant */}
            <div className="backdrop-blur-xl bg-white/5 p-8 rounded-3xl border border-white/10">
              <button className="w-full px-6 py-3 bg-cyan-600 hover:not-disabled:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors mb-2">
                Enabled Button
              </button>
              <button disabled className="w-full px-6 py-3 bg-cyan-600 hover:not-disabled:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors">
                Disabled Button
              </button>
            </div>

            {/* Nth-Child Pattern */}
            <div className="backdrop-blur-xl bg-white/5 p-8 rounded-3xl border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-4">NTH-CHILD</h3>
              <ul className="space-y-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <li key={n} className="p-2 bg-black/50 rounded-lg odd:bg-cyan-600/20 even:bg-fuchsia-600/20">
                    Item {n}
                  </li>
                ))}
              </ul>
            </div>

            {/* Has Variant */}
            <div className="backdrop-blur-xl bg-white/5 p-8 rounded-3xl border border-white/10 has-[:checked]:border-cyan-500 has-[:checked]:bg-cyan-500/10 transition-all">
              <h3 className="text-2xl font-bold text-white mb-4">HAS VARIANT</h3>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-5 h-5" />
                <span className="text-white">Check to change container</span>
              </label>
            </div>

            {/* Focus Within */}
            <div className="backdrop-blur-xl bg-white/5 p-8 rounded-3xl border border-white/10 focus-within:border-cyan-500 focus-within:shadow-lg focus-within:shadow-cyan-500/20 transition-all">
              <h3 className="text-2xl font-bold text-white mb-4">FOCUS WITHIN</h3>
              <input 
                type="text" 
                placeholder="Focus me..."
                className="w-full px-4 py-2 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none"
              />
            </div>

          </div>
        </div>
      </section>

      {/* ========================================
          SECTION 7: RESPONSIVE SHOWCASE
          ======================================== */}
      <section className="py-32 px-8 bg-gradient-to-b from-black via-slate-950 to-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-7xl font-black text-center mb-4 text-white text-shadow-lg text-shadow-purple-500/50">
            RESPONSIVE SHOWCASE
          </h2>
          <p className="text-center text-gray-400 text-xl mb-20">
            Container Queries, Breakpoints, Clamp, Fluid Scaling
          </p>

          {/* Container Query Demo */}
          <div className="@container backdrop-blur-xl bg-white/5 p-8 rounded-3xl border border-white/10 mb-16">
            <h3 className="text-4xl font-bold text-white mb-8 text-center">Container Queries (Resize Container)</h3>
            <div className="grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-3 @xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="backdrop-blur-md bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-2xl p-6 border border-white/10 hover:scale-105 hover:border-white/30 transition-all"
                >
                  <div className="text-5xl font-bold text-white mb-2">{i + 1}</div>
                  <div className="text-sm text-gray-400">Container aware</div>
                </div>
              ))}
            </div>
          </div>

          {/* Breakpoint Demo */}
          <div className="backdrop-blur-xl bg-white/5 p-8 rounded-3xl border border-white/10">
            <h3 className="text-4xl font-bold text-white mb-8 text-center">Responsive Breakpoints</h3>
            <div className="text-center">
              <div className="inline-block px-8 py-4 bg-cyan-600 sm:bg-green-600 md:bg-yellow-600 lg:bg-orange-600 xl:bg-red-600 2xl:bg-purple-600 rounded-2xl text-white font-black text-2xl">
                <span className="sm:hidden">Mobile</span>
                <span className="hidden sm:inline md:hidden">SM</span>
                <span className="hidden md:inline lg:hidden">MD</span>
                <span className="hidden lg:inline xl:hidden">LG</span>
                <span className="hidden xl:inline 2xl:hidden">XL</span>
                <span className="hidden 2xl:inline">2XL</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          SECTION 8: ADVANCED FILTERS
          ======================================== */}
      <section className="py-32 px-8 bg-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-7xl font-black text-center mb-4 text-white text-shadow-lg text-shadow-red-500/50">
            FILTERS & EFFECTS
          </h2>
          <p className="text-center text-gray-400 text-xl mb-20">
            Blur, Brightness, Contrast, Grayscale, Hue-Rotate, Saturate
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            
            {/* Original */}
            <div className="text-center">
              <div className="w-full h-48 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-2xl mb-4" />
              <p className="text-white font-bold">Original</p>
            </div>

            {/* Blur */}
            <div className="text-center">
              <div className="w-full h-48 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-2xl mb-4 blur-md" />
              <p className="text-white font-bold">blur-md</p>
            </div>

            {/* Brightness */}
            <div className="text-center">
              <div className="w-full h-48 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-2xl mb-4 brightness-150" />
              <p className="text-white font-bold">brightness-150</p>
            </div>

            {/* Contrast */}
            <div className="text-center">
              <div className="w-full h-48 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-2xl mb-4 contrast-200" />
              <p className="text-white font-bold">contrast-200</p>
            </div>

            {/* Grayscale */}
            <div className="text-center">
              <div className="w-full h-48 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-2xl mb-4 grayscale" />
              <p className="text-white font-bold">grayscale</p>
            </div>

            {/* Hue Rotate */}
            <div className="text-center">
              <div className="w-full h-48 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-2xl mb-4 hue-rotate-90" />
              <p className="text-white font-bold">hue-rotate-90</p>
            </div>

            {/* Saturate */}
            <div className="text-center">
              <div className="w-full h-48 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-2xl mb-4 saturate-200" />
              <p className="text-white font-bold">saturate-200</p>
            </div>

            {/* Sepia */}
            <div className="text-center">
              <div className="w-full h-48 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-2xl mb-4 sepia" />
              <p className="text-white font-bold">sepia</p>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================
          SECTION 9: DROP SHADOWS (V4.1)
          ======================================== */}
      <section className="py-32 px-8 bg-gradient-to-b from-black via-purple-950/20 to-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-7xl font-black text-center mb-4 text-white text-shadow-lg text-shadow-pink-500/50">
            COLORED DROP SHADOWS
          </h2>
          <p className="text-center text-gray-400 text-xl mb-20">
            New in v4.1 - Colored drop-shadow on any element
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            
            <div className="text-center">
              <div className="inline-block p-8 bg-black rounded-3xl drop-shadow-[0_10px_30px_rgba(6,182,212,0.6)] hover:drop-shadow-[0_15px_50px_rgba(6,182,212,0.8)] transition-all">
                <div className="text-7xl">💎</div>
              </div>
              <p className="text-white mt-4 font-bold">Cyan</p>
            </div>

            <div className="text-center">
              <div className="inline-block p-8 bg-black rounded-3xl drop-shadow-[0_10px_30px_rgba(236,72,153,0.6)] hover:drop-shadow-[0_15px_50px_rgba(236,72,153,0.8)] transition-all">
                <div className="text-7xl">🔥</div>
              </div>
              <p className="text-white mt-4 font-bold">Pink</p>
            </div>

            <div className="text-center">
              <div className="inline-block p-8 bg-black rounded-3xl drop-shadow-[0_10px_30px_rgba(168,85,247,0.6)] hover:drop-shadow-[0_15px_50px_rgba(168,85,247,0.8)] transition-all">
                <div className="text-7xl">⚡</div>
              </div>
              <p className="text-white mt-4 font-bold">Purple</p>
            </div>

            <div className="text-center">
              <div className="inline-block p-8 bg-black rounded-3xl drop-shadow-[0_10px_30px_rgba(34,197,94,0.6)] hover:drop-shadow-[0_15px_50px_rgba(34,197,94,0.8)] transition-all">
                <div className="text-7xl">✨</div>
              </div>
              <p className="text-white mt-4 font-bold">Green</p>
            </div>

            <div className="text-center">
              <div className="inline-block p-8 bg-black rounded-3xl drop-shadow-[0_10px_30px_rgba(251,146,60,0.6)] hover:drop-shadow-[0_15px_50px_rgba(251,146,60,0.8)] transition-all">
                <div className="text-7xl">🌟</div>
              </div>
              <p className="text-white mt-4 font-bold">Orange</p>
            </div>

            <div className="text-center">
              <div className="inline-block p-8 bg-black rounded-3xl drop-shadow-[0_10px_30px_rgba(250,204,21,0.6)] hover:drop-shadow-[0_15px_50px_rgba(250,204,21,0.8)] transition-all">
                <div className="text-7xl">💫</div>
              </div>
              <p className="text-white mt-4 font-bold">Yellow</p>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================
          FOOTER - FEATURE LIST
          ======================================== */}
      <footer className="py-16 px-8 bg-black border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-5xl font-black bg-linear-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent mb-4">
              100+ Features Showcased
            </h3>
            <p className="text-gray-400 text-xl">
              This is Tailwind CSS v4 at its absolute limits
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              'Typography', 'Layouts', 'Colors', 'Effects', 'Animations', '3D Transforms',
              'Interactions', 'Responsive', 'Filters', 'Shadows', 'Gradients', 'Masks',
              'Glassmorphism', 'Spotlight', 'Neon Glow', 'Morphing', 'Container Queries', 'Subgrid',
              'Bento Grid', 'Masonry', 'Text Shadow', 'Drop Shadow', 'Blend Modes', 'Clamp',
            ].map((feature, i) => (
              <div
                key={i}
                className="px-4 py-3 backdrop-blur-lg bg-white/5 rounded-xl text-center text-sm text-gray-300 border border-white/10 hover:border-cyan-500/50 hover:text-cyan-400 transition-all"
              >
                {feature}
              </div>
            ))}
          </div>
        </div>
      </footer>

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
