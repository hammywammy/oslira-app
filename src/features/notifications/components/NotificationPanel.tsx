import { useNotificationStore } from '../store/notificationStore';
import { AnnouncementCard } from './AnnouncementCard';

interface NotificationPanelProps {
  onClose: () => void;
}

/**
 * Activity panel showing all announcements
 * Displays dismissible announcement cards with view actions
 */
export function NotificationPanel({ onClose }: NotificationPanelProps) {
  const announcements = useNotificationStore((state) => state.announcements);
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const dismissAnnouncement = useNotificationStore((state) => state.dismissAnnouncement);

  const handleDismissAll = () => {
    announcements.forEach((announcement) => dismissAnnouncement(announcement.id));
  };

  return (
    <div className="flex flex-col max-h-[600px] overflow-hidden rounded-lg">
      {/* Header */}
      <div className="p-4 border-b border-border bg-background rounded-t-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Activity</h3>
          {unreadCount > 0 && (
            <span className="text-xs text-muted-foreground">
              {unreadCount} {unreadCount === 1 ? 'notification' : 'notifications'}
            </span>
          )}
        </div>
      </div>

      {/* Announcements List */}
      <div className="flex-1 overflow-y-auto">
        {announcements.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-muted-foreground text-sm">
              <p>No new notifications</p>
              <p className="text-xs mt-1">You're all caught up!</p>
            </div>
          </div>
        ) : (
          announcements.map((announcement) => (
            <AnnouncementCard
              key={announcement.id}
              announcement={announcement}
              onClose={onClose}
            />
          ))
        )}
      </div>

      {/* Footer - Dismiss All */}
      {announcements.length > 0 && (
        <div className="p-2 border-t border-border bg-background rounded-b-lg">
          <button
            onClick={handleDismissAll}
            className="w-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
          >
            Dismiss all
          </button>
        </div>
      )}
    </div>
  );
}
