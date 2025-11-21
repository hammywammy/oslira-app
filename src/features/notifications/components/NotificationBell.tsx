// src/features/notifications/components/NotificationBell.tsx

import { useState, useRef } from 'react';
import { Icon } from '@iconify/react';
import { DropdownPortal } from '@/shared/components/ui/DropdownPortal';
import { useNotificationStore } from '../store/notificationStore';
import { NotificationPanel } from './NotificationPanel';

/**
 * Notification bell icon with unread count badge
 * Opens activity panel on click
 */
export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const unreadCount = useNotificationStore((state) => state.unreadCount);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-muted rounded-lg transition-colors relative"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
      >
        <Icon icon="ph:bell" className="w-5 h-5 text-muted-foreground" />

        {/* Red badge with count - only shows when there are unread notifications */}
        {unreadCount > 0 && (
          <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] flex items-center justify-center px-1 bg-red-500 text-white text-[10px] font-semibold rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel Dropdown */}
      <DropdownPortal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        triggerRef={buttonRef}
        width={384}
        alignment="right"
      >
        <NotificationPanel onClose={() => setIsOpen(false)} />
      </DropdownPortal>
    </div>
  );
}
