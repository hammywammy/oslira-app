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

import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import { AuthProvider } from '@/features/auth/contexts/AuthProvider';
import { ShowcaseNav } from '@/shared/components/dev/ShowcaseNav'; 
import { ThemeProvider } from '@/core/theme/ThemeProvider';
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
// SUBDOMAIN REDIRECT (runs before React Router mounts)
// =============================================================================
/**
 * Detects if user is on app subdomain at root and redirects to /auth/login
 * Uses native window.location to work before router context exists
 */
function checkAndRedirectSubdomain() {
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;

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
    window.location.replace('/auth/login');
    return true; // Redirect initiated
  }

  return false; // No redirect needed
}

// Execute redirect check immediately (before React even renders)
const shouldRedirect = checkAndRedirectSubdomain();

// =============================================================================
// APP COMPONENT
// =============================================================================
function App() {
  // If redirect was initiated, show minimal loading state while redirecting
  if (shouldRedirect) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" enableSystem={true}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <RouterProvider router={router} />
            <ShowcaseNav />
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
