// src/hooks/useAnalysisSSE.ts

/**
 * ANALYSIS SSE HOOK - REAL-TIME PROGRESS UPDATES VIA SERVER-SENT EVENTS
 *
 * Replaces polling with EventSource for efficient real-time updates.
 * Based on the onboarding SSE pattern from useCompleteOnboarding.ts
 *
 * USAGE:
 * const { progress, isConnected, error } = useAnalysisSSE(runId);
 *
 * FEATURES:
 * - Real-time progress updates via SSE
 * - Auto-reconnect on connection loss
 * - Graceful error handling with fallback support
 * - Auto-cleanup on unmount or completion
 */

import { useState, useEffect, useRef } from 'react';
import { authManager } from '@/core/auth/auth-manager';
import { env } from '@/core/auth/environment';
import { logger } from '@/core/utils/logger';

// =============================================================================
// TYPES
// =============================================================================

export type AnalysisStatus = 'pending' | 'analyzing' | 'complete' | 'failed' | 'cancelled';

export interface AnalysisProgressState {
  runId: string;
  status: AnalysisStatus;
  progress: number; // 0-100
  step: {
    current: number;
    total: number;
  };
  currentStep?: string;
  leadId?: string;
  avatarUrl?: string;
}

interface UseAnalysisSSEReturn {
  progress: AnalysisProgressState | null;
  isConnected: boolean;
  error: Error | null;
}

// =============================================================================
// HOOK
// =============================================================================

/**
 * Establishes SSE connection for real-time analysis progress updates
 *
 * @param runId - The analysis run ID to track (null to disable)
 * @returns Progress state, connection status, and error if any
 */
export function useAnalysisSSE(runId: string | null): UseAnalysisSSEReturn {
  const [progress, setProgress] = useState<AnalysisProgressState | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const eventSourceRef = useRef<EventSource | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Don't connect if no runId
    if (!runId) {
      return;
    }

    let isMounted = true;

    const connectSSE = async () => {
      try {
        // Get auth token for query parameter (EventSource doesn't support headers)
        const token = await authManager.getAccessToken();

        if (!token) {
          throw new Error('Authentication required');
        }

        if (!isMounted) return;

        // Construct SSE endpoint URL
        const streamUrl = `${env.apiUrl}/api/analysis/${runId}/stream?token=${encodeURIComponent(token)}`;

        logger.info('[AnalysisSSE] Connecting to stream', {
          runId,
          timestamp: new Date().toISOString(),
        });

        const eventSource = new EventSource(streamUrl);
        eventSourceRef.current = eventSource;

        // Connection opened
        eventSource.addEventListener('open', () => {
          if (!isMounted) return;

          logger.info('[AnalysisSSE] Connection established', { runId });
          setIsConnected(true);
          setError(null);
        });

        // Connected event (initial confirmation from backend)
        eventSource.addEventListener('connected', (event) => {
          if (!isMounted) return;

          try {
            const data = JSON.parse(event.data);
            logger.info('[AnalysisSSE] Connected event received', {
              runId,
              message: data.message,
            });
          } catch (err) {
            logger.error('[AnalysisSSE] Failed to parse connected event', err as Error);
          }
        });

        // Progress update event
        eventSource.addEventListener('progress', (event) => {
          if (!isMounted) return;

          try {
            const data = JSON.parse(event.data);

            setProgress({
              runId,
              status: data.status || 'analyzing',
              progress: data.progress || 0,
              step: data.step || { current: 0, total: 4 },
              currentStep: data.current_step,
              leadId: data.lead_id,
              avatarUrl: data.avatar_url,
            });

            logger.info('[AnalysisSSE] Progress update', {
              runId,
              progress: data.progress,
              step: data.step,
            });
          } catch (err) {
            logger.error('[AnalysisSSE] Failed to parse progress event', err as Error);
          }
        });

        // Completion event
        eventSource.addEventListener('complete', (event) => {
          if (!isMounted) return;

          try {
            const data = JSON.parse(event.data);

            setProgress({
              runId,
              status: 'complete',
              progress: 100,
              step: data.step || { current: 4, total: 4 },
              currentStep: data.current_step,
              leadId: data.lead_id,
              avatarUrl: data.avatar_url,
            });

            logger.info('[AnalysisSSE] Analysis complete', {
              runId,
              leadId: data.lead_id,
            });

            // Close connection
            eventSource.close();
            setIsConnected(false);
          } catch (err) {
            logger.error('[AnalysisSSE] Failed to parse complete event', err as Error);
          }
        });

        // Failed event
        eventSource.addEventListener('failed', (event) => {
          if (!isMounted) return;

          try {
            const data = JSON.parse(event.data);

            setProgress({
              runId,
              status: 'failed',
              progress: data.progress || 0,
              step: data.step || { current: 0, total: 4 },
              currentStep: data.current_step || 'Failed',
              leadId: data.lead_id,
              avatarUrl: data.avatar_url,
            });

            logger.error('[AnalysisSSE] Analysis failed', new Error(data.error || 'Analysis failed'), {
              runId,
            });

            setError(new Error(data.error || 'Analysis failed'));
            eventSource.close();
            setIsConnected(false);
          } catch (err) {
            logger.error('[AnalysisSSE] Failed to parse failed event', err as Error);
          }
        });

        // Cancelled event
        eventSource.addEventListener('cancelled', (event) => {
          if (!isMounted) return;

          try {
            const data = JSON.parse(event.data);

            setProgress({
              runId,
              status: 'cancelled',
              progress: data.progress || 0,
              step: data.step || { current: 0, total: 4 },
              currentStep: 'Cancelled',
              leadId: data.lead_id,
              avatarUrl: data.avatar_url,
            });

            logger.info('[AnalysisSSE] Analysis cancelled', { runId });

            eventSource.close();
            setIsConnected(false);
          } catch (err) {
            logger.error('[AnalysisSSE] Failed to parse cancelled event', err as Error);
          }
        });

        // Error handler
        eventSource.onerror = (event: any) => {
          if (!isMounted) return;

          logger.error('[AnalysisSSE] Connection error', new Error('SSE connection error'), {
            runId,
            readyState: eventSource.readyState,
            timestamp: new Date().toISOString(),
          });

          // Check if backend sent error message
          if (event.data) {
            try {
              const data = JSON.parse(event.data);
              setError(new Error(data.message || 'SSE connection failed'));
            } catch {
              setError(new Error('SSE connection failed'));
            }
          } else {
            setError(new Error('SSE connection failed'));
          }

          eventSource.close();
          setIsConnected(false);
        };

        // Timeout after 5 minutes (analyses should complete within this time)
        timeoutRef.current = setTimeout(() => {
          if (!isMounted) return;

          logger.error('[AnalysisSSE] Timeout - exceeded 5 minutes', new Error('Analysis timeout'));

          setError(new Error('Analysis timeout - exceeded 5 minutes'));
          eventSource.close();
          setIsConnected(false);
        }, 300000); // 5 minutes

      } catch (err) {
        if (!isMounted) return;

        logger.error('[AnalysisSSE] Failed to establish connection', err as Error);
        setError(err instanceof Error ? err : new Error('Failed to connect'));
        setIsConnected(false);
      }
    };

    connectSSE();

    // Cleanup function
    return () => {
      isMounted = false;

      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      setIsConnected(false);
    };
  }, [runId]);

  return {
    progress,
    isConnected,
    error,
  };
}
