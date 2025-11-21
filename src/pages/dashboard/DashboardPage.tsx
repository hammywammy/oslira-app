// src/pages/dashboard/DashboardPage.tsx

/**
 * DASHBOARD PAGE - V7.0 SUPABASE-STYLE
 * 
 * LAYOUT: Full viewport table integration
 * - TopBar (global, fixed top)
 * - DashboardHotbar (fixed below TopBar)
 * - LeadsTable (fills viewport, edge-to-edge)
 * - Pagination (fixed bottom)
 * 
 * CHANGES FROM V6.0:
 * - Removed AppShell wrapper
 * - Removed container padding/max-width
 * - Using TableViewLayout for proper bounds
 * - All business logic unchanged
 */

import { useState } from 'react';
import { TableViewLayout } from '@/features/dashboard/layout/TableViewLayout';
import { DashboardHotbar } from '@/features/dashboard/components/DashboardHotbar/DashboardHotbar';
import { LeadsTable } from '@/features/dashboard/components/LeadsTable/LeadsTable';
import { TablePagination } from '@/features/dashboard/components/LeadsTable/TablePagination';
import { AnalyzeLeadModal } from '@/features/leads/components/AnalyzeLeadModal';
import { BulkUploadModal } from '@/features/leads/components/BulkUploadModal';
import { useDashboardStore } from '@/features/dashboard/store/dashboardStore';

// =============================================================================
// COMPONENT
// =============================================================================

export function DashboardPage() {
  // Note: Leads are now fetched directly in LeadsTable component via useLeads hook
  // This provides better data isolation and automatic refresh capabilities
  
  // Modal state
  const [showAnalyzeModal, setShowAnalyzeModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  
  // Table state
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Note: Pagination will be handled server-side in future iterations
  // For now, showing all leads without pagination
  const totalPages = 1;

  // ===========================================================================
  // HANDLERS (UNCHANGED)
  // ===========================================================================

  const handleAnalyzeSuccess = (leadId: string) => {
    console.log('✅ Lead analysis started:', leadId);
  };

  const handleBulkSuccess = (jobId: string, count: number) => {
    console.log('✅ Bulk analysis started:', jobId, 'for', count, 'leads');
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedLeads(new Set());
  };
  
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
    setSelectedLeads(new Set());
  };

  // ===========================================================================
  // RENDER
  // ===========================================================================

  return (
    <>
      <TableViewLayout
        hotbar={
          <DashboardHotbar
            onBulkUpload={() => setShowBulkModal(true)}
            onAnalyzeLead={() => setShowAnalyzeModal(true)}
          />
        }
        table={
          <LeadsTable
            selectedLeads={selectedLeads}
            onSelectionChange={setSelectedLeads}
          />
        }
        pagination={
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={0}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        }
      />

      {/* MODALS (UNCHANGED) */}
      <AnalyzeLeadModal
        isOpen={showAnalyzeModal}
        onClose={() => setShowAnalyzeModal(false)}
        onSuccess={handleAnalyzeSuccess}
      />

      <BulkUploadModal
        isOpen={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        onSuccess={handleBulkSuccess}
      />
    </>
  );
}
