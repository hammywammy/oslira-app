import { Icon } from '@iconify/react';

interface MentionBadgeProps {
  username: string;
  count: number;
}

export function MentionBadge({ username, count }: MentionBadgeProps) {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-full text-sm">
      <Icon icon="mdi:at" className="w-3.5 h-3.5" />
      <span className="font-medium">{username}</span>
      <span className="text-xs text-purple-600 dark:text-purple-400">×{count}</span>
    </div>
  );
}
