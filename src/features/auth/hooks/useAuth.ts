// src/features/auth/hooks/useAuth.ts
/**
 * @file useAuth Hook
 * @description Convenience hook to access AuthContext
 */

import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthProvider';

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  
  return context;
}
