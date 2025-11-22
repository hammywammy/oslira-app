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
    addJob,
    updateJob,
    disablePolling,
    enablePolling,
    confirmJobStarted,
  } = useAnalysisQueueStore();

  const { data, error } = useQuery({
    queryKey: ['activeAnalyses'],
    queryFn: fetchActiveAnalyses,
    // Fix 5: Function-based refetchInterval for conditional polling
    // Stops polling when both backend returns 0 results AND no local active jobs
    refetchInterval: (query) => {
      const hasBackendJobs = (query.state.data?.length ?? 0) > 0;
      const { jobs } = useAnalysisQueueStore.getState();
      const hasLocalActiveJobs = jobs.filter(j => j.status === 'pending' || j.status === 'analyzing').length > 0;
      const shouldPoll = hasBackendJobs || hasLocalActiveJobs;

      if (!shouldPoll) {
        logger.info('[ActiveAnalyses] Stopping polling - no active jobs', {
          hasBackendJobs,
          hasLocalActiveJobs,
        });
      }

      return shouldPoll ? 5000 : false;
    },
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    staleTime: 0, // Always consider data stale to enable polling
    retry: 2, // Retry failed requests
    enabled: true, // Always enabled for manual fetching, but interval controlled by refetchInterval
  });

  // Fix 7: Removed unconditional mount-time refetch that caused polling to restart
  // on every page navigation. React Query's enabled:true handles initial fetch,
  // and function-based refetchInterval handles conditional polling based on job state.

  // Sync fetched data into Zustand store when data changes
  useEffect(() => {
    if (!data) return;

    // Read current state from store inside effect to avoid dependency loop
    const {
      jobs: currentJobs,
      isPollingEnabled: currentIsPollingEnabled,
      pollingShouldStop: currentPollingShouldStop
    } = useAnalysisQueueStore.getState();

    logger.info('[ActiveAnalyses] Data received from API', {
      fetchedJobCount: data.length,
      jobs: data.map(j => ({ runId: j.runId, username: j.username, status: j.status, progress: j.progress })),
    });

    syncAnalysesToStore(data, currentJobs, addJob, updateJob, confirmJobStarted);

    const fetchedActiveCount = data.filter(
      (job) => job.status === 'pending' || job.status === 'analyzing'
    ).length;

    const localActiveCount = currentJobs.filter(
      (job) => job.status === 'pending' || job.status === 'analyzing'
    ).length;

    if (fetchedActiveCount === 0 && localActiveCount === 0) {
      if (currentPollingShouldStop || currentIsPollingEnabled) {
        logger.info('[ActiveAnalyses] No active analyses, disabling polling');
        disablePolling();
      }
    } else if (fetchedActiveCount > 0 && !currentIsPollingEnabled) {
      logger.info('[ActiveAnalyses] Found active analyses, enabling polling');
      enablePolling();
    }
  }, [data, addJob, updateJob, confirmJobStarted, disablePolling, enablePolling]);

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
 * 5. Fix 6: Handle completed jobs from backend
 * 6. Fix 8: Clear orphaned optimistic jobs after timeout
 * 7. Store's auto-dismiss logic handles cleanup for completed jobs
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
  const fetchedJobIds = new Set(fetchedJobs.map((job) => job.runId));

  // Process fetched jobs from backend
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

        // Fix 6: Handle completed jobs from backend
        // When backend returns status 'complete', update the job to trigger auto-dismiss
        if (fetchedJob.status === 'complete' && currentJob.status !== 'complete') {
          logger.info('[ActiveAnalyses] Job completed, marking as complete', {
            runId: fetchedJob.runId,
          });

          updateJob(fetchedJob.runId, {
            status: 'complete',
            progress: 100,
            step: fetchedJob.step,
            avatarUrl: fetchedJob.avatarUrl,
            leadId: fetchedJob.leadId,
          });
          return; // Early return since job is complete
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

  // Fix 8: Clear orphaned optimistic jobs after timeout
  // If a local job exists but backend returns 0 results (or doesn't include it),
  // and enough time has passed (30 seconds), mark it as complete to trigger auto-dismiss
  const ORPHAN_TIMEOUT_MS = 30000; // 30 seconds
  const now = Date.now();

  currentJobs.forEach((currentJob) => {
    const isOrphaned = !fetchedJobIds.has(currentJob.runId);
    const isActive = currentJob.status === 'pending' || currentJob.status === 'analyzing';
    const hasTimedOut = now - currentJob.startedAt > ORPHAN_TIMEOUT_MS;

    if (isOrphaned && isActive && hasTimedOut) {
      logger.info('[ActiveAnalyses] Clearing orphaned optimistic job', {
        runId: currentJob.runId,
        age: now - currentJob.startedAt,
      });

      // Mark as complete to trigger auto-dismiss
      updateJob(currentJob.runId, {
        status: 'complete',
        progress: 100,
      });
    }
  });
}
