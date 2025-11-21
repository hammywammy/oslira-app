// src/pages/settings/tabs/PrivacyTab.tsx

/**
 * PRIVACY TAB - DATA PRIVACY & SECURITY
 * 
 * Placeholder for privacy and security features:
 * - Data sharing preferences
 * - Analytics and tracking
 * - Data export
 * - Privacy policies
 * 
 * FUTURE INTEGRATION:
 * - Connect to privacy settings API
 * - Add data export functionality
 * - Add privacy preference management
 */

import { useState } from 'react';
import { Icon } from '@iconify/react';
import { Card } from '@/shared/components/ui/Card';
import { Switch } from '@/shared/components/ui/Switch';
import { Button } from '@/shared/components/ui/Button';

// =============================================================================
// COMPONENT
// =============================================================================

export function PrivacyTab() {
  // Placeholder state (will be replaced with backend data)
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [productUpdates, setProductUpdates] = useState(true);

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Privacy</h2>
        <p className="text-muted-foreground">
          Manage your data privacy and security preferences
        </p>
      </div>

      {/* Data Collection */}
      <Card className="p-6">
        <div className="space-y-6">
          {/* Section Header */}
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon icon="ph:shield-check" className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Data Collection</h3>
              <p className="text-sm text-muted-foreground">
                Control how we collect and use your data
              </p>
            </div>
          </div>

          {/* Analytics Toggle */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="text-sm font-medium text-foreground">Usage Analytics</div>
              <div className="text-xs text-muted-foreground mt-1">
                Help us improve Oslira by sharing anonymous usage data
              </div>
            </div>
            <Switch
              checked={analyticsEnabled}
              onCheckedChange={setAnalyticsEnabled}
              disabled
            />
          </div>

          {/* AI Training Data */}
          <div className="flex items-start justify-between gap-4 pt-4 border-t border-border">
            <div className="flex-1">
              <div className="text-sm font-medium text-foreground">AI Training</div>
              <div className="text-xs text-muted-foreground mt-1">
                Allow anonymized data to help improve AI model accuracy
              </div>
            </div>
            <Switch disabled />
          </div>
        </div>
      </Card>

      {/* Communications */}
      <Card className="p-6">
        <div className="space-y-6">
          {/* Section Header */}
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon icon="ph:envelope" className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Email Preferences</h3>
              <p className="text-sm text-muted-foreground">
                Manage what emails you receive from us
              </p>
            </div>
          </div>

          {/* Marketing Emails */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="text-sm font-medium text-foreground">Marketing Emails</div>
              <div className="text-xs text-muted-foreground mt-1">
                Receive tips, case studies, and special offers
              </div>
            </div>
            <Switch
              checked={marketingEmails}
              onCheckedChange={setMarketingEmails}
              disabled
            />
          </div>

          {/* Product Updates */}
          <div className="flex items-start justify-between gap-4 pt-4 border-t border-border">
            <div className="flex-1">
              <div className="text-sm font-medium text-foreground">Product Updates</div>
              <div className="text-xs text-muted-foreground mt-1">
                Get notified about new features and improvements
              </div>
            </div>
            <Switch
              checked={productUpdates}
              onCheckedChange={setProductUpdates}
              disabled
            />
          </div>
        </div>
      </Card>

      {/* Data Management */}
      <Card className="p-6">
        <div className="space-y-6">
          {/* Section Header */}
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon icon="ph:database" className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Data Management</h3>
              <p className="text-sm text-muted-foreground">
                Access and manage your data
              </p>
            </div>
          </div>

          {/* Export Data */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="text-sm font-medium text-foreground">Export Your Data</div>
              <div className="text-xs text-muted-foreground mt-1">
                Download a copy of all your data in JSON format
              </div>
            </div>
            <Button variant="secondary" size="sm" disabled>
              <Icon icon="ph:download" className="w-4 h-4" />
              Export Data
            </Button>
          </div>

          {/* Delete Data */}
          <div className="flex items-start justify-between gap-4 pt-4 border-t border-border">
            <div className="flex-1">
              <div className="text-sm font-medium text-foreground">Delete Lead Data</div>
              <div className="text-xs text-muted-foreground mt-1">
                Permanently remove all your lead analysis data
              </div>
            </div>
            <Button variant="secondary" size="sm" disabled className="text-red-600">
              <Icon icon="ph:trash" className="w-4 h-4" />
              Delete Data
            </Button>
          </div>
        </div>
      </Card>

      {/* Legal Links */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon icon="ph:scroll" className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Legal Documents</h3>
              <p className="text-sm text-muted-foreground">
                Review our policies and terms
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <a
              href="#"
              className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors group"
            >
              <span className="text-sm text-foreground">Privacy Policy</span>
              <Icon icon="ph:arrow-right" className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
            </a>
            <a
              href="#"
              className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors group"
            >
              <span className="text-sm text-foreground">Terms of Service</span>
              <Icon icon="ph:arrow-right" className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
            </a>
            <a
              href="#"
              className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors group"
            >
              <span className="text-sm text-foreground">Cookie Policy</span>
              <Icon icon="ph:arrow-right" className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default PrivacyTab;
