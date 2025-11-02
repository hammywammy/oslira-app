// src/pages/dashboard/DashboardPage.tsx

/**
 * DASHBOARD PAGE - WITH MODAL INTEGRATION
 * 
 * Main dashboard view with Analyze Lead and Bulk Upload modals
 */

import { useState } from 'react';
import { AppShell } from '@/shared/components/layout/AppShell';
import { LeadsTable } from '@/features/dashboard/components/LeadsTable/LeadsTable';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { AnalyzeLeadModal } from '@/features/leads/components/AnalyzeLeadModal';
import { BulkUploadModal } from '@/features/leads/components/BulkUploadModal';
import { useAuth } from '@/features/auth/contexts/AuthProvider';
import { Icon } from '@iconify/react';

// =============================================================================
// COMPONENT
// =============================================================================

export function DashboardPage() {
  const { user, account } = useAuth();
  
  // Modal state
  const [showAnalyzeModal, setShowAnalyzeModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);

  // Get business profile ID and credits from auth context
  const businessProfileId = user?.selected_business_id;
  const currentCredits = account?.credit_balance || 0;

  // ===========================================================================
  // MODAL HANDLERS
  // ===========================================================================

  const handleAnalyzeSuccess = (leadId: string) => {
    console.log('✅ Lead analysis started:', leadId);
    // TODO: Show success toast
    // TODO: Refresh leads table
    // For now, just close modal - it's already closed by the modal itself
  };

  const handleBulkSuccess = (jobId: string, count: number) => {
    console.log('✅ Bulk analysis started:', jobId, 'for', count, 'leads');
    // TODO: Show success toast with message like: "Analyzing 25 leads..."
    // TODO: Refresh leads table or show progress indicator
  };

  // ===========================================================================
  // RENDER
  // ===========================================================================

  return (
    <AppShell>
      {/* ===== PAGE HEADER ===== */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          {/* Title */}
          <div>
            <h1 className="text-2xl font-semibold text-foreground mb-1">Leads</h1>
            <p className="text-sm text-muted-foreground">
              Manage and analyze your Instagram leads
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              onClick={() => setShowBulkModal(true)}
            >
              <Icon icon="ph:upload-simple" className="w-4 h-4" />
              Bulk Upload
            </Button>
            <Button
              variant="primary"
              onClick={() => setShowAnalyzeModal(true)}
            >
              <Icon icon="ph:plus" className="w-4 h-4" />
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
            fullWidth
          />
        </div>

        {/* Filter Button */}
        <Button variant="secondary">
          <Icon icon="ph:funnel" className="w-4 h-4" />
          Filters
        </Button>

        {/* Sort Button */}
        <Button variant="ghost">
          <Icon icon="ph:sort-ascending" className="w-4 h-4" />
          Sort
        </Button>
      </div>

      {/* ===== LEADS TABLE - THE STAR ===== */}
      <LeadsTable />

      {/* ===== MODALS ===== */}
      <AnalyzeLeadModal
        isOpen={showAnalyzeModal}
        onClose={() => setShowAnalyzeModal(false)}
        onSuccess={handleAnalyzeSuccess}
        businessProfileId={businessProfileId}
      />

      <BulkUploadModal
        isOpen={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        onSuccess={handleBulkSuccess}
        businessProfileId={businessProfileId}
        currentCredits={currentCredits}
      />
    </AppShell>
  );
}
