/**
 * ANALYSIS WEBSOCKET HOOK - REAL-TIME PROGRESS WITH HIBERNATION
 *
 * Replaces SSE with WebSocket for efficient real-time updates.
 * Uses Durable Object WebSocket Hibernation API.
 *
 * FEATURES:
 * - Real-time progress updates
 * - Automatic reconnection (max 1 attempt - fail fast to polling)
 * - Heartbeat ping/pong (immediate + every 5s - well under DO 10s hibernation threshold)
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
  type: 'initial' | 'progress' | 'complete' | 'failed' | 'pong' | 'error' | 'ready';
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

const HEARTBEAT_INTERVAL = 5000; // 5 seconds (well under DO hibernation timeout of 10s)
const RECONNECT_DELAY = 1000; // 1 second base delay for exponential backoff (1s, 2s, 3s)
const MAX_RECONNECT_ATTEMPTS = 3; // Three reconnection attempts with exponential backoff

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

        // Send immediate ping to prevent early hibernation
        ws.send(JSON.stringify({ action: 'ping' }));

        // Start heartbeat interval
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

            case 'ready':
              logger.info('[WebSocket] Connection ready', { runId });
              break;

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

        const timestamp = new Date().toISOString();
        const currentProgress = progress?.progress ?? 0;

        // Detailed closure logging for debugging connection issues
        const closureDetails = {
          runId,
          timestamp,
          code: event.code,
          reason: event.reason || 'No reason provided',
          readyState: ws.readyState,
          wasClean: event.wasClean,
          currentProgress: `${currentProgress}%`,
        };

        setIsConnected(false);
        cleanup();

        // Clean closure (code 1000 or 1001) - no reconnection needed
        if (event.code === 1000 || event.code === 1001) {
          logger.info('[WebSocket] Clean closure, no reconnection needed', closureDetails);
          return;
        }

        // Abnormal closure - attempt reconnection
        logger.warn('[WebSocket] Abnormal closure detected', closureDetails);

        if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttemptsRef.current++;
          const delay = RECONNECT_DELAY * reconnectAttemptsRef.current;

          logger.info('[WebSocket] Scheduling reconnection with exponential backoff', {
            attempt: reconnectAttemptsRef.current,
            max: MAX_RECONNECT_ATTEMPTS,
            delayMs: delay,
            nextAttemptIn: `${delay}ms`,
          });

          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, delay);
        } else {
          setError(new Error('Max reconnection attempts reached'));
          logger.error('[WebSocket] Max retries reached for abnormal closure', new Error('Max retries reached'), {
            runId,
            finalProgress: `${currentProgress}%`,
          });
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

  // WebSocket state monitoring - log state transitions with timestamps and progress
  useEffect(() => {
    if (!wsRef.current || !runId) return;

    const ws = wsRef.current;
    const checkInterval = setInterval(() => {
      const timestamp = new Date().toISOString();
      const currentProgress = progress?.progress ?? 0;
      const readyState = ws.readyState;

      let stateName = 'UNKNOWN';
      switch (readyState) {
        case WebSocket.CONNECTING:
          stateName = 'CONNECTING';
          break;
        case WebSocket.OPEN:
          stateName = 'OPEN';
          break;
        case WebSocket.CLOSING:
          stateName = 'CLOSING';
          break;
        case WebSocket.CLOSED:
          stateName = 'CLOSED';
          break;
      }

      // Only log state changes (not every check)
      const stateKey = `${runId}-${stateName}`;
      const lastLoggedState = (ws as WebSocket & { _lastLoggedState?: string })._lastLoggedState;

      if (lastLoggedState !== stateKey) {
        logger.info('[WebSocket] State transition', {
          runId,
          timestamp,
          state: stateName,
          readyState,
          currentProgress: `${currentProgress}%`,
          isConnected,
        });

        (ws as WebSocket & { _lastLoggedState?: string })._lastLoggedState = stateKey;
      }
    }, 1000); // Check every second

    return () => {
      clearInterval(checkInterval);
    };
  }, [runId, progress, isConnected]);

  return { progress, isConnected, error, reconnect: connect };
}
