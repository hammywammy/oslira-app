// src/pages/AppSubdomainRoot.tsx

/**
 * APP SUBDOMAIN ROOT HANDLER
 * 
 * Purpose: Handles traffic from app.oslira.com/ (via Cloudflare Pages _redirects)
 * 
 * Behavior:
 * - Authenticated users → Redirect to /dashboard
 * - Unauthenticated users → Redirect to /auth/login
 * 
 * Architecture:
 * - Works in tandem with Cloudflare Pages _redirects file
 * - Zero overhead: redirects happen immediately after auth check
 * - Production-grade: no hostname detection needed
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/contexts/AuthProvider';

export function AppSubdomainRoot() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Wait for auth state to initialize
    if (isLoading) return;

    // Redirect based on authentication state
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    } else {
      navigate('/auth/login', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Show minimal loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
        <p className="mt-4 text-slate-600 text-sm">Loading...</p>
      </div>
    </div>
  );
}

export default AppSubdomainRoot;
