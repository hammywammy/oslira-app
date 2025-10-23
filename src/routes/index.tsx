// src/routes/index.tsx
/**
 * @file Router Configuration
 * @description Centralized route definitions with proper Suspense boundaries
 */

import { createBrowserRouter } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { HomePage } from '@/pages/marketing/HomePage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { SignupPage } from '@/pages/auth/SignupPage';
import { OAuthCallbackPage } from '@/pages/auth/OAuthCallbackPage';
import { OnboardingPage } from '@/pages/onboarding/OnboardingPage';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';

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
// LAZY LOADED PAGES (with Suspense wrapper)
// =============================================================================

const TailwindShowcase = lazy(() => import('@/pages/showcase/TailwindShowcase'));
const FramerShowcase = lazy(() => import('@/pages/showcase/FramerShowcase'));
const ComponentLab = lazy(() => import('@/pages/showcase/ComponentLab'));
const DarkModeShowcase = lazy(() => import('@/pages/showcase/DarkModeShowcase'));
const ChartsShowcase = lazy(() => import('@/pages/showcase/ChartsShowcase'));

// Helper to wrap lazy components with Suspense
const withSuspense = (Component: React.LazyExoticComponent<() => JSX.Element>) => (
  <Suspense fallback={<LoadingFallback />}>
    <Component />
  </Suspense>
);

// =============================================================================
// ROUTER CONFIGURATION
// =============================================================================

export const router = createBrowserRouter([
  // ============================================================
  // MARKETING ROUTES (Public)
  // ============================================================
  {
    path: '/',
    element: <HomePage />,
  },

  // ============================================================
  // AUTH ROUTES (Public)
  // ============================================================
  {
    path: '/auth/login',
    element: <LoginPage />,
  },
  {
    path: '/auth/signup',
    element: <SignupPage />,
  },
  {
    path: '/auth/callback',
    element: <OAuthCallbackPage />,
  },

  // ============================================================
  // ONBOARDING ROUTE (Protected - no onboarding required)
  // ============================================================
  {
    path: '/onboarding',
    element: (
      <ProtectedRoute requireOnboarding={false}>
        <OnboardingPage />
      </ProtectedRoute>
    ),
  },

  // ============================================================
  // SHOWCASE ROUTES (Public - for testing)
  // ============================================================
  {
    path: '/showcase/tailwind',
    element: withSuspense(TailwindShowcase),
  },
  {
    path: '/showcase/framer',
    element: withSuspense(FramerShowcase),
  },
  {
    path: '/showcase/components',
    element: withSuspense(ComponentLab),
  },
  {
    path: '/showcase/darkmode',
    element: withSuspense(DarkModeShowcase),
  },
  {
    path: '/showcase/charts',
    element: withSuspense(ChartsShowcase),
  },

  // ============================================================
  // APP ROUTES (Protected)
  // ============================================================
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-screen bg-slate-50">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Dashboard</h1>
            <p className="text-slate-600">Coming soon...</p>
          </div>
        </div>
      </ProtectedRoute>
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
