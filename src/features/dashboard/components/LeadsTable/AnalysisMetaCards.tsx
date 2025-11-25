// src/features/dashboard/components/LeadsTable/AnalysisMetaCards.tsx

/**
 * ANALYSIS META CARDS COMPONENT
 *
 * Displays 3 mini cards in a horizontal row:
 * - Analysis type (Light/Deep/Xray)
 * - Status (Complete/Processing/etc)
 * - Date analyzed
 */

import { Icon } from '@iconify/react';
import type { AnalysisType, AnalysisStatus } from '@/shared/types/leads.types';

interface AnalysisMetaCardsProps {
  analysisType: AnalysisType | null;
  status: AnalysisStatus | null;
  analyzedAt: string | null;
}

function formatShortDate(dateString: string | null): string {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function MetaCard({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <div className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
      <Icon icon={icon} className="w-4 h-4 text-gray-500 dark:text-gray-400" />
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{children}</span>
    </div>
  );
}

export function AnalysisMetaCards({ analysisType, status, analyzedAt }: AnalysisMetaCardsProps) {
  const typeConfig = {
    light: { icon: 'mdi:lightning-bolt', label: 'Light' },
    deep: { icon: 'mdi:brain', label: 'Deep' },
    xray: { icon: 'mdi:atom', label: 'X-Ray' },
  };

  const statusConfig = {
    pending: { icon: 'mdi:clock-outline', label: 'Pending' },
    processing: { icon: 'mdi:loading', label: 'Processing' },
    complete: { icon: 'mdi:check-circle', label: 'Complete' },
    failed: { icon: 'mdi:alert-circle', label: 'Failed' },
  };

  const type = analysisType ? typeConfig[analysisType] : { icon: 'mdi:minus-circle-outline', label: 'None' };
  const statusInfo = status ? statusConfig[status] : { icon: 'mdi:minus-circle-outline', label: 'N/A' };

  return (
    <div className="flex gap-3">
      <MetaCard icon={type.icon}>{type.label}</MetaCard>
      <MetaCard icon={statusInfo.icon}>{statusInfo.label}</MetaCard>
      <MetaCard icon="mdi:calendar">{formatShortDate(analyzedAt)}</MetaCard>
    </div>
  );
}
