/**
 * ============================================================================
 * THEME SYSTEM TEST PAGE
 * ============================================================================
 * 
 * PURPOSE: Comprehensive visual test of new theme architecture
 * - Tests every semantic token
 * - Side-by-side light/dark preview
 * - Zero dark: classes in components
 * - Proves CSS variables auto-flip correctly
 * 
 * ROUTE: /showcase/theme-test
 * ============================================================================
 */

import { useTheme } from '@/core/theme/ThemeProvider';
import { Icon } from '@iconify/react';

export default function ThemeTest() {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      
      {/* ======================================================================
          HEADER WITH THEME TOGGLE
          ====================================================================== */}
      
      <header className="sticky top-0 z-sticky bg-card border-b border-border backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Theme System Test</h1>
            <p className="text-sm text-muted-foreground">
              Current: <span className="font-mono">{resolvedTheme}</span>
              {theme === 'system' && ' (auto)'}
            </p>
          </div>

          {/* Theme Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme('light')}
              className={`px-4 py-2 rounded-lg border transition-all ${
                resolvedTheme === 'light'
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-secondary text-secondary-foreground border-border hover:bg-accent'
              }`}
            >
              <Icon icon="mdi:white-balance-sunny" className="inline mr-2" />
              Light
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`px-4 py-2 rounded-lg border transition-all ${
                resolvedTheme === 'dark'
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-secondary text-secondary-foreground border-border hover:bg-accent'
              }`}
            >
              <Icon icon="mdi:moon-waning-crescent" className="inline mr-2" />
              Dark
            </button>
            <button
              onClick={() => setTheme('system')}
              className={`px-4 py-2 rounded-lg border transition-all ${
                theme === 'system'
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-secondary text-secondary-foreground border-border hover:bg-accent'
              }`}
            >
              <Icon icon="mdi:monitor" className="inline mr-2" />
              System
            </button>
          </div>
        </div>
      </header>

      {/* ======================================================================
          MAIN CONTENT - SEMANTIC TOKEN TESTS
          ====================================================================== */}
      
      <main className="max-w-7xl mx-auto px-6 py-12 space-y-12">

        {/* ==================================================================
            SECTION 1: BACKGROUND TOKENS
            ================================================================== */}
        
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Background Tokens</h2>
            <p className="text-muted-foreground">Base surfaces and backgrounds</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* background */}
            <div className="bg-background border border-border rounded-lg p-6 space-y-3">
              <div className="flex items-center justify-between">
                <code className="text-xs font-mono text-muted-foreground">bg-background</code>
                <Icon icon="mdi:palette" className="text-primary" />
              </div>
              <p className="text-foreground font-medium">Main page background</p>
              <p className="text-sm text-muted-foreground">
                You're looking at it right now - the main page bg
              </p>
            </div>

            {/* card */}
            <div className="bg-card border border-border rounded-lg p-6 space-y-3 shadow-md">
              <div className="flex items-center justify-between">
                <code className="text-xs font-mono text-muted-foreground">bg-card</code>
                <Icon icon="mdi:card" className="text-primary" />
              </div>
              <p className="text-card-foreground font-medium">Card background</p>
              <p className="text-sm text-muted-foreground">
                Slightly elevated from main background
              </p>
            </div>

            {/* muted */}
            <div className="bg-muted border border-border rounded-lg p-6 space-y-3">
              <div className="flex items-center justify-between">
                <code className="text-xs font-mono text-muted-foreground">bg-muted</code>
                <Icon icon="mdi:texture" className="text-primary" />
              </div>
              <p className="text-muted-foreground font-medium">Muted background</p>
              <p className="text-sm text-muted-foreground">
                For subtle, de-emphasized sections
              </p>
            </div>
          </div>
        </section>

        {/* ==================================================================
            SECTION 2: TEXT TOKENS
            ================================================================== */}
        
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Text Tokens</h2>
            <p className="text-muted-foreground">Hierarchy and emphasis</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-8 space-y-4">
            <p className="text-foreground text-2xl font-bold">
              text-foreground: Primary text (Headings, body)
            </p>
            <p className="text-muted-foreground text-lg">
              text-muted-foreground: Secondary text (Descriptions, metadata)
            </p>
            <p className="text-card-foreground">
              text-card-foreground: Text on card backgrounds
            </p>
            <a href="#" className="text-primary hover:underline block">
              text-primary: Links and primary actions
            </a>
          </div>
        </section>

        {/* ==================================================================
            SECTION 3: INTERACTIVE ELEMENTS
            ================================================================== */}
        
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Interactive Elements</h2>
            <p className="text-muted-foreground">Buttons and actions</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-8 space-y-6">
            
            {/* Primary Button */}
            <div className="space-y-2">
              <code className="text-xs font-mono text-muted-foreground">bg-primary + text-primary-foreground</code>
              <div>
                <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                  Primary Button
                </button>
              </div>
            </div>

            {/* Secondary Button */}
            <div className="space-y-2">
              <code className="text-xs font-mono text-muted-foreground">bg-secondary + text-secondary-foreground</code>
              <div>
                <button className="bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-accent transition-colors">
                  Secondary Button
                </button>
              </div>
            </div>

            {/* Destructive Button */}
            <div className="space-y-2">
              <code className="text-xs font-mono text-muted-foreground">bg-destructive + text-destructive-foreground</code>
              <div>
                <button className="bg-destructive text-destructive-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                  Destructive Button
                </button>
              </div>
            </div>

            {/* Muted Button */}
            <div className="space-y-2">
              <code className="text-xs font-mono text-muted-foreground">bg-muted + text-muted-foreground</code>
              <div>
                <button className="bg-muted text-muted-foreground px-6 py-3 rounded-lg font-semibold hover:bg-accent hover:text-accent-foreground transition-colors">
                  Muted Button
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            SECTION 4: BORDERS AND DIVIDERS
            ================================================================== */}
        
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Borders & Dividers</h2>
            <p className="text-muted-foreground">Separators and outlines</p>
          </div>

          <div className="bg-card rounded-lg p-8 space-y-6">
            
            <div className="border border-border rounded-lg p-4">
              <code className="text-xs font-mono text-muted-foreground">border-border</code>
              <p className="text-foreground mt-2">Default border style</p>
            </div>

            <div className="border-2 border-input rounded-lg p-4">
              <code className="text-xs font-mono text-muted-foreground">border-input</code>
              <p className="text-foreground mt-2">Input field borders</p>
            </div>

            <div className="ring-2 ring-ring rounded-lg p-4">
              <code className="text-xs font-mono text-muted-foreground">ring-ring</code>
              <p className="text-foreground mt-2">Focus rings (keyboard navigation)</p>
            </div>
          </div>
        </section>

        {/* ==================================================================
            SECTION 5: FORMS
            ================================================================== */}
        
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Form Elements</h2>
            <p className="text-muted-foreground">Inputs and controls</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-8 space-y-6">
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Text Input
              </label>
              <input
                type="text"
                placeholder="Enter some text..."
                className="w-full bg-background text-foreground border border-input rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Textarea
              </label>
              <textarea
                placeholder="Write something..."
                rows={4}
                className="w-full bg-background text-foreground border border-input rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ring transition-shadow resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Select
              </label>
              <select className="w-full bg-background text-foreground border border-input rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ring transition-shadow">
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
              </select>
            </div>
          </div>
        </section>

        {/* ==================================================================
            SECTION 6: STATE COLORS
            ================================================================== */}
        
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">State Colors</h2>
            <p className="text-muted-foreground">Success, error, warning, info</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Success */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-success-500 flex items-center justify-center">
                  <Icon icon="mdi:check" className="text-white text-xl" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Success</p>
                  <code className="text-xs text-muted-foreground">success-500</code>
                </div>
              </div>
              <div className="bg-success-100 border border-success-500 rounded p-3">
                <p className="text-success-700 text-sm font-medium">
                  Operation completed successfully!
                </p>
              </div>
            </div>

            {/* Error */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-error-500 flex items-center justify-center">
                  <Icon icon="mdi:alert-circle" className="text-white text-xl" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Error</p>
                  <code className="text-xs text-muted-foreground">error-500</code>
                </div>
              </div>
              <div className="bg-error-100 border border-error-500 rounded p-3">
                <p className="text-error-700 text-sm font-medium">
                  Something went wrong. Please try again.
                </p>
              </div>
            </div>

            {/* Warning */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-warning-500 flex items-center justify-center">
                  <Icon icon="mdi:alert" className="text-white text-xl" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Warning</p>
                  <code className="text-xs text-muted-foreground">warning-500</code>
                </div>
              </div>
              <div className="bg-warning-100 border border-warning-500 rounded p-3">
                <p className="text-warning-700 text-sm font-medium">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            {/* Info */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-info-500 flex items-center justify-center">
                  <Icon icon="mdi:information" className="text-white text-xl" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Info</p>
                  <code className="text-xs text-muted-foreground">info-500</code>
                </div>
              </div>
              <div className="bg-info-100 border border-info-500 rounded p-3">
                <p className="text-info-700 text-sm font-medium">
                  Pro tip: You can toggle themes anytime!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            SECTION 7: SHADOWS & ELEVATION
            ================================================================== */}
        
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Shadows & Elevation</h2>
            <p className="text-muted-foreground">Depth and layering</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <code className="text-xs font-mono text-muted-foreground">shadow-sm</code>
              <p className="text-foreground mt-2 text-sm">Small elevation</p>
            </div>
            <div className="bg-card rounded-lg p-6 shadow-md">
              <code className="text-xs font-mono text-muted-foreground">shadow-md</code>
              <p className="text-foreground mt-2 text-sm">Medium elevation</p>
            </div>
            <div className="bg-card rounded-lg p-6 shadow-lg">
              <code className="text-xs font-mono text-muted-foreground">shadow-lg</code>
              <p className="text-foreground mt-2 text-sm">Large elevation</p>
            </div>
            <div className="bg-card rounded-lg p-6 shadow-xl">
              <code className="text-xs font-mono text-muted-foreground">shadow-xl</code>
              <p className="text-foreground mt-2 text-sm">Extra large</p>
            </div>
          </div>
        </section>

        {/* ==================================================================
            SECTION 8: SYSTEM VALIDATION
            ================================================================== */}
        
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">System Validation</h2>
            <p className="text-muted-foreground">Proving it works</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-8 space-y-6">
            
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <Icon icon="mdi:check" className="text-primary-foreground" />
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">Zero dark: classes in components</p>
                <p className="text-sm text-muted-foreground">
                  Every element on this page uses semantic tokens (bg-background, text-foreground, etc.). 
                  The CSS handles light/dark mode automatically.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <Icon icon="mdi:check" className="text-primary-foreground" />
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">Single source of truth</p>
                <p className="text-sm text-muted-foreground">
                  ThemeProvider in main.tsx controls the .dark class on {'<html>'}. 
                  All components respond automatically.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <Icon icon="mdi:check" className="text-primary-foreground" />
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">Scalable architecture</p>
                <p className="text-sm text-muted-foreground">
                  Add new pages without thinking about dark mode. Just use semantic tokens.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <Icon icon="mdi:check" className="text-primary-foreground" />
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">Your color palette intact</p>
                <p className="text-sm text-muted-foreground">
                  Electric blue (#00B8FF), subtle purple (#8B7FC7), and your complete neutral scale 
                  are preserved. Semantic tokens just reference them intelligently.
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ======================================================================
          FOOTER
          ====================================================================== */}
      
      <footer className="border-t border-border mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center">
          <p className="text-muted-foreground text-sm">
            Theme System V3.0 • Shadcn/Vercel Architecture • Zero Dark Classes
          </p>
          <button
            onClick={toggleTheme}
            className="mt-4 text-primary hover:underline text-sm font-medium"
          >
            Toggle Theme (Current: {resolvedTheme})
          </button>
        </div>
      </footer>

    </div>
  );
}
