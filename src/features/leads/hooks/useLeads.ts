// src/features/leads/hooks/useLeads.ts

/**
 * USE LEADS HOOK
 *
 * React hook for managing leads data fetching and state
 *
 * FEATURES:
 * - Automatic data fetching on mount
 * - Loading and error states
 * - Refresh functionality
 * - Type-safe lead data
 */

import { useState, useEffect, useCallback } from 'react';
import { fetchLeads } from '../api/leadsApi';
import { logger } from '@/core/utils/logger';
import type { Lead } from '@/shared/types/leads.types';
import { useAuth } from '@/features/auth/contexts/AuthProvider';

// =============================================================================
// TYPES
// =============================================================================

interface UseLeadsOptions {
  autoFetch?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: 'created_at' | 'updated_at' | 'overall_score';
  sortOrder?: 'asc' | 'desc';
  businessProfileId?: string | null;
}

interface UseLeadsReturn {
  leads: Lead[];
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  isEmpty: boolean;
}

// =============================================================================
// HOOK
// =============================================================================

/**
 * Hook for fetching and managing leads data
 *
 * @param options - Configuration options
 * @returns Leads data, loading state, error state, and refresh function
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { leads, isLoading, error, refresh } = useLeads();
 *
 *   if (isLoading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *
 *   return (
 *     <div>
 *       {leads.map(lead => <LeadCard key={lead.id} lead={lead} />)}
 *       <button onClick={refresh}>Refresh</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useLeads(options: UseLeadsOptions = {}): UseLeadsReturn {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const {
    autoFetch = true,
    page = 1,
    pageSize = 100,
    sortBy = 'created_at',
    sortOrder = 'desc',
    businessProfileId,
  } = options;

  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch leads from API
   */
  const fetchLeadsData = useCallback(async () => {
    // Don't fetch if not authenticated or auth is loading
    if (!isAuthenticated || authLoading) {
      logger.warn('[useLeads] Not authenticated or auth loading, skipping fetch');
      setLeads([]);
      setIsLoading(false);
      return;
    }

    // Don't fetch if no business profile selected (silent during loading)
    if (!businessProfileId) {
      setLeads([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      logger.info('[useLeads] Fetching leads', { page, pageSize, sortBy, sortOrder, businessProfileId });

      const data = await fetchLeads({
        page,
        pageSize,
        sortBy,
        sortOrder,
        businessProfileId,
      });

      setLeads(data);
      logger.info('[useLeads] Leads loaded', { count: data.length });
    } catch (err) {
      const error = err as Error;
      logger.error('[useLeads] Failed to fetch leads', error);
      setError(error);
      setLeads([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, authLoading, page, pageSize, sortBy, sortOrder, businessProfileId]);

  /**
   * Refresh leads data
   */
  const refresh = useCallback(async () => {
    logger.info('[useLeads] Manual refresh triggered');
    await fetchLeadsData();
  }, [fetchLeadsData]);

  /**
   * Auto-fetch on mount and when dependencies change
   */
  useEffect(() => {
    if (autoFetch) {
      fetchLeadsData();
    }
  }, [autoFetch, fetchLeadsData]);

  return {
    leads,
    isLoading,
    error,
    refresh,
    isEmpty: leads.length === 0 && !isLoading,
  };
}
