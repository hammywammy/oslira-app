// src/routes/index.tsx

/**
 * ROUTER CONFIGURATION - OSLIRA PRODUCTION
 * 
 * Pure routing with domain enforcement.
 * Domain Architecture:
 * - oslira.com → Marketing (including /pricing)
 * - app.oslira.com → Application (auth + dashboard + upgrade)
 * 
 * UPDATED: Added /pricing (marketing) and /upgrade (in-app) routes
 */

import { createBrowserRouter } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { HomePage } from '@/pages/marketing/HomePage';
import { PricingPage } from '@/pages/marketing/PricingPage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { SignupPage } from '@/pages/auth/SignupPage';
import { OAuthCallbackPage } from '@/pages/auth/OAuthCallbackPage';
import { OnboardingPage } from '@/pages/onboarding/OnboardingPage';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { UpgradePage } from '@/pages/dashboard/UpgradePage';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';

import { SettingsPage } from '@/pages/settings/SettingsPage';
import { GeneralTab } from '@/pages/settings/tabs/GeneralTab';
import { AccountTab } from '@/pages/settings/tabs/AccountTab';
import { PrivacyTab } from '@/pages/settings/tabs/PrivacyTab';
import { BillingTab } from '@/pages/settings/tabs/BillingTab';
import { UsageTab } from '@/pages/settings/tabs/UsageTab';

import { isAppDomain, isMarketingDomain, getUrlForDomain } from '@/core/auth/environment';

// =============================================================================
// LAZY LOADED COMPONENTS (Marketing Showcase Pages)
// =============================================================================

const TailwindShowcase = lazy(() => import('@/pages/showcase/TailwindShowcase'));
const FramerShowcase = lazy(() => import('@/pages/showcase/FramerShowcase'));
const ComponentLab = lazy(() => import('@/pages/showcase/ComponentLab'));
const DarkModeShowcase = lazy(() => import('@/pages/showcase/DarkModeShowcase'));
const ChartsShowcase = lazy(() => import('@/pages/showcase/ChartsShowcase'));
const ComponentShowcase = lazy(() => import('@/pages/showcase/ComponentShowcase'));
const ThemeTest = lazy(() => import('@/pages/showcase/ThemeTest'));

// =============================================================================
// DOMAIN GUARD
// =============================================================================

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

// =============================================================================
// ROUTER
// =============================================================================

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
  // MARKETING SHOWCASE PAGES (Development)
  // ============================================================
  
  {
    path: '/showcase/tailwind',
    element: (
      <DomainGuard domain="marketing">
        <Suspense fallback={<div>Loading...</div>}>
          <TailwindShowcase />
        </Suspense>
      </DomainGuard>
    ),
  },
  {
    path: '/showcase/framer',
    element: (
      <DomainGuard domain="marketing">
        <Suspense fallback={<div>Loading...</div>}>
          <FramerShowcase />
        </Suspense>
      </DomainGuard>
    ),
  },
  {
    path: '/showcase/component-lab',
    element: (
      <DomainGuard domain="marketing">
        <Suspense fallback={<div>Loading...</div>}>
          <ComponentLab />
        </Suspense>
      </DomainGuard>
    ),
  },
  {
    path: '/showcase/dark-mode',
    element: (
      <DomainGuard domain="marketing">
        <Suspense fallback={<div>Loading...</div>}>
          <DarkModeShowcase />
        </Suspense>
      </DomainGuard>
    ),
  },
  {
    path: '/showcase/charts',
    element: (
      <DomainGuard domain="marketing">
        <Suspense fallback={<div>Loading...</div>}>
          <ChartsShowcase />
        </Suspense>
      </DomainGuard>
    ),
  },
  {
    path: '/showcase/components',
    element: (
      <DomainGuard domain="marketing">
        <Suspense fallback={<div>Loading...</div>}>
          <ComponentShowcase />
        </Suspense>
      </DomainGuard>
    ),
  },
  {
    path: '/showcase/theme-test',
    element: (
      <DomainGuard domain="marketing">
        <Suspense fallback={<div>Loading...</div>}>
          <ThemeTest />
        </Suspense>
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
