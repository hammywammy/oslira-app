// src/features/analysis-queue/hooks/useActiveAnalyses.ts

/**
 * ACTIVE ANALYSES SSE + POLLING HOOK - V4.0 HYBRID APPROACH
 *
 * Combines SSE for real-time updates with polling fallback for reliability.
 *
 * ARCHITECTURE:
 * - Primary: SSE connections for real-time progress updates (per analysis)
 * - Fallback: Adaptive polling when SSE fails or for bulk operations
 *   • 0 active jobs: Stop polling completely
 *   • 1-3 active jobs: Poll every 10 seconds (slower, SSE handles updates)
 *   • 4+ active jobs: Poll every 5 seconds (bulk mode)
 * - Initialization fetch on mount to catch orphaned jobs
 * - Confirms optimistic jobs when backend returns them
 * - Auto-dismiss handled by store's existing logic
 *
 * BACKEND ENDPOINTS:
 * - SSE: /api/analysis/${runId}/stream (per-analysis real-time)
 * - Polling: GET /api/analysis/active (fallback + bulk sync)
 *
 * USAGE:
 * useActiveAnalyses(); // Call in a top-level component (e.g., TopBar)
 */

import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAnalysisQueueStore, type AnalysisJob } from '../stores/useAnalysisQueueStore';
import { httpClient } from '@/core/auth/http-client';
import { logger } from '@/core/utils/logger';
import { useAuth } from '@/features/auth/contexts/AuthProvider';
import { useCreditsService } from '@/features/credits/hooks/useCreditsService';
import { authManager } from '@/core/auth/auth-manager';
import { env } from '@/core/auth/environment';

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
 * Hybrid hook: Uses SSE for real-time updates with polling fallback
 *
 * Features:
 * - SSE connections for active analyses (real-time progress)
 * - Adaptive polling fallback (0 jobs: stop, 1-3 jobs: 10s, 4+ jobs: 5s)
 * - Initialization fetch on mount
 * - Auto-stops polling when no active analyses
 * - Confirms optimistic jobs when backend returns them
 */
export function useActiveAnalyses() {
  const { isAuthenticated, isAuthReady, isLoading: authLoading } = useAuth();
  const {
    jobs: currentJobs,
    addJob,
    updateJob,
    confirmJobStarted,
  } = useAnalysisQueueStore();
  const { fetchBalance } = useCreditsService();

  // Track active SSE connections to prevent duplicates
  const activeStreamsRef = useRef<Set<string>>(new Set());

  // Polling fallback query (slower intervals when SSE is active)
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

      // SSE working - use slower polling for backup sync
      if (activeCount <= 3) return 10000;         // 10 seconds for 1-3 jobs
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

    syncAnalysesToStore(data, currentJobs, addJob, updateJob, confirmJobStarted, fetchBalance);
  }, [data, currentJobs, addJob, updateJob, confirmJobStarted, fetchBalance]);

  // Start SSE stream when first active job appears
  useEffect(() => {
    const activeJob = currentJobs.find(
      (j) => j.status === 'pending' || j.status === 'analyzing'
    );

    if (!activeJob) {
      return; // No active jobs, nothing to stream
    }

    // Prevent duplicate streams for the same runId
    if (activeStreamsRef.current.has(activeJob.runId)) {
      return;
    }

    // Mark this stream as active
    activeStreamsRef.current.add(activeJob.runId);

    // Start the SSE stream (Promise-based, not React hook)
    streamAnalysisProgress(
      activeJob.runId,
      updateJob,
      confirmJobStarted,
      fetchBalance
    ).finally(() => {
      // Remove from active streams when complete
      activeStreamsRef.current.delete(activeJob.runId);
    });
  }, [currentJobs, updateJob, confirmJobStarted, fetchBalance]);

  // Log errors
  if (error) {
    logger.error('[ActiveAnalyses] Polling error', error as Error);
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

// =============================================================================
// SSE HELPER: Stream analysis progress
// =============================================================================

/**
 * Promise-based SSE stream for analysis progress updates
 *
 * Based on the working onboarding pattern from useCompleteOnboarding.ts
 * Uses direct Zustand calls from event listeners (NO React state)
 *
 * @param runId - Analysis run ID to stream
 * @param updateJob - Zustand store action
 * @param confirmJobStarted - Zustand store action
 * @param fetchBalance - Function to refresh credits balance
 * @returns Promise that resolves when analysis completes
 */
async function streamAnalysisProgress(
  runId: string,
  updateJob: (runId: string, updates: Partial<AnalysisJob>) => void,
  confirmJobStarted: (runId: string, avatarUrl?: string, leadId?: string) => void,
  fetchBalance: () => Promise<void>
): Promise<void> {
  return new Promise((resolve, reject) => {
    logger.info('[SSE] Starting SSE stream', { runId });

    // Get auth token for query parameter (EventSource doesn't support headers)
    authManager.getAccessToken().then(token => {
      if (!token) {
        logger.error('[SSE] No auth token available');
        reject(new Error('Authentication required'));
        return;
      }

      // Track if component is still mounted
      let isMounted = true;

      // Construct SSE endpoint URL
      const streamUrl = `${env.apiUrl}/api/analysis/${runId}/stream?token=${encodeURIComponent(token)}`;

      logger.info('[SSE] Connecting to stream', {
        runId,
        url: streamUrl.replace(token, '[REDACTED]')
      });

      const eventSource = new EventSource(streamUrl);

      // Connection opened
      eventSource.addEventListener('open', () => {
        if (!isMounted) return;
        logger.info('[SSE] Connection established', { runId });
      });

      // Connected event (initial confirmation from backend)
      eventSource.addEventListener('connected', (event) => {
        if (!isMounted) return;

        try {
          const data = JSON.parse(event.data);
          logger.info('[SSE] Connected event received', {
            runId,
            message: data.message,
          });
        } catch (err) {
          logger.error('[SSE] Failed to parse connected event', err as Error);
        }
      });

      // Progress update event
      eventSource.addEventListener('progress', (event) => {
        if (!isMounted) return;

        try {
          const data = JSON.parse(event.data);

          // Direct Zustand call - NO React state
          updateJob(runId, {
            status: data.status || 'analyzing',
            progress: data.progress || 0,
            step: data.step || { current: 0, total: 4 },
            avatarUrl: data.avatar_url,
            leadId: data.lead_id,
          });

          // Confirm job started with backend data if available
          if (data.lead_id || data.avatar_url) {
            confirmJobStarted(runId, data.avatar_url, data.lead_id);
          }

          logger.info('[SSE] Progress update', {
            runId,
            progress: data.progress,
            step: data.step,
          });
        } catch (err) {
          logger.error('[SSE] Failed to parse progress event', err as Error);
        }
      });

      // Completion event
      eventSource.addEventListener('complete', (event) => {
        if (!isMounted) return;

        try {
          const data = JSON.parse(event.data);

          // Direct Zustand call - NO React state
          updateJob(runId, {
            status: 'complete',
            progress: 100,
            step: data.step || { current: 4, total: 4 },
            avatarUrl: data.avatar_url,
            leadId: data.lead_id,
          });

          logger.info('[SSE] Analysis complete', {
            runId,
            leadId: data.lead_id,
          });

          // Refresh balance after completion
          fetchBalance().catch((error) => {
            logger.error('[SSE] Failed to refresh balance after completion', error as Error);
          });

          eventSource.close();
          isMounted = false;
          resolve();
        } catch (err) {
          logger.error('[SSE] Failed to parse complete event', err as Error);
          eventSource.close();
          isMounted = false;
          reject(err);
        }
      });

      // Failed event
      eventSource.addEventListener('failed', (event) => {
        if (!isMounted) return;

        try {
          const data = JSON.parse(event.data);

          // Direct Zustand call - NO React state
          updateJob(runId, {
            status: 'failed',
            progress: data.progress || 0,
            step: data.step || { current: 0, total: 4 },
            avatarUrl: data.avatar_url,
            leadId: data.lead_id,
          });

          logger.error('[SSE] Analysis failed', new Error(data.error || 'Analysis failed'), {
            runId,
          });

          eventSource.close();
          isMounted = false;
          reject(new Error(data.error || 'Analysis failed'));
        } catch (err) {
          logger.error('[SSE] Failed to parse failed event', err as Error);
          eventSource.close();
          isMounted = false;
          reject(err);
        }
      });

      // Cancelled event
      eventSource.addEventListener('cancelled', (event) => {
        if (!isMounted) return;

        try {
          const data = JSON.parse(event.data);

          // Direct Zustand call - NO React state
          updateJob(runId, {
            status: 'cancelled',
            progress: data.progress || 0,
            step: data.step || { current: 0, total: 4 },
            avatarUrl: data.avatar_url,
            leadId: data.lead_id,
          });

          logger.info('[SSE] Analysis cancelled', { runId });

          eventSource.close();
          isMounted = false;
          resolve();
        } catch (err) {
          logger.error('[SSE] Failed to parse cancelled event', err as Error);
          eventSource.close();
          isMounted = false;
          reject(err);
        }
      });

      // Error handler
      eventSource.onerror = (event: any) => {
        if (!isMounted) return;

        logger.error('[SSE] Connection error', new Error('SSE connection error'), {
          runId,
          readyState: eventSource.readyState,
        });

        // Check if backend sent error message
        if (event.data) {
          try {
            const data = JSON.parse(event.data);
            eventSource.close();
            isMounted = false;
            reject(new Error(data.message || 'SSE connection failed'));
            return;
          } catch {
            // Not JSON, generic error
          }
        }

        eventSource.close();
        isMounted = false;
        reject(new Error('SSE connection failed'));
      };

      // Timeout after 60 seconds (analyses should complete within this time)
      const timeout = setTimeout(() => {
        if (!isMounted) return;

        logger.error('[SSE] Timeout - exceeded 60 seconds', new Error('Analysis timeout'));

        eventSource.close();
        isMounted = false;
        reject(new Error('Analysis timeout - exceeded 60 seconds'));
      }, 60000);

      // Clear timeout on completion
      eventSource.addEventListener('complete', () => {
        clearTimeout(timeout);
      });

      eventSource.addEventListener('cancelled', () => {
        clearTimeout(timeout);
      });

    }).catch(error => {
      logger.error('[SSE] Failed to get auth token', error);
      reject(error);
    });
  });
}
