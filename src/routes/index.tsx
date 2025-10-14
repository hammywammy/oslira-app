/**
 * @file Router Configuration
 * @description Centralized route definitions
 */

import { createBrowserRouter } from 'react-router-dom';
import { HomePage } from '@/pages/marketing/HomePage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { SignupPage } from '@/pages/auth/SignupPage';
import { OAuthCallbackPage } from '@/pages/auth/OAuthCallbackPage';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';

// Lazy load showcase pages
import { lazy } from 'react';
const TailwindShowcase = lazy(() => import('@/pages/showcase/TailwindShowcase'));
const FramerShowcase = lazy(() => import('@/pages/showcase/FramerShowcase'));
const ComponentLab = lazy(() => import('@/pages/showcase/ComponentLab'));

export const router = createBrowserRouter([
  // ============================================================
  // MARKETING ROUTES (Public)
  // ============================================================
  {
    path: '/',
    element: <HomePage />,
  },

  // ============================================================
  // SHOWCASE ROUTES (Public - for testing)
  // ============================================================
  {
    path: '/showcase/tailwind',
    element: <TailwindShowcase />,
  },
  {
    path: '/showcase/framer',
    element: <FramerShowcase />,
  },
  {
  path: '/showcase/components',
  element: <ComponentLab />,
},
    {
    path: '/showcase/darkmode',  // ← ADD THIS ROUTE
    element: <DarkModeShowcase />,
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

  // ============================================================
  // 404 NOT FOUND
  // ============================================================
  {
    path: '*',
    element: (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-white mb-4">404</h1>
          <p className="text-gray-400 mb-6 text-xl">Page not found</p>
          <a
            href="/"
            className="text-cyan-400 hover:text-cyan-300 font-semibold text-lg"
          >
            Go Home
          </a>
        </div>
      </div>
    ),
  },
]);

export default router;
