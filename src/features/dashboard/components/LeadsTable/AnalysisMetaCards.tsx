// src/features/dashboard/components/LeadsTable/AnalysisMetaCards.tsx

/**
 * ANALYSIS META CARDS COMPONENT
 *
 * Displays 3 mini cards in a horizontal row with faint colors:
 * - Analysis type (Light/Deep/Xray) - amber/blue/purple
 * - Status (Complete/Processing/etc) - green/amber/red
 * - Date analyzed - gray
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

interface MetaCardProps {
  icon: string;
  children: React.ReactNode;
  bgColor: string;
  iconColor: string;
  textColor: string;
}

function MetaCard({ icon, children, bgColor, iconColor, textColor }: MetaCardProps) {
  return (
    <div className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg ${bgColor}`}>
      <Icon icon={icon} className={`w-4 h-4 ${iconColor}`} />
      <span className={`text-sm font-medium ${textColor}`}>{children}</span>
    </div>
  );
}

export function AnalysisMetaCards({ analysisType, status, analyzedAt }: AnalysisMetaCardsProps) {
  // Type config with colors
  const typeConfig = {
    light: {
      icon: 'mdi:lightning-bolt',
      label: 'Light',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
      iconColor: 'text-amber-600 dark:text-amber-400',
      textColor: 'text-amber-700 dark:text-amber-300',
    },
    deep: {
      icon: 'mdi:brain',
      label: 'Deep',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
      textColor: 'text-blue-700 dark:text-blue-300',
    },
    xray: {
      icon: 'mdi:atom',
      label: 'X-Ray',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      iconColor: 'text-purple-600 dark:text-purple-400',
      textColor: 'text-purple-700 dark:text-purple-300',
    },
  };

  // Status config with colors
  const statusConfig = {
    pending: {
      icon: 'mdi:clock-outline',
      label: 'Pending',
      bgColor: 'bg-gray-50 dark:bg-gray-800/50',
      iconColor: 'text-gray-500 dark:text-gray-400',
      textColor: 'text-gray-700 dark:text-gray-300',
    },
    processing: {
      icon: 'mdi:loading',
      label: 'Processing',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
      iconColor: 'text-amber-600 dark:text-amber-400',
      textColor: 'text-amber-700 dark:text-amber-300',
    },
    complete: {
      icon: 'mdi:check-circle',
      label: 'Complete',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      iconColor: 'text-green-600 dark:text-green-400',
      textColor: 'text-green-700 dark:text-green-300',
    },
    failed: {
      icon: 'mdi:alert-circle',
      label: 'Failed',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      iconColor: 'text-red-600 dark:text-red-400',
      textColor: 'text-red-700 dark:text-red-300',
    },
  };

  const type = analysisType
    ? typeConfig[analysisType]
    : {
        icon: 'mdi:minus-circle-outline',
        label: 'None',
        bgColor: 'bg-gray-50 dark:bg-gray-800/50',
        iconColor: 'text-gray-500 dark:text-gray-400',
        textColor: 'text-gray-700 dark:text-gray-300',
      };

  const statusInfo = status
    ? statusConfig[status]
    : {
        icon: 'mdi:minus-circle-outline',
        label: 'N/A',
        bgColor: 'bg-gray-50 dark:bg-gray-800/50',
        iconColor: 'text-gray-500 dark:text-gray-400',
        textColor: 'text-gray-700 dark:text-gray-300',
      };

  // Date card - subtle blue/gray
  const dateConfig = {
    bgColor: 'bg-slate-50 dark:bg-slate-800/50',
    iconColor: 'text-slate-500 dark:text-slate-400',
    textColor: 'text-slate-700 dark:text-slate-300',
  };

  return (
    <div className="flex gap-3">
      <MetaCard
        icon={type.icon}
        bgColor={type.bgColor}
        iconColor={type.iconColor}
        textColor={type.textColor}
      >
        {type.label}
      </MetaCard>
      <MetaCard
        icon={statusInfo.icon}
        bgColor={statusInfo.bgColor}
        iconColor={statusInfo.iconColor}
        textColor={statusInfo.textColor}
      >
        {statusInfo.label}
      </MetaCard>
      <MetaCard
        icon="mdi:calendar"
        bgColor={dateConfig.bgColor}
        iconColor={dateConfig.iconColor}
        textColor={dateConfig.textColor}
      >
        {formatShortDate(analyzedAt)}
      </MetaCard>
    </div>
  );
}
