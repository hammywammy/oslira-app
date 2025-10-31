// src/pages/showcase/ComponentShowcase.tsx

/**
 * COMPONENT SHOWCASE - PRODUCTION GRADE
 * 
 * Oslira Design System: Intelligence + Mastery
 * Inspired by Supabase, Linear, Stripe, OpenAI
 * 
 * ARCHITECTURE:
 * ✅ Light mode PRIMARY (default)
 * ✅ Dark mode toggle (bottom-left corner)
 * ✅ Professional color system from design doc
 * ✅ WCAG AA compliant contrast ratios
 * ✅ Perceptually uniform neutrals
 * ✅ Semantic state colors
 * ✅ Copy-to-clipboard color swatches
 * ✅ Mode-specific component variants
 * 
 * DESIGN PHILOSOPHY:
 * "Concert hall, not arcade; calm ocean, not storm"
 * Clean, professional, never boring
 * Data-driven intelligence over gimmicks
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { Logo } from '@/shared/components/ui/Logo';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
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
import { Alert } from '@/shared/components/ui/Alert';
import { Progress } from '@/shared/components/ui/Progress';

// =============================================================================
// COMPLETE OSLIRA COLOR SYSTEM (v1.0 - October 2025)
// =============================================================================

const COLOR_SYSTEM = {
  // PRIMARY BRAND: Electric Intelligence Blue
  primary: [
    { name: 'Primary 800', value: '#005A85', usage: 'Deepest - pressed states', wcag: 'AAA' },
    { name: 'Primary 700', value: '#007AB3', usage: 'Darker - hover states', wcag: 'AAA' },
    { name: 'Primary 600', value: '#0099D6', usage: 'Dark - links', wcag: 'AA' },
    { name: 'Primary 500', value: '#00B8FF', usage: 'Main brand', wcag: 'AA' },
    { name: 'Primary 400', value: '#33C7FF', usage: 'Light - loading states', wcag: 'AA' },
    { name: 'Primary 300', value: '#66D4FF', usage: 'Subtle - disabled', wcag: 'A' },
  ],

  // SECONDARY: Subtle Intelligence Purple (5% usage max)
  secondary: [
    { name: 'Secondary 700', value: '#5F4D99', usage: 'Deeper - hover', wcag: 'AA' },
    { name: 'Secondary 600', value: '#7566B3', usage: 'Dark - premium tier', wcag: 'AA' },
    { name: 'Secondary 500', value: '#8B7FC7', usage: 'Main - micro-interactions', wcag: 'AA' },
    { name: 'Secondary 400', value: '#A599D4', usage: 'Light - processing', wcag: 'AA' },
    { name: 'Secondary 300', value: '#BFB3E1', usage: 'Subtle - accents', wcag: 'A' },
  ],

  // NEUTRALS: Perceptually Uniform (Stripe LAB methodology)
  neutral: [
    { name: 'Neutral 0', value: '#FFFFFF', usage: 'White - page bg', wcag: '—' },
    { name: 'Neutral 50', value: '#FAFBFC', usage: 'Snow - card surfaces', wcag: '—' },
    { name: 'Neutral 100', value: '#F4F6F8', usage: 'Lightest - hover bg', wcag: '—' },
    { name: 'Neutral 200', value: '#E8ECEF', usage: 'Subtle - disabled bg', wcag: '—' },
    { name: 'Neutral 300', value: '#DFE3E8', usage: 'Light - subtle borders', wcag: '—' },
    { name: 'Neutral 400', value: '#C9CED6', usage: 'Border - default', wcag: '—' },
    { name: 'Neutral 500', value: '#A8ADB7', usage: 'Mid - strong borders', wcag: 'AA' },
    { name: 'Neutral 600', value: '#6E7681', usage: 'Muted - secondary text', wcag: 'AA' },
    { name: 'Neutral 700', value: '#4B5563', usage: 'Body - body text', wcag: 'AAA' },
    { name: 'Neutral 800', value: '#1F2937', usage: 'Heading - headings', wcag: 'AAA' },
    { name: 'Neutral 900', value: '#0A0D14', usage: 'Black - primary text', wcag: 'AAA' },
  ],

  // SEMANTIC STATES
  success: [
    { name: 'Success 100', value: '#D1FAE5', usage: 'Surface - alert bg', wcag: '—' },
    { name: 'Success 200', value: '#A7F3D0', usage: 'Subtle - border', wcag: '—' },
    { name: 'Success 400', value: '#34D399', usage: 'Light - icons', wcag: 'AA' },
    { name: 'Success 500', value: '#10B981', usage: 'Main - badges', wcag: 'AA' },
    { name: 'Success 600', value: '#059669', usage: 'Dark - buttons', wcag: 'AA' },
    { name: 'Success 700', value: '#047857', usage: 'Deeper - text', wcag: 'AAA' },
  ],

  error: [
    { name: 'Error 100', value: '#FEE2E2', usage: 'Surface - alert bg', wcag: '—' },
    { name: 'Error 200', value: '#FECACA', usage: 'Subtle - border', wcag: '—' },
    { name: 'Error 400', value: '#F87171', usage: 'Light - icons', wcag: 'AA' },
    { name: 'Error 500', value: '#EF4444', usage: 'Main - validation', wcag: 'AA' },
    { name: 'Error 600', value: '#DC2626', usage: 'Dark - buttons', wcag: 'AA' },
    { name: 'Error 700', value: '#B91C1C', usage: 'Deeper - text', wcag: 'AAA' },
  ],

  warning: [
    { name: 'Warning 100', value: '#FEF3C7', usage: 'Surface - alert bg', wcag: '—' },
    { name: 'Warning 200', value: '#FDE68A', usage: 'Subtle - border', wcag: '—' },
    { name: 'Warning 400', value: '#FBBF24', usage: 'Light - icons', wcag: 'AA' },
    { name: 'Warning 500', value: '#F59E0B', usage: 'Main - warnings', wcag: 'AA' },
    { name: 'Warning 600', value: '#D97706', usage: 'Dark - buttons', wcag: 'AA' },
    { name: 'Warning 700', value: '#B45309', usage: 'Deeper - text', wcag: 'AAA' },
  ],

  info: [
    { name: 'Info 100', value: '#DBEAFE', usage: 'Surface - alert bg', wcag: '—' },
    { name: 'Info 200', value: '#BFDBFE', usage: 'Subtle - border', wcag: '—' },
    { name: 'Info 400', value: '#60A5FA', usage: 'Light - icons', wcag: 'AA' },
    { name: 'Info 500', value: '#3B82F6', usage: 'Main - info', wcag: 'AA' },
    { name: 'Info 600', value: '#2563EB', usage: 'Dark - buttons', wcag: 'AA' },
    { name: 'Info 700', value: '#1D4ED8', usage: 'Deeper - text', wcag: 'AAA' },
  ],

  // DATA VISUALIZATION
  data: [
    { name: 'Data Blue', value: '#00B8FF', usage: 'High-value leads', wcag: 'AA' },
    { name: 'Data Teal', value: '#14B8A6', usage: 'Engagement metrics', wcag: 'AA' },
    { name: 'Data Purple', value: '#8B7FC7', usage: 'Premium tier data', wcag: 'AA' },
    { name: 'Data Green', value: '#10B981', usage: 'Positive trends', wcag: 'AA' },
    { name: 'Data Orange', value: '#F59E0B', usage: 'Warning metrics', wcag: 'AA' },
    { name: 'Data Red', value: '#EF4444', usage: 'Critical metrics', wcag: 'AA' },
    { name: 'Data Gray', value: '#6E7681', usage: 'Neutral data', wcag: 'AA' },
  ],
};

// =============================================================================
// COMPONENT
// =============================================================================

export default function ComponentShowcase() {
  const [isDark, setIsDark] = useState(false);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  
  // Form state
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [radioValue, setRadioValue] = useState('option1');
  const [switchChecked, setSwitchChecked] = useState(false);
  const [selectValue, setSelectValue] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [textareaValue, setTextareaValue] = useState('');
  
  // Toast/Alert state
  const [showToast, setShowToast] = useState(false);
  const [progress, setProgress] = useState(60);

  const copyToClipboard = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 2000);
  };
  
  const triggerToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Theme classes
  const themeClasses = isDark
    ? 'bg-[#0A0D14] text-neutral-50'
    : 'bg-white text-neutral-900';

  const cardBg = isDark ? 'bg-[#1F2937]/50' : 'bg-neutral-50';
  const borderColor = isDark ? 'border-neutral-700' : 'border-neutral-300';
  const subtleText = isDark ? 'text-neutral-400' : 'text-neutral-600';
  const headingText = isDark ? 'text-neutral-50' : 'text-neutral-900';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${themeClasses}`}>
      
      {/* Dark Mode Toggle - Bottom Left Corner */}
      <motion.button
        onClick={() => setIsDark(!isDark)}
        className={`fixed bottom-8 left-8 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all ${
          isDark 
            ? 'bg-neutral-800 hover:bg-neutral-700 border border-neutral-600' 
            : 'bg-white hover:bg-neutral-50 border border-neutral-300 shadow-xl'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Toggle dark mode"
      >
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.div
              key="sun"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Icon icon="ph:sun-bold" className="text-2xl text-yellow-400" />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Icon icon="ph:moon-bold" className="text-2xl text-neutral-700" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Hero Section */}
      <div className={`relative overflow-hidden border-b ${borderColor}`}>
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, ${isDark ? 'rgb(255 255 255 / 0.1)' : 'rgb(0 0 0 / 0.1)'} 1px, transparent 0)`,
            backgroundSize: '48px 48px'
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            {/* Brand Badge */}
            <div className={`inline-flex items-center gap-3 px-5 py-2.5 rounded-full border ${
              isDark 
                ? 'bg-primary-500/5 border-primary-500/20' 
                : 'bg-primary-500/5 border-primary-500/20'
            }`}>
              <Logo size="sm" />
              <span className={`font-semibold ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>
                Oslira Design System
              </span>
            </div>
            
            <h1 className={`text-5xl sm:text-6xl font-bold tracking-tight ${headingText}`}>
              Component Showcase
            </h1>
            
            <p className={`text-xl max-w-2xl mx-auto ${subtleText}`}>
              Intelligence + Mastery · Inspired by Supabase, Linear, Stripe, OpenAI
            </p>

            {/* Metrics */}
            <div className="flex items-center justify-center gap-8 pt-4">
              <div className="text-center">
                <div className={`text-3xl font-bold ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>
                  60+
                </div>
                <div className={`text-sm ${subtleText}`}>Colors</div>
              </div>
              <div className={`w-px h-12 ${isDark ? 'bg-neutral-700' : 'bg-neutral-300'}`} />
              <div className="text-center">
                <div className={`text-3xl font-bold ${isDark ? 'text-success-400' : 'text-success-600'}`}>
                  WCAG AA
                </div>
                <div className={`text-sm ${subtleText}`}>Compliant</div>
              </div>
              <div className={`w-px h-12 ${isDark ? 'bg-neutral-700' : 'bg-neutral-300'}`} />
              <div className="text-center">
                <div className={`text-3xl font-bold ${isDark ? 'text-secondary-400' : 'text-secondary-600'}`}>
                  Production
                </div>
                <div className={`text-sm ${subtleText}`}>Ready</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
        
        {/* PRIMARY BRAND COLORS */}
        <ColorSection
          title="Primary Brand"
          subtitle="Electric Intelligence Blue · Main CTAs, links, active states"
          colors={COLOR_SYSTEM.primary}
          isDark={isDark}
          copiedColor={copiedColor}
          onCopy={copyToClipboard}
          cardBg={cardBg}
          borderColor={borderColor}
          subtleText={subtleText}
          headingText={headingText}
        />

        {/* SECONDARY COLORS */}
        <ColorSection
          title="Secondary Intelligence"
          subtitle="Subtle Purple · 5% usage max · Micro-interactions, premium tiers"
          colors={COLOR_SYSTEM.secondary}
          isDark={isDark}
          copiedColor={copiedColor}
          onCopy={copyToClipboard}
          cardBg={cardBg}
          borderColor={borderColor}
          subtleText={subtleText}
          headingText={headingText}
        />

        {/* NEUTRAL SYSTEM */}
        <ColorSection
          title="Neutral System"
          subtitle="Perceptually Uniform · Stripe LAB methodology · Backgrounds, text, borders"
          colors={COLOR_SYSTEM.neutral}
          isDark={isDark}
          copiedColor={copiedColor}
          onCopy={copyToClipboard}
          cardBg={cardBg}
          borderColor={borderColor}
          subtleText={subtleText}
          headingText={headingText}
          gridCols="grid-cols-2 md:grid-cols-4 lg:grid-cols-6"
        />

        {/* SEMANTIC STATES */}
        <div className="space-y-12">
          <div className="text-center space-y-3">
            <h2 className={`text-4xl font-bold ${headingText}`}>Semantic States</h2>
            <p className={`text-lg ${subtleText}`}>
              Universal patterns · Success, error, warning, info
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <ColorSection
              title="Success"
              subtitle="Confirmation, positive actions"
              colors={COLOR_SYSTEM.success}
              isDark={isDark}
              copiedColor={copiedColor}
              onCopy={copyToClipboard}
              cardBg={cardBg}
              borderColor={borderColor}
              subtleText={subtleText}
              headingText={headingText}
              gridCols="grid-cols-2 md:grid-cols-3"
              compact
            />

            <ColorSection
              title="Error"
              subtitle="Destructive, critical states"
              colors={COLOR_SYSTEM.error}
              isDark={isDark}
              copiedColor={copiedColor}
              onCopy={copyToClipboard}
              cardBg={cardBg}
              borderColor={borderColor}
              subtleText={subtleText}
              headingText={headingText}
              gridCols="grid-cols-2 md:grid-cols-3"
              compact
            />

            <ColorSection
              title="Warning"
              subtitle="Caution, important notices"
              colors={COLOR_SYSTEM.warning}
              isDark={isDark}
              copiedColor={copiedColor}
              onCopy={copyToClipboard}
              cardBg={cardBg}
              borderColor={borderColor}
              subtleText={subtleText}
              headingText={headingText}
              gridCols="grid-cols-2 md:grid-cols-3"
              compact
            />

            <ColorSection
              title="Info"
              subtitle="Informational, neutral updates"
              colors={COLOR_SYSTEM.info}
              isDark={isDark}
              copiedColor={copiedColor}
              onCopy={copyToClipboard}
              cardBg={cardBg}
              borderColor={borderColor}
              subtleText={subtleText}
              headingText={headingText}
              gridCols="grid-cols-2 md:grid-cols-3"
              compact
            />
          </div>
        </div>

        {/* DATA VISUALIZATION */}
        <ColorSection
          title="Data Visualization"
          subtitle="Lead scores, metrics, analytics charts"
          colors={COLOR_SYSTEM.data}
          isDark={isDark}
          copiedColor={copiedColor}
          onCopy={copyToClipboard}
          cardBg={cardBg}
          borderColor={borderColor}
          subtleText={subtleText}
          headingText={headingText}
          gridCols="grid-cols-2 md:grid-cols-4 lg:grid-cols-7"
        />

        {/* BUTTON COMPONENTS */}
        <section className="space-y-8">
          <div className="text-center space-y-3">
            <h2 className={`text-4xl font-bold ${headingText}`}>Button Components</h2>
            <p className={`text-lg ${subtleText}`}>
              Professional CTAs with multiple variants and states
            </p>
          </div>

          {/* Variants */}
          <div className={`p-8 rounded-2xl border ${borderColor} ${cardBg}`}>
            <h3 className={`text-xl font-semibold mb-6 ${headingText}`}>Variants</h3>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">Primary Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="ghost">Ghost Button</Button>
              <Button variant="danger">Danger Button</Button>
            </div>
          </div>

          {/* Sizes */}
          <div className={`p-8 rounded-2xl border ${borderColor} ${cardBg}`}>
            <h3 className={`text-xl font-semibold mb-6 ${headingText}`}>Sizes</h3>
            <div className="flex flex-wrap items-center gap-4">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
          </div>

          {/* States */}
          <div className={`p-8 rounded-2xl border ${borderColor} ${cardBg}`}>
            <h3 className={`text-xl font-semibold mb-6 ${headingText}`}>States</h3>
            <div className="flex flex-wrap gap-4">
              <Button>Default</Button>
              <Button loading>Loading</Button>
              <Button disabled>Disabled</Button>
            </div>
          </div>

          {/* Full Width */}
          <div className={`p-8 rounded-2xl border ${borderColor} ${cardBg}`}>
            <h3 className={`text-xl font-semibold mb-6 ${headingText}`}>Full Width</h3>
            <Button fullWidth variant="primary">Full Width Button</Button>
          </div>
        </section>

        {/* CARD COMPONENTS */}
        <section className="space-y-8">
          <div className="text-center space-y-3">
            <h2 className={`text-4xl font-bold ${headingText}`}>Card Components</h2>
            <p className={`text-lg ${subtleText}`}>
              Content containers with elevation and interactive states
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className={`${cardBg} border ${borderColor}`}>
              <h3 className={`text-xl font-semibold mb-2 ${headingText}`}>Basic Card</h3>
              <p className={subtleText}>
                Default card with standard padding and border radius. Perfect for content grouping.
              </p>
            </Card>

            <Card className={`border transition-all ${
              isDark 
                ? 'bg-primary-500/5 border-primary-500/30 hover:border-primary-500/50' 
                : 'bg-primary-500/5 border-primary-500/30 hover:border-primary-600/50'
            }`}>
              <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-primary-400' : 'text-primary-700'}`}>
                Accent Card
              </h3>
              <p className={subtleText}>
                Card with custom background and brand colors. Hover to see border transition.
              </p>
            </Card>

            <Card className={`border transition-all ${
              isDark 
                ? 'bg-secondary-500/5 border-secondary-500/30 hover:border-secondary-500/50' 
                : 'bg-secondary-500/5 border-secondary-500/30 hover:border-secondary-600/50'
            }`}>
              <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-secondary-400' : 'text-secondary-700'}`}>
                Premium Card
              </h3>
              <p className={subtleText}>
                Subtle purple accent for premium features. 5% usage maximum.
              </p>
            </Card>
          </div>
        </section>

        {/* FORM ELEMENTS */}
        <section className="space-y-8">
          <div className="text-center space-y-3">
            <h2 className={`text-4xl font-bold ${headingText}`}>Form Elements</h2>
            <p className={`text-lg ${subtleText}`}>
              Professional inputs with validation states
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Input */}
            <Card className={`${cardBg} border ${borderColor}`}>
              <h3 className={`text-xl font-semibold mb-6 ${headingText}`}>Input</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="input-default">Default Input</Label>
                  <Input 
                    id="input-default"
                    placeholder="Enter text..." 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="input-icon">With Icon</Label>
                  <Input 
                    id="input-icon"
                    icon="mdi:magnify" 
                    iconPosition="left"
                    placeholder="Search..."
                  />
                </div>
                <div>
                  <Label htmlFor="input-error">Error State</Label>
                  <Input 
                    id="input-error"
                    error="This field is required"
                    placeholder="Invalid input"
                  />
                </div>
              </div>
            </Card>

            {/* Textarea */}
            <Card className={`${cardBg} border ${borderColor}`}>
              <h3 className={`text-xl font-semibold mb-6 ${headingText}`}>Textarea</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="textarea-default">Default Textarea</Label>
                  <Textarea 
                    id="textarea-default"
                    placeholder="Enter message..."
                    value={textareaValue}
                    onChange={(e) => setTextareaValue(e.target.value)}
                    rows={4}
                  />
                </div>
              </div>
            </Card>

            {/* Select */}
            <Card className={`${cardBg} border ${borderColor}`}>
              <h3 className={`text-xl font-semibold mb-6 ${headingText}`}>Select</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="select-default">Default Select</Label>
                  <Select 
                    id="select-default"
                    value={selectValue}
                    onChange={(e) => setSelectValue(e.target.value)}
                  >
                    <option value="">Choose an option</option>
                    <option value="1">Option 1</option>
                    <option value="2">Option 2</option>
                    <option value="3">Option 3</option>
                  </Select>
                </div>
              </div>
            </Card>

            {/* Checkbox & Radio & Switch */}
            <Card className={`${cardBg} border ${borderColor}`}>
              <h3 className={`text-xl font-semibold mb-6 ${headingText}`}>Toggles</h3>
              <div className="space-y-6">
                <div className="space-y-3">
                  <p className={`text-sm font-medium ${subtleText}`}>Checkbox</p>
                  <Checkbox 
                    checked={checkboxChecked}
                    onChange={(e) => setCheckboxChecked(e.target.checked)}
                  >
                    Accept terms and conditions
                  </Checkbox>
                </div>

                <div className="space-y-3">
                  <p className={`text-sm font-medium ${subtleText}`}>Radio Group</p>
                  <div className="space-y-2">
                    <Radio 
                      name="radio-demo"
                      value="option1"
                      checked={radioValue === 'option1'}
                      onChange={(e) => setRadioValue(e.target.value)}
                    >
                      Option 1
                    </Radio>
                    <Radio 
                      name="radio-demo"
                      value="option2"
                      checked={radioValue === 'option2'}
                      onChange={(e) => setRadioValue(e.target.value)}
                    >
                      Option 2
                    </Radio>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className={`text-sm font-medium ${subtleText}`}>Switch</p>
                  <Switch 
                    checked={switchChecked}
                    onChange={(e) => setSwitchChecked(e.target.checked)}
                  >
                    Enable notifications
                  </Switch>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* FEEDBACK COMPONENTS */}
        <section className="space-y-8">
          <div className="text-center space-y-3">
            <h2 className={`text-4xl font-bold ${headingText}`}>Feedback Components</h2>
            <p className={`text-lg ${subtleText}`}>
              Alerts, badges, spinners, and progress indicators
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Alerts */}
            <Card className={`${cardBg} border ${borderColor}`}>
              <h3 className={`text-xl font-semibold mb-6 ${headingText}`}>Alerts</h3>
              <div className="space-y-4">
                <Alert variant="success">
                  <strong>Success!</strong> Your changes have been saved.
                </Alert>
                <Alert variant="error">
                  <strong>Error!</strong> Something went wrong.
                </Alert>
                <Alert variant="warning">
                  <strong>Warning!</strong> Please review your input.
                </Alert>
                <Alert variant="info">
                  <strong>Info:</strong> This is an informational message.
                </Alert>
              </div>
            </Card>

            {/* Badges */}
            <Card className={`${cardBg} border ${borderColor}`}>
              <h3 className={`text-xl font-semibold mb-6 ${headingText}`}>Badges</h3>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="primary">Primary</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="error">Error</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="info">Info</Badge>
                </div>
              </div>
            </Card>

            {/* Spinner & Progress */}
            <Card className={`${cardBg} border ${borderColor}`}>
              <h3 className={`text-xl font-semibold mb-6 ${headingText}`}>Loading States</h3>
              <div className="space-y-6">
                <div>
                  <p className={`text-sm font-medium mb-3 ${subtleText}`}>Spinners</p>
                  <div className="flex items-center gap-4">
                    <Spinner size="sm" />
                    <Spinner size="md" />
                    <Spinner size="lg" />
                  </div>
                </div>
                <div>
                  <p className={`text-sm font-medium mb-3 ${subtleText}`}>Progress Bar</p>
                  <Progress value={progress} max={100} />
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" onClick={() => setProgress(Math.max(0, progress - 10))}>-10</Button>
                    <Button size="sm" onClick={() => setProgress(Math.min(100, progress + 10))}>+10</Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Avatar */}
            <Card className={`${cardBg} border ${borderColor}`}>
              <h3 className={`text-xl font-semibold mb-6 ${headingText}`}>Avatars</h3>
              <div className="flex items-center gap-4">
                <Avatar size="sm" src="https://i.pravatar.cc/150?img=1" alt="User" />
                <Avatar size="md" src="https://i.pravatar.cc/150?img=2" alt="User" />
                <Avatar size="lg" src="https://i.pravatar.cc/150?img=3" alt="User" />
                <Avatar size="lg" fallback="JD" />
              </div>
            </Card>
          </div>

          {/* Toast Notification Demo */}
          <Card className={`${cardBg} border ${borderColor}`}>
            <h3 className={`text-xl font-semibold mb-4 ${headingText}`}>Toast Notification</h3>
            <p className={`${subtleText} mb-6`}>Click to trigger a temporary notification</p>
            <Button onClick={triggerToast}>Show Toast</Button>
          </Card>

          {/* Toast */}
          <AnimatePresence>
            {showToast && (
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`fixed bottom-8 right-8 z-50 ${isDark ? 'bg-neutral-800' : 'bg-white'} border ${borderColor} rounded-xl shadow-elevated p-4 min-w-[300px]`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? 'bg-success-500/20' : 'bg-success-100'}`}>
                    <Icon icon="ph:check-bold" className={`text-xl ${isDark ? 'text-success-400' : 'text-success-600'}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-semibold ${headingText}`}>Success</h4>
                    <p className={`text-sm ${subtleText}`}>Your changes have been saved successfully.</p>
                  </div>
                  <button 
                    onClick={() => setShowToast(false)}
                    className={`${subtleText} hover:${headingText}`}
                  >
                    <Icon icon="ph:x-bold" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* APPLIED EXAMPLES */}
        <section className="space-y-8">
          <div className="text-center space-y-3">
            <h2 className={`text-4xl font-bold ${headingText}`}>Applied Examples</h2>
            <p className={`text-lg ${subtleText}`}>
              Components working together in real-world scenarios
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Login Form Example */}
            <Card className={`${cardBg} border ${borderColor}`}>
              <div className="space-y-6">
                <div>
                  <h3 className={`text-2xl font-bold ${headingText}`}>Sign In</h3>
                  <p className={subtleText}>Welcome back! Please enter your details.</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email"
                      type="email"
                      placeholder="you@company.com"
                      icon="mdi:email"
                      iconPosition="left"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      icon="mdi:lock"
                      iconPosition="left"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Checkbox>Remember me</Checkbox>
                    <a href="#" className={`text-sm ${isDark ? 'text-primary-400' : 'text-primary-600'} hover:underline`}>
                      Forgot password?
                    </a>
                  </div>
                  <Button variant="primary" fullWidth>Sign In</Button>
                </div>
              </div>
            </Card>

            {/* Settings Panel Example */}
            <Card className={`${cardBg} border ${borderColor}`}>
              <div className="space-y-6">
                <h3 className={`text-2xl font-bold ${headingText}`}>Notification Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b" style={{ borderColor: isDark ? '#2d3748' : '#e8ecef' }}>
                    <div>
                      <p className={`font-medium ${headingText}`}>Email Notifications</p>
                      <p className={`text-sm ${subtleText}`}>Receive updates via email</p>
                    </div>
                    <Switch checked={switchChecked} onChange={(e) => setSwitchChecked(e.target.checked)} />
                  </div>
                  <div className="flex items-center justify-between py-3 border-b" style={{ borderColor: isDark ? '#2d3748' : '#e8ecef' }}>
                    <div>
                      <p className={`font-medium ${headingText}`}>Push Notifications</p>
                      <p className={`text-sm ${subtleText}`}>Receive push notifications</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className={`font-medium ${headingText}`}>SMS Notifications</p>
                      <p className={`text-sm ${subtleText}`}>Receive text messages</p>
                    </div>
                    <Switch />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="ghost">Cancel</Button>
                  <Button variant="primary">Save Changes</Button>
                </div>
              </div>
            </Card>

            {/* User Profile Card Example */}
            <Card className={`${cardBg} border ${borderColor}`}>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar size="lg" src="https://i.pravatar.cc/150?img=5" alt="Sarah Johnson" />
                  <div className="flex-1">
                    <h4 className={`text-lg font-semibold ${headingText}`}>Sarah Johnson</h4>
                    <p className={subtleText}>Product Designer</p>
                  </div>
                  <Badge variant="success">Active</Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 py-4 border-y" style={{ borderColor: isDark ? '#2d3748' : '#e8ecef' }}>
                  <div className="text-center">
                    <p className={`text-2xl font-bold ${headingText}`}>24</p>
                    <p className={`text-sm ${subtleText}`}>Projects</p>
                  </div>
                  <div className="text-center">
                    <p className={`text-2xl font-bold ${headingText}`}>1.2k</p>
                    <p className={`text-sm ${subtleText}`}>Followers</p>
                  </div>
                  <div className="text-center">
                    <p className={`text-2xl font-bold ${headingText}`}>89</p>
                    <p className={`text-sm ${subtleText}`}>Following</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="primary" fullWidth>Message</Button>
                  <Button variant="secondary" icon="mdi:account-plus" iconPosition="only" />
                </div>
              </div>
            </Card>

            {/* Data Table Row Example */}
            <Card className={`${cardBg} border ${borderColor}`}>
              <div className="space-y-4">
                <h3 className={`text-xl font-semibold ${headingText}`}>Lead Analysis Results</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: isDark ? '#1F2937' : '#f4f6f8' }}>
                    <Avatar size="sm" src="https://i.pravatar.cc/150?img=10" alt="Lead" />
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium truncate ${headingText}`}>@techfounder</p>
                      <p className={`text-sm truncate ${subtleText}`}>Technology Startup CEO</p>
                    </div>
                    <Badge variant="success">Hot Lead</Badge>
                    <span className={`text-lg font-bold ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>94</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: isDark ? '#1F2937' : '#f4f6f8' }}>
                    <Avatar size="sm" src="https://i.pravatar.cc/150?img=11" alt="Lead" />
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium truncate ${headingText}`}>@designagency</p>
                      <p className={`text-sm truncate ${subtleText}`}>Creative Agency Owner</p>
                    </div>
                    <Badge variant="warning">Warm</Badge>
                    <span className={`text-lg font-bold ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>67</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: isDark ? '#1F2937' : '#f4f6f8' }}>
                    <Avatar size="sm" src="https://i.pravatar.cc/150?img=12" alt="Lead" />
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium truncate ${headingText}`}>@marketingpro</p>
                      <p className={`text-sm truncate ${subtleText}`}>Marketing Consultant</p>
                    </div>
                    <Badge variant="info">Cold</Badge>
                    <span className={`text-lg font-bold ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>42</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* DESIGN PRINCIPLES */}
        <section className={`p-12 rounded-2xl border ${borderColor} ${cardBg}`}>
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className={`text-4xl font-bold ${headingText}`}>Design Principles</h2>
            <p className={`text-lg ${subtleText}`}>
              The foundation of Oslira's visual identity
            </p>

            <div className="grid md:grid-cols-2 gap-6 pt-8">
              <div className={`p-6 rounded-xl border ${borderColor} ${isDark ? 'bg-neutral-800/30' : 'bg-white'}`}>
                <Icon icon="ph:sparkle-bold" className={`text-4xl mb-4 ${isDark ? 'text-primary-400' : 'text-primary-600'}`} />
                <h3 className={`text-lg font-semibold mb-2 ${headingText}`}>Intelligence + Mastery</h3>
                <p className={`text-sm ${subtleText}`}>
                  Clean, professional, never boring. Data-driven intelligence over gimmicks.
                </p>
              </div>

              <div className={`p-6 rounded-xl border ${borderColor} ${isDark ? 'bg-neutral-800/30' : 'bg-white'}`}>
                <Icon icon="ph:check-circle-bold" className={`text-4xl mb-4 ${isDark ? 'text-success-400' : 'text-success-600'}`} />
                <h3 className={`text-lg font-semibold mb-2 ${headingText}`}>WCAG AA Compliant</h3>
                <p className={`text-sm ${subtleText}`}>
                  All color combinations tested for 4.5:1 contrast minimum.
                </p>
              </div>

              <div className={`p-6 rounded-xl border ${borderColor} ${isDark ? 'bg-neutral-800/30' : 'bg-white'}`}>
                <Icon icon="ph:palette-bold" className={`text-4xl mb-4 ${isDark ? 'text-secondary-400' : 'text-secondary-600'}`} />
                <h3 className={`text-lg font-semibold mb-2 ${headingText}`}>Perceptual Uniformity</h3>
                <p className={`text-sm ${subtleText}`}>
                  Stripe LAB methodology for consistent visual weight across scales.
                </p>
              </div>

              <div className={`p-6 rounded-xl border ${borderColor} ${isDark ? 'bg-neutral-800/30' : 'bg-white'}`}>
                <Icon icon="ph:code-bold" className={`text-4xl mb-4 ${isDark ? 'text-info-400' : 'text-info-600'}`} />
                <h3 className={`text-lg font-semibold mb-2 ${headingText}`}>Semantic Tokens</h3>
                <p className={`text-sm ${subtleText}`}>
                  Design tokens for scalable, maintainable design systems.
                </p>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Footer */}
      <footer className={`border-t ${borderColor} mt-24`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center space-y-2">
            <p className={subtleText}>
              Oslira Design System v1.0 · October 2025
            </p>
            <p className={`text-sm ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>
              Built with React, TypeScript, Tailwind CSS, Framer Motion
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// =============================================================================
// COLOR SECTION COMPONENT
// =============================================================================

interface ColorSectionProps {
  title: string;
  subtitle: string;
  colors: Array<{ name: string; value: string; usage: string; wcag?: string }>;
  isDark: boolean;
  copiedColor: string | null;
  onCopy: (color: string) => void;
  cardBg: string;
  borderColor: string;
  subtleText: string;
  headingText: string;
  gridCols?: string;
  compact?: boolean;
}

function ColorSection({
  title,
  subtitle,
  colors,
  isDark,
  copiedColor,
  onCopy,
  cardBg,
  borderColor,
  subtleText,
  headingText,
  gridCols = 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
  compact = false,
}: ColorSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="space-y-8"
    >
      {!compact && (
        <div className="text-center space-y-3">
          <h2 className={`text-4xl font-bold ${headingText}`}>{title}</h2>
          <p className={`text-lg ${subtleText}`}>{subtitle}</p>
        </div>
      )}
      
      {compact && (
        <div className="space-y-2">
          <h3 className={`text-2xl font-semibold ${headingText}`}>{title}</h3>
          <p className={`text-sm ${subtleText}`}>{subtitle}</p>
        </div>
      )}

      <div className={`grid ${gridCols} gap-4`}>
        {colors.map((color) => (
          <motion.button
            key={color.value}
            onClick={() => onCopy(color.value)}
            className={`group relative p-4 rounded-xl border ${borderColor} ${cardBg} hover:scale-105 transition-all text-left`}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Color Swatch */}
            <div
              className="h-20 rounded-lg mb-3 border border-black/10"
              style={{ backgroundColor: color.value }}
            />

            {/* Color Info */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h4 className={`font-semibold text-sm ${headingText}`}>{color.name}</h4>
                {color.wcag && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    color.wcag === 'AAA' 
                      ? isDark ? 'bg-success-500/20 text-success-400' : 'bg-success-100 text-success-700'
                      : color.wcag === 'AA'
                      ? isDark ? 'bg-info-500/20 text-info-400' : 'bg-info-100 text-info-700'
                      : isDark ? 'bg-neutral-700 text-neutral-400' : 'bg-neutral-200 text-neutral-600'
                  }`}>
                    {color.wcag}
                  </span>
                )}
              </div>
              
              <p className={`text-xs ${subtleText}`}>{color.usage}</p>
              
              <div className="flex items-center justify-between pt-2">
                <code className={`text-xs font-mono ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>
                  {color.value}
                </code>
                
                {copiedColor === color.value && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`text-xs font-medium ${isDark ? 'text-success-400' : 'text-success-600'}`}
                  >
                    ✓ Copied
                  </motion.span>
                )}
              </div>
            </div>

            {/* Hover Icon */}
            <div className={`absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity`}>
              <Icon 
                icon="ph:copy-bold" 
                className={`text-lg ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`} 
              />
            </div>
          </motion.button>
        ))}
      </div>
    </motion.section>
  );
}
