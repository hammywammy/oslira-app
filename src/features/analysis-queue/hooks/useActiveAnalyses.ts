// src/features/analysis-queue/hooks/useActiveAnalyses.ts

/**
 * ACTIVE ANALYSES POLLING HOOK
 *
 * Uses React Query to poll the backend for active analysis jobs and syncs
 * them into the Zustand store for UI consumption.
 *
 * ARCHITECTURE:
 * - Adaptive polling: 2s when analyses are running, 10s when queue is empty
 * - Automatic deduplication via React Query cache
 * - Batch updates to Zustand store
 * - Auto-dismiss handled by store's existing logic
 *
 * BACKEND ENDPOINT:
 * GET /api/analysis/active
 * Returns: { success: boolean, data: AnalysisJob[] }
 *
 * USAGE:
 * useActiveAnalyses(); // Call in a top-level component (e.g., TopBar)
 */

import { useQuery } from '@tanstack/react-query';
import { useAnalysisQueueStore, type AnalysisJob } from '../stores/useAnalysisQueueStore';
import { httpClient } from '@/core/auth/http-client';
import { logger } from '@/core/utils/logger';

// =============================================================================
// TYPES
// =============================================================================

interface FetchActiveAnalysesResponse {
  success: boolean;
  data: AnalysisJob[];
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
      count: response.data.length,
    });

    return response.data;
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
 * - Adaptive polling interval based on active job count
 * - Automatic cache deduplication
 * - Batch updates to store
 * - Graceful error handling
 */
export function useActiveAnalyses() {
  const { jobs, addJob, updateJob } = useAnalysisQueueStore();

  // Count active jobs (pending or analyzing)
  const activeCount = jobs.filter(
    (job) => job.status === 'pending' || job.status === 'analyzing'
  ).length;

  // Adaptive polling: 2s when active, 10s when idle
  const refetchInterval = activeCount > 0 ? 2000 : 10000;

  const { data, error } = useQuery({
    queryKey: ['activeAnalyses'],
    queryFn: fetchActiveAnalyses,
    refetchInterval,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    staleTime: 0, // Always consider data stale to enable polling
    retry: 2, // Retry failed requests
  });

  // Sync fetched data into Zustand store when data changes
  if (data) {
    syncAnalysesToStore(data, jobs, addJob, updateJob);
  }

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
 * 1. For each fetched job, check if it exists in store
 * 2. If new, add it to store
 * 3. If exists, update it with latest data
 * 4. Store's auto-dismiss logic handles cleanup for completed jobs
 *
 * @param fetchedJobs - Jobs from API
 * @param currentJobs - Current jobs in store
 * @param addJob - Store action to add new job
 * @param updateJob - Store action to update existing job
 */
function syncAnalysesToStore(
  fetchedJobs: AnalysisJob[],
  currentJobs: AnalysisJob[],
  addJob: (job: Omit<AnalysisJob, 'startedAt'>) => void,
  updateJob: (leadId: string, updates: Partial<AnalysisJob>) => void
) {
  // Create a Set of current job IDs for fast lookup
  const currentJobIds = new Set(currentJobs.map((job) => job.leadId));

  fetchedJobs.forEach((fetchedJob) => {
    if (!currentJobIds.has(fetchedJob.leadId)) {
      // New job - add to store
      logger.info('[ActiveAnalyses] Adding new job to store', {
        leadId: fetchedJob.leadId,
      });

      // Remove startedAt since store will add it
      const { startedAt, ...jobWithoutTimestamp } = fetchedJob;
      addJob(jobWithoutTimestamp);
    } else {
      // Existing job - update with latest data
      const currentJob = currentJobs.find((job) => job.leadId === fetchedJob.leadId);

      // Only update if data has changed
      if (
        currentJob &&
        (currentJob.progress !== fetchedJob.progress ||
          currentJob.status !== fetchedJob.status ||
          currentJob.step.current !== fetchedJob.step.current)
      ) {
        logger.info('[ActiveAnalyses] Updating job in store', {
          leadId: fetchedJob.leadId,
          progress: fetchedJob.progress,
          status: fetchedJob.status,
        });

        updateJob(fetchedJob.leadId, {
          progress: fetchedJob.progress,
          status: fetchedJob.status,
          step: fetchedJob.step,
        });
      }
    }
  });
}
