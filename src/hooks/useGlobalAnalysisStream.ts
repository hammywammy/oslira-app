/**
 * GLOBAL ANALYSIS STREAM HOOK
 *
 * Single WebSocket connection that receives updates for ALL active analyses.
 *
 * ARCHITECTURE:
 * - Connects ONCE when first analysis starts
 * - Receives updates for ALL runIds
 * - Auto-reconnects on disconnect
 * - Gracefully degrades to polling if WebSocket fails
 *
 * USAGE:
 * useGlobalAnalysisStream(); // Call once in top-level component
 */

import { useEffect, useRef } from 'react';
import { useAnalysisQueueStore } from '@/features/analysis-queue/stores/useAnalysisQueueStore';
import { authManager } from '@/core/auth/auth-manager';
import { env } from '@/core/auth/environment';
import { logger } from '@/core/utils/logger';

interface StreamMessage {
  type: 'analysis.progress' | 'analysis.complete' | 'analysis.failed' | 'ready' | 'pong';
  runId?: string;
  data?: {
    progress: number;
    step: { current: number; total: number };
    status: string;
    currentStep?: string;
    avatarUrl?: string;
    leadId?: string;
    error?: string;
  };
  timestamp: number;
}

export function useGlobalAnalysisStream() {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const { jobs, updateJob } = useAnalysisQueueStore();

  // Check if we have active jobs that need streaming
  const hasActiveJobs = jobs.some(j =>
    j.status === 'pending' || j.status === 'analyzing'
  );

  useEffect(() => {
    // Only connect if we have active jobs
    if (!hasActiveJobs) {
      logger.info('[GlobalStream] No active jobs, skipping connection');
      return;
    }

    let mounted = true;

    const connect = async () => {
      try {
        const token = await authManager.getAccessToken();
        if (!token || !mounted) return;

        // Build WebSocket URL (wss:// for production, ws:// for dev)
        const wsProtocol = env.apiUrl.startsWith('https') ? 'wss' : 'ws';
        const wsUrl = env.apiUrl.replace(/^https?/, wsProtocol);
        const url = `${wsUrl}/api/analysis/ws`;

        logger.info('[GlobalStream] Connecting to global WebSocket');

        const ws = new WebSocket(url);
        wsRef.current = ws;

        ws.onopen = () => {
          if (!mounted) return;
          logger.info('[GlobalStream] Connected');
          reconnectAttemptsRef.current = 0; // Reset on successful connection
        };

        ws.onmessage = (event) => {
          if (!mounted) return;

          try {
            const message: StreamMessage = JSON.parse(event.data);

            // Handle different message types
            switch (message.type) {
              case 'ready':
                logger.info('[GlobalStream] Ready to receive updates');
                break;

              case 'pong':
                // Heartbeat response - ignore
                break;

              case 'analysis.progress':
              case 'analysis.complete':
              case 'analysis.failed':
                if (message.runId && message.data) {
                  // Update specific job in store
                  updateJob(message.runId, {
                    progress: message.data.progress,
                    step: message.data.step,
                    status: message.data.status as any,
                    avatarUrl: message.data.avatarUrl,
                    leadId: message.data.leadId,
                  });

                  logger.info('[GlobalStream] Progress update', {
                    runId: message.runId,
                    progress: message.data.progress,
                    status: message.data.status
                  });
                }
                break;

              default:
                logger.warn('[GlobalStream] Unknown message type', { type: message.type });
            }
          } catch (error) {
            logger.error('[GlobalStream] Message parse error', { error });
          }
        };

        ws.onerror = (error) => {
          if (!mounted) return;
          logger.error('[GlobalStream] WebSocket error', { error });
        };

        ws.onclose = (event) => {
          if (!mounted) return;

          logger.info('[GlobalStream] Disconnected', {
            code: event.code,
            reason: event.reason,
            wasClean: event.wasClean
          });

          // Attempt reconnection with exponential backoff (max 3 attempts)
          if (reconnectAttemptsRef.current < 3) {
            const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 8000);
            reconnectAttemptsRef.current++;

            logger.info('[GlobalStream] Reconnecting', {
              attempt: reconnectAttemptsRef.current,
              delay
            });

            reconnectTimeoutRef.current = setTimeout(() => {
              if (mounted) connect();
            }, delay);
          } else {
            logger.warn('[GlobalStream] Max reconnection attempts reached, falling back to polling');
          }
        };
      } catch (error) {
        logger.error('[GlobalStream] Connection error', { error });
      }
    };

    // Connect
    connect();

    // Cleanup
    return () => {
      mounted = false;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close(1000, 'Component unmounted');
        wsRef.current = null;
      }
    };
  }, [hasActiveJobs]); // Reconnect when first job starts

  return {
    isConnected: wsRef.current?.readyState === WebSocket.OPEN,
    connectionState: wsRef.current?.readyState
  };
}
