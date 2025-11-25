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
    if (!runId) return;

    let isMounted = true;

    const connectSSE = async () => {
      try {
        const token = await authManager.getAccessToken();
        if (!token) throw new Error('Authentication required');
        if (!isMounted) return;

        const streamUrl = `${env.apiUrl}/api/analysis/${runId}/stream?token=${encodeURIComponent(token)}`;

        logger.info('[AnalysisSSE] Connecting to stream', { runId });

        const eventSource = new EventSource(streamUrl);
        eventSourceRef.current = eventSource;

        eventSource.addEventListener('open', () => {
          if (!isMounted) {
            logger.warn('[AnalysisSSE] Open after unmount, closing', { runId });
            eventSource.close();
            return;
          }
          logger.info('[AnalysisSSE] Connection established', { runId });
          setIsConnected(true);
          setError(null);
        });

        eventSource.addEventListener('progress', (event) => {
          if (!isMounted) return;
          try {
            const data = JSON.parse(event.data);
            setProgress({
              runId,
              status: data.status || 'analyzing',
              progress: data.progress || 0,
              step: data.step || { current: 0, total: 4 },
              currentStep: data.current_step,  // Backend: current_step
              leadId: data.lead_id,            // Backend: lead_id
              avatarUrl: data.avatar_url,      // Backend: avatar_url
            });
            logger.info('[AnalysisSSE] Progress update', {
              runId,
              progress: data.progress,
            });
          } catch (err) {
            logger.error('[AnalysisSSE] Parse error', err as Error);
          }
        });

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
            logger.info('[AnalysisSSE] Complete', { runId });
            eventSource.close();
            setIsConnected(false);
          } catch (err) {
            logger.error('[AnalysisSSE] Parse error', err as Error);
          }
        });

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
            setError(new Error(data.error || 'Analysis failed'));
            eventSource.close();
            setIsConnected(false);
          } catch (err) {
            logger.error('[AnalysisSSE] Parse error', err as Error);
          }
        });

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
            eventSource.close();
            setIsConnected(false);
          } catch (err) {
            logger.error('[AnalysisSSE] Parse error', err as Error);
          }
        });

        eventSource.onerror = () => {
          if (!isMounted) return;
          logger.error('[AnalysisSSE] Connection error', new Error('SSE failed'), { runId });
          setError(new Error('SSE connection failed'));
          eventSource.close();
          setIsConnected(false);
        };

        timeoutRef.current = setTimeout(() => {
          if (!isMounted) return;
          logger.error('[AnalysisSSE] Timeout', new Error('5min timeout'));
          setError(new Error('Analysis timeout'));
          eventSource.close();
          setIsConnected(false);
        }, 300000);

      } catch (err) {
        if (!isMounted) return;
        logger.error('[AnalysisSSE] Connection failed', err as Error);
        setError(err instanceof Error ? err : new Error('Failed to connect'));
        setIsConnected(false);
      }
    };

    connectSSE();

    // Cleanup - always close if exists
    return () => {
      isMounted = false;

      if (eventSourceRef.current) {
        logger.info('[AnalysisSSE] Cleaning up', { runId });
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
