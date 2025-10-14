/**
 * @file Root Application Component
 * @description Sets up all providers and routing
 * 
 * Path: src/App.tsx
 */
import { RouterProvider } from 'react-router-dom';
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
// APP COMPONENT
// =============================================================================
function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
          <ShowcaseNav />
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
