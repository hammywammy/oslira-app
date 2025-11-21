// src/pages/dashboard/UpgradePage.tsx

/**
 * UPGRADE PAGE - IN-APP VERSION
 * 
 * Authenticated upgrade page for app.oslira.com
 * Shows paid tiers only (Growth → Enterprise)
 * 
 * ROUTE: /upgrade
 * DOMAIN: app.oslira.com
 * AUTH: Protected (requires authentication)
 * 
 * FEATURES:
 * - Shows current tier with badge
 * - Hides Free tier (users already authenticated)
 * - Disables current tier CTA
 * - Handles upgrade flow with Stripe Checkout
 * - Success/error notifications via URL params
 * 
 * FLOW:
 * 1. User views pricing cards
 * 2. Clicks "Upgrade to X"
 * 3. Redirects to Stripe Checkout
 * 4. Payment completes → webhook updates subscription
 * 5. User returns to /upgrade?success=true
 * 6. Shows success message, refreshes data
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { PricingCard } from '@/features/billing/components/PricingCard';
import { PRICING_TIERS, PAID_TIERS, TierName } from '@/config/pricing.config';

// =============================================================================
// COMPONENT
// =============================================================================

export function UpgradePage() {
  const [selectedTier, setSelectedTier] = useState<TierName | null>(null);

  // TODO: Replace with actual subscription data from backend
  // For now, using dummy data for visual demonstration
  const currentTier: TierName = 'free';

  /**
   * Handle tier selection
   * TODO: Implement actual upgrade logic with Stripe Checkout
   */
  function handleSelectTier(tierId: string) {
    setSelectedTier(tierId as TierName);
    console.log('Selected tier:', tierId);
    // TODO: Integrate with backend upgrade endpoint
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-neutral-50 dark:to-neutral-900">

      {/* =====================================================================
          HERO SECTION
          ===================================================================== */}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Upgrade your plan
          </h1>
          <p className="text-lg text-muted-foreground mb-2">
            Choose the plan that matches your prospecting volume
          </p>

          {/* Current Tier Indicator */}
          <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-primary/10 rounded-full">
            <Icon icon="ph:check-circle-fill" className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-foreground">
              Current plan: <span className="font-bold">{PRICING_TIERS[currentTier].displayName}</span>
            </span>
          </div>
        </motion.div>
      </section>

      {/* =====================================================================
          PRICING CARDS (PAID TIERS ONLY)
          ===================================================================== */}
      
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {PAID_TIERS.map((tierId) => {
            const tier = PRICING_TIERS[tierId];
            const isCurrentTier = tierId === currentTier;

            return (
              <PricingCard
                key={tier.id}
                tier={tier}
                isCurrentTier={isCurrentTier}
                onSelect={handleSelectTier}
                loading={selectedTier === tierId}
                disabled={false}
              />
            );
          })}
        </div>
      </section>

      {/* =====================================================================
          INFORMATION SECTIONS
          ===================================================================== */}
      
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        
        {/* How Credits Work */}
        <InfoSection
          icon="ph:coins-fill"
          title="How credits work"
          description="Credits are used for Deep and X-Ray analyses. Light analyses are free within your monthly quota. All credits and quotas reset at the start of each billing period and don't roll over."
        />

        {/* Upgrade Process */}
        <InfoSection
          icon="ph:arrow-up-bold"
          title="Upgrading your plan"
          description="Upgrades take effect immediately. You'll receive the difference in credits for the current period, and billing will be prorated. You can upgrade anytime."
        />

        {/* Downgrade Process */}
        <InfoSection
          icon="ph:arrow-down-bold"
          title="Downgrading your plan"
          description="Downgrades are scheduled for the end of your current billing period. You'll keep your current tier benefits until then. Contact support to downgrade."
        />

        {/* Support */}
        <InfoSection
          icon="ph:chat-circle-dots-fill"
          title="Need help deciding?"
          description="Our team is here to help you choose the right plan for your needs. Contact support or schedule a call to discuss your prospecting volume and goals."
          ctaText="Contact Support"
          ctaHref="mailto:support@oslira.com"
        />
      </section>

      {/* =====================================================================
          FAQ SECTION
          ===================================================================== */}
      
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-center text-foreground mb-8">
          Common Questions
        </h2>

        <div className="space-y-4">
          <FAQItem
            question="What happens to my data if I downgrade?"
            answer="All your analysis history is preserved according to your new tier's retention policy. For example, downgrading from Pro (180 days) to Growth (60 days) means analyses older than 60 days will eventually be archived."
          />

          <FAQItem
            question="Can I cancel anytime?"
            answer="Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your current billing period. After that, you'll be moved to the Free tier."
          />

          <FAQItem
            question="Do unused credits roll over?"
            answer="No, credits reset at the start of each billing period. This keeps pricing simple and ensures you always have fresh credits to use."
          />

          <FAQItem
            question="How does prorated billing work?"
            answer="When you upgrade mid-cycle, you're charged the prorated difference for the remaining days in your billing period. Your next renewal will be at the full price of your new tier."
          />
        </div>
      </section>

      {/* =====================================================================
          BACK TO DASHBOARD
          ===================================================================== */}
      
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <a
          href="/dashboard"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Icon icon="ph:arrow-left" className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </a>
      </section>
    </div>
  );
}

// =============================================================================
// SUBCOMPONENTS
// =============================================================================

function InfoSection({
  icon,
  title,
  description,
  ctaText,
  ctaHref,
}: {
  icon: string;
  title: string;
  description: string;
  ctaText?: string;
  ctaHref?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex items-start gap-4"
    >
      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
        <Icon icon={icon} className="w-5 h-5 text-primary" />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          {description}
        </p>
        {ctaText && ctaHref && (
          <a
            href={ctaHref}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            {ctaText}
            <Icon icon="ph:arrow-right" className="w-4 h-4" />
          </a>
        )}
      </div>
    </motion.div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-accent/50 transition-colors"
      >
        <span className="font-medium text-foreground">{question}</span>
        <Icon
          icon={isOpen ? 'ph:minus' : 'ph:plus'}
          className="w-5 h-5 text-muted-foreground flex-shrink-0"
        />
      </button>
      {isOpen && (
        <div className="px-6 py-4 border-t border-border bg-muted/30">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {answer}
          </p>
        </div>
      )}
    </div>
  );
}
