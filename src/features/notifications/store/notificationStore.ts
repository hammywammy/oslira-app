// src/features/notifications/store/notificationStore.ts

/**
 * NOTIFICATION STORE - ZUSTAND STATE MANAGEMENT
 *
 * Zero-backend notification system with localStorage persistence.
 * Tracks dismissed announcements and computes visible notifications.
 *
 * ARCHITECTURE:
 * - Announcements are hardcoded in /config/announcements.ts
 * - Dismissed IDs are stored in localStorage
 * - Store filters announcements to show only non-dismissed items
 * - Unread count shows all visible (non-dismissed) announcements
 * - New devices see all announcements (dismissed state is device-specific)
 *
 * USAGE:
 * const {
 *   announcements,        // All visible (non-dismissed) announcements
 *   unreadCount,          // Count of visible announcements
 *   dismissAnnouncement,  // Mark announcement as dismissed
 *   clearAllDismissed,    // Reset all dismissed state (for testing)
 * } = useNotificationStore();
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { announcements as allAnnouncements } from '@/config/announcements';
import type { Announcement } from '@/config/announcements';

// =============================================================================
// TYPES
// =============================================================================

interface NotificationState {
  // Persisted state
  dismissedIds: Set<string>;

  // Computed getters
  announcements: Announcement[];
  unreadCount: number;

  // Actions
  dismissAnnouncement: (id: string) => void;
  clearAllDismissed: () => void;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Filter out dismissed announcements and sort by date (newest first)
 */
const getVisibleAnnouncements = (dismissedIds: Set<string>): Announcement[] => {
  return allAnnouncements
    .filter((announcement) => !dismissedIds.has(announcement.id))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// =============================================================================
// STORE
// =============================================================================

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      // Persisted State
      dismissedIds: new Set<string>(),

      // Computed Getters
      get announcements() {
        return getVisibleAnnouncements(get().dismissedIds);
      },

      get unreadCount() {
        return getVisibleAnnouncements(get().dismissedIds).length;
      },

      // Actions
      dismissAnnouncement: (id: string) =>
        set((state) => {
          const newDismissedIds = new Set(state.dismissedIds);
          newDismissedIds.add(id);
          return { dismissedIds: newDismissedIds };
        }),

      clearAllDismissed: () =>
        set({
          dismissedIds: new Set<string>(),
        }),
    }),
    {
      name: 'oslira-notifications', // localStorage key

      // Custom storage to handle Set serialization
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;

          const { state } = JSON.parse(str);
          return {
            state: {
              ...state,
              dismissedIds: new Set(state.dismissedIds || []),
            },
          };
        },
        setItem: (name, value) => {
          const { state } = value;
          localStorage.setItem(
            name,
            JSON.stringify({
              state: {
                ...state,
                dismissedIds: Array.from(state.dismissedIds),
              },
            })
          );
        },
        removeItem: (name) => localStorage.removeItem(name),
      },

      // Only persist dismissedIds
      partialize: (state) => ({
        dismissedIds: state.dismissedIds,
      }),
    }
  )
);
