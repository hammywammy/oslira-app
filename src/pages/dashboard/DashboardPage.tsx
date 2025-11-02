// src/pages/dashboard/DashboardPage.tsx

/**
 * DASHBOARD PAGE - V3.0 REDESIGN
 * 
 * IMPROVEMENTS:
 * ✅ Properly styled action buttons with consistent spacing
 * ✅ Blue as 10% accent (icons, subtle highlights)
 * ✅ Clean visual hierarchy
 * ✅ Modal integration with new designs
 */

import { useState } from 'react';
import { AppShell } from '@/shared/components/layout/AppShell';
import { LeadsTable } from '@/features/dashboard/components/LeadsTable/LeadsTable';
import { Button } from '@/shared/components/ui/Button';
import { AnalyzeLeadModal } from '@/features/leads/components/AnalyzeLeadModal';
import { BulkUploadModal } from '@/features/leads/components/BulkUploadModal';
import { useAuth } from '@/features/auth/contexts/AuthProvider';
import { useSelectedBusiness } from '@/core/store/selectors';
import { Icon } from '@iconify/react';

// =============================================================================
// COMPONENT
// =============================================================================

export function DashboardPage() {
  const { account } = useAuth();
  const selectedBusiness = useSelectedBusiness();
  
  // Modal state
  const [showAnalyzeModal, setShowAnalyzeModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);

  // Get business profile ID and credits
  const businessProfileId = selectedBusiness?.id;
  const currentCredits = account?.credit_balance || 0;

  // ===========================================================================
  // MODAL HANDLERS
  // ===========================================================================

  const handleAnalyzeSuccess = (leadId: string) => {
    console.log('✅ Lead analysis started:', leadId);
    // TODO: Show success toast
    // TODO: Refresh leads table
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
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {/* Title Section */}
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">Leads</h1>
            <p className="text-sm text-muted-foreground">
              Manage and analyze your Instagram leads
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              onClick={() => setShowBulkModal(true)}
              className="flex items-center gap-2"
            >
              <Icon icon="ph:upload-simple" className="w-4 h-4" />
              <span>Bulk Upload</span>
            </Button>
            <Button
              variant="primary"
              onClick={() => setShowAnalyzeModal(true)}
              className="flex items-center gap-2"
            >
              <Icon icon="ph:magnifying-glass-bold" className="w-4 h-4" />
              <span>Analyze Lead</span>
            </Button>
          </div>
        </div>
      </div>

      {/* ===== LEADS TABLE ===== */}
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
