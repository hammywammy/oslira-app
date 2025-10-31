// src/pages/showcase/ComponentShowcase.tsx

/**
 * COMPONENT SHOWCASE - PRODUCTION GRADE V4.1
 * 
 * ARCHITECTURE:
 * ✅ ZERO theme management logic (uses global ThemeProvider)
 * ✅ Pure showcase page - only demonstrates components
 * ✅ Uses ThemeToggle component for theme switching
 * ✅ All components automatically respond to global theme
 * ✅ MATCHES ACTUAL COMPONENT APIs (no TypeScript errors)
 * 
 * DESIGN PHILOSOPHY:
 * "Concert hall, not arcade; calm ocean, not storm"
 * - Let the design system speak for itself
 * - Subtle, purposeful animations
 * - Clean, scannable layout
 * - Professional polish without over-design
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { ThemeToggle } from '@/core/theme/ThemeToggle';
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
  // ===========================================================================
  // STATE: Form Inputs (for demonstration only)
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
  // RENDER
  // ===========================================================================
  
return (
  <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      
      {/* =====================================================================
          THEME TOGGLE - FIXED BOTTOM LEFT
          Uses global ThemeToggle component - zero local theme logic
          ===================================================================== */}
      
      <ThemeToggle variant="fixed" />

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

            {/* CTA Buttons */}
            <div className="flex items-center justify-center gap-4 pt-4">
              <Button variant="primary" size="lg" icon="ph:code-bold">
                View on GitHub
              </Button>
              <Button variant="secondary" size="lg" icon="ph:book-open-bold">
                Documentation
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* =====================================================================
          MAIN CONTENT
          ===================================================================== */}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
        
        {/* ===================================================================
            SECTION: BUTTONS
            =================================================================== */}
        
        <section className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Buttons</h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              Professional buttons with proper hover states and loading indicators
            </p>
          </div>

          <Card className="p-8">
            <div className="space-y-6">
              {/* Variants */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Variants</h3>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="danger">Danger</Button>
                </div>
              </div>

              {/* Sizes */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Sizes</h3>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                </div>
              </div>

              {/* With Icons */}
              <div>
                <h3 className="text-lg font-semibold mb-4">With Icons</h3>
                <div className="flex flex-wrap gap-3">
                  <Button icon="ph:paper-plane-tilt-bold" iconPosition="left">
                    Send
                  </Button>
                  <Button 
                    variant="secondary" 
                    icon="ph:download-bold" 
                    iconPosition="right"
                  >
                    Download
                  </Button>
                  <Button 
                    variant="ghost" 
                    icon="ph:gear-bold" 
                    iconPosition="only"
                    aria-label="Settings"
                  />
                </div>
              </div>

              {/* States */}
              <div>
                <h3 className="text-lg font-semibold mb-4">States</h3>
                <div className="flex flex-wrap gap-3">
                  <Button loading>Loading</Button>
                  <Button disabled>Disabled</Button>
                  <Button fullWidth>Full Width</Button>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* ===================================================================
            SECTION: FORM INPUTS
            =================================================================== */}
        
        <section className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Form Inputs</h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              Clean inputs with validation states and proper accessibility
            </p>
          </div>

          <Card className="p-8">
            <div className="space-y-6">
              {/* Text Input */}
              <div>
                <Label htmlFor="input-default">Text Input</Label>
                <Input
                  id="input-default"
                  placeholder="Enter text..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </div>

              {/* Input with Icon */}
              <div>
                <Label htmlFor="input-icon">With Icon</Label>
                <Input
                  id="input-icon"
                  icon="ph:magnifying-glass-bold"
                  placeholder="Search..."
                />
              </div>

              {/* Validation States */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="input-error">Error State</Label>
                  <Input
                    id="input-error"
                    error="This field is required"
                    placeholder="Email address"
                  />
                </div>
                <div>
                  <Label htmlFor="input-success">Success State</Label>
                  <Input
                    id="input-success"
                    success
                    placeholder="Username"
                    value="johndoe"
                    readOnly
                  />
                </div>
              </div>

              {/* Textarea */}
              <div>
                <Label htmlFor="textarea">Textarea</Label>
                <Textarea
                  id="textarea"
                  rows={4}
                  placeholder="Enter your message..."
                  value={textareaValue}
                  onChange={(e) => setTextareaValue(e.target.value)}
                  maxLength={500}
                  showCount
                />
              </div>

              {/* Select */}
              <div>
                <Label htmlFor="select">Select Dropdown</Label>
                <Select
                  id="select"
                  value={selectValue}
                  onChange={(e) => setSelectValue(e.target.value)}
                >
                  <option value="">Choose an option</option>
                  <option value="option1">Option 1</option>
                  <option value="option2">Option 2</option>
                  <option value="option3">Option 3</option>
                </Select>
              </div>
            </div>
          </Card>
        </section>

        {/* ===================================================================
            SECTION: TOGGLES & SWITCHES
            =================================================================== */}
        
        <section className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Toggles & Switches</h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              Interactive controls for boolean states
            </p>
          </div>

          <Card className="p-8">
            <div className="space-y-6">
              {/* Checkbox */}
              <div>
                <Checkbox
                  checked={checkboxChecked}
                  onChange={(e) => setCheckboxChecked(e.target.checked)}
                >
                  I agree to the terms and conditions
                </Checkbox>
              </div>

              {/* Radio Buttons */}
              <div className="space-y-3">
                <Label>Choose your plan</Label>
                <Radio
                  name="plan"
                  value="option1"
                  checked={radioValue === 'option1'}
                  onChange={() => setRadioValue('option1')}
                >
                  Starter - $29/month
                </Radio>
                <Radio
                  name="plan"
                  value="option2"
                  checked={radioValue === 'option2'}
                  onChange={() => setRadioValue('option2')}
                >
                  Pro - $99/month
                </Radio>
                <Radio
                  name="plan"
                  value="option3"
                  checked={radioValue === 'option3'}
                  onChange={() => setRadioValue('option3')}
                >
                  Enterprise - $299/month
                </Radio>
              </div>

              {/* Switch */}
              <div>
                <Switch
                  checked={switchChecked}
                  onChange={(e) => setSwitchChecked(e.target.checked)}
                >
                  Enable notifications
                </Switch>
              </div>
            </div>
          </Card>
        </section>

        {/* ===================================================================
            SECTION: FEEDBACK COMPONENTS
            =================================================================== */}
        
        <section className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Feedback</h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              Alerts, spinners, and progress indicators
            </p>
          </div>

          <Card className="p-8">
            <div className="space-y-6">
              {/* Alerts */}
              <div className="space-y-3">
                <Alert variant="info" icon="ph:info-bold">
                  This is an informational message
                </Alert>
                <Alert variant="success" icon="ph:check-circle-bold">
                  Your changes have been saved successfully
                </Alert>
                <Alert variant="warning" icon="ph:warning-bold">
                  Your subscription expires in 3 days
                </Alert>
                <Alert variant="error" icon="ph:x-circle-bold">
                  Failed to process payment. Please try again.
                </Alert>
              </div>

              {/* Spinners */}
              <div className="flex items-center gap-6">
                <div className="space-y-2">
                  <Label>Small</Label>
                  <Spinner size="sm" />
                </div>
                <div className="space-y-2">
                  <Label>Medium</Label>
                  <Spinner size="md" />
                </div>
                <div className="space-y-2">
                  <Label>Large</Label>
                  <Spinner size="lg" />
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Progress: {progress}%</Label>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => setProgress(Math.max(0, progress - 10))}
                    >
                      -10
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => setProgress(Math.min(100, progress + 10))}
                    >
                      +10
                    </Button>
                  </div>
                </div>
                <Progress value={progress} />
              </div>
            </div>
          </Card>
        </section>

        {/* ===================================================================
            SECTION: DATA DISPLAY
            =================================================================== */}
        
        <section className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Data Display</h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              Badges, avatars, and cards for presenting information
            </p>
          </div>

          <Card className="p-8">
            <div className="space-y-6">
              {/* Badges */}
              <div>
                <Label className="mb-4">Badges</Label>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="default">Default</Badge>
                  <Badge variant="primary">Primary</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="error">Error</Badge>
                  <Badge variant="neutral">Neutral</Badge>
                </div>
              </div>

              {/* Avatars */}
              <div>
                <Label className="mb-4">Avatars</Label>
                <div className="flex items-center gap-4">
                  <Avatar 
                    src="https://i.pravatar.cc/150?img=1" 
                    name="User 1"
                    size="sm"
                  />
                  <Avatar 
                    src="https://i.pravatar.cc/150?img=2" 
                    name="User 2"
                    size="md"
                  />
                  <Avatar 
                    src="https://i.pravatar.cc/150?img=3" 
                    name="User 3"
                    size="lg"
                  />
                  <Avatar 
                    name="John Doe"
                    size="md"
                  />
                </div>
              </div>

              {/* Cards */}
              <div>
                <Label className="mb-4">Card Variants</Label>
                <div className="grid md:grid-cols-2 gap-4">
                  <Card>
                    <div className="p-6">
                      <h3 className="font-semibold mb-2">Default Card</h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Standard card with subtle border
                      </p>
                    </div>
                  </Card>

                  <Card shadow="lg">
                    <div className="p-6">
                      <h3 className="font-semibold mb-2">Elevated Card</h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Card with shadow elevation
                      </p>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* ===================================================================
            SECTION: OVERLAYS
            =================================================================== */}
        
        <section className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Overlays</h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              Modals and tooltips for focused interactions
            </p>
          </div>

          <Card className="p-8">
            <div className="space-y-6">
              {/* Modal Trigger */}
              <div>
                <Label className="mb-4">Modal</Label>
                <Button onClick={() => setModalOpen(true)}>
                  Open Modal
                </Button>
              </div>

              {/* Tooltips */}
              <div>
                <Label className="mb-4">Tooltips</Label>
                <div className="flex gap-4">
                  <Tooltip content="This is a tooltip">
                    <Button variant="secondary">Hover me</Button>
                  </Tooltip>
                  <Tooltip content="Tooltips work on any element" placement="top">
                    <Icon 
                      icon="ph:info-bold" 
                      className="text-2xl text-neutral-500 cursor-help"
                    />
                  </Tooltip>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* ===================================================================
            SECTION: LOGO & BRANDING
            =================================================================== */}
        
        <section className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Logo & Branding</h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              Consistent branding across all sizes
            </p>
          </div>

          <Card className="p-8">
            <div className="flex items-center gap-8">
              <div className="space-y-2">
                <Label>Small</Label>
                <Logo size="sm" />
              </div>
              <div className="space-y-2">
                <Label>Medium</Label>
                <Logo size="md" />
              </div>
              <div className="space-y-2">
                <Label>Large</Label>
                <Logo size="lg" />
              </div>
            </div>
          </Card>
        </section>

      </div>

      {/* =====================================================================
          FOOTER
          ===================================================================== */}
      
      <footer className="border-t border-neutral-200 dark:border-neutral-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Logo size="sm" />
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                Oslira Design System
              </span>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Production-ready design system.
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
            and content containment. The theme automatically switches between light and dark modes.
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
