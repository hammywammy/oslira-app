/**
 * ACTIVE ANALYSES HOOK - GLOBAL WEBSOCKET + POLLING FALLBACK
 *
 * Uses global WebSocket for real-time updates with polling fallback.
 *
 * ARCHITECTURE:
 * - Primary: Global WebSocket (1 connection for ALL jobs)
 * - Fallback: Adaptive polling (5s when WebSocket disconnected or >3 jobs)
 * - Confirms optimistic jobs when backend returns them
 * - Tracks loading/error states for UI feedback
 */

import { useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAnalysisQueueStore, useIsWebSocketConnected, type AnalysisJob } from '../stores/useAnalysisQueueStore';
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
  const response = await httpClient.get<FetchActiveAnalysesResponse>(
    '/api/analysis/active'
  );

  if (!response.success || !response.data) {
    logger.warn('[ActiveAnalyses] Invalid response format', { response });
    throw new Error('Invalid response format');
  }

  return response.data?.analyses ?? [];
}

export function useActiveAnalyses() {
  const { isAuthenticated, isAuthReady } = useAuth();
  const { jobs, updateAllJobs, confirmJobStarted, setLoading, setError } = useAnalysisQueueStore();
  const { refetchBalance } = useCreditsService();
  const queryClient = useQueryClient();
  const isWebSocketConnected = useIsWebSocketConnected();
  const initialFetchDone = useRef(false);

  // Connect to global WebSocket
  useGlobalAnalysisStream();

  // Initial fetch and polling fallback
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['activeAnalyses'],
    queryFn: fetchActiveAnalyses,
    refetchInterval: () => {
      const activeCount = jobs.filter(j =>
        j.status === 'pending' || j.status === 'analyzing'
      ).length;

      // Stop polling if no active jobs
      if (activeCount === 0) return false;

      // ONLY poll if WebSocket disconnected
      if (isWebSocketConnected) return false;

      // Poll every 5s as fallback (when WebSocket down)
      logger.info('[ActiveAnalyses] Polling fallback (WebSocket disconnected)');
      return 5000;
    },
    enabled: isAuthenticated && isAuthReady,
    retry: 2,
    retryDelay: 1000,
  });

  // Update loading state
  useEffect(() => {
    if (!initialFetchDone.current && isLoading) {
      setLoading(true);
    }
  }, [isLoading, setLoading]);

  // Handle errors
  useEffect(() => {
    if (error) {
      logger.error('[ActiveAnalyses] Fetch error', error as Error);
      setError(true);
    }
  }, [error, setError]);

  // Sync data to store
  useEffect(() => {
    if (data === undefined) return;

    initialFetchDone.current = true;

    // Bulk update (single state change = smooth animations)
    // This will also set isLoading=false and isError=false
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
      refetchBalance().catch(err => {
        logger.error('[ActiveAnalyses] Balance refresh failed', err as Error);
      });
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    }
  }, [data]);

  // Return refetch for manual retry
  return { refetch };
}
