// src/features/analysis/hooks/useAnalysisProgress.ts

/**
 * ANALYSIS PROGRESS POLLING HOOK - V2.0 PRODUCTION GRADE
 *
 * FEATURES:
 * - Polls every 2 seconds (Cloudflare Workflow async execution)
 * - Graceful handling of 404/null during workflow initialization (first 10s)
 * - Exponential backoff for network errors (2s, 4s, 8s, 16s, 32s)
 * - Retry 500 errors up to 3 times
 * - Max 3 minutes polling (90 attempts at 2s intervals)
 * - AbortController for proper cleanup on unmount
 * - Stops on complete/failed/cancelled status
 * - Returns progress state + lead_id on completion
 * - Prevents memory leaks and race conditions
 *
 * WORKFLOW STATES:
 * T+0-10s:  Accept 404/null (Durable Object initializing)
 * T+10-180s: Poll progress updates
 * T+180s:    Timeout if not complete
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { httpClient } from '@/core/auth/http-client';
import { logger } from '@/core/utils/logger';

interface AnalysisProgressState {
  run_id: string;
  status: 'pending' | 'processing' | 'complete' | 'failed' | 'cancelled';
  progress: number;
  current_step: string;
  total_steps: number;
  error_message?: string;
  result?: {
    lead_id: string;
    overall_score: number;
    niche_fit_score: number;
    engagement_score: number;
    confidence_level: number;
    summary_text: string;
    outreach_message?: string;
  };
}

interface UseAnalysisProgressOptions {
  runId: string | null;
  onComplete?: (leadId: string) => void;
  onError?: (error: string) => void;
}

// Constants
const POLLING_INTERVAL = 2000; // 2 seconds
const MAX_ATTEMPTS = 90; // 3 minutes at 2s intervals
const INITIALIZATION_GRACE_PERIOD = 10000; // 10 seconds to allow DO initialization
const MAX_RETRIES_FOR_500 = 3;

export function useAnalysisProgress({
  runId,
  onComplete,
  onError,
}: UseAnalysisProgressOptions) {
  const [progress, setProgress] = useState<AnalysisProgressState | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs to track state across async boundaries
  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const attemptsRef = useRef(0);
  const startTimeRef = useRef<number>(0);
  const serverErrorRetriesRef = useRef(0);
  const isActiveRef = useRef(false);

  // Cleanup function
  const cleanup = useCallback(() => {
    logger.debug('[AnalysisProgress] Cleanup triggered');

    // Cancel any in-flight requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    // Clear any pending timeouts
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }

    // Reset refs
    attemptsRef.current = 0;
    serverErrorRetriesRef.current = 0;
    isActiveRef.current = false;
  }, []);

  // Stop polling
  const stopPolling = useCallback((reason: string) => {
    logger.info('[AnalysisProgress] Stopping poll', {
      runId,
      reason
    });
    setIsPolling(false);
    cleanup();
  }, [runId, cleanup]);

  // Main polling function
  const poll = useCallback(async () => {
    if (!runId || !isActiveRef.current) {
      return;
    }

    // Check timeout
    if (attemptsRef.current >= MAX_ATTEMPTS) {
      const timeoutError = 'Analysis timed out after 3 minutes';
      logger.error('[AnalysisProgress] Timeout', new Error(timeoutError), {
        context: { runId, attempts: attemptsRef.current }
      });
      setError(timeoutError);
      stopPolling('timeout');
      onError?.(timeoutError);
      return;
    }

    attemptsRef.current++;
    const elapsedTime = Date.now() - startTimeRef.current;
    const isInGracePeriod = elapsedTime < INITIALIZATION_GRACE_PERIOD;

    // Create new AbortController for this request
    abortControllerRef.current = new AbortController();

    try {
      logger.debug('[AnalysisProgress] Polling...', {
        attempt: attemptsRef.current,
        elapsed: `${(elapsedTime / 1000).toFixed(1)}s`,
        gracePeriod: isInGracePeriod
      });

      const response = await httpClient.get<AnalysisProgressState>(
        `/api/analysis/${runId}/progress`,
        { signal: abortControllerRef.current.signal } as any
      );

      // Reset retry counter on successful response
      serverErrorRetriesRef.current = 0;

      // Update progress state
      setProgress(response);

      logger.info('[AnalysisProgress] Poll update', {
        runId,
        attempt: attemptsRef.current,
        status: response.status,
        progress: response.progress,
        step: response.current_step,
      });

      // Check completion
      if (response.status === 'complete') {
        logger.info('[AnalysisProgress] Complete!', {
          runId,
          leadId: response.result?.lead_id
        });

        if (response.result?.lead_id) {
          stopPolling('complete');
          onComplete?.(response.result.lead_id);
        } else {
          const noLeadError = 'Analysis complete but no lead ID returned';
          logger.error('[AnalysisProgress] Missing lead_id', new Error(noLeadError), {
            response
          });
          setError(noLeadError);
          stopPolling('missing_lead_id');
          onError?.(noLeadError);
        }
        return;
      }

      // Check failure
      if (response.status === 'failed') {
        const failureError = response.error_message || 'Analysis failed';
        logger.error('[AnalysisProgress] Failed', new Error(failureError), {
          runId,
          error: failureError
        });
        setError(failureError);
        stopPolling('failed');
        onError?.(failureError);
        return;
      }

      // Check cancellation
      if (response.status === 'cancelled') {
        logger.info('[AnalysisProgress] Cancelled', {
          runId
        });
        const cancelError = 'Analysis was cancelled';
        setError(cancelError);
        stopPolling('cancelled');
        onError?.(cancelError);
        return;
      }

      // Continue polling - status is pending or processing
      if (isActiveRef.current) {
        timeoutIdRef.current = setTimeout(() => poll(), POLLING_INTERVAL);
      }

    } catch (err: any) {
      // Ignore aborted requests (cleanup)
      if (err.name === 'AbortError' || !isActiveRef.current) {
        logger.debug('[AnalysisProgress] Request aborted (cleanup)');
        return;
      }

      const errorMessage = err.message || 'Failed to fetch progress';

      // Handle 404 during grace period (normal during DO initialization)
      if (errorMessage.includes('404') || errorMessage.includes('Not Found')) {
        if (isInGracePeriod) {
          logger.debug('[AnalysisProgress] 404 during grace period (workflow initializing)', {
            attempt: attemptsRef.current,
            elapsed: `${(elapsedTime / 1000).toFixed(1)}s`
          });
          // Continue polling
          if (isActiveRef.current) {
            timeoutIdRef.current = setTimeout(() => poll(), POLLING_INTERVAL);
          }
          return;
        } else {
          // 404 after grace period is an error
          const notFoundError = 'Analysis workflow not found. It may have been cancelled or expired.';
          logger.error('[AnalysisProgress] 404 after grace period', new Error(notFoundError), {
            runId,
            elapsed: `${(elapsedTime / 1000).toFixed(1)}s`
          });
          setError(notFoundError);
          stopPolling('not_found');
          onError?.(notFoundError);
          return;
        }
      }

      // Handle 500 errors with retry
      if (errorMessage.includes('500') || errorMessage.includes('Internal Server Error')) {
        serverErrorRetriesRef.current++;

        if (serverErrorRetriesRef.current <= MAX_RETRIES_FOR_500) {
          const backoffDelay = Math.min(POLLING_INTERVAL * Math.pow(2, serverErrorRetriesRef.current - 1), 32000);
          logger.warn('[AnalysisProgress] 500 error, retrying...', {
            runId,
            retry: serverErrorRetriesRef.current,
            maxRetries: MAX_RETRIES_FOR_500,
            backoffDelay: `${backoffDelay}ms`
          });
          // Retry with exponential backoff
          if (isActiveRef.current) {
            timeoutIdRef.current = setTimeout(() => poll(), backoffDelay);
          }
          return;
        } else {
          // Max retries exceeded
          const serverError = 'Server error after multiple retries. Please try again later.';
          logger.error('[AnalysisProgress] Max 500 retries exceeded', new Error(serverError), {
            runId,
            retries: serverErrorRetriesRef.current
          });
          setError(serverError);
          stopPolling('server_error');
          onError?.(serverError);
          return;
        }
      }

      // Handle network errors with exponential backoff
      if (errorMessage.includes('Network') || errorMessage.includes('Failed to fetch')) {
        const backoffDelay = Math.min(POLLING_INTERVAL * Math.pow(2, attemptsRef.current % 5), 32000);
        logger.warn('[AnalysisProgress] Network error, retrying with backoff', {
          runId,
          attempt: attemptsRef.current,
          backoffDelay: `${backoffDelay}ms`
        });
        // Retry with exponential backoff
        if (isActiveRef.current) {
          timeoutIdRef.current = setTimeout(() => poll(), backoffDelay);
        }
        return;
      }

      // Other errors - fail immediately
      logger.error('[AnalysisProgress] Unhandled error', err instanceof Error ? err : new Error(errorMessage), {
        runId,
        errorMessage
      });
      setError(errorMessage);
      stopPolling('error');
      onError?.(errorMessage);
    }
  }, [runId, onComplete, onError, stopPolling]);

  // Start polling
  const startPolling = useCallback(() => {
    if (!runId || isActiveRef.current) {
      logger.debug('[AnalysisProgress] Skipping start (no runId or already active)');
      return;
    }

    logger.info('[AnalysisProgress] Starting poll', {
      runId
    });

    // Reset state
    setIsPolling(true);
    setError(null);
    setProgress(null);
    isActiveRef.current = true;
    attemptsRef.current = 0;
    serverErrorRetriesRef.current = 0;
    startTimeRef.current = Date.now();

    // Start polling
    poll();
  }, [runId, poll]);

  // Auto-start polling when runId changes
  useEffect(() => {
    if (runId) {
      startPolling();
    }

    // Cleanup on unmount or runId change
    return () => {
      logger.debug('[AnalysisProgress] useEffect cleanup');
      cleanup();
    };
  }, [runId, startPolling, cleanup]);

  return {
    progress,
    isPolling,
    error,
    startPolling,
  };
}
