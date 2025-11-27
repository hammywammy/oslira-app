import { Icon } from '@iconify/react';

interface MetricProps {
  label: string;
  value: string | number;
  rawValue?: number;
  interpretation?: string;
  icon?: string;
  color?: string;
  unit?: string;
  tooltip?: string;
}

const colorMap: Record<string, { icon: string; bg: string }> = {
  blue: { icon: 'text-blue-600', bg: 'bg-blue-50' },
  purple: { icon: 'text-purple-600', bg: 'bg-purple-50' },
  red: { icon: 'text-red-600', bg: 'bg-red-50' },
  green: { icon: 'text-green-600', bg: 'bg-green-50' },
  amber: { icon: 'text-amber-600', bg: 'bg-amber-50' },
  teal: { icon: 'text-teal-600', bg: 'bg-teal-50' },
  gray: { icon: 'text-gray-600', bg: 'bg-gray-50' },
  gold: { icon: 'text-yellow-600', bg: 'bg-yellow-50' },
};

export function Metric({
  label,
  value,
  rawValue,
  interpretation,
  icon,
  color = 'gray',
  unit,
  tooltip,
}: MetricProps) {
  const colors = colorMap[color] || colorMap.gray;

  return (
    <div className="group flex flex-col gap-2 p-4 rounded-lg border border-gray-100 bg-gray-50/50 transition-all duration-200 hover:bg-white hover:border-gray-200 hover:shadow-sm">
      {/* Label with icon and tooltip */}
      <div className="flex items-center gap-2">
        {icon && (
          <div className={`p-1.5 rounded-md ${colors.bg}`}>
            <Icon icon={icon} className={`w-3.5 h-3.5 ${colors.icon}`} />
          </div>
        )}
        <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">{label}</span>
        {tooltip && (
          <div className="group/tooltip relative">
            <Icon icon="mdi:information-outline" className="w-3.5 h-3.5 text-gray-400 cursor-help" />
            <div className="absolute left-0 bottom-full mb-2 hidden group-hover/tooltip:block w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-50">
              {tooltip}
              <div className="absolute top-full left-4 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
            </div>
          </div>
        )}
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl font-bold text-gray-900 tracking-tight">{value}</span>
        {unit && <span className="text-sm font-medium text-gray-400">{unit}</span>}
      </div>

      {/* Interpretation */}
      {interpretation && (
        <span className="text-xs font-medium text-gray-500">{interpretation}</span>
      )}

      {/* Raw value */}
      {rawValue !== undefined && rawValue !== null && (
        <span className="text-xs text-gray-400 font-mono">({rawValue.toLocaleString()})</span>
      )}
    </div>
  );
}
