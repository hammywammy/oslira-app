/**
 * @file Hero Section
 * @description Homepage hero with demo input
 * 
 * Replaces: HTML Hero section in index.html
 */

import { Button } from '@/shared/components/ui/Button';
import { InstagramDemo } from '../components/InstagramDemo';
import { ENV } from '@/core/config/env';

// =============================================================================
// COMPONENT
// =============================================================================

export function HeroSection() {
  const handleGetStarted = () => {
    window.location.href = `${ENV.frontendUrl}/auth/signup`;
  };

  return (
    <section className="home__hero">
      <div className="home__hero-container">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column: Copy & CTA */}
          <div className="text-left md:text-left">
            <h1 className="home__hero-title">
              Turn Hours of Instagram{' '}
              <span className="home__hero-title-gradient">Prospecting into Minutes</span>
            </h1>

            <p className="home__hero-subtitle">
              Paste an Instagram link and Oslira grades the profile, gives you a clear
              debrief, crafts personalized outreach, and suggests your next leads. Get 25
              free credits — no card required.
            </p>

            {/* Demo Component */}
            <InstagramDemo />

            {/* Primary CTA */}
            <div className="home__hero-cta-container">
              <Button
                onClick={handleGetStarted}
                variant="primary"
                size="lg"
                className="home__btn-primary-hero primary-cta-main"
              >
                Get 25 Free Credits Now
              </Button>
              <p className="home__cta-subtext">
                No credit card needed • 2-minute setup
              </p>
            </div>

            {/* Social Proof Numbers */}
            <div className="home__hero-stats">
              <div className="home__hero-stat">
                <div className="home__hero-stat-number">1,200+</div>
                <div className="home__hero-stat-label">Copywriters using Oslira</div>
              </div>
              <div className="home__hero-stat">
                <div className="home__hero-stat-number">43%</div>
                <div className="home__hero-stat-label">Average response rate</div>
              </div>
              <div className="home__hero-stat">
                <div className="home__hero-stat-number">5 hrs</div>
                <div className="home__hero-stat-label">Saved per week</div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Demo */}
          <div className="home__hero-visual">
            <div className="home__hero-demo-preview hero-demo-preview">
              <div className="home__demo-browser-frame">
                <div className="home__demo-browser-header">
                  <div className="home__demo-browser-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <div className="home__demo-browser-url">oslira.com/dashboard</div>
                </div>
                <div className="home__demo-browser-content">
                  <div className="home__demo-dashboard-preview">
                    <h3>AI Lead Analysis</h3>
                    <div className="home__demo-lead-card">
                      <div className="home__demo-lead-info">
                        <div className="home__demo-lead-avatar">JD</div>
                        <div>
                          <h4>@jane_designer</h4>
                          <p>UI/UX Designer • 8.2K followers</p>
                        </div>
                        <span className="home__demo-match-score">92% match</span>
                      </div>
                      <div className="home__demo-insights">
                        <span className="home__demo-tag">Needs copy help</span>
                        <span className="home__demo-tag">High engagement</span>
                        <span className="home__demo-tag">Business owner</span>
                      </div>
                      <div className="home__demo-outreach">
                        <p>
                          "Hi Jane! Your portfolio caught my eye - especially the fintech
                          project..."
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
