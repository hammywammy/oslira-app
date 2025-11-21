// src/pages/settings/tabs/UsageTab.tsx

/**
 * USAGE TAB - ANALYTICS & CREDIT TRACKING
 * 
 * Placeholder for usage analytics and credit tracking:
 * - Credit usage over time
 * - Analysis type breakdown
 * - Usage statistics
 * - Export usage reports
 * 
 * FUTURE INTEGRATION:
 * - Connect to analytics API
 * - Add usage charts (Recharts)
 * - Add detailed usage breakdown
 * - Add export functionality
 */

import { Icon } from '@iconify/react';
import { Card } from '@/shared/components/ui/Card';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';

// =============================================================================
// COMPONENT
// =============================================================================

export function UsageTab() {
  // Placeholder data (will be replaced with real analytics data)
  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Usage</h2>
        <p className="text-muted-foreground">
          Track your credit usage and analysis activity
        </p>
      </div>

      {/* Current Period Overview */}
      <Card className="p-6">
        <div className="space-y-6">
          {/* Section Header */}
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon icon="ph:chart-line" className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground">Current Period</h3>
              <p className="text-sm text-muted-foreground">{currentMonth}</p>
            </div>
          </div>

          {/* Usage Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <Icon icon="ph:coins" className="w-5 h-5 text-primary" />
                <Badge variant="primary" size="sm">Free</Badge>
              </div>
              <div className="text-2xl font-bold text-foreground">0 / 25</div>
              <div className="text-xs text-muted-foreground mt-1">AI Credits Used</div>
              <div className="w-full bg-muted rounded-full h-1.5 mt-3">
                <div className="bg-primary h-1.5 rounded-full" style={{ width: '0%' }} />
              </div>
            </div>

            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <Icon icon="ph:lightning" className="w-5 h-5 text-amber-500" />
                <Badge variant="secondary" size="sm">Light</Badge>
              </div>
              <div className="text-2xl font-bold text-foreground">0</div>
              <div className="text-xs text-muted-foreground mt-1">Light Analyses</div>
            </div>

            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <Icon icon="ph:brain" className="w-5 h-5 text-blue-500" />
                <Badge variant="secondary" size="sm">Deep</Badge>
              </div>
              <div className="text-2xl font-bold text-foreground">0</div>
              <div className="text-xs text-muted-foreground mt-1">Deep Analyses</div>
            </div>

            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <Icon icon="ph:users" className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-foreground">0</div>
              <div className="text-xs text-muted-foreground mt-1">Leads Analyzed</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Usage Chart Placeholder */}
      <Card className="p-6">
        <div className="space-y-6">
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon icon="ph:chart-bar" className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Usage Trends</h3>
                <p className="text-sm text-muted-foreground">Credit usage over time</p>
              </div>
            </div>
            <Button variant="secondary" size="sm" disabled>
              <Icon icon="ph:calendar" className="w-4 h-4" />
              Last 30 Days
            </Button>
          </div>

          {/* Chart Placeholder */}
          <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-border rounded-lg">
            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <Icon icon="ph:chart-line" className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="text-sm font-medium text-foreground mb-1">No usage data yet</div>
            <div className="text-xs text-muted-foreground">
              Start analyzing leads to see your usage trends
            </div>
          </div>
        </div>
      </Card>

      {/* Analysis Breakdown */}
      <Card className="p-6">
        <div className="space-y-6">
          {/* Section Header */}
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon icon="ph:list-bullets" className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Analysis Breakdown</h3>
              <p className="text-sm text-muted-foreground">
                Detailed breakdown by analysis type
              </p>
            </div>
          </div>

          {/* Empty State */}
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <Icon icon="ph:list-bullets" className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="text-sm font-medium text-foreground mb-1">No analysis history</div>
            <div className="text-xs text-muted-foreground max-w-xs">
              Your analysis activity will appear here once you start researching leads
            </div>
          </div>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="p-6">
        <div className="space-y-6">
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon icon="ph:clock-counter-clockwise" className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
                <p className="text-sm text-muted-foreground">Latest analysis actions</p>
              </div>
            </div>
            <Button variant="secondary" size="sm" disabled>
              <Icon icon="ph:download" className="w-4 h-4" />
              Export
            </Button>
          </div>

          {/* Empty State */}
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <Icon icon="ph:clock-counter-clockwise" className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="text-sm font-medium text-foreground mb-1">No recent activity</div>
            <div className="text-xs text-muted-foreground max-w-xs">
              Your recent analysis activity will be tracked here
            </div>
          </div>
        </div>
      </Card>

      {/* Usage Limits Info */}
      <Card className="p-6 bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900">
        <div className="flex items-start gap-3">
          <Icon icon="ph:info" className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div className="space-y-2">
            <div className="text-sm font-medium text-blue-900 dark:text-blue-100">
              About Credit Usage
            </div>
            <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
              <p>• Light analyses use 1 credit each</p>
              <p>• Deep analyses use 2 credits each</p>
              <p>• Credits reset monthly on your billing date</p>
              <p>• Unused credits do not roll over</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default UsageTab;
