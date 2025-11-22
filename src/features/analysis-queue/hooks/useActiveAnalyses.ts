// src/features/analysis-queue/hooks/useActiveAnalyses.ts

/**
 * ACTIVE ANALYSES POLLING HOOK - V3.0 ADAPTIVE POLLING
 *
 * Uses React Query to poll the backend for active analysis jobs and syncs
 * them into the Zustand store for UI consumption.
 *
 * ARCHITECTURE:
 * - Adaptive polling interval based on active job count:
 *   • 0 active jobs: Stop polling completely
 *   • 1-3 active jobs: Poll every 3 seconds
 *   • 4+ active jobs: Poll every 5 seconds (bulk mode)
 * - Initialization fetch on mount to catch orphaned jobs
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
import { useAuth } from '@/features/auth/contexts/AuthProvider';
import { useCreditsService } from '@/features/credits/hooks/useCreditsService';

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
    // DIAGNOSTIC: Log at start
    console.log('[ActiveAnalyses] DIAGNOSTIC fetch firing', {
      localStorageToken: localStorage.getItem('oslira_refresh_token')?.substring(0, 8) || 'NULL',
      timestamp: Date.now()
    });

    // logger.info('[ActiveAnalyses] Fetching active analyses');

    const response = await httpClient.get<FetchActiveAnalysesResponse>(
      '/api/analysis/active'
    );

    if (!response.success || !response.data) {
      logger.warn('[ActiveAnalyses] Invalid response format', { response });
      return [];
    }

    // logger.info('[ActiveAnalyses] Active analyses fetched', {
    //   count: response.data?.analyses?.length ?? 0,
    // });

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
 * - Adaptive polling interval (0 jobs: stop, 1-3 jobs: 3s, 4+ jobs: 5s)
 * - Initialization fetch on mount
 * - Auto-stops polling when no active analyses
 * - Confirms optimistic jobs when backend returns them
 */
export function useActiveAnalyses() {
  const { isAuthenticated, isAuthReady, isLoading: authLoading } = useAuth();
  const {
    addJob,
    updateJob,
    confirmJobStarted,
  } = useAnalysisQueueStore();
  const { fetchBalance } = useCreditsService();

  const { data, error } = useQuery({
    queryKey: ['activeAnalyses'],
    queryFn: fetchActiveAnalyses,
    // Adaptive polling based on active job count
    refetchInterval: (query) => {
      const data = query.state.data ?? [];
      const activeCount = data.filter(
        j => j.status === 'pending' || j.status === 'analyzing'
      ).length;

      if (activeCount === 0) return false;        // Stop polling completely
      if (activeCount <= 3) return 3000;          // 3 seconds for 1-3 jobs
      return 5000;                                 // 5 seconds for bulk (4+ jobs)
    },
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    staleTime: 0, // Always consider data stale to enable polling
    retry: 2, // Retry failed requests
    enabled: isAuthenticated && !authLoading && isAuthReady, // Only fetch when authenticated, auth state is ready, and auth is fully initialized
  });

  // Sync fetched data into Zustand store when data changes
  // React Query's function-based refetchInterval handles conditional polling
  useEffect(() => {
    if (!data) return;

    // Read current jobs from store to sync with fetched data
    const { jobs: currentJobs } = useAnalysisQueueStore.getState();

    syncAnalysesToStore(data, currentJobs, addJob, updateJob, confirmJobStarted, fetchBalance);
  }, [data, addJob, updateJob, confirmJobStarted, fetchBalance]);

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
 * 8. Refresh credits balance after analysis completes
 *
 * @param fetchedJobs - Jobs from API
 * @param currentJobs - Current jobs in store
 * @param addJob - Store action to add new job
 * @param updateJob - Store action to update existing job
 * @param confirmJobStarted - Store action to confirm optimistic job
 * @param fetchBalance - Function to refresh credits balance
 */
function syncAnalysesToStore(
  fetchedJobs: AnalysisJob[],
  currentJobs: AnalysisJob[],
  addJob: (job: Omit<AnalysisJob, 'startedAt'>) => void,
  updateJob: (runId: string, updates: Partial<AnalysisJob>) => void,
  confirmJobStarted: (runId: string, avatarUrl?: string, leadId?: string) => void,
  fetchBalance: () => Promise<void>
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
          // logger.info('[ActiveAnalyses] Confirming optimistic job', {
          //   runId: fetchedJob.runId,
          //   hasLeadId: !!fetchedJob.leadId,
          //   hasAvatar: !!fetchedJob.avatarUrl,
          // });

          confirmJobStarted(
            fetchedJob.runId,
            fetchedJob.avatarUrl,
            fetchedJob.leadId
          );
        }

        // Fix 6: Handle completed jobs from backend
        // When backend returns status 'complete', update the job to trigger auto-dismiss
        if (fetchedJob.status === 'complete' && currentJob.status !== 'complete') {
          logger.info('[ActiveAnalyses] Job completed, marking as complete and refreshing balance', {
            runId: fetchedJob.runId,
          });

          updateJob(fetchedJob.runId, {
            status: 'complete',
            progress: 100,
            step: fetchedJob.step,
            avatarUrl: fetchedJob.avatarUrl,
            leadId: fetchedJob.leadId,
          });

          // Refresh credits balance after analysis completion
          fetchBalance().catch((error) => {
            logger.error('[ActiveAnalyses] Failed to refresh balance after completion', error as Error);
          });

          return; // Early return since job is complete
        }

        // Handle failed jobs from backend
        if (fetchedJob.status === 'failed' && currentJob.status !== 'failed') {
          logger.info('[ActiveAnalyses] Job failed, marking as failed', {
            runId: fetchedJob.runId,
          });

          updateJob(fetchedJob.runId, {
            status: 'failed',
            step: fetchedJob.step,
            avatarUrl: fetchedJob.avatarUrl,
            leadId: fetchedJob.leadId,
          });
          return;
        }

        // Update if data has changed
        if (
          currentJob.progress !== fetchedJob.progress ||
          currentJob.status !== fetchedJob.status ||
          currentJob.step.current !== fetchedJob.step.current
        ) {
          // Only log when status changes, not progress/step changes
          if (currentJob.status !== fetchedJob.status) {
            logger.info('[ActiveAnalyses] Updating job in store', {
              runId: fetchedJob.runId,
              progress: fetchedJob.progress,
              status: fetchedJob.status,
            });
          }

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
