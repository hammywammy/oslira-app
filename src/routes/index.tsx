/**
 * ROUTER CONFIGURATION - OSLIRA PRODUCTION
 * 
 * Pure routing with domain enforcement.
 * Domain Architecture:
 * - oslira.com → Marketing (including /pricing)
 * - app.oslira.com → Application (auth + dashboard + upgrade + settings)
 * 
 * UPDATED: Added Settings routes and Coming Soon redirects
 */

import { createBrowserRouter, Navigate } from 'react-router-dom';
import { HomePage } from '@/pages/marketing/HomePage';
import { PricingPage } from '@/pages/marketing/PricingPage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { SignupPage } from '@/pages/auth/SignupPage';
import { OAuthCallbackPage } from '@/pages/auth/OAuthCallbackPage';
import { OnboardingPage } from '@/pages/onboarding/OnboardingPage';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { UpgradePage } from '@/pages/dashboard/UpgradePage';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';

// Settings Pages
import { SettingsPage } from '@/pages/settings/SettingsPage';
import { GeneralTab } from '@/pages/settings/tabs/GeneralTab';
import { AccountTab } from '@/pages/settings/tabs/AccountTab';
import { PrivacyTab } from '@/pages/settings/tabs/PrivacyTab';
import { BillingTab } from '@/pages/settings/tabs/BillingTab';
import { UsageTab } from '@/pages/settings/tabs/UsageTab';

// Coming Soon Page
import { ComingSoonPage } from '@/pages/ComingSoonPage';

import { isAppDomain, isMarketingDomain, getUrlForDomain } from '@/core/auth/environment';

// DOMAIN GUARD
function DomainGuard({ 
  domain, 
  children 
}: { 
  domain: 'app' | 'marketing'; 
  children: JSX.Element 
}) {
  const onCorrectDomain = domain === 'app' ? isAppDomain() : isMarketingDomain();

  if (!onCorrectDomain) {
    const correctUrl = getUrlForDomain(domain);
    window.location.href = correctUrl + window.location.pathname;
    return <div>Redirecting...</div>;
  }

  return children;
}

// ROUTER
export const router = createBrowserRouter([
  // ============================================================
  // MARKETING DOMAIN (oslira.com)
  // ============================================================
  
  {
    path: '/',
    element: (
      <DomainGuard domain="marketing">
        <HomePage />
      </DomainGuard>
    ),
  },

  // ========================================
  // PRICING PAGE - PUBLIC
  // ========================================
  {
    path: '/pricing',
    element: (
      <DomainGuard domain="marketing">
        <PricingPage />
      </DomainGuard>
    ),
  },

  // ============================================================
  // AUTH PAGES (app.oslira.com)
  // ============================================================
  
  {
    path: '/auth/login',
    element: (
      <DomainGuard domain="app">
        <LoginPage />
      </DomainGuard>
    ),
  },
  {
    path: '/auth/signup',
    element: (
      <DomainGuard domain="app">
        <SignupPage />
      </DomainGuard>
    ),
  },
  {
    path: '/auth/callback',
    element: (
      <DomainGuard domain="app">
        <OAuthCallbackPage />
      </DomainGuard>
    ),
  },

  // ============================================================
  // APP DOMAIN (app.oslira.com) - Protected Routes
  // ============================================================
  
  {
    path: '/onboarding',
    element: (
      <DomainGuard domain="app">
        <ProtectedRoute requireOnboarding={false}>
          <OnboardingPage />
        </ProtectedRoute>
      </DomainGuard>
    ),
  },
  
  // ========================================
  // DASHBOARD - PRODUCTION READY
  // ========================================
  {
    path: '/dashboard',
    element: (
      <DomainGuard domain="app">
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      </DomainGuard>
    ),
  },

  // ========================================
  // UPGRADE PAGE - IN-APP BILLING
  // ========================================
  {
    path: '/upgrade',
    element: (
      <DomainGuard domain="app">
        <ProtectedRoute>
          <UpgradePage />
        </ProtectedRoute>
      </DomainGuard>
    ),
  },

  // ========================================
  // SETTINGS PAGE - NESTED ROUTES
  // ========================================
  {
    path: '/settings',
    element: (
      <DomainGuard domain="app">
        <ProtectedRoute>
          <SettingsPage />
        </ProtectedRoute>
      </DomainGuard>
    ),
    children: [
      {
        path: 'general',
        element: <GeneralTab />,
      },
      {
        path: 'account',
        element: <AccountTab />,
      },
      {
        path: 'privacy',
        element: <PrivacyTab />,
      },
      {
        path: 'billing',
        element: <BillingTab />,
      },
      {
        path: 'usage',
        element: <UsageTab />,
      },
    ],
  },

  // ========================================
  // COMING SOON PAGE
  // ========================================
  {
    path: '/coming-soon',
    element: (
      <DomainGuard domain="app">
        <ProtectedRoute>
          <ComingSoonPage />
        </ProtectedRoute>
      </DomainGuard>
    ),
  },

  // ========================================
  // PLACEHOLDER REDIRECTS → COMING SOON
  // ========================================
  {
    path: '/leads',
    element: <Navigate to="/coming-soon" replace />,
  },
  {
    path: '/analytics',
    element: <Navigate to="/coming-soon" replace />,
  },
  {
    path: '/campaigns',
    element: <Navigate to="/coming-soon" replace />,
  },
  {
    path: '/messages',
    element: <Navigate to="/coming-soon" replace />,
  },
  {
    path: '/integrations',
    element: <Navigate to="/coming-soon" replace />,
  },

  // ============================================================
  // 404 NOT FOUND
  // ============================================================
  
  {
    path: '*',
    element: (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-text mb-4">404</h1>
          <p className="text-text-secondary mb-6 text-xl">Page not found</p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    ),
  },
]);

export default router;
