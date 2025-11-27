/**
 * @file Event Bus
 * @description Minimal pub/sub for non-React events (analytics, tracking)
 * 
 * Features Preserved from EventBus.js:
 * - Event emission and subscription
 * - Wildcard listeners
 * - Event history tracking
 * - Statistics
 * 
 * Note: Most component communication should use React Query or Zustand.
 * This is only for cross-cutting concerns like analytics.
 */

import { logger } from '@/core/utils/logger';

export type EventCallback = (data?: unknown) => void;

interface EventListener {
  id: string;
  callback: EventCallback;
  once: boolean;
}

interface EventEntry {
  event: string;
  data?: unknown;
  timestamp: string;
}

interface EventStats {
  totalEvents: number;
  totalListeners: number;
  eventTypes: number;
  recentEvents: number;
}

// EVENT BUS CLASS
class EventBus {
  private listeners = new Map<string, EventListener[]>();
  private wildcardListeners: EventListener[] = [];
  private history: EventEntry[] = [];
  private maxHistorySize = 100;
  private stats = {
    totalEvents: 0,
    totalListeners: 0,
  };

  /**
   * Subscribe to an event
   * Supports wildcard '*' to listen to all events
   */
  on(event: string, callback: EventCallback): () => void {
    const id = this.generateId();
    const listener: EventListener = { id, callback, once: false };

    if (event === '*') {
      this.wildcardListeners.push(listener);
    } else {
      if (!this.listeners.has(event)) {
        this.listeners.set(event, []);
      }
      this.listeners.get(event)!.push(listener);
    }

    this.stats.totalListeners++;

    logger.debug('Event listener registered', { event, id });

    // Return unsubscribe function
    return () => this.off(event, id);
  }

  /**
   * Subscribe to an event (once)
   */
  once(event: string, callback: EventCallback): () => void {
    const id = this.generateId();
    const listener: EventListener = { id, callback, once: true };

    if (event === '*') {
      this.wildcardListeners.push(listener);
    } else {
      if (!this.listeners.has(event)) {
        this.listeners.set(event, []);
      }
      this.listeners.get(event)!.push(listener);
    }

    this.stats.totalListeners++;

    logger.debug('Event listener registered (once)', { event, id });

    // Return unsubscribe function
    return () => this.off(event, id);
  }

  /**
   * Unsubscribe from an event
   */
  off(event: string, listenerId?: string): void {
    if (event === '*') {
      if (listenerId) {
        this.wildcardListeners = this.wildcardListeners.filter((l) => l.id !== listenerId);
      } else {
        this.wildcardListeners = [];
      }
    } else {
      const listeners = this.listeners.get(event);
      if (!listeners) return;

      if (listenerId) {
        const filtered = listeners.filter((l) => l.id !== listenerId);
        this.listeners.set(event, filtered);
        
        if (filtered.length === 0) {
          this.listeners.delete(event);
        }
      } else {
        this.listeners.delete(event);
      }
    }

    this.stats.totalListeners = this.getTotalListenerCount();
    logger.debug('Event listener unregistered', { event, listenerId });
  }

  /**
   * Emit an event
   */
  emit(event: string, data?: unknown): void {
    this.stats.totalEvents++;

    // Store in history
    const entry: EventEntry = {
      event,
      data,
      timestamp: new Date().toISOString(),
    };

    this.history.push(entry);

    // Keep only last N entries
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
    }

    logger.debug('Event emitted', { event, hasData: !!data });

    // Call specific event listeners
    const listeners = this.listeners.get(event) || [];
    const listenersToRemove: string[] = [];

    for (const listener of listeners) {
      try {
        listener.callback(data);
        
        if (listener.once) {
          listenersToRemove.push(listener.id);
        }
      } catch (error) {
        logger.error('Event listener error', error as Error, { event, listenerId: listener.id });
      }
    }

    // Remove 'once' listeners
    if (listenersToRemove.length > 0) {
      const remaining = listeners.filter((l) => !listenersToRemove.includes(l.id));
      this.listeners.set(event, remaining);
    }

    // Call wildcard listeners
    for (const listener of this.wildcardListeners) {
      try {
        listener.callback({ event, data });
      } catch (error) {
        logger.error('Wildcard listener error', error as Error, { event });
      }
    }
  }

  /**
   * Get all listeners for an event
   */
  getListeners(event: string): number {
    if (event === '*') {
      return this.wildcardListeners.length;
    }
    return this.listeners.get(event)?.length || 0;
  }

  /**
   * Get total listener count
   */
  private getTotalListenerCount(): number {
    let count = this.wildcardListeners.length;
    for (const listeners of this.listeners.values()) {
      count += listeners.length;
    }
    return count;
  }

  /**
   * Get event statistics
   */
  getStats(): EventStats {
    return {
      totalEvents: this.stats.totalEvents,
      totalListeners: this.getTotalListenerCount(),
      eventTypes: this.listeners.size,
      recentEvents: this.history.length,
    };
  }

  /**
   * Get event history
   */
  getHistory(count?: number): EventEntry[] {
    if (count) {
      return this.history.slice(-count);
    }
    return [...this.history];
  }

  /**
   * Clear event history
   */
  clearHistory(): void {
    this.history = [];
  }

  /**
   * Clear all listeners
   */
  clearAllListeners(): void {
    this.listeners.clear();
    this.wildcardListeners = [];
    this.stats.totalListeners = 0;
  }

  /**
   * Generate unique listener ID
   */
  private generateId(): string {
    return `listener_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// SINGLETON INSTANCE
export const eventBus = new EventBus();

// COMMON EVENT TYPES (from EventTypes.js)
export const EVENT_TYPES = {
  // Auth events
  AUTH: {
    SIGNED_IN: 'auth:signed-in',
    SIGNED_OUT: 'auth:signed-out',
    SESSION_EXPIRED: 'auth:session-expired',
    UNAUTHORIZED: 'auth:unauthorized',
  },

  // Business events
  BUSINESS: {
    CREATED: 'business:created',
    UPDATED: 'business:updated',
    SELECTED: 'business:selected',
  },

  // Lead events
  LEAD: {
    CREATED: 'lead:created',
    UPDATED: 'lead:updated',
    ANALYZED: 'lead:analyzed',
    BULK_CREATED: 'lead:bulk-created',
  },

  // Analytics events
  ANALYTICS: {
    TRACKED: 'analytics:tracked',
    PAGE_VIEW: 'analytics:page-view',
    EVENT: 'analytics:event',
  },

  // UI events
  UI: {
    MODAL_OPENED: 'ui:modal-opened',
    MODAL_CLOSED: 'ui:modal-closed',
    SIDEBAR_TOGGLED: 'ui:sidebar-toggled',
    TOAST_SHOWN: 'ui:toast-shown',
  },
} as const;

export default eventBus;
