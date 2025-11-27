// src/features/dashboard/components/LeadsTable/analytics/MetricsSection.tsx

import type { ReactNode } from 'react';

interface MetricsSectionProps {
  title: string;
  children: ReactNode;
}

export function MetricsSection({ title, children }: MetricsSectionProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm transition-all duration-200 hover:shadow-md">
      <h3 className="text-base font-semibold text-gray-900 mb-6 tracking-tight">{title}</h3>
      {children}
    </div>
  );
}
