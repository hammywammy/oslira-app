// src/App.tsx
/**
 * @file Root Application Component
 * @description Sets up all providers and routing with subdomain-aware redirect
 * 
 * SUBDOMAIN ROUTING:
 * - app.oslira.com/ → Automatically redirects to /auth/login
 * - oslira.com/ → Shows marketing homepage
 * 
 * Architecture:
 * - Client-side detection (required because app.oslira.com is a Pages custom domain)
 * - Zero overhead: redirect happens on mount before UI renders
 * - Works in dev and production
 */

import { useEffect } from 'react';
import { RouterProvider, useLocation, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import { AuthProvider } from '@/features/auth/contexts/AuthProvider';
import { ShowcaseNav } from '@/shared/components/dev/ShowcaseNav'; 
import { router } from '@/routes';

// =============================================================================
// QUERY CLIENT SETUP
// =============================================================================
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// =============================================================================
// SUBDOMAIN REDIRECT COMPONENT
// =============================================================================
/**
 * Detects if user is on app subdomain at root and redirects to /auth/login
 * This runs once on app mount before any other routing
 */
function SubdomainRedirect() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const hostname = window.location.hostname;
    const pathname = location.pathname;

    // Check if we're on app subdomain
    const isAppSubdomain = 
      hostname === 'app.oslira.com' ||
      hostname === 'staging-app.oslira.com' ||
      hostname === 'app.localhost' || // Local dev with hosts file
      hostname.startsWith('oslira-app-production.pages.dev'); // Direct Pages URL

    // Only redirect if at root path
    const isRoot = pathname === '/';

    if (isAppSubdomain && isRoot) {
      console.log('[SubdomainRedirect] App subdomain detected, redirecting to /auth/login');
      navigate('/auth/login', { replace: true });
    }
  }, [navigate, location.pathname]);

  return null;
}

// =============================================================================
// APP COMPONENT
// =============================================================================
function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SubdomainRedirect />
          <RouterProvider router={router} />
          <ShowcaseNav />
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
