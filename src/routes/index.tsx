/**
 * @file Router Configuration
 * @description Centralized route definitions
 * 
 * Path: src/routes/index.tsx
 */

import { createBrowserRouter } from 'react-router-dom';
import { HomePage } from '@/pages/marketing/HomePage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { SignupPage } from '@/pages/auth/SignupPage';
import { OAuthCallbackPage } from '@/pages/auth/OAuthCallbackPage';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';

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
  {
    path: '/pricing',
    element: <div>Pricing Page (TODO)</div>, // Build in Phase 4
  },
  {
    path: '/security',
    element: <div>Security Page (TODO)</div>, // Build in Phase 4
  },
  {
    path: '/about',
    element: <div>About Page (TODO)</div>, // Build in Phase 4
  },
  {
    path: '/help',
    element: <div>Help Page (TODO)</div>, // Build in Phase 4
  },
  {
    path: '/contact-hub',
    element: <div>Contact Page (TODO)</div>, // Build in Phase 4
  },
  {
    path: '/status',
    element: <div>Status Page (TODO)</div>, // Build in Phase 4
  },
  {
    path: '/terms',
    element: <div>Terms Page (TODO)</div>, // Build in Phase 4
  },
  {
    path: '/privacy',
    element: <div>Privacy Page (TODO)</div>, // Build in Phase 4
  },
  {
    path: '/refund',
    element: <div>Refund Policy Page (TODO)</div>, // Build in Phase 4
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
  {
    path: '/auth/reset-password',
    element: <div>Reset Password Page (TODO)</div>, // Build in Phase 4
  },

  // ============================================================
  // APP ROUTES (Protected)
  // ============================================================
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <div>Dashboard (TODO)</div>
      </ProtectedRoute>
    ),
  },
  {
    path: '/leads',
    element: (
      <ProtectedRoute>
        <div>Leads Page (TODO)</div>
      </ProtectedRoute>
    ),
  },
  {
    path: '/analytics',
    element: (
      <ProtectedRoute>
        <div>Analytics Page (TODO)</div>
      </ProtectedRoute>
    ),
  },
  {
    path: '/settings',
    element: (
      <ProtectedRoute>
        <div>Settings Page (TODO)</div>
      </ProtectedRoute>
    ),
  },

  // ============================================================
  // 404 NOT FOUND
  // ============================================================
  {
    path: '*',
    element: (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-gray-600 mb-6">Page not found</p>
          <a
            href="/"
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            Go Home
          </a>
        </div>
      </div>
    ),
  },
]);

export default router;
