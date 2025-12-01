/**
 * ANALYSIS META CARDS COMPONENT
 *
 * Displays subtle inline badges for:
 * - Analysis type (Light/Deep/Xray)
 * - Status (Complete/Processing/etc)
 */

import { Icon } from '@iconify/react';
import type { AnalysisType, AnalysisStatus } from '@/shared/types/leads.types';

interface AnalysisMetaCardsProps {
  analysisType: AnalysisType | null;
  status: AnalysisStatus | null;
  analyzedAt: string | null;
}

interface MetaBadgeProps {
  icon: string;
  children: React.ReactNode;
  iconColor: string;
  textColor: string;
}

function MetaBadge({ icon, children, iconColor, textColor }: MetaBadgeProps) {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-50 border border-gray-200">
      <Icon icon={icon} className={`w-3.5 h-3.5 ${iconColor}`} />
      <span className={`text-xs font-medium ${textColor}`}>{children}</span>
    </div>
  );
}

export function AnalysisMetaCards({ analysisType, status, analyzedAt: _analyzedAt }: AnalysisMetaCardsProps) {
  // Type config with colors
  const typeConfig = {
    light: {
      icon: 'mdi:lightning-bolt',
      label: 'Light Analysis',
      iconColor: 'text-amber-600',
      textColor: 'text-amber-700',
    },
    deep: {
      icon: 'mdi:brain',
      label: 'Deep Analysis',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-700',
    },
    xray: {
      icon: 'mdi:atom',
      label: 'X-Ray Analysis',
      iconColor: 'text-purple-600',
      textColor: 'text-purple-700',
    },
  };

  // Status config with colors
  const statusConfig = {
    pending: {
      icon: 'mdi:clock-outline',
      label: 'Pending',
      iconColor: 'text-gray-500',
      textColor: 'text-gray-700',
    },
    processing: {
      icon: 'mdi:loading',
      label: 'Processing',
      iconColor: 'text-amber-600',
      textColor: 'text-amber-700',
    },
    complete: {
      icon: 'mdi:check-circle',
      label: 'Complete',
      iconColor: 'text-green-600',
      textColor: 'text-green-700',
    },
    failed: {
      icon: 'mdi:alert-circle',
      label: 'Failed',
      iconColor: 'text-red-600',
      textColor: 'text-red-700',
    },
  };

  const type = analysisType
    ? typeConfig[analysisType]
    : {
        icon: 'mdi:minus-circle-outline',
        label: 'No Analysis',
        iconColor: 'text-gray-500',
        textColor: 'text-gray-700',
      };

  const statusInfo = status
    ? statusConfig[status]
    : {
        icon: 'mdi:minus-circle-outline',
        label: 'N/A',
        iconColor: 'text-gray-500',
        textColor: 'text-gray-700',
      };

  return (
    <div className="flex items-center gap-2">
      <MetaBadge icon={type.icon} iconColor={type.iconColor} textColor={type.textColor}>
        {type.label}
      </MetaBadge>
      <MetaBadge
        icon={statusInfo.icon}
        iconColor={statusInfo.iconColor}
        textColor={statusInfo.textColor}
      >
        {statusInfo.label}
      </MetaBadge>
    </div>
  );
}
