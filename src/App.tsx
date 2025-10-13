/**
 * @file Root Application Component
 * @description Sets up all providers and routing
 */

import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import { AuthProvider } from '@/features/auth/contexts/AuthProvider';
import { logger } from '@/core/utils/logger';

// =============================================================================
// QUERY CLIENT SETUP
// =============================================================================

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime in v5)
      refetchOnWindowFocus: false,
      retry: 1,
      // Note: onError is deprecated in v5, use global error boundary
    },
    mutations: {
      // Note: onError is deprecated in v5, use mutation callbacks or global error boundary
    },
  },
});

// =============================================================================
// APP COMPONENT
// =============================================================================

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            {/* Router and main content will be added in Phase 4 */}
            {/* Temporary landing page - will be replaced with router in Phase 4 */}
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  🚀 Oslira V2
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                  Phase 1 Complete: Core Infrastructure Ready
                </p>
                <div className="space-y-2 text-sm text-gray-500">
                  <p>✅ Environment Configuration</p>
                  <p>✅ Authentication System</p>
                  <p>✅ State Management (Zustand)</p>
                  <p>✅ HTTP Client with Retry Logic</p>
                  <p>✅ Error Tracking & Logging</p>
                  <p>✅ All Utilities Migrated</p>
                </div>
              </div>
            </div>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
