// src/pages/showcase/ComponentShowcase.tsx

/**
 * COMPONENT SHOWCASE
 * 
 * Comprehensive validation page for all atomic components
 * Review every component in isolation with all variants
 * 
 * SECTIONS:
 * 1. Brand & Identity (Logo, Colors)
 * 2. Buttons & Actions
 * 3. Form Inputs
 * 4. Feedback & Status
 * 5. Data Display
 * 
 * USAGE:
 * Navigate to /showcase to review all components
 */

import { useState } from 'react';
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
// COMPONENT
// =============================================================================

export default function ComponentShowcase() {
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [radioValue, setRadioValue] = useState('option1');
  const [switchChecked, setSwitchChecked] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="container-default">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 mb-3">
            Component Showcase
          </h1>
          <p className="text-lg text-neutral-600">
            Oslira Design System - All atomic components in production-ready state
          </p>
        </div>

        {/* Section 1: Brand & Identity */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">
            1. Brand & Identity
          </h2>

          {/* Logos */}
          <Card className="mb-6">
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">Logo</h3>
            <div className="flex items-center gap-8 flex-wrap">
              <div className="flex flex-col items-center gap-2">
                <Logo size="sm" />
                <span className="text-xs text-neutral-600">Small</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Logo size="md" />
                <span className="text-xs text-neutral-600">Medium</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Logo size="lg" />
                <span className="text-xs text-neutral-600">Large</span>
              </div>
            </div>
          </Card>

          {/* Color Palette */}
          <Card>
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">Color Palette</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Primary */}
              <div>
                <div className="h-16 bg-primary-500 rounded-md mb-2" />
                <p className="text-xs font-medium">Primary 500</p>
                <p className="text-xs text-neutral-600">#00B8FF</p>
              </div>
              {/* Secondary */}
              <div>
                <div className="h-16 bg-secondary-500 rounded-md mb-2" />
                <p className="text-xs font-medium">Secondary 500</p>
                <p className="text-xs text-neutral-600">#8B7FC7</p>
              </div>
              {/* Success */}
              <div>
                <div className="h-16 bg-success-500 rounded-md mb-2" />
                <p className="text-xs font-medium">Success 500</p>
                <p className="text-xs text-neutral-600">#10B981</p>
              </div>
              {/* Error */}
              <div>
                <div className="h-16 bg-error-500 rounded-md mb-2" />
                <p className="text-xs font-medium">Error 500</p>
                <p className="text-xs text-neutral-600">#EF4444</p>
              </div>
            </div>
          </Card>
        </section>

        {/* Section 2: Buttons & Actions */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">
            2. Buttons & Actions
          </h2>

          <Card>
            <div className="space-y-6">
              {/* Button Variants */}
              <div>
                <h4 className="text-sm font-semibold text-neutral-700 mb-3">Variants</h4>
                <div className="flex items-center gap-3 flex-wrap">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="danger">Danger</Button>
                </div>
              </div>

              {/* Button Sizes */}
              <div>
                <h4 className="text-sm font-semibold text-neutral-700 mb-3">Sizes</h4>
                <div className="flex items-center gap-3">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                </div>
              </div>

              {/* Button with Icons */}
              <div>
                <h4 className="text-sm font-semibold text-neutral-700 mb-3">With Icons</h4>
                <div className="flex items-center gap-3 flex-wrap">
                  <Button icon="mdi:plus" iconPosition="left">Add Lead</Button>
                  <Button icon="mdi:arrow-right" iconPosition="right">Continue</Button>
                  <Button icon="mdi:star" iconPosition="only" />
                </div>
              </div>

              {/* Button States */}
              <div>
                <h4 className="text-sm font-semibold text-neutral-700 mb-3">States</h4>
                <div className="flex items-center gap-3 flex-wrap">
                  <Button loading>Loading...</Button>
                  <Button disabled>Disabled</Button>
                  <Button fullWidth>Full Width</Button>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Section 3: Form Inputs */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">
            3. Form Inputs
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Text Inputs */}
            <Card>
              <h3 className="text-lg font-semibold text-neutral-800 mb-4">Text Input</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="input1">Default</Label>
                  <Input id="input1" placeholder="Enter text..." />
                </div>
                <div>
                  <Label htmlFor="input2">With Icon</Label>
                  <Input id="input2" icon="mdi:magnify" iconPosition="left" placeholder="Search..." />
                </div>
                <div>
                  <Label htmlFor="input3">Error State</Label>
                  <Input id="input3" error="This field is required" />
                </div>
                <div>
                  <Label htmlFor="input4">Success State</Label>
                  <Input id="input4" success placeholder="Valid input" />
                </div>
                <div>
                  <Label htmlFor="input5">Disabled</Label>
                  <Input id="input5" disabled placeholder="Disabled input" />
                </div>
              </div>
            </Card>

            {/* Select */}
            <Card>
              <h3 className="text-lg font-semibold text-neutral-800 mb-4">Select</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="select1">Default</Label>
                  <Select id="select1">
                    <option value="">Choose an option</option>
                    <option value="1">Option 1</option>
                    <option value="2">Option 2</option>
                    <option value="3">Option 3</option>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="select2">Error State</Label>
                  <Select id="select2" error="Please select an option">
                    <option value="">Choose an option</option>
                    <option value="1">Option 1</option>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="select3">Disabled</Label>
                  <Select id="select3" disabled>
                    <option value="">Choose an option</option>
                  </Select>
                </div>
              </div>
            </Card>

            {/* Textarea */}
            <Card>
              <h3 className="text-lg font-semibold text-neutral-800 mb-4">Textarea</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="textarea1">Default</Label>
                  <Textarea id="textarea1" placeholder="Enter description..." rows={4} />
                </div>
                <div>
                  <Label htmlFor="textarea2">With Character Count</Label>
                  <Textarea id="textarea2" maxLength={200} showCount rows={3} />
                </div>
              </div>
            </Card>

            {/* Boolean Inputs */}
            <Card>
              <h3 className="text-lg font-semibold text-neutral-800 mb-4">Boolean Inputs</h3>
              <div className="space-y-6">
                {/* Checkbox */}
                <div>
                  <h4 className="text-sm font-semibold text-neutral-700 mb-3">Checkbox</h4>
                  <div className="space-y-2">
                    <Checkbox checked={checkboxChecked} onChange={(e) => setCheckboxChecked(e.target.checked)}>
                      <span className="text-sm">Accept terms and conditions</span>
                    </Checkbox>
                    <Checkbox indeterminate>
                      <span className="text-sm">Indeterminate state</span>
                    </Checkbox>
                    <Checkbox disabled>
                      <span className="text-sm">Disabled</span>
                    </Checkbox>
                  </div>
                </div>

                {/* Radio */}
                <div>
                  <h4 className="text-sm font-semibold text-neutral-700 mb-3">Radio</h4>
                  <div className="space-y-2">
                    <Radio
                      name="radio-group"
                      value="option1"
                      checked={radioValue === 'option1'}
                      onChange={(e) => setRadioValue(e.target.value)}
                    >
                      <span className="text-sm">Option 1</span>
                    </Radio>
                    <Radio
                      name="radio-group"
                      value="option2"
                      checked={radioValue === 'option2'}
                      onChange={(e) => setRadioValue(e.target.value)}
                    >
                      <span className="text-sm">Option 2</span>
                    </Radio>
                  </div>
                </div>

                {/* Switch */}
                <div>
                  <h4 className="text-sm font-semibold text-neutral-700 mb-3">Switch</h4>
                  <div className="flex items-center gap-3">
                    <Switch checked={switchChecked} onChange={(e) => setSwitchChecked(e.target.checked)} />
                    <span className="text-sm text-neutral-700">Enable notifications</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Section 4: Feedback & Status */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">
            4. Feedback & Status
          </h2>

          <div className="space-y-6">
            {/* Badges */}
            <Card>
              <h3 className="text-lg font-semibold text-neutral-800 mb-4">Badges</h3>
              <div className="flex items-center gap-3 flex-wrap">
                <Badge variant="default">Default</Badge>
                <Badge variant="primary">Primary</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="error">Error</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="info">Info</Badge>
                <Badge variant="primary" icon="mdi:star">Premium</Badge>
                <Badge variant="success" dot>Online</Badge>
              </div>
            </Card>

            {/* Alerts */}
            <Card>
              <h3 className="text-lg font-semibold text-neutral-800 mb-4">Alerts</h3>
              <div className="space-y-3">
                <Alert variant="success">Lead analyzed successfully!</Alert>
                <Alert variant="error" title="Error">Failed to analyze lead. Please try again.</Alert>
                <Alert variant="warning">You have 5 credits remaining.</Alert>
                <Alert variant="info" onDismiss={() => alert('Dismissed')}>
                  Pro tip: Use bulk upload for faster analysis.
                </Alert>
              </div>
            </Card>

            {/* Spinners */}
            <Card>
              <h3 className="text-lg font-semibold text-neutral-800 mb-4">Spinners</h3>
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-center gap-2">
                  <Spinner size="sm" variant="primary" />
                  <span className="text-xs text-neutral-600">Small</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Spinner size="md" variant="primary" />
                  <span className="text-xs text-neutral-600">Medium</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Spinner size="lg" variant="primary" />
                  <span className="text-xs text-neutral-600">Large</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Spinner size="md" variant="neutral" />
                  <span className="text-xs text-neutral-600">Neutral</span>
                </div>
              </div>
            </Card>

            {/* Progress */}
            <Card>
              <h3 className="text-lg font-semibold text-neutral-800 mb-4">Progress</h3>
              <div className="space-y-4">
                <Progress value={25} label="Analyzing..." showPercentage />
                <Progress value={65} size="lg" variant="primary" showPercentage />
                <Progress value={100} variant="secondary" />
              </div>
            </Card>
          </div>
        </section>

        {/* Section 5: Data Display */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">
            5. Data Display
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Avatars */}
            <Card>
              <h3 className="text-lg font-semibold text-neutral-800 mb-4">Avatars</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar name="John Doe" size="sm" />
                  <Avatar name="Jane Smith" size="md" />
                  <Avatar name="Bob Johnson" size="lg" />
                  <Avatar name="Alice Williams" size="xl" />
                </div>
                <div className="flex items-center gap-4">
                  <Avatar name="Online User" status="online" />
                  <Avatar name="Offline User" status="offline" />
                  <Avatar name="Away User" status="away" />
                  <Avatar name="Busy User" status="busy" />
                </div>
              </div>
            </Card>

            {/* Cards */}
            <Card>
              <h3 className="text-lg font-semibold text-neutral-800 mb-4">Card Variants</h3>
              <div className="space-y-3">
                <Card padding="compact">Compact padding</Card>
                <Card padding="default">Default padding</Card>
                <Card padding="spacious">Spacious padding</Card>
                <Card hoverable>Hoverable card</Card>
              </div>
            </Card>

            {/* Tooltips */}
            <Card>
              <h3 className="text-lg font-semibold text-neutral-800 mb-4">Tooltips</h3>
              <div className="flex items-center gap-4 flex-wrap">
                <Tooltip content="This is a tooltip" position="top">
                  <Button variant="secondary">Hover Top</Button>
                </Tooltip>
                <Tooltip content="Tooltip on the bottom" position="bottom">
                  <Button variant="secondary">Hover Bottom</Button>
                </Tooltip>
                <Tooltip content="Left tooltip" position="left">
                  <Button variant="secondary">Hover Left</Button>
                </Tooltip>
                <Tooltip content="Right tooltip" position="right">
                  <Button variant="secondary">Hover Right</Button>
                </Tooltip>
              </div>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center text-sm text-neutral-600 pt-8 border-t border-neutral-300">
          <p>Oslira Design System v1.0 • October 2025</p>
          <p className="mt-1">All components production-ready and accessible (WCAG AA)</p>
        </div>
      </div>
    </div>
  );
}
