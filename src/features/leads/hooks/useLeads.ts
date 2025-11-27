import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchLeads } from '../api/leadsApi';
import { logger } from '@/core/utils/logger';
import type { Lead } from '@/shared/types/leads.types';
import { useAuth } from '@/features/auth/contexts/AuthProvider';

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

export function useLeads(options: UseLeadsOptions = {}): UseLeadsReturn {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();

  const {
    autoFetch = true,
    page = 1,
    pageSize = 100,
    sortBy = 'created_at',
    sortOrder = 'desc',
    businessProfileId,
  } = options;

  const { data: leads = [], isLoading, error, refetch } = useQuery({
    queryKey: ['leads', businessProfileId, page, sortBy, sortOrder],
    queryFn: async () => {
      logger.info('[useLeads] Fetching leads', {
        page, pageSize, sortBy, sortOrder, businessProfileId
      });

      const data = await fetchLeads({
        page,
        pageSize,
        sortBy,
        sortOrder,
        businessProfileId,
      });

      logger.info('[useLeads] Leads loaded', { count: data.length });
      return data;
    },
    enabled: autoFetch && !!businessProfileId && isAuthenticated && !authLoading,
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  });

  const refresh = async () => {
    logger.info('[useLeads] Manual refresh triggered');
    await refetch();
  };

  return {
    leads,
    isLoading,
    error: error as Error | null,
    refresh,
    isEmpty: leads.length === 0 && !isLoading,
  };
}
