/**
 * USE AUTH HOOK
 * 
 * Convenience hook for accessing auth context
 * Re-exports the useAuth from AuthProvider for cleaner imports
 * 
 * Usage:
 * const { user, isAuthenticated, logout } = useAuth();
 */

export { useAuth } from '../contexts/AuthProvider';
