// src/routes/index.tsx

/**
 * ROUTER CONFIGURATION - OSLIRA PRODUCTION
 * 
 * Pure routing with domain enforcement.
 * Domain Architecture:
 * - oslira.com → Marketing
 * - app.oslira.com → Application (auth + dashboard)
 * 
 * CRITICAL UPDATE:
 * Dashboard route now properly connected to DashboardPage component.
 */

import { createBrowserRouter } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { HomePage } from '@/pages/marketing/HomePage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { SignupPage } from '@/pages/auth/SignupPage';
import { OAuthCallbackPage } from '@/pages/auth/OAuthCallbackPage';
import { OnboardingPage } from '@/pages/onboarding/OnboardingPage';
import { DashboardPage } from '@/pages/dashboard/DashboardPage'; // ← ADDED
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { isAppDomain, isMarketingDomain, getUrlForDomain } from '@/core/auth/environment';

// =============================================================================
// LAZY LOADED COMPONENTS (Marketing Showcase Pages)
// =============================================================================

const TailwindShowcase = lazy(() => import('@/pages/showcase/TailwindShowcase'));
const FramerShowcase = lazy(() => import('@/pages/showcase/FramerShowcase'));
const ComponentLab = lazy(() => import('@/pages/showcase/ComponentLab'));
const DarkModeShowcase = lazy(() => import('@/pages/showcase/DarkModeShowcase'));
const ChartsShowcase = lazy(() => import('@/pages/showcase/ChartsShowcase'));

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
// SUSPENSE WRAPPER
// =============================================================================

function withSuspense(Component: React.LazyExoticComponent<() => JSX.Element>) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <Component />
    </Suspense>
  );
}

// =============================================================================
// ROUTES
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
  {
    path: '/showcase/tailwind',
    element: (
      <DomainGuard domain="marketing">
        {withSuspense(TailwindShowcase)}
      </DomainGuard>
    ),
  },
  {
    path: '/showcase/framer',
    element: (
      <DomainGuard domain="marketing">
        {withSuspense(FramerShowcase)}
      </DomainGuard>
    ),
  },
  {
    path: '/showcase/components',
    element: (
      <DomainGuard domain="marketing">
        {withSuspense(ComponentLab)}
      </DomainGuard>
    ),
  },
  {
    path: '/showcase/darkmode',
    element: (
      <DomainGuard domain="marketing">
        {withSuspense(DarkModeShowcase)}
      </DomainGuard>
    ),
  },
  {
    path: '/showcase/charts',
    element: (
      <DomainGuard domain="marketing">
        {withSuspense(ChartsShowcase)}
      </DomainGuard>
    ),
  },

  // ============================================================
  // APP DOMAIN (app.oslira.com) - Public Routes
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
