// src/features/notifications/index.ts

/**
 * NOTIFICATIONS FEATURE
 *
 * Zero-backend notification system with localStorage persistence
 *
 * EXPORTS:
 * - NotificationBell: Bell icon with badge
 * - useNotificationStore: Zustand store hook
 */

export { NotificationBell } from './components/NotificationBell';
export { useNotificationStore } from './store/notificationStore';
