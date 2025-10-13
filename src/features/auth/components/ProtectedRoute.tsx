/**
 * @file Protected Route Component
 * @description Route protection with auth requirements
 * 
 * Features:
 * - Redirect unauthenticated users to login
 * - Loading state handling
 * - Session validation integration
 */

import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthProvider';

// =============================================================================
// TYPES
// =============================================================================

interface ProtectedRouteProps {
  children: ReactNode;
  requireBusiness?: boolean;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function ProtectedRoute({ children, requireBusiness = false }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, businesses } = useAuth();
  const location = useLocation();

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Check business requirement
  if (requireBusiness && businesses.length === 0) {
    return <Navigate to="/onboarding" replace />;
  }

  // Render protected content
  return <>{children}</>;
}
