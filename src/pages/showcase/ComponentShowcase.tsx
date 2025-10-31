// src/pages/showcase/ComponentShowcase.tsx

/**
 * COMPONENT SHOWCASE - PRODUCTION GRADE V2.0
 * 
 * ARCHITECTURE:
 * ✅ Manual toggle button controls Tailwind's natural dark mode
 * ✅ isDark state syncs with <html class="dark">
 * ✅ All components automatically respond via dark: classes
 * ✅ No manual theme management - pure Tailwind
 * ✅ Professional, clean showcase layout
 * 
 * DESIGN PHILOSOPHY:
 * "Concert hall, not arcade; calm ocean, not storm"
 * Let the components speak for themselves
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
// COMPONENT
// =============================================================================

export default function ComponentShowcase() {
  const [isDark, setIsDark] = useState(false);
  
  // Form state
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [radioValue, setRadioValue] = useState('option1');
  const [switchChecked, setSwitchChecked] = useState(false);
  const [selectValue, setSelectValue] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [textareaValue, setTextareaValue] = useState('');
  const [progress, setProgress] = useState(60);
  const [modalOpen, setModalOpen] = useState(false);

  // Sync isDark with <html class="dark">
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
      
      {/* =====================================================================
          DARK MODE TOGGLE - BOTTOM LEFT CORNER
          ===================================================================== */}
      <motion.button
        onClick={() => setIsDark(!isDark)}
        className="fixed bottom-8 left-8 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all
                   bg-white dark:bg-neutral-800 
                   hover:bg-neutral-50 dark:hover:bg-neutral-700 
                   border border-neutral-300 dark:border-neutral-600"
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
                            bg-primary-500/5 border-primary-500/20">
              <Logo size="sm" />
              <span className="font-semibold text-primary-600 dark:text-primary-400">
                Oslira Design System
              </span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
              Component Showcase
            </h1>
            
            <p className="text-xl max-w-2xl mx-auto text-neutral-600 dark:text-neutral-400">
              Production-grade UI components with natural dark mode support
            </p>

            {/* Metrics */}
            <div className="flex items-center justify-center gap-8 pt-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">14</div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">Components</div>
              </div>
              <div className="w-px h-12 bg-neutral-300 dark:bg-neutral-700" />
              <div className="text-center">
                <div className="text-3xl font-bold text-success-600 dark:text-success-400">WCAG AA</div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">Compliant</div>
              </div>
              <div className="w-px h-12 bg-neutral-300 dark:bg-neutral-700" />
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary-600 dark:text-secondary-400">0</div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">Tech Debt</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* =====================================================================
          MAIN CONTENT
          ===================================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">

        {/* BUTTONS */}
        <section className="space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-4xl font-bold">Buttons</h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              Professional CTAs with multiple variants and states
            </p>
          </div>

          <Card size="lg" rounded="xl">
            <div className="space-y-8">
              {/* Variants */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Variants</h3>
                <div className="flex flex-wrap gap-4">
                  <Button variant="primary">Primary Button</Button>
                  <Button variant="secondary">Secondary Button</Button>
                  <Button variant="ghost">Ghost Button</Button>
                  <Button variant="danger">Danger Button</Button>
                </div>
              </div>

              {/* Sizes */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Sizes</h3>
                <div className="flex flex-wrap items-center gap-4">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                </div>
              </div>

              {/* With Icons */}
              <div>
                <h3 className="text-xl font-semibold mb-4">With Icons</h3>
                <div className="flex flex-wrap gap-4">
                  <Button icon="mdi:magnify" iconPosition="left">Search</Button>
                  <Button icon="mdi:arrow-right" iconPosition="right">Next</Button>
                  <Button icon="mdi:plus" iconPosition="only" />
                </div>
              </div>

              {/* States */}
              <div>
                <h3 className="text-xl font-semibold mb-4">States</h3>
                <div className="flex flex-wrap gap-4">
                  <Button>Default</Button>
                  <Button loading>Loading</Button>
                  <Button disabled>Disabled</Button>
                </div>
              </div>

              {/* Full Width */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Full Width</h3>
                <Button fullWidth variant="primary">Full Width Button</Button>
              </div>
            </div>
          </Card>
        </section>

        {/* CARDS */}
        <section className="space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-4xl font-bold">Cards</h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              Flexible containers with multiple configurations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card size="md" rounded="xl" hoverable>
              <h3 className="text-xl font-semibold mb-2">Basic Card</h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Default card with hover effect. Clean and professional.
              </p>
            </Card>

            <Card size="md" rounded="xl" shadow="md">
              <h3 className="text-xl font-semibold mb-2">Elevated Card</h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Card with medium shadow for emphasis.
              </p>
            </Card>

            <Card size="md" rounded="xl" clickable onClick={() => alert('Card clicked!')}>
              <h3 className="text-xl font-semibold mb-2">Clickable Card</h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Interactive card with onClick handler.
              </p>
            </Card>
          </div>
        </section>

        {/* FORM INPUTS */}
        <section className="space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-4xl font-bold">Form Inputs</h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              Professional inputs with validation states
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Input */}
            <Card size="lg" rounded="xl">
              <h3 className="text-xl font-semibold mb-6">Input</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="input-default">Default Input</Label>
                  <Input 
                    id="input-default"
                    placeholder="Enter text..." 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    fullWidth
                  />
                </div>
                <div>
                  <Label htmlFor="input-icon">With Icon</Label>
                  <Input 
                    id="input-icon"
                    icon="mdi:magnify" 
                    iconPosition="left"
                    placeholder="Search..."
                    fullWidth
                  />
                </div>
                <div>
                  <Label htmlFor="input-error">Error State</Label>
                  <Input 
                    id="input-error"
                    error="This field is required"
                    placeholder="Invalid input"
                    fullWidth
                  />
                </div>
                <div>
                  <Label htmlFor="input-success">Success State</Label>
                  <Input 
                    id="input-success"
                    success
                    placeholder="Valid input"
                    fullWidth
                  />
                </div>
              </div>
            </Card>

            {/* Textarea */}
            <Card size="lg" rounded="xl">
              <h3 className="text-xl font-semibold mb-6">Textarea</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="textarea-default">Default Textarea</Label>
                  <Textarea 
                    id="textarea-default"
                    placeholder="Enter message..."
                    value={textareaValue}
                    onChange={(e) => setTextareaValue(e.target.value)}
                    rows={4}
                    fullWidth
                  />
                </div>
                <div>
                  <Label htmlFor="textarea-counter">With Character Counter</Label>
                  <Textarea 
                    id="textarea-counter"
                    placeholder="Max 200 characters..."
                    maxLength={200}
                    showCount
                    rows={4}
                    fullWidth
                  />
                </div>
              </div>
            </Card>

            {/* Select */}
            <Card size="lg" rounded="xl">
              <h3 className="text-xl font-semibold mb-6">Select</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="select-default">Default Select</Label>
                  <Select 
                    id="select-default"
                    value={selectValue}
                    onChange={(e) => setSelectValue(e.target.value)}
                    fullWidth
                  >
                    <option value="">Choose an option</option>
                    <option value="1">Option 1</option>
                    <option value="2">Option 2</option>
                    <option value="3">Option 3</option>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="select-error">Error State</Label>
                  <Select 
                    id="select-error"
                    error="Please select an option"
                    fullWidth
                  >
                    <option value="">Choose an option</option>
                    <option value="1">Option 1</option>
                    <option value="2">Option 2</option>
                  </Select>
                </div>
              </div>
            </Card>

            {/* Toggles */}
            <Card size="lg" rounded="xl">
              <h3 className="text-xl font-semibold mb-6">Toggles</h3>
              <div className="space-y-6">
                <div className="space-y-3">
                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Checkbox</p>
                  <Checkbox 
                    checked={checkboxChecked}
                    onChange={(e) => setCheckboxChecked(e.target.checked)}
                  >
                    Accept terms and conditions
                  </Checkbox>
                  <Checkbox indeterminate>
                    Indeterminate state
                  </Checkbox>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Radio Group</p>
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
                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Switch</p>
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
            <h2 className="text-4xl font-bold">Feedback Components</h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              Alerts, badges, spinners, and progress indicators
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Alerts */}
            <Card size="lg" rounded="xl">
              <h3 className="text-xl font-semibold mb-6">Alerts</h3>
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
                <Alert variant="success" closeable onClose={() => console.log('Alert closed')}>
                  <strong>Closeable!</strong> Click the X to dismiss.
                </Alert>
              </div>
            </Card>

            {/* Badges */}
            <Card size="lg" rounded="xl">
              <h3 className="text-xl font-semibold mb-6">Badges</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-3 text-neutral-600 dark:text-neutral-400">Variants</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="primary">Primary</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="success">Success</Badge>
                    <Badge variant="error">Error</Badge>
                    <Badge variant="warning">Warning</Badge>
                    <Badge variant="info">Info</Badge>
                    <Badge variant="neutral">Neutral</Badge>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-3 text-neutral-600 dark:text-neutral-400">With Icons</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="primary" icon="mdi:star">Premium</Badge>
                    <Badge variant="success" icon="mdi:check">Verified</Badge>
                    <Badge variant="warning" icon="mdi:alert">Warning</Badge>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-3 text-neutral-600 dark:text-neutral-400">With Status Dots</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="success" dot>Online</Badge>
                    <Badge variant="error" dot>Offline</Badge>
                    <Badge variant="warning" dot>Away</Badge>
                  </div>
                </div>
              </div>
            </Card>

            {/* Spinner & Progress */}
            <Card size="lg" rounded="xl">
              <h3 className="text-xl font-semibold mb-6">Loading States</h3>
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-medium mb-3 text-neutral-600 dark:text-neutral-400">Spinners</p>
                  <div className="flex items-center gap-4">
                    <Spinner size="sm" />
                    <Spinner size="md" />
                    <Spinner size="lg" />
                    <Spinner size="xl" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-3 text-neutral-600 dark:text-neutral-400">Spinner Variants</p>
                  <div className="flex items-center gap-4">
                    <Spinner variant="primary" />
                    <Spinner variant="neutral" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-3 text-neutral-600 dark:text-neutral-400">Progress Bar</p>
                  <Progress value={progress} showPercentage />
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" onClick={() => setProgress(Math.max(0, progress - 10))}>-10%</Button>
                    <Button size="sm" onClick={() => setProgress(Math.min(100, progress + 10))}>+10%</Button>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-3 text-neutral-600 dark:text-neutral-400">Progress with Label</p>
                  <Progress value={75} label="Analyzing leads..." showPercentage variant="success" />
                </div>
              </div>
            </Card>

            {/* Avatars */}
            <Card size="lg" rounded="xl">
              <h3 className="text-xl font-semibold mb-6">Avatars</h3>
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-medium mb-3 text-neutral-600 dark:text-neutral-400">Sizes</p>
                  <div className="flex items-center gap-4">
                    <Avatar size="sm" name="John Doe" />
                    <Avatar size="md" name="Jane Smith" />
                    <Avatar size="lg" name="Bob Johnson" />
                    <Avatar size="xl" name="Alice Brown" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-3 text-neutral-600 dark:text-neutral-400">With Status</p>
                  <div className="flex items-center gap-4">
                    <Avatar name="Online User" status="online" />
                    <Avatar name="Offline User" status="offline" />
                    <Avatar name="Away User" status="away" />
                    <Avatar name="Busy User" status="busy" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-3 text-neutral-600 dark:text-neutral-400">Avatar Group</p>
                  <div className="flex -space-x-2">
                    <Avatar size="md" name="User 1" />
                    <Avatar size="md" name="User 2" />
                    <Avatar size="md" name="User 3" />
                    <Avatar size="md" name="User 4" />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* UTILITY COMPONENTS */}
        <section className="space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-4xl font-bold">Utility Components</h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              Tooltips and modals for enhanced UX
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Tooltips */}
            <Card size="lg" rounded="xl">
              <h3 className="text-xl font-semibold mb-6">Tooltips</h3>
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-medium mb-3 text-neutral-600 dark:text-neutral-400">Placement</p>
                  <div className="flex flex-wrap gap-4">
                    <Tooltip content="Tooltip on top" placement="top">
                      <Button variant="secondary">Top</Button>
                    </Tooltip>
                    <Tooltip content="Tooltip on bottom" placement="bottom">
                      <Button variant="secondary">Bottom</Button>
                    </Tooltip>
                    <Tooltip content="Tooltip on left" placement="left">
                      <Button variant="secondary">Left</Button>
                    </Tooltip>
                    <Tooltip content="Tooltip on right" placement="right">
                      <Button variant="secondary">Right</Button>
                    </Tooltip>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-3 text-neutral-600 dark:text-neutral-400">Variants</p>
                  <div className="flex flex-wrap gap-4">
                    <Tooltip content="Dark tooltip" variant="dark">
                      <Button variant="secondary">Dark</Button>
                    </Tooltip>
                    <Tooltip content="Light tooltip" variant="light">
                      <Button variant="secondary">Light</Button>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </Card>

            {/* Modal */}
            <Card size="lg" rounded="xl">
              <h3 className="text-xl font-semibold mb-6">Modal</h3>
              <div className="space-y-4">
                <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Professional dialog with backdrop, header, body, and footer sections.
                </p>
              </div>
            </Card>
          </div>
        </section>

        {/* REAL-WORLD EXAMPLE */}
        <section className="space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-4xl font-bold">Real-World Example</h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              Components working together in production
            </p>
          </div>

          <Card size="lg" rounded="xl" className="max-w-md mx-auto">
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Sign In</h3>
                <p className="text-neutral-600 dark:text-neutral-400">Welcome back! Please enter your details.</p>
              </div>

              <Alert variant="info">
                Demo mode - no actual authentication
              </Alert>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="demo-email" required>Email</Label>
                  <Input 
                    id="demo-email"
                    type="email"
                    placeholder="you@company.com"
                    icon="mdi:email"
                    iconPosition="left"
                    fullWidth
                  />
                </div>

                <div>
                  <Label htmlFor="demo-password" required>Password</Label>
                  <Input 
                    id="demo-password"
                    type="password"
                    placeholder="••••••••"
                    icon="mdi:lock"
                    iconPosition="left"
                    fullWidth
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Checkbox>Remember me</Checkbox>
                  <a href="#" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
                    Forgot password?
                  </a>
                </div>

                <Button variant="primary" fullWidth>
                  Sign In
                </Button>

                <div className="text-center">
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">
                    Don't have an account?{' '}
                    <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline">
                      Sign up
                    </a>
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </section>

      </div>

      {/* =====================================================================
          FOOTER
          ===================================================================== */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center space-y-2">
            <p className="text-neutral-600 dark:text-neutral-400">
              Oslira Design System v2.0 · October 2025
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-500">
              Built with React, TypeScript, Tailwind CSS, Framer Motion
            </p>
          </div>
        </div>
      </footer>

      {/* =====================================================================
          MODAL DIALOG (CONTROLLED BY STATE)
          ===================================================================== */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} size="md" centered>
        <Modal.Header>Example Modal</Modal.Header>
        <Modal.Body>
          <p>This is a professional modal dialog with proper backdrop, header, body, and footer sections.</p>
          <p className="mt-4 text-neutral-600 dark:text-neutral-400">
            Try clicking outside or pressing ESC to close.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="ghost" onClick={() => setModalOpen(false)}>
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
