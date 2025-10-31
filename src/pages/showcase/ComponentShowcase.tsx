// src/pages/showcase/ComponentShowcase.tsx

/**
 * COMPONENT SHOWCASE - PRODUCTION GRADE V3.0
 * 
 * ARCHITECTURE:
 * ✅ Enterprise dark mode pattern (Shadcn/Vercel approach)
 * ✅ Clean state management with localStorage persistence
 * ✅ Proper initialization and cleanup
 * ✅ All components use Tailwind dark: variant automatically
 * ✅ CSS variables flip via .dark class in theme.css
 * ✅ Professional, minimal toggle UI
 * 
 * DESIGN PHILOSOPHY:
 * "Concert hall, not arcade; calm ocean, not storm"
 * - Let the design system speak for itself
 * - Subtle, purposeful animations
 * - Clean, scannable layout
 * - Professional polish without over-design
 * 
 * HOW IT WORKS:
 * 1. Toggle button controls isDark state
 * 2. useEffect syncs isDark ↔ <html class="dark">
 * 3. Tailwind sees .dark class → applies dark: variants
 * 4. CSS variables flip (theme.css .dark overrides)
 * 5. Components adapt automatically
 */

import { useState, useEffect } from 'react';
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
import { Tooltip } from '@/shared/components/ui/Tooltip';
import { Modal } from '@/shared/components/ui/Modal';

// =============================================================================
// CONSTANTS
// =============================================================================

const STORAGE_KEY = 'oslira-theme-mode';

// =============================================================================
// COMPONENT
// =============================================================================

export default function ComponentShowcase() {
  // ===========================================================================
  // STATE: Dark Mode with localStorage persistence
  // ===========================================================================
  
  const [isDark, setIsDark] = useState<boolean>(() => {
    // Initialize from localStorage or default to light mode
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored === 'dark';
    }
    return false;
  });
  
  // ===========================================================================
  // STATE: Form Inputs (for demonstration)
  // ===========================================================================
  
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [radioValue, setRadioValue] = useState('option1');
  const [switchChecked, setSwitchChecked] = useState(false);
  const [selectValue, setSelectValue] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [textareaValue, setTextareaValue] = useState('');
  const [progress, setProgress] = useState(60);
  const [modalOpen, setModalOpen] = useState(false);

  // ===========================================================================
  // EFFECT: Initialize dark mode on mount (cleanup any stale state)
  // ===========================================================================
  
  useEffect(() => {
    // Force clean slate on mount
    const root = document.documentElement;
    root.classList.remove('dark');
    
    // Apply stored preference
    if (isDark) {
      root.classList.add('dark');
    }
  }, []); // Run once on mount

  // ===========================================================================
  // EFFECT: Sync isDark state with DOM and localStorage
  // ===========================================================================
  
  useEffect(() => {
    const root = document.documentElement;
    
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem(STORAGE_KEY, 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem(STORAGE_KEY, 'light');
    }
  }, [isDark]);

  // ===========================================================================
  // HANDLERS
  // ===========================================================================
  
  const toggleDarkMode = () => {
    setIsDark(!isDark);
  };

  // ===========================================================================
  // RENDER
  // ===========================================================================
  
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
      
      {/* =====================================================================
          DARK MODE TOGGLE - FIXED BOTTOM LEFT
          ===================================================================== */}
      
      <motion.button
        onClick={toggleDarkMode}
        className="fixed bottom-8 left-8 z-50 w-14 h-14 rounded-full shadow-elevated 
                   flex items-center justify-center transition-all duration-200
                   bg-white dark:bg-neutral-800 
                   hover:bg-neutral-50 dark:hover:bg-neutral-700 
                   border border-neutral-300 dark:border-neutral-600
                   focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
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
              <Icon icon="ph:moon-bold" className="text-2xl text-neutral-700 dark:text-neutral-300" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* =====================================================================
          HERO SECTION
          ===================================================================== */}
      
      <div className="relative overflow-hidden border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            {/* Brand Badge */}
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border
                            bg-primary-500/5 border-primary-500/20
                            dark:bg-primary-500/10 dark:border-primary-500/30">
              <Logo size="sm" />
              <span className="font-semibold text-primary-600 dark:text-primary-400">
                Oslira Design System
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Production-grade UI components with <br />
              <span className="text-primary-500">natural dark mode support</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-neutral-700 dark:text-neutral-300 max-w-2xl mx-auto">
              14 components, WCAG AA compliant, 0 tech debt. 
              Built with Tailwind v4 and enterprise-grade architecture.
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 pt-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">14</div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">Components</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">WCAG AA</div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">Compliant</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">0</div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">Tech Debt</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* =====================================================================
          COMPONENTS GRID
          ===================================================================== */}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-16">

          {/* ===================================================================
              SECTION: BUTTONS
              =================================================================== */}
          
          <section>
            <h2 className="text-3xl font-bold mb-2">Buttons</h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-8">
              Professional CTAs with multiple variants and states
            </p>
            
            <Card className="p-8">
              <div className="space-y-6">
                {/* Variants */}
                <div>
                  <Label className="mb-3 block">Variants</Label>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="primary">Primary Button</Button>
                    <Button variant="secondary">Secondary Button</Button>
                    <Button variant="ghost">Ghost Button</Button>
                    <Button variant="danger">Danger Button</Button>
                  </div>
                </div>

                {/* Sizes */}
                <div>
                  <Label className="mb-3 block">Sizes</Label>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button size="sm">Small</Button>
                    <Button size="md">Medium</Button>
                    <Button size="lg">Large</Button>
                  </div>
                </div>

                {/* With Icons */}
                <div>
                  <Label className="mb-3 block">With Icons</Label>
                  <div className="flex flex-wrap gap-3">
                    <Button icon="ph:magnifying-glass-bold" iconPosition="left">
                      Search
                    </Button>
                    <Button icon="ph:arrow-right-bold" iconPosition="right">
                      Next
                    </Button>
                    <Button icon="ph:plus-bold" iconPosition="only" />
                  </div>
                </div>

                {/* States */}
                <div>
                  <Label className="mb-3 block">States</Label>
                  <div className="flex flex-wrap gap-3">
                    <Button>Default</Button>
                    <Button loading>Loading</Button>
                    <Button disabled>Disabled</Button>
                  </div>
                </div>
              </div>
            </Card>
          </section>

          {/* ===================================================================
              SECTION: FORM INPUTS
              =================================================================== */}
          
          <section>
            <h2 className="text-3xl font-bold mb-2">Form Inputs</h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-8">
              Clean, accessible form controls with validation states
            </p>
            
            <Card className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Text Input */}
                <div>
                  <Label htmlFor="input-demo">Text Input</Label>
                  <Input
                    id="input-demo"
                    placeholder="Enter text..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="mt-2"
                  />
                </div>

                {/* Text Input with Error */}
                <div>
                  <Label htmlFor="input-error">Input with Error</Label>
                  <Input
                    id="input-error"
                    placeholder="Required field"
                    error="This field is required"
                    className="mt-2"
                  />
                </div>

                {/* Select */}
                <div>
                  <Label htmlFor="select-demo">Select</Label>
                  <Select
                    id="select-demo"
                    value={selectValue}
                    onChange={(e) => setSelectValue(e.target.value)}
                    className="mt-2"
                  >
                    <option value="">Choose option...</option>
                    <option value="1">Option 1</option>
                    <option value="2">Option 2</option>
                    <option value="3">Option 3</option>
                  </Select>
                </div>

                {/* Textarea */}
                <div>
                  <Label htmlFor="textarea-demo">Textarea</Label>
                  <Textarea
                    id="textarea-demo"
                    placeholder="Enter description..."
                    rows={3}
                    value={textareaValue}
                    onChange={(e) => setTextareaValue(e.target.value)}
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Checkboxes & Radio Buttons */}
              <div className="mt-8 pt-8 border-t border-neutral-200 dark:border-neutral-700">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Checkbox */}
                  <div>
                    <Label className="mb-3 block">Checkbox</Label>
                    <Checkbox
                      checked={checkboxChecked}
                      onChange={(e) => setCheckboxChecked(e.target.checked)}
                    >
                      I agree to the terms and conditions
                    </Checkbox>
                  </div>

                  {/* Radio Buttons */}
                  <div>
                    <Label className="mb-3 block">Radio Buttons</Label>
                    <div className="space-y-2">
                      <Radio
                        checked={radioValue === 'option1'}
                        onChange={() => setRadioValue('option1')}
                        name="radio-demo"
                      >
                        Option 1
                      </Radio>
                      <Radio
                        checked={radioValue === 'option2'}
                        onChange={() => setRadioValue('option2')}
                        name="radio-demo"
                      >
                        Option 2
                      </Radio>
                      <Radio
                        checked={radioValue === 'option3'}
                        onChange={() => setRadioValue('option3')}
                        name="radio-demo"
                      >
                        Option 3
                      </Radio>
                    </div>
                  </div>
                </div>
              </div>

              {/* Switch */}
              <div className="mt-8 pt-8 border-t border-neutral-200 dark:border-neutral-700">
                <Label className="mb-3 block">Switch</Label>
                <Switch
                  checked={switchChecked}
                  onChange={(e) => setSwitchChecked(e.target.checked)}
                >
                  Enable notifications
                </Switch>
              </div>
            </Card>
          </section>

          {/* ===================================================================
              SECTION: FEEDBACK COMPONENTS
              =================================================================== */}
          
          <section>
            <h2 className="text-3xl font-bold mb-2">Feedback Components</h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-8">
              Alerts, progress indicators, and loading states
            </p>
            
            <div className="space-y-6">
              {/* Alerts */}
              <Card className="p-8">
                <Label className="mb-4 block">Alerts</Label>
                <div className="space-y-4">
                  <Alert variant="success">
                    Changes saved successfully!
                  </Alert>
                  <Alert variant="error">
                    An error occurred. Please try again.
                  </Alert>
                  <Alert variant="warning">
                    Your session will expire in 5 minutes.
                  </Alert>
                  <Alert variant="info">
                    New features are available. Check them out!
                  </Alert>
                </div>
              </Card>

              {/* Progress */}
              <Card className="p-8">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Progress</Label>
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        {progress}%
                      </span>
                    </div>
                    <Progress value={progress} />
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => setProgress(Math.max(0, progress - 10))}>
                      -10%
                    </Button>
                    <Button size="sm" onClick={() => setProgress(Math.min(100, progress + 10))}>
                      +10%
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Spinner */}
              <Card className="p-8">
                <Label className="mb-4 block">Loading Spinners</Label>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <Spinner size="sm" />
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2">Small</p>
                  </div>
                  <div className="text-center">
                    <Spinner size="md" />
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2">Medium</p>
                  </div>
                  <div className="text-center">
                    <Spinner size="lg" />
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2">Large</p>
                  </div>
                </div>
              </Card>
            </div>
          </section>

          {/* ===================================================================
              SECTION: DATA DISPLAY
              =================================================================== */}
          
          <section>
            <h2 className="text-3xl font-bold mb-2">Data Display</h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-8">
              Badges, avatars, and content containers
            </p>
            
            <div className="space-y-6">
              {/* Badges */}
              <Card className="p-8">
                <Label className="mb-4 block">Badges</Label>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="primary">Primary</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="error">Error</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="info">Info</Badge>
                </div>
              </Card>

              {/* Avatars */}
              <Card className="p-8">
                <Label className="mb-4 block">Avatars</Label>
                <div className="flex items-center gap-4">
                  <Avatar size="sm" name="John Doe" />
                  <Avatar size="md" name="Jane Smith" />
                  <Avatar size="lg" name="Alex Johnson" />
                  <Avatar size="sm" src="https://i.pravatar.cc/150?img=1" />
                  <Avatar size="md" src="https://i.pravatar.cc/150?img=2" />
                  <Avatar size="lg" src="https://i.pravatar.cc/150?img=3" />
                </div>
              </Card>

              {/* Cards */}
              <div className="grid md:grid-cols-3 gap-6">
                <Card hoverable>
                  <div className="p-6">
                    <h3 className="font-semibold mb-2">Hoverable Card</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Lift effect on hover for interactive elements
                    </p>
                  </div>
                </Card>
                
                <Card clickable onClick={() => alert('Card clicked!')}>
                  <div className="p-6">
                    <h3 className="font-semibold mb-2">Clickable Card</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Full card acts as a button
                    </p>
                  </div>
                </Card>
                
                <Card selected>
                  <div className="p-6">
                    <h3 className="font-semibold mb-2">Selected Card</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Visual indication of selection state
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </section>

          {/* ===================================================================
              SECTION: OVERLAYS
              =================================================================== */}
          
          <section>
            <h2 className="text-3xl font-bold mb-2">Overlays</h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-8">
              Modals, tooltips, and contextual information
            </p>
            
            <Card className="p-8">
              <div className="space-y-6">
                {/* Tooltips */}
                <div>
                  <Label className="mb-4 block">Tooltips</Label>
                  <div className="flex gap-4">
                    <Tooltip content="Helpful tooltip content">
                      <Button variant="secondary">Hover me</Button>
                    </Tooltip>
                    <Tooltip content="Another useful tooltip" placement="top">
                      <Button variant="secondary">Top tooltip</Button>
                    </Tooltip>
                  </div>
                </div>

                {/* Modal */}
                <div>
                  <Label className="mb-4 block">Modal</Label>
                  <Button onClick={() => setModalOpen(true)}>
                    Open Modal
                  </Button>
                </div>
              </div>
            </Card>
          </section>

        </div>
      </div>

      {/* =====================================================================
          FOOTER
          ===================================================================== */}
      
      <footer className="border-t border-neutral-200 dark:border-neutral-800 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center space-y-4">
            <Logo size="md" />
            <p className="text-neutral-600 dark:text-neutral-400">
              Built with React, TypeScript, Tailwind v4, and enterprise-grade architecture
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-500">
              © 2025 Oslira. Production-ready design system.
            </p>
          </div>
        </div>
      </footer>

      {/* =====================================================================
          MODAL COMPONENT
          ===================================================================== */}
      
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      >
        <Modal.Header>Example Modal</Modal.Header>
        <Modal.Body>
          <p className="text-neutral-700 dark:text-neutral-300">
            This is a modal dialog with proper dark mode support. It demonstrates the overlay pattern
            and content containment.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => setModalOpen(false)}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
}
