// src/features/dashboard/components/LeadsTable/analytics/MetricsSection.tsx

import type { ReactNode } from 'react';

interface MetricsSectionProps {
  title: string;
  children: ReactNode;
}

export function MetricsSection({ title, children }: MetricsSectionProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{title}</h3>
      {children}
    </div>
  );
}
