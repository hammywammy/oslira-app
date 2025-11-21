// src/pages/marketing/PricingPage.tsx

/**
 * PRICING PAGE - PUBLIC MARKETING VERSION
 * 
 * Public-facing pricing page for oslira.com
 * Shows all 5 tiers including Free
 * 
 * ROUTE: /pricing
 * DOMAIN: oslira.com (marketing)
 * AUTH: Public (no authentication required)
 * 
 * DESIGN:
 * - "Concert hall" aesthetic (clean, professional, subtle)
 * - Inspired by Claude.ai pricing page
 * - Centered layout with generous spacing
 * - Clear tier comparison
 * - Strategic copy integration from Oslira copy doc
 * 
 * FLOW:
 * - User browses tiers
 * - Clicks CTA → Redirects to /auth/signup with tier pre-selected
 * - After signup → Onboarding → Dashboard
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { PricingCard } from '@/features/billing/components/PricingCard';
import { PRICING_TIERS, ALL_TIERS, TierName } from '@/config/pricing.config';
import { Logo } from '@/shared/components/ui/Logo';

// =============================================================================
// COMPONENT
// =============================================================================

export function PricingPage() {
  const navigate = useNavigate();
  const [selectedTier, setSelectedTier] = useState<TierName | null>(null);

  /**
   * Handle tier selection
   * Navigates to signup with tier parameter
   */
  function handleSelectTier(tierId: TierName) {
    if (tierId === 'free') {
      // Free tier → direct to signup
      navigate('/auth/signup');
    } else {
      // Paid tier → signup with tier selected
      navigate(`/auth/signup?tier=${tierId}`);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-neutral-50 dark:to-neutral-900">
      
      {/* =====================================================================
          HEADER / NAVIGATION
          ===================================================================== */}
      
      <header className="sticky top-0 z-sticky bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2.5 group">
              <Logo size="md" />
              <span className="text-xl font-semibold text-foreground">
                Oslira
              </span>
            </a>

            {/* Nav Actions */}
            <div className="flex items-center gap-4">
              <a
                href="/auth/login"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Sign In
              </a>
              <a
                href="/auth/signup"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* =====================================================================
          HERO SECTION
          ===================================================================== */}
      
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Plans that grow with you
          </h1>
          <p className="text-xl text-muted-foreground mb-4">
            Know your prospect better in 10 seconds than most people do in 10 minutes.
          </p>
          <p className="text-base text-muted-foreground/80">
            AI-powered Instagram prospecting that turns hours of manual research into instant intelligence.
          </p>
        </motion.div>
      </section>

      {/* =====================================================================
          PRICING CARDS
          ===================================================================== */}
      
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 items-start">
          {ALL_TIERS.map((tierId) => {
            const tier = PRICING_TIERS[tierId];
            return (
              <PricingCard
                key={tier.id}
                tier={tier}
                onSelect={handleSelectTier}
                loading={selectedTier === tierId}
              />
            );
          })}
        </div>
      </section>

      {/* =====================================================================
          VALUE PROPS SECTION
          ===================================================================== */}
      
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-border">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Everything you need to win more deals
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stop guessing who your prospect is. Get instant insights that would take hours to find manually.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <ValueProp
            icon="ph:lightning-fill"
            title="10-Second Research"
            description="Turn 10 minutes of profile scrolling into one click. Research 50 prospects in the time it used to take for 3."
          />

          {/* Feature 2 */}
          <ValueProp
            icon="ph:brain-fill"
            title="AI That Reads People"
            description="Decode personality, communication style, and buying signals from social behavior patterns humans miss."
          />

          {/* Feature 3 */}
          <ValueProp
            icon="ph:target-fill"
            title="Know What to Say"
            description="Get personalized outreach angles and message starters that feel like you've known them for years."
          />
        </div>
      </section>

      {/* =====================================================================
          FAQ SECTION
          ===================================================================== */}
      
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center text-foreground mb-12">
          Frequently Asked Questions
        </h2>

        <div className="space-y-6">
          <FAQItem
            question="What are credits used for?"
            answer="Credits are used for Deep and X-Ray analyses that provide comprehensive personality profiling, buying signals, and personalized outreach strategies. Light analyses are separate and included in your monthly quota."
          />

          <FAQItem
            question="What happens to unused credits?"
            answer="Credits reset at the start of each billing period and don't roll over. This ensures you always have fresh credits to use and keeps pricing simple."
          />

          <FAQItem
            question="Can I upgrade or downgrade anytime?"
            answer="Yes! Upgrades take effect immediately with prorated billing. Downgrades are scheduled for the end of your current billing period."
          />

          <FAQItem
            question="What's the difference between Light, Deep, and X-Ray?"
            answer="Light analyses provide quick profile overviews (free within quota). Deep analyses include personality profiling and buying signals (1 credit). X-Ray adds advanced psychographic analysis and custom outreach strategies (2 credits)."
          />

          <FAQItem
            question="Is there a free trial?"
            answer="The Free tier includes 10 credits and 10 light analyses—perfect for testing the platform. No credit card required."
          />
        </div>
      </section>

      {/* =====================================================================
          CTA SECTION
          ===================================================================== */}
      
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-primary/10 via-secondary/5 to-transparent rounded-3xl border border-primary/20 p-12 text-center"
        >
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to transform your prospecting?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join professionals who've replaced manual research with AI intelligence.
          </p>
          <div className="flex items-center justify-center gap-4">
            <a
              href="/auth/signup"
              className="px-8 py-4 bg-primary text-primary-foreground rounded-xl text-base font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl"
            >
              Start Free Today
            </a>
            <a
              href="/"
              className="px-8 py-4 bg-secondary text-secondary-foreground rounded-xl text-base font-semibold hover:bg-secondary/90 transition-all"
            >
              Learn More
            </a>
          </div>
        </motion.div>
      </section>

      {/* =====================================================================
          FOOTER
          ===================================================================== */}
      
      <footer className="border-t border-border py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Logo size="sm" />
              <span className="text-sm text-muted-foreground">
                © 2025 Oslira. All rights reserved.
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="/terms" className="hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="/privacy" className="hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="/help" className="hover:text-foreground transition-colors">
                Help
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// =============================================================================
// SUBCOMPONENTS
// =============================================================================

function ValueProp({ 
  icon, 
  title, 
  description 
}: { 
  icon: string; 
  title: string; 
  description: string; 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <div className="w-14 h-14 mx-auto mb-4 bg-primary/10 rounded-2xl flex items-center justify-center">
        <Icon icon={icon} className="w-7 h-7 text-primary" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground">
        {description}
      </p>
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
        <span className="font-semibold text-foreground">{question}</span>
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
