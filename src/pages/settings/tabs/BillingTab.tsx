// src/pages/settings/tabs/BillingTab.tsx

/**
 * BILLING TAB - SUBSCRIPTION & PAYMENTS
 *
 * Displays current subscription and billing information:
 * - Current plan information from subscription store
 * - Credits and light analyses from credits store
 * - Payment methods (future)
 * - Billing history (future)
 * - Upgrade/downgrade options
 */

import { Icon } from '@iconify/react';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Badge } from '@/shared/components/ui/Badge';
import { Link } from 'react-router-dom';
import { useCurrentTier, useCurrentPeriodEnd } from '@/features/billing/store/subscriptionStore';
import { useCurrentBalance, useLightBalance } from '@/features/credits/store/creditsStore';
import { PRICING_TIERS } from '@/config/pricing.config';

// =============================================================================
// HELPERS
// =============================================================================

function formatDate(dateString: string | null): string {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return 'N/A';
  }
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// =============================================================================
// COMPONENT
// =============================================================================

export function BillingTab() {
  // Get real data from stores (hydrated by AuthProvider via bootstrap)
  const tier = useCurrentTier();
  const periodEnd = useCurrentPeriodEnd();
  const creditsRemaining = useCurrentBalance();
  const lightAnalysesRemaining = useLightBalance();

  // Get display name from pricing config
  const currentPlan = PRICING_TIERS[tier]?.displayName ?? capitalize(tier);
  const isFree = tier === 'free';

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Billing</h2>
        <p className="text-muted-foreground">
          Manage your subscription and billing information
        </p>
      </div>

      {/* Current Plan */}
      <Card className="p-6">
        <div className="space-y-6">
          {/* Section Header */}
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon icon="ph:package" className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground">Current Plan</h3>
              <p className="text-sm text-muted-foreground">
                Your subscription details and usage
              </p>
            </div>
            <Badge variant="primary">{currentPlan}</Badge>
          </div>

          {/* Plan Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <Icon icon="ph:coins" className="w-4 h-4" />
                AI Credits
              </div>
              <div className="text-2xl font-bold text-foreground">{creditsRemaining}</div>
              <div className="text-xs text-muted-foreground mt-1">remaining this month</div>
            </div>

            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <Icon icon="ph:lightning" className="w-4 h-4" />
                Light Analyses
              </div>
              <div className="text-2xl font-bold text-foreground">{lightAnalysesRemaining}</div>
              <div className="text-xs text-muted-foreground mt-1">remaining this month</div>
            </div>

            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <Icon icon="ph:calendar" className="w-4 h-4" />
                Renewal Date
              </div>
              <div className="text-2xl font-bold text-foreground">
                {isFree ? 'N/A' : formatDate(periodEnd)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {isFree ? 'free plan' : 'next billing date'}
              </div>
            </div>
          </div>

          {/* Upgrade CTA */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
            <div>
              <div className="text-sm font-semibold text-foreground">Upgrade for More Credits</div>
              <div className="text-xs text-muted-foreground mt-1">
                Get more AI credits and unlock advanced features
              </div>
            </div>
            <Link to="/upgrade">
              <Button variant="primary" size="sm">
                <Icon icon="ph:arrow-up" className="w-4 h-4" />
                View Plans
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* Payment Method */}
      <Card className="p-6">
        <div className="space-y-6">
          {/* Section Header */}
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon icon="ph:credit-card" className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Payment Method</h3>
              <p className="text-sm text-muted-foreground">
                Manage your payment information
              </p>
            </div>
          </div>

          {/* No Payment Method */}
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-3">
              <Icon icon="ph:credit-card" className="w-8 h-8 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium text-foreground">No payment method</div>
                <div className="text-xs text-muted-foreground">Add a payment method to upgrade</div>
              </div>
            </div>
            <Button variant="secondary" size="sm" disabled>
              <Icon icon="ph:plus" className="w-4 h-4" />
              Add Card
            </Button>
          </div>
        </div>
      </Card>

      {/* Billing History */}
      <Card className="p-6">
        <div className="space-y-6">
          {/* Section Header */}
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon icon="ph:receipt" className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Billing History</h3>
              <p className="text-sm text-muted-foreground">
                View and download past invoices
              </p>
            </div>
          </div>

          {/* Empty State */}
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <Icon icon="ph:receipt" className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="text-sm font-medium text-foreground mb-1">No billing history</div>
            <div className="text-xs text-muted-foreground max-w-xs">
              Your invoices will appear here once you upgrade to a paid plan
            </div>
          </div>
        </div>
      </Card>

      {/* Manage Subscription */}
      <Card className="p-6">
        <div className="space-y-6">
          {/* Section Header */}
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon icon="ph:gear" className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Subscription Management</h3>
              <p className="text-sm text-muted-foreground">
                Manage your plan and billing preferences
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link to="/upgrade" className="block">
              <button className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 transition-colors text-left">
                <div className="flex items-center gap-3">
                  <Icon icon="ph:arrow-up" className="w-5 h-5 text-primary" />
                  <div>
                    <div className="text-sm font-medium text-foreground">Upgrade Plan</div>
                    <div className="text-xs text-muted-foreground">Get more credits and features</div>
                  </div>
                </div>
                <Icon icon="ph:caret-right" className="w-5 h-5 text-muted-foreground" />
              </button>
            </Link>

            <button
              disabled
              className="w-full flex items-center justify-between p-4 rounded-lg opacity-50 cursor-not-allowed text-left"
            >
              <div className="flex items-center gap-3">
                <Icon icon="ph:pause" className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium text-foreground">Pause Subscription</div>
                  <div className="text-xs text-muted-foreground">Temporarily pause billing</div>
                </div>
              </div>
              <Icon icon="ph:caret-right" className="w-5 h-5 text-muted-foreground" />
            </button>

            <button
              disabled
              className="w-full flex items-center justify-between p-4 rounded-lg opacity-50 cursor-not-allowed text-left"
            >
              <div className="flex items-center gap-3">
                <Icon icon="ph:x-circle" className="w-5 h-5 text-red-600" />
                <div>
                  <div className="text-sm font-medium text-foreground">Cancel Subscription</div>
                  <div className="text-xs text-muted-foreground">End your subscription</div>
                </div>
              </div>
              <Icon icon="ph:caret-right" className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default BillingTab;
