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
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { Logo } from '@/shared/components/ui/Logo';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Textarea } from '@/shared/components/ui/Textarea';
import { Select } from '@/shared/components/ui/Select';
import { Checkbox } from '@/shared/components/ui/Checkbox';
import { Radio } from '@/shared/components/ui/Radio';
import { Switch } from '@/shared/components/ui/Switch';
import { Label } from '@/shared/components/ui/Label';
import { Badge } from '@/shared/components/ui/Badge';
import { Avatar } from '@/shared/components/ui/Avatar';
import { Spinner } from '@/shared/components/ui/Spinner';
import { Tooltip } from '@/shared/components/ui/Tooltip';
import { Alert } from '@/shared/components/ui/Alert';
import { Progress } from '@/shared/components/ui/Progress';
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
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [radioValue, setRadioValue] = useState('option1');
  const [switchChecked, setSwitchChecked] = useState(false);
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
              <br />
              <span className="text-sm text-slate-500 italic">
                "Concert hall, not arcade; calm ocean, not storm"
              </span>
            </p>

            <div className="flex items-center justify-center gap-4 pt-6">
              <Button variant="primary" icon="mdi:github" iconPosition="left">
                View on GitHub
              </Button>
              <Button variant="ghost" icon="mdi:book-open-outline" iconPosition="left">
                Documentation
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container-default py-16 space-y-20">
        
        {/* ===================================================================
            SECTION 1: BRAND & IDENTITY
        =================================================================== */}
        <section>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Section Header */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-primary-400 font-mono text-sm">01</span>
                <h2 className="text-3xl font-bold text-white">Brand & Identity</h2>
              </div>
              <p className="text-slate-400">Core visual elements that define Oslira</p>
            </div>

            {/* Logo Variants */}
            <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
              <div className="p-8 space-y-6">
                <h3 className="text-xl font-semibold text-white">Logo</h3>
                <div className="flex items-center gap-12">
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 flex items-center justify-center bg-slate-800/50 rounded-xl">
                      <Logo size="sm" />
                    </div>
                    <span className="text-xs text-slate-500">Small (24px)</span>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="w-20 h-20 flex items-center justify-center bg-slate-800/50 rounded-xl">
                      <Logo size="md" />
                    </div>
                    <span className="text-xs text-slate-500">Medium (32px)</span>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="w-24 h-24 flex items-center justify-center bg-slate-800/50 rounded-xl">
                      <Logo size="lg" />
                    </div>
                    <span className="text-xs text-slate-500">Large (48px)</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Color Palette */}
            <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
              <div className="p-8 space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Color Palette</h3>
                  <p className="text-sm text-slate-400">Click any color to copy hex code</p>
                </div>

                {/* Primary Colors */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Primary Brand</h4>
                  <div className="grid grid-cols-5 gap-4">
                    {COLORS.primary.map((color) => (
                      <motion.button
                        key={color.value}
                        onClick={() => copyToClipboard(color.value)}
                        className="group relative"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div
                          className="h-24 rounded-xl border-2 border-slate-700 shadow-lg transition-all group-hover:shadow-xl group-hover:border-white/20"
                          style={{ backgroundColor: color.value }}
                        />
                        <div className="mt-3 space-y-1">
                          <p className="text-sm font-medium text-white">{color.name}</p>
                          <p className="text-xs text-slate-500 font-mono">{color.value}</p>
                          <p className="text-xs text-slate-600">{color.usage}</p>
                        </div>
                        {copiedColor === color.value && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute top-0 right-0 bg-green-500 text-white text-xs px-2 py-1 rounded"
                          >
                            Copied!
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Neutral Colors */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Neutral Tones</h4>
                  <div className="grid grid-cols-5 gap-4">
                    {COLORS.neutral.map((color) => (
                      <motion.button
                        key={color.value}
                        onClick={() => copyToClipboard(color.value)}
                        className="group relative"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div
                          className="h-24 rounded-xl border-2 border-slate-700 shadow-lg transition-all group-hover:shadow-xl group-hover:border-white/20"
                          style={{ backgroundColor: color.value }}
                        />
                        <div className="mt-3 space-y-1">
                          <p className="text-sm font-medium text-white">{color.name}</p>
                          <p className="text-xs text-slate-500 font-mono">{color.value}</p>
                          <p className="text-xs text-slate-600">{color.usage}</p>
                        </div>
                        {copiedColor === color.value && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute top-0 right-0 bg-green-500 text-white text-xs px-2 py-1 rounded"
                          >
                            Copied!
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Semantic Colors */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Semantic Colors</h4>
                  <div className="grid grid-cols-4 gap-4">
                    {COLORS.semantic.map((color) => (
                      <motion.button
                        key={color.value}
                        onClick={() => copyToClipboard(color.value)}
                        className="group relative"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div
                          className="h-24 rounded-xl border-2 border-slate-700 shadow-lg transition-all group-hover:shadow-xl group-hover:border-white/20"
                          style={{ backgroundColor: color.value }}
                        />
                        <div className="mt-3 space-y-1">
                          <p className="text-sm font-medium text-white">{color.name}</p>
                          <p className="text-xs text-slate-500 font-mono">{color.value}</p>
                          <p className="text-xs text-slate-600">{color.usage}</p>
                        </div>
                        {copiedColor === color.value && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute top-0 right-0 bg-green-500 text-white text-xs px-2 py-1 rounded"
                          >
                            Copied!
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </section>

        {/* ===================================================================
            SECTION 2: BUTTONS & ACTIONS
        =================================================================== */}
        <section>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Section Header */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-primary-400 font-mono text-sm">02</span>
                <h2 className="text-3xl font-bold text-white">Buttons & Actions</h2>
              </div>
              <p className="text-slate-400">Interactive elements that drive user actions</p>
            </div>

            <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
              <div className="p-8 space-y-8">
                {/* Variants */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Variants</h4>
                  <div className="flex items-center gap-4 flex-wrap">
                    <Button variant="primary">Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="danger">Danger</Button>
                  </div>
                </div>

                {/* Sizes */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Sizes</h4>
                  <div className="flex items-center gap-4">
                    <Button size="sm">Small</Button>
                    <Button size="md">Medium</Button>
                    <Button size="lg">Large</Button>
                  </div>
                </div>

                {/* With Icons */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">With Icons</h4>
                  <div className="flex items-center gap-4 flex-wrap">
                    <Button icon="mdi:plus" iconPosition="left">Add Lead</Button>
                    <Button icon="mdi:arrow-right" iconPosition="right">Continue</Button>
                    <Button icon="mdi:star" iconPosition="only" />
                  </div>
                </div>

                {/* States */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">States</h4>
                  <div className="flex items-center gap-4 flex-wrap">
                    <Button loading>Loading...</Button>
                    <Button disabled>Disabled</Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </section>

        {/* Continue with other sections... */}
        {/* I'll add Form Inputs section next */}

      </div>
    </div>
  );
}
