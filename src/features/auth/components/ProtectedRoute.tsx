// src/features/auth/components/ProtectedRoute.tsx

/**
 * PROTECTED ROUTE
 * 
 * Route guard that checks authentication and onboarding status
 * 
 * Logic:
 * 1. If loading → show spinner
 * 2. If not authenticated → redirect /auth/login
 * 3. If authenticated but onboarding incomplete → redirect /onboarding
 * 4. Else → render children
 * 
 * Usage:
 * <ProtectedRoute>
 *   <DashboardPage />
 * </ProtectedRoute>
 */

import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthProvider';

// =============================================================================
// TYPES
// =============================================================================

interface ProtectedRouteProps {
  children: ReactNode;
  requireOnboarding?: boolean; // If false, allow access even if onboarding incomplete
}

// =============================================================================
// COMPONENT
// =============================================================================

export function ProtectedRoute({
  children,
  requireOnboarding = true,
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  // Not authenticated → redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  // Authenticated but onboarding incomplete → redirect to onboarding
  if (requireOnboarding && !user?.onboarding_completed) {
    return <Navigate to="/onboarding" replace />;
  }

  // All checks passed → render children
  return <>{children}</>;
}
