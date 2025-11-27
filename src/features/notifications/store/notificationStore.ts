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

interface NotificationState {
  // Persisted state
  dismissedIds: Set<string>;

  // Derived state (computed on every state change)
  announcements: Announcement[];
  unreadCount: number;

  // Actions
  dismissAnnouncement: (id: string) => void;
  clearAllDismissed: () => void;
}

/**
 * Filter out dismissed announcements and sort by date (newest first)
 */
const getVisibleAnnouncements = (dismissedIds: Set<string>): Announcement[] => {
  return allAnnouncements
    .filter((announcement) => !dismissedIds.has(announcement.id))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => {
      // Helper to recompute derived state
      const computeDerivedState = (dismissedIds: Set<string>) => {
        const announcements = getVisibleAnnouncements(dismissedIds);
        return {
          announcements,
          unreadCount: announcements.length,
        };
      };

      const initialDismissedIds = new Set<string>();
      const initialDerived = computeDerivedState(initialDismissedIds);

      return {
        // Persisted State
        dismissedIds: initialDismissedIds,

        // Derived State
        announcements: initialDerived.announcements,
        unreadCount: initialDerived.unreadCount,

        // Actions
        dismissAnnouncement: (id: string) =>
          set((state) => {
            const newDismissedIds = new Set(state.dismissedIds);
            newDismissedIds.add(id);
            return {
              dismissedIds: newDismissedIds,
              ...computeDerivedState(newDismissedIds),
            };
          }),

        clearAllDismissed: () => {
          const newDismissedIds = new Set<string>();
          return set({
            dismissedIds: newDismissedIds,
            ...computeDerivedState(newDismissedIds),
          });
        },
      };
    },
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

      // Recompute derived state after hydration
      onRehydrateStorage: () => (state) => {
        if (state) {
          const announcements = getVisibleAnnouncements(state.dismissedIds);
          state.announcements = announcements;
          state.unreadCount = announcements.length;
        }
      },
    }
  )
);
