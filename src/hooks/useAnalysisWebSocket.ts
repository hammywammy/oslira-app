// src/hooks/useAnalysisWebSocket.ts

/**
 * ANALYSIS WEBSOCKET HOOK - REAL-TIME PROGRESS WITH HIBERNATION
 *
 * Replaces SSE with WebSocket for efficient real-time updates.
 * Uses Durable Object WebSocket Hibernation API.
 *
 * FEATURES:
 * - Real-time progress updates
 * - Automatic reconnection (max 1 attempt - fail fast to polling)
 * - Heartbeat ping/pong (every 8s - below DO 10s hibernation threshold)
 * - Page Visibility API detection for tab hibernation
 * - Graceful degradation to HTTP polling
 * - Auto-cleanup on unmount
 *
 * USAGE:
 * const { progress, isConnected, error, reconnect } = useAnalysisWebSocket(runId);
 */

import { useState, useEffect, useRef, useCallback } from 'react';
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
  step: { current: number; total: number };
  currentStep?: string;
  leadId?: string;
  avatarUrl?: string;
}

interface WebSocketMessage {
  type: 'initial' | 'progress' | 'complete' | 'failed' | 'pong' | 'error';
  data?: {
    status?: AnalysisStatus;
    progress?: number;
    step?: { current: number; total: number };
    current_step?: string;
    lead_id?: string;
    avatar_url?: string;
    error?: string;
  };
  message?: string;
  timestamp?: number;
}

interface UseAnalysisWebSocketReturn {
  progress: AnalysisProgressState | null;
  isConnected: boolean;
  error: Error | null;
  reconnect: () => void;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const HEARTBEAT_INTERVAL = 8000; // 8 seconds (must be < DO hibernation timeout of 10s)
const RECONNECT_DELAY = 1000; // 1 second (fail fast to polling)
const MAX_RECONNECT_ATTEMPTS = 1; // Fail fast - fall back to HTTP polling quickly

// =============================================================================
// HOOK
// =============================================================================

export function useAnalysisWebSocket(runId: string | null): UseAnalysisWebSocketReturn {
  const [progress, setProgress] = useState<AnalysisProgressState | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const isMountedRef = useRef(true);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  }, []);

  // Connect to WebSocket
  const connect = useCallback(async () => {
    if (!runId || !isMountedRef.current) return;

    try {
      cleanup();

      const token = await authManager.getAccessToken();
      if (!token) throw new Error('Authentication required');

      // Build WebSocket URL
      const protocol = env.apiUrl.startsWith('https') ? 'wss' : 'ws';
      const wsUrl = env.apiUrl.replace(/^https?/, protocol);
      const url = `${wsUrl}/api/analysis/${runId}/ws?token=${encodeURIComponent(token)}`;

      logger.info('[WebSocket] Connecting', { runId });

      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!isMountedRef.current) {
          ws.close();
          return;
        }

        logger.info('[WebSocket] Connected', { runId });
        setIsConnected(true);
        setError(null);
        reconnectAttemptsRef.current = 0;

        // Start heartbeat
        heartbeatIntervalRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ action: 'ping' }));
          }
        }, HEARTBEAT_INTERVAL);
      };

      ws.onmessage = (event) => {
        if (!isMountedRef.current) return;

        try {
          const message: WebSocketMessage = JSON.parse(event.data);

          switch (message.type) {
            case 'initial':
            case 'progress': {
              if (message.data) {
                const newProgress: AnalysisProgressState = {
                  runId,
                  status: message.data.status || 'analyzing',
                  progress: message.data.progress || 0,
                  step: message.data.step || { current: 0, total: 4 },
                  currentStep: message.data.current_step,
                  leadId: message.data.lead_id,
                  avatarUrl: message.data.avatar_url,
                };
                setProgress(newProgress);
                logger.info('[WebSocket] Progress update', {
                  runId,
                  progress: newProgress.progress,
                });
              }
              break;
            }

            case 'complete': {
              if (message.data) {
                const completeProgress: AnalysisProgressState = {
                  runId,
                  status: 'complete',
                  progress: 100,
                  step: message.data.step || { current: 4, total: 4 },
                  currentStep: message.data.current_step,
                  leadId: message.data.lead_id,
                  avatarUrl: message.data.avatar_url,
                };
                setProgress(completeProgress);
                logger.info('[WebSocket] Analysis complete - closing connection', { runId });

                // CRITICAL: Stop reconnection attempts and close WebSocket
                reconnectAttemptsRef.current = MAX_RECONNECT_ATTEMPTS;
                cleanup();
              }
              break;
            }

            case 'failed': {
              if (message.data) {
                const failedProgress: AnalysisProgressState = {
                  runId,
                  status: 'failed',
                  progress: message.data.progress || 0,
                  step: message.data.step || { current: 0, total: 4 },
                  currentStep: message.data.current_step || 'Failed',
                  leadId: message.data.lead_id,
                  avatarUrl: message.data.avatar_url,
                };
                setProgress(failedProgress);
                setError(new Error(message.data.error || 'Analysis failed'));
                logger.info('[WebSocket] Analysis failed - closing connection', { runId });

                // CRITICAL: Stop reconnection attempts and close WebSocket
                reconnectAttemptsRef.current = MAX_RECONNECT_ATTEMPTS;
                cleanup();
              }
              break;
            }

            case 'pong':
              // Heartbeat acknowledged
              break;

            case 'error':
              logger.error('[WebSocket] Server error', new Error(message.message || 'Server error'));
              setError(new Error(message.message || 'Server error'));
              break;

            default:
              logger.warn('[WebSocket] Unknown message', { type: message.type });
          }
        } catch (err) {
          logger.error('[WebSocket] Parse error', err as Error);
        }
      };

      ws.onerror = () => {
        logger.error('[WebSocket] Connection error', new Error('WebSocket connection error'), { runId });
        setError(new Error('WebSocket connection error'));
      };

      ws.onclose = (event) => {
        if (!isMountedRef.current) return;

        logger.warn('[WebSocket] Closed', { runId, code: event.code, reason: event.reason });
        setIsConnected(false);
        cleanup();

        // Reconnect if not normal closure and not a terminal state
        if (event.code !== 1000 && reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttemptsRef.current++;
          logger.info('[WebSocket] Reconnecting', {
            attempt: reconnectAttemptsRef.current,
            max: MAX_RECONNECT_ATTEMPTS,
          });

          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, RECONNECT_DELAY * reconnectAttemptsRef.current);
        } else if (reconnectAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
          setError(new Error('Max reconnection attempts reached'));
          logger.error('[WebSocket] Max retries', new Error('Max retries reached'), { runId });
        }
      };
    } catch (err) {
      logger.error('[WebSocket] Failed to connect', err as Error);
      setError(err as Error);
      setIsConnected(false);
    }
  }, [runId, cleanup]);

  // Initial connection
  useEffect(() => {
    isMountedRef.current = true;

    if (runId) {
      connect();
    }

    return () => {
      isMountedRef.current = false;
      cleanup();
    };
  }, [runId, connect, cleanup]);

  // Page Visibility handler - reconnect when tab becomes visible
  useEffect(() => {
    if (!isConnected || !runId) return;

    // Prevent tab/browser hibernation during analysis
    const handleVisibilityChange = () => {
      if (!document.hidden && wsRef.current?.readyState !== WebSocket.OPEN) {
        logger.warn('[WebSocket] Tab visible but WS dead - reconnecting');
        connect();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isConnected, runId, connect]);

  return { progress, isConnected, error, reconnect: connect };
}
