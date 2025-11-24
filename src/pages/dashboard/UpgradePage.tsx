// src/pages/dashboard/UpgradePage.tsx

import { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { PricingCard } from '@/features/billing/components/PricingCard';
import { useSubscriptionPlan } from '@/core/store/selectors';
import { useUpgrade } from '@/features/billing/hooks/useUpgrade';
import { PRICING_TIERS, PAID_TIERS, TierName } from '@/config/pricing.config';
import { toast } from 'sonner';

export function UpgradePage() {
  const [searchParams] = useSearchParams();
  const planType = useSubscriptionPlan();
  const upgradeMutation = useUpgrade();

  // Current tier from subscription or default to 'free'
  const currentTier: TierName = planType || 'free';

  // Handle success/cancel redirects from Stripe
  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      toast.success('Subscription upgraded successfully!', {
        description: 'Your new plan is now active.',
      });
    }
    if (searchParams.get('canceled') === 'true') {
      toast.info('Upgrade canceled', {
        description: 'No changes were made to your subscription.',
      });
    }
  }, [searchParams]);

  /**
   * Handle tier selection
   */
  function handleSelectTier(tierId: TierName) {
    if (tierId === currentTier) return;
    if (tierId === 'free') return; // Can't downgrade to free via this UI

    upgradeMutation.mutate(tierId);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-neutral-50 dark:to-neutral-900">
      {/* Back Arrow */}
      <div className="fixed top-6 left-6 z-50">
        <Link
          to="/dashboard"
          className="flex items-center justify-center w-10 h-10 rounded-lg bg-card border border-border hover:bg-accent transition-colors"
        >
          <Icon icon="ph:arrow-left" className="w-5 h-5 text-foreground" />
        </Link>
      </div>

      {/* Header */}
      <div className="text-center pt-16 pb-12 px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-foreground mb-4"
        >
          Upgrade Your Plan
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-muted-foreground max-w-2xl mx-auto"
        >
          Choose the plan that fits your prospecting needs
        </motion.p>

        {/* Current Plan Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary"
        >
          <Icon icon="ph:crown" className="w-4 h-4" />
          <span className="text-sm font-medium">
            Current plan: {PRICING_TIERS[currentTier].displayName}
          </span>
        </motion.div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PAID_TIERS.map((tierId, index) => (
            <motion.div
              key={tierId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <PricingCard
                tier={PRICING_TIERS[tierId]}
                isCurrentTier={tierId === currentTier}
                onSelect={() => handleSelectTier(tierId)}
                disabled={upgradeMutation.isPending}
                loading={upgradeMutation.isPending && upgradeMutation.variables === tierId}
              />
            </motion.div>
          ))}
        </div>

        {/* Error Display */}
        {upgradeMutation.isError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-center"
          >
            <p className="text-destructive">
              {upgradeMutation.error?.message || 'Failed to start upgrade. Please try again.'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
