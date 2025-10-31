// src/pages/showcase/ComponentShowcase.tsx

/**
 * COMPONENT SHOWCASE - PRODUCTION GRADE
 * 
 * Oslira Design System with elegant professionalism
 * "Concert hall, not arcade; calm ocean, not storm"
 * 
 * FEATURES:
 * ✅ Live color swatches with copy-to-clipboard
 * ✅ Oslira brand colors (primary electric blue)
 * ✅ Elegant dark backgrounds with subtle gradients
 * ✅ Proper elevation and depth
 * ✅ Smooth animations and micro-interactions
 * ✅ Professional typography hierarchy
 * ✅ Interactive component previews
 * 
 * TYPESCRIPT FIXES (2025-10-30):
 * ✅ Removed all unused imports (Icon, Input, Textarea, Select, Checkbox, Radio, Switch, Label, Badge, Avatar, Spinner, Tooltip, Alert, Progress)
 * ✅ Removed all unused state variables (checkboxChecked, radioValue, switchChecked, and their setters)
 * ✅ Kept only actively used imports: useState, motion, Logo, Button, Card
 * ✅ Zero TypeScript errors, zero runtime impact
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Logo } from '@/shared/components/ui/Logo';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';

// =============================================================================
// COLOR PALETTE
// =============================================================================

const COLORS = {
  primary: [
    { name: 'Primary 900', value: '#001f3f', usage: 'Deep accents' },
    { name: 'Primary 700', value: '#003d7a', usage: 'Hover states' },
    { name: 'Primary 500', value: '#0089ff', usage: 'Main brand' },
    { name: 'Primary 300', value: '#66b3ff', usage: 'Light accents' },
    { name: 'Primary 100', value: '#e6f4ff', usage: 'Backgrounds' },
  ],
  neutral: [
    { name: 'Neutral 900', value: '#0f1419', usage: 'Text primary' },
    { name: 'Neutral 700', value: '#2d3748', usage: 'Text secondary' },
    { name: 'Neutral 500', value: '#718096', usage: 'Text muted' },
    { name: 'Neutral 300', value: '#cbd5e0', usage: 'Borders' },
    { name: 'Neutral 100', value: '#f7fafc', usage: 'Backgrounds' },
  ],
  semantic: [
    { name: 'Success', value: '#10b981', usage: 'Positive actions' },
    { name: 'Warning', value: '#f59e0b', usage: 'Caution states' },
    { name: 'Error', value: '#ef4444', usage: 'Destructive actions' },
    { name: 'Info', value: '#3b82f6', usage: 'Informational' },
  ],
};

// =============================================================================
// COMPONENT
// =============================================================================

export default function ComponentShowcase() {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const copyToClipboard = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-white/10">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(148 163 184 / 0.15) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative container-default py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20">
              <Logo size="sm" />
              <span className="text-primary-400 font-semibold">Oslira Design System</span>
            </div>
            
            <h1 className="text-6xl font-bold text-white">
              Component Showcase
            </h1>
            
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Elegant professionalism. Production-ready components built for scale.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Color Palette Section */}
      <section className="container-default py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-4xl font-bold text-white mb-4">Color System</h2>
          <p className="text-lg text-slate-400 mb-12">
            Oslira's electric blue brand identity with professional neutrals
          </p>

          <div className="space-y-12">
            {/* Primary Colors */}
            <div>
              <h3 className="text-2xl font-semibold text-white mb-6">Primary</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {COLORS.primary.map((color) => (
                  <Card
                    key={color.value}
                    className="cursor-pointer group hover:scale-105 transition-transform"
                    onClick={() => copyToClipboard(color.value)}
                  >
                    <div
                      className="h-32 rounded-lg mb-4"
                      style={{ backgroundColor: color.value }}
                    />
                    <h4 className="font-semibold text-white mb-1">{color.name}</h4>
                    <p className="text-sm text-slate-400 mb-2">{color.usage}</p>
                    <code className="text-xs text-primary-400 font-mono">
                      {copiedColor === color.value ? '✓ Copied!' : color.value}
                    </code>
                  </Card>
                ))}
              </div>
            </div>

            {/* Neutral Colors */}
            <div>
              <h3 className="text-2xl font-semibold text-white mb-6">Neutral</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {COLORS.neutral.map((color) => (
                  <Card
                    key={color.value}
                    className="cursor-pointer group hover:scale-105 transition-transform"
                    onClick={() => copyToClipboard(color.value)}
                  >
                    <div
                      className="h-32 rounded-lg mb-4 border border-white/10"
                      style={{ backgroundColor: color.value }}
                    />
                    <h4 className="font-semibold text-white mb-1">{color.name}</h4>
                    <p className="text-sm text-slate-400 mb-2">{color.usage}</p>
                    <code className="text-xs text-primary-400 font-mono">
                      {copiedColor === color.value ? '✓ Copied!' : color.value}
                    </code>
                  </Card>
                ))}
              </div>
            </div>

            {/* Semantic Colors */}
            <div>
              <h3 className="text-2xl font-semibold text-white mb-6">Semantic</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {COLORS.semantic.map((color) => (
                  <Card
                    key={color.value}
                    className="cursor-pointer group hover:scale-105 transition-transform"
                    onClick={() => copyToClipboard(color.value)}
                  >
                    <div
                      className="h-32 rounded-lg mb-4"
                      style={{ backgroundColor: color.value }}
                    />
                    <h4 className="font-semibold text-white mb-1">{color.name}</h4>
                    <p className="text-sm text-slate-400 mb-2">{color.usage}</p>
                    <code className="text-xs text-primary-400 font-mono">
                      {copiedColor === color.value ? '✓ Copied!' : color.value}
                    </code>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Button Component Section */}
      <section className="container-default py-20 border-t border-white/10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-white mb-4">Buttons</h2>
          <p className="text-lg text-slate-400 mb-12">
            Call-to-action components with multiple variants
          </p>

          <div className="space-y-12">
            {/* Variants */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-6">Variants</h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary">Primary Button</Button>
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="ghost">Ghost Button</Button>
                <Button variant="danger">Danger Button</Button>
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-6">Sizes</h3>
              <div className="flex flex-wrap items-center gap-4">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>

            {/* States */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-6">States</h3>
              <div className="flex flex-wrap gap-4">
                <Button>Default</Button>
                <Button loading>Loading</Button>
                <Button disabled>Disabled</Button>
              </div>
            </div>

            {/* Full Width */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-6">Full Width</h3>
              <Button fullWidth>Full Width Button</Button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Card Component Section */}
      <section className="container-default py-20 border-t border-white/10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-white mb-4">Cards</h2>
          <p className="text-lg text-slate-400 mb-12">
            Content containers with elevation and hover effects
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <h3 className="text-xl font-semibold text-white mb-2">Basic Card</h3>
              <p className="text-slate-400">
                Default card with standard padding and border radius
              </p>
            </Card>

            <Card className="bg-primary-500/5 border-primary-500/20">
              <h3 className="text-xl font-semibold text-white mb-2">Accent Card</h3>
              <p className="text-slate-400">
                Card with custom background and border colors
              </p>
            </Card>

            <Card className="hover:border-primary-500/50 transition-all">
              <h3 className="text-xl font-semibold text-white mb-2">Interactive Card</h3>
              <p className="text-slate-400">
                Hover to see the border color transition
              </p>
            </Card>
          </div>
        </motion.div>
      </section>

      {/* Logo Section */}
      <section className="container-default py-20 border-t border-white/10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-white mb-4">Logo</h2>
          <p className="text-lg text-slate-400 mb-12">
            Brand identity with multiple size variants
          </p>

          <div className="flex flex-wrap items-center gap-8">
            <div className="space-y-2">
              <p className="text-sm text-slate-500">Small</p>
              <Logo size="sm" />
            </div>
            <div className="space-y-2">
              <p className="text-sm text-slate-500">Medium</p>
              <Logo size="md" />
            </div>
            <div className="space-y-2">
              <p className="text-sm text-slate-500">Large</p>
              <Logo size="lg" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="container-default py-12 border-t border-white/10">
        <div className="text-center text-slate-500">
          <p>Oslira Design System · Production Grade Components</p>
          <p className="text-sm mt-2">Built with React, TypeScript, Tailwind CSS, and Framer Motion</p>
        </div>
      </footer>
    </div>
  );
}
