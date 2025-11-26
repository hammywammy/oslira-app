// src/features/dashboard/components/LeadsTable/analytics/Metric.tsx

import { Icon } from '@iconify/react';

interface MetricProps {
  label: string;
  value: string | number;
  rawValue?: number;
  interpretation?: string;
  icon?: string;
  color?: string;
  unit?: string;
}

export function Metric({
  label,
  value,
  rawValue,
  interpretation,
  icon,
  color = 'gray',
  unit,
}: MetricProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        {icon && <Icon icon={icon} className={`w-4 h-4 text-${color}-500`} />}
        <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
      </div>

      <div className="flex items-baseline gap-1">
        <span className="text-xl font-semibold text-gray-900 dark:text-gray-100">{value}</span>
        {unit && <span className="text-sm text-gray-500">{unit}</span>}
      </div>

      {interpretation && (
        <span className="text-xs text-gray-500 dark:text-gray-400">{interpretation}</span>
      )}

      {rawValue !== undefined && rawValue !== null && (
        <span className="text-xs text-gray-400">({rawValue.toLocaleString()})</span>
      )}
    </div>
  );
}
