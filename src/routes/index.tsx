// src/routes/index.tsx

/**
 * ROUTER CONFIGURATION
 * 
 * Pure routing - domain enforcement handled by environment manager.
 * Routes are declarative path mappings with domain guards.
 * 
 * Domain Architecture:
 * - oslira.com → Marketing (homepage + showcase pages)
 * - app.oslira.com → Application (auth, dashboard, onboarding)
 * 
 * NO business logic here. Just route declarations.
 */

import { createBrowserRouter } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { HomePage } from '@/pages/marketing/HomePage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { SignupPage } from '@/pages/auth/SignupPage';
import { OAuthCallbackPage } from '@/pages/auth/OAuthCallbackPage';
import { OnboardingPage } from '@/pages/onboarding/OnboardingPage';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { isAppDomain, isMarketingDomain, getUrlForDomain } from '@/core/auth/environment';

// =============================================================================
// DOMAIN GUARD
// =============================================================================

/**
 * Enforces domain boundaries using centralized environment detection
 * Redirects to correct domain if user is on wrong one
 */
function DomainGuard({ 
  domain, 
  children 
}: { 
  domain: 'app' | 'marketing'; 
  children: JSX.Element 
}) {
  const onCorrectDomain = domain === 'app' ? isAppDomain() : isMarketingDomain();
  
  // If on wrong domain, redirect to correct one
  if (!onCorrectDomain) {
    const correctUrl = getUrlForDomain(domain);
    window.location.replace(correctUrl + window.location.pathname);
    
    // Show loading state during redirect
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }
  
  return children;
}

// =============================================================================
// LOADING FALLBACK
// =============================================================================

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>
);

// =============================================================================
// LAZY LOADED PAGES
// =============================================================================

const TailwindShowcase = lazy(() => import('@/pages/showcase/TailwindShowcase'));
const FramerShowcase = lazy(() => import('@/pages/showcase/FramerShowcase'));
const ComponentLab = lazy(() => import('@/pages/showcase/ComponentLab'));
const DarkModeShowcase = lazy(() => import('@/pages/showcase/DarkModeShowcase'));
const ChartsShowcase = lazy(() => import('@/pages/showcase/ChartsShowcase'));

const withSuspense = (Component: React.LazyExoticComponent<() => JSX.Element>) => (
  <Suspense fallback={<LoadingFallback />}>
    <Component />
  </Suspense>
);

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
  {
    path: '/dashboard',
    element: (
      <DomainGuard domain="app">
        <ProtectedRoute>
          <div className="flex items-center justify-center min-h-screen bg-slate-50">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-slate-900 mb-4">Dashboard</h1>
              <p className="text-slate-600">Coming soon...</p>
            </div>
          </div>
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-white mb-4">404</h1>
          <p className="text-gray-400 mb-6 text-xl">Page not found</p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    ),
  },
]);

export default router;
