// src/pages/dashboard/DashboardPage.tsx
/**
 * DASHBOARD PAGE
 * 
 * Main dashboard view featuring:
 * - Table-first layout (85% of screen)
 * - Action buttons (Research, Bulk Upload)
 * - Stats strip (future Phase 3)
 * 
 * This replaces the placeholder "Coming soon..." view
 */

import { DashboardShell } from '@/features/dashboard/layout/DashboardShell';
import { LeadsTable } from '@/features/dashboard/components/LeadsTable/LeadsTable';
import { Button } from '@/shared/components/ui/Button';
import { Icon } from '@iconify/react';

// =============================================================================
// COMPONENT
// =============================================================================

export function DashboardPage() {
  return (
    <DashboardShell>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-text mb-1">Leads</h1>
            <p className="text-sm text-text-secondary">
              Manage and analyze your Instagram leads
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              icon="mdi:upload"
              iconPosition="left"
            >
              Bulk Upload
            </Button>
            <Button
              variant="primary"
              icon="mdi:plus"
              iconPosition="left"
            >
              Analyze Lead
            </Button>
          </div>
        </div>
      </div>

      {/* Filter Bar (Placeholder) */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex-1 relative">
          <Icon 
            icon="mdi:magnify" 
            width={20} 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
          />
          <input
            type="text"
            placeholder="Search leads..."
            className="w-full h-10 pl-10 pr-4 bg-surface-raised border border-border rounded-lg text-sm focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <Button variant="secondary" icon="mdi:filter" iconPosition="left">
          Filters
        </Button>
        <Button variant="ghost" icon="mdi:sort" iconPosition="left">
          Sort
        </Button>
      </div>

      {/* Leads Table - The Star of the Show */}
      <LeadsTable />
    </DashboardShell>
  );
}
