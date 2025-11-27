import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import type { Announcement } from '@/config/announcements';
import { useNotificationStore } from '../store/notificationStore';

interface AnnouncementCardProps {
  announcement: Announcement;
  onClose?: () => void;
}

/**
 * Individual announcement card component
 * Displays announcement details with optional action button and dismiss button
 */
export function AnnouncementCard({ announcement, onClose }: AnnouncementCardProps) {
  const navigate = useNavigate();
  const dismissAnnouncement = useNotificationStore((state) => state.dismissAnnouncement);

  const handleView = () => {
    if (announcement.actionUrl) {
      navigate(announcement.actionUrl);
      onClose?.();
    }
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    dismissAnnouncement(announcement.id);
  };

  // Icon based on announcement type
  const getIcon = () => {
    switch (announcement.type) {
      case 'success':
        return { icon: 'ph:check-circle', color: 'text-green-500' };
      case 'warning':
        return { icon: 'ph:warning', color: 'text-yellow-500' };
      case 'error':
        return { icon: 'ph:warning-circle', color: 'text-red-500' };
      default:
        return { icon: 'ph:info', color: 'text-blue-500' };
    }
  };

  const { icon, color } = getIcon();

  // Format date to relative time
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return diffInMinutes <= 1 ? 'Just now' : `${diffInMinutes} min ago`;
    } else if (diffInHours < 24) {
      return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`;
    } else if (diffInDays < 7) {
      return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="px-4 py-3 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
      <div className="flex items-start gap-3">
        {/* Unread indicator dot */}
        <span className="mt-2 w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />

        {/* Icon */}
        <div className={`mt-0.5 flex-shrink-0 ${color}`}>
          <Icon icon={icon} className="w-5 h-5" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-semibold text-foreground">{announcement.title}</h4>

            {/* Dismiss button */}
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 p-1 hover:bg-muted rounded transition-colors"
              aria-label="Dismiss"
            >
              <Icon icon="ph:x" className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          <p className="text-sm text-muted-foreground mt-1">{announcement.message}</p>

          {/* Time and Action */}
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs text-muted-foreground">
              {getRelativeTime(announcement.createdAt)}
            </span>

            {announcement.actionLabel && (
              <>
                <span className="text-xs text-muted-foreground">•</span>
                <button
                  onClick={handleView}
                  className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  {announcement.actionLabel}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
