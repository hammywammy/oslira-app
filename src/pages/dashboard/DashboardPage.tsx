// src/pages/dashboard/DashboardPage.tsx

/**
 * DASHBOARD PAGE - OSLIRA PRODUCTION
 * 
 * Main dashboard view featuring table-first layout.
 * This is where users spend 80% of their time.
 * 
 * LAYOUT:
 * - Page header with title + action buttons
 * - Filter bar (search, filters, sort)
 * - LeadsTable (85% of screen real estate)
 * 
 * PHILOSOPHY:
 * The table IS the product. Everything else supports it.
 */

import { AppShell } from '@/shared/components/layout/AppShell';
import { LeadsTable } from '@/features/dashboard/components/LeadsTable/LeadsTable';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';

// =============================================================================
// COMPONENT
// =============================================================================

export function DashboardPage() {
  return (
    <AppShell>
      {/* ===== PAGE HEADER ===== */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          {/* Title */}
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

      {/* ===== FILTER BAR ===== */}
      <div className="mb-4 flex items-center gap-3">
        {/* Search Input */}
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search leads..."
            icon="mdi:magnify"
            iconPosition="left"
            fullWidth
          />
        </div>

        {/* Filter Button */}
        <Button variant="secondary" icon="mdi:filter-outline" iconPosition="left">
          Filters
        </Button>

        {/* Sort Button */}
        <Button variant="ghost" icon="mdi:sort" iconPosition="left">
          Sort
        </Button>
      </div>

      {/* ===== LEADS TABLE - THE STAR ===== */}
      <LeadsTable />
    </AppShell>
  );
}
