/**
 * ACTIVE ANALYSES HOOK - GLOBAL WEBSOCKET + POLLING FALLBACK
 *
 * Uses global WebSocket for real-time updates with polling fallback.
 *
 * ARCHITECTURE:
 * - Primary: Global WebSocket (1 connection for ALL jobs)
 * - Fallback: Adaptive polling (5s when WebSocket disconnected or >3 jobs)
 * - Confirms optimistic jobs when backend returns them
 */

import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAnalysisQueueStore, type AnalysisJob } from '../stores/useAnalysisQueueStore';
import { httpClient } from '@/core/auth/http-client';
import { logger } from '@/core/utils/logger';
import { useAuth } from '@/features/auth/contexts/AuthProvider';
import { useCreditsService } from '@/features/credits/hooks/useCreditsService';
import { useGlobalAnalysisStream } from '@/hooks/useGlobalAnalysisStream';

interface FetchActiveAnalysesResponse {
  success: boolean;
  data: {
    active_count: number;
    analyses: AnalysisJob[];
  };
}

async function fetchActiveAnalyses(): Promise<AnalysisJob[]> {
  try {
    const response = await httpClient.get<FetchActiveAnalysesResponse>(
      '/api/analysis/active'
    );

    if (!response.success || !response.data) {
      logger.warn('[ActiveAnalyses] Invalid response format', { response });
      return [];
    }

    return response.data?.analyses ?? [];
  } catch (error) {
    logger.error('[ActiveAnalyses] Failed to fetch', error as Error);
    return [];
  }
}

export function useActiveAnalyses() {
  const { isAuthenticated, isAuthReady } = useAuth();
  const { jobs, updateAllJobs, confirmJobStarted } = useAnalysisQueueStore();
  const { refetchBalance } = useCreditsService();
  const queryClient = useQueryClient();

  // Connect to global WebSocket
  useGlobalAnalysisStream();

  // Polling with adaptive interval
  const { data } = useQuery({
    queryKey: ['activeAnalyses'],
    queryFn: fetchActiveAnalyses,
    refetchInterval: () => {
      const activeCount = jobs.filter(j =>
        j.status === 'pending' || j.status === 'analyzing'
      ).length;

      // Stop polling if no active jobs
      if (activeCount === 0) return false;

      // Poll every 5s as fallback
      return 5000;
    },
    enabled: isAuthenticated && isAuthReady && jobs.length > 0,
  });

  // Sync data to store
  useEffect(() => {
    if (!data) return;

    // Bulk update (single state change = smooth animations)
    updateAllJobs(data);

    // Confirm optimistic jobs
    data.forEach(job => {
      const existingJob = jobs.find(j => j.runId === job.runId);
      if (existingJob && existingJob.leadId === undefined && job.leadId) {
        confirmJobStarted(job.runId, job.avatarUrl, job.leadId);
      }
    });

    // Refresh balance when jobs complete
    const completedJobs = data.filter(j => j.status === 'complete');
    if (completedJobs.length > 0) {
      refetchBalance().catch(error => {
        logger.error('[ActiveAnalyses] Balance refresh failed', error as Error);
      });
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    }
  }, [data]);

  return null;
}
