// src/features/analysis/hooks/useAnalysisProgress.ts

/**
 * ANALYSIS PROGRESS POLLING HOOK
 * 
 * Mirrors business context polling pattern
 * - Polls every 1 second
 * - Max 180 seconds (3 minutes for long analyses)
 * - Returns progress state + lead_id on completion
 */

import { useState, useEffect, useCallback } from 'react';
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
    lead_id: string; // ← This is what we need to return to onSuccess
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

export function useAnalysisProgress({
  runId,
  onComplete,
  onError,
}: UseAnalysisProgressOptions) {
  const [progress, setProgress] = useState<AnalysisProgressState | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pollProgress = useCallback(async () => {
    if (!runId) return;

    const maxAttempts = 180; // 3 minutes max
    let attempts = 0;

    logger.info('[AnalysisProgress] Starting poll', new Error('Poll started'), { 
      context: { runId } 
    });
    setIsPolling(true);
    setError(null);

    const poll = async () => {
      if (attempts >= maxAttempts) {
        const timeoutError = 'Analysis timed out after 3 minutes';
        logger.error('[AnalysisProgress] Timeout', new Error(timeoutError), { 
          context: { runId, attempts } 
        });
        setError(timeoutError);
        setIsPolling(false);
        onError?.(timeoutError);
        return;
      }

      attempts++;

      try {
        const response = await httpClient.get<AnalysisProgressState>(
          `/api/analysis/${runId}/progress`
        );

        setProgress(response);

        logger.info('[AnalysisProgress] Poll update', new Error('Poll update'), {
          context: {
            runId,
            attempt: attempts,
            status: response.status,
            progress: response.progress,
            step: response.current_step,
          }
        });

        // Check completion
        if (response.status === 'complete') {
          logger.info('[AnalysisProgress] Complete!', new Error('Analysis complete'), { 
            context: {
              runId, 
              leadId: response.result?.lead_id 
            }
          });
          setIsPolling(false);

          if (response.result?.lead_id) {
            onComplete?.(response.result.lead_id);
          } else {
            const noLeadError = 'Analysis complete but no lead ID returned';
            logger.error('[AnalysisProgress] Missing lead_id', new Error(noLeadError), {
              context: { response }
            });
            setError(noLeadError);
            onError?.(noLeadError);
          }
          return;
        }

        // Check failure
        if (response.status === 'failed') {
          const failureError = response.error_message || 'Analysis failed';
          logger.error('[AnalysisProgress] Failed', new Error(failureError), { 
            context: { runId, error: failureError } 
          });
          setError(failureError);
          setIsPolling(false);
          onError?.(failureError);
          return;
        }

        // Check cancellation
        if (response.status === 'cancelled') {
          logger.info('[AnalysisProgress] Cancelled', new Error('Analysis cancelled'), { 
            context: { runId } 
          });
          setError('Analysis was cancelled');
          setIsPolling(false);
          onError?.('Analysis was cancelled');
          return;
        }

        // Continue polling
        setTimeout(poll, 1000);
      } catch (err: any) {
        const errorMessage = err.message || 'Failed to fetch progress';
        logger.error('[AnalysisProgress] Poll error', err instanceof Error ? err : new Error(errorMessage));
        setError(errorMessage);
        setIsPolling(false);
        onError?.(errorMessage);
      }
    };

    poll();
  }, [runId, onComplete, onError]);

  // Auto-start polling when runId changes
  useEffect(() => {
    if (runId && !isPolling) {
      pollProgress();
    }
  }, [runId, pollProgress, isPolling]);

  return {
    progress,
    isPolling,
    error,
    startPolling: pollProgress,
  };
}
