// src/features/dashboard/components/LeadsTable/analytics/HashtagBadge.tsx

interface HashtagBadgeProps {
  tag: string;
  count: number;
}

export function HashtagBadge({ tag, count }: HashtagBadgeProps) {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm">
      <span className="font-medium">{tag}</span>
      <span className="text-xs text-blue-600 dark:text-blue-400">×{count}</span>
    </div>
  );
}
