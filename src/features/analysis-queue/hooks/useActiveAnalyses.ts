// src/features/analysis-queue/hooks/useActiveAnalyses.ts

/**
 * ACTIVE ANALYSES POLLING HOOK - V2.0 CONDITIONAL POLLING
 *
 * Uses React Query to poll the backend for active analysis jobs and syncs
 * them into the Zustand store for UI consumption.
 *
 * ARCHITECTURE:
 * - Conditional polling: Only polls when isPollingEnabled is true
 * - Flat 5s polling interval when enabled
 * - Initialization fetch on mount to catch orphaned jobs
 * - Auto-stops polling when no active analyses
 * - Confirms optimistic jobs when backend returns them
 * - Auto-dismiss handled by store's existing logic
 *
 * BACKEND ENDPOINT:
 * GET /api/analysis/active
 * Returns: { success: boolean, data: { active_count: number, analyses: AnalysisJob[] } }
 *
 * USAGE:
 * useActiveAnalyses(); // Call in a top-level component (e.g., TopBar)
 */

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAnalysisQueueStore, type AnalysisJob } from '../stores/useAnalysisQueueStore';
import { httpClient } from '@/core/auth/http-client';
import { logger } from '@/core/utils/logger';

// =============================================================================
// TYPES
// =============================================================================

interface FetchActiveAnalysesResponse {
  success: boolean;
  data: {
    active_count: number;
    analyses: AnalysisJob[];
  };
}

// =============================================================================
// API FUNCTION
// =============================================================================

/**
 * Fetch all active analyses for the authenticated user
 *
 * Backend should:
 * 1. Get user's account_id from auth token
 * 2. Query Durable Objects or database for active analyses
 * 3. Return array of analysis jobs with current progress
 *
 * @returns Promise with array of active analysis jobs
 */
async function fetchActiveAnalyses(): Promise<AnalysisJob[]> {
  try {
    logger.info('[ActiveAnalyses] Fetching active analyses');

    const response = await httpClient.get<FetchActiveAnalysesResponse>(
      '/api/analysis/active'
    );

    if (!response.success || !response.data) {
      logger.warn('[ActiveAnalyses] Invalid response format', { response });
      return [];
    }

    logger.info('[ActiveAnalyses] Active analyses fetched', {
      count: response.data?.analyses?.length ?? 0,
    });

    return response.data?.analyses ?? [];
  } catch (error) {
    logger.error('[ActiveAnalyses] Failed to fetch active analyses', error as Error);
    // Return empty array instead of throwing - graceful degradation
    return [];
  }
}

// =============================================================================
// HOOK
// =============================================================================

/**
 * Polls the backend for active analyses and syncs them into the Zustand store
 *
 * Features:
 * - Conditional polling based on isPollingEnabled flag
 * - Flat 5s polling interval when enabled
 * - Initialization fetch on mount
 * - Auto-stops polling when no active analyses
 * - Confirms optimistic jobs when backend returns them
 */
export function useActiveAnalyses() {
  const {
    jobs,
    isPollingEnabled,
    pollingShouldStop,
    addJob,
    updateJob,
    disablePolling,
    enablePolling,
    confirmJobStarted,
  } = useAnalysisQueueStore();

  // Polling interval: 5s when enabled, false when disabled
  const refetchInterval = isPollingEnabled ? 5000 : false;

  const { data, error, refetch } = useQuery({
    queryKey: ['activeAnalyses'],
    queryFn: fetchActiveAnalyses,
    refetchInterval,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    staleTime: 0, // Always consider data stale to enable polling
    retry: 2, // Retry failed requests
    enabled: true, // Always enabled for manual fetching, but interval controlled by refetchInterval
  });

  // Initialization fetch on mount to catch orphaned jobs
  useEffect(() => {
    logger.info('[ActiveAnalyses] Initialization fetch');
    refetch();
  }, [refetch]);

  // Sync fetched data into Zustand store when data changes
  useEffect(() => {
    if (data) {
      syncAnalysesToStore(data, jobs, addJob, updateJob, confirmJobStarted);

      // If we fetched zero active analyses and store also has zero active count
      const fetchedActiveCount = data.filter(
        (job) => job.status === 'pending' || job.status === 'analyzing'
      ).length;

      if (fetchedActiveCount === 0 && jobs.filter(
        (job) => job.status === 'pending' || job.status === 'analyzing'
      ).length === 0) {
        // Check if we should stop polling
        if (pollingShouldStop || isPollingEnabled) {
          logger.info('[ActiveAnalyses] No active analyses, disabling polling');
          disablePolling();
        }
      } else if (fetchedActiveCount > 0 && !isPollingEnabled) {
        // If we found active jobs and polling is disabled, enable it
        logger.info('[ActiveAnalyses] Found active analyses, enabling polling');
        enablePolling();
      }
    }
  }, [data, jobs, addJob, updateJob, confirmJobStarted, disablePolling, enablePolling, isPollingEnabled, pollingShouldStop]);

  // Log errors
  if (error) {
    logger.error('[ActiveAnalyses] Query error', error as Error);
  }
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Syncs fetched analyses into the Zustand store
 *
 * Strategy:
 * 1. For each fetched job, check if it exists in store (by runId)
 * 2. If new, add it to store
 * 3. If exists and was optimistic, confirm it with backend data
 * 4. If exists and has updates, update it with latest data
 * 5. Store's auto-dismiss logic handles cleanup for completed jobs
 *
 * @param fetchedJobs - Jobs from API
 * @param currentJobs - Current jobs in store
 * @param addJob - Store action to add new job
 * @param updateJob - Store action to update existing job
 * @param confirmJobStarted - Store action to confirm optimistic job
 */
function syncAnalysesToStore(
  fetchedJobs: AnalysisJob[],
  currentJobs: AnalysisJob[],
  addJob: (job: Omit<AnalysisJob, 'startedAt'>) => void,
  updateJob: (runId: string, updates: Partial<AnalysisJob>) => void,
  confirmJobStarted: (runId: string, avatarUrl?: string, leadId?: string) => void
) {
  // Create a Set of current job runIds for fast lookup
  const currentJobIds = new Set(currentJobs.map((job) => job.runId));

  fetchedJobs.forEach((fetchedJob) => {
    if (!currentJobIds.has(fetchedJob.runId)) {
      // New job - add to store
      logger.info('[ActiveAnalyses] Adding new job to store', {
        runId: fetchedJob.runId,
      });

      // Remove startedAt since store will add it
      const { startedAt, ...jobWithoutTimestamp } = fetchedJob;
      addJob(jobWithoutTimestamp);
    } else {
      // Existing job - check if it was optimistic and needs confirmation
      const currentJob = currentJobs.find((job) => job.runId === fetchedJob.runId);

      if (currentJob) {
        // If job doesn't have leadId or avatarUrl yet, confirm it with backend data
        if (!currentJob.leadId || !currentJob.avatarUrl) {
          logger.info('[ActiveAnalyses] Confirming optimistic job', {
            runId: fetchedJob.runId,
            hasLeadId: !!fetchedJob.leadId,
            hasAvatar: !!fetchedJob.avatarUrl,
          });

          confirmJobStarted(
            fetchedJob.runId,
            fetchedJob.avatarUrl,
            fetchedJob.leadId
          );
        }

        // Update if data has changed
        if (
          currentJob.progress !== fetchedJob.progress ||
          currentJob.status !== fetchedJob.status ||
          currentJob.step.current !== fetchedJob.step.current
        ) {
          logger.info('[ActiveAnalyses] Updating job in store', {
            runId: fetchedJob.runId,
            progress: fetchedJob.progress,
            status: fetchedJob.status,
          });

          updateJob(fetchedJob.runId, {
            progress: fetchedJob.progress,
            status: fetchedJob.status,
            step: fetchedJob.step,
            avatarUrl: fetchedJob.avatarUrl,
            leadId: fetchedJob.leadId,
          });
        }
      }
    }
  });
}
