// src/pages/dashboard/DashboardPage.tsx

/**
 * DASHBOARD PAGE - V5.0 WITH HOTBAR INTEGRATION
 * 
 * ARCHITECTURE:
 * ✅ DashboardHotbar positioned inline below TopBar
 * ✅ Native table fills entire viewport width
 * ✅ Bottom pagination bar (Supabase-style)
 * ✅ Selection state managed at page level
 * ✅ Professional CRM layout with consistent spacing
 * 
 * LAYOUT STRUCTURE:
 * - TopBar (fixed at top)
 * - DashboardHotbar (fixed below TopBar)
 * - Main content area (table + pagination)
 */

import { useState } from 'react';
import { AppShell } from '@/shared/components/layout/AppShell';
import { DashboardHotbar } from '@/features/dashboard/components/DashboardHotbar/DashboardHotbar';
import { LeadsTable } from '@/features/dashboard/components/LeadsTable/LeadsTable';
import { TablePagination } from '@/features/dashboard/components/LeadsTable/TablePagination';
import { AnalyzeLeadModal } from '@/features/leads/components/AnalyzeLeadModal';
import { BulkUploadModal } from '@/features/leads/components/BulkUploadModal';
import { useAuth } from '@/features/auth/contexts/AuthProvider';
import { useDashboardStore } from '@/features/dashboard/store/dashboardStore';

// =============================================================================
// CONSTANTS
// =============================================================================

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

// Mock data for testing
const MOCK_LEADS = [
  { id: '1', username: '@nike', full_name: 'Nike' },
  { id: '2', username: '@adidas', full_name: 'Adidas' },
  { id: '3', username: '@puma', full_name: 'PUMA' },
  { id: '4', username: '@underarmour', full_name: 'Under Armour' },
  { id: '5', username: '@newbalance', full_name: 'New Balance' },
];

// =============================================================================
// COMPONENT
// =============================================================================

export function DashboardPage() {
  const { account } = useAuth();
  const { leads: storeLeads } = useDashboardStore();
  
  // Use store leads OR mock data
  const leads = storeLeads.length > 0 ? storeLeads : MOCK_LEADS;
  
  // Modal state
  const [showAnalyzeModal, setShowAnalyzeModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  
  // Table state
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Get credits
  const currentCredits = account?.credit_balance || 0;
  
  // Pagination calculations
  const totalPages = Math.ceil(leads.length / pageSize);

  // ===========================================================================
  // HANDLERS
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
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedLeads(new Set()); // Clear selection on page change
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
      {/* DASHBOARD HOTBAR - Fixed inline below TopBar */}
      <DashboardHotbar
        onBulkUpload={() => setShowBulkModal(true)}
        onAnalyzeLead={() => setShowAnalyzeModal(true)}
        currentCredits={currentCredits}
      />

      {/* MAIN CONTENT - Wrapped in AppShell */}
      <AppShell>
        {/* Add top padding to account for fixed hotbar (TopBar 56px + Hotbar 56px = 112px) */}
        <div className="pt-14">
          {/* FULL-WIDTH TABLE CONTAINER */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            {/* Table */}
            <LeadsTable
              selectedLeads={selectedLeads}
              onSelectionChange={setSelectedLeads}
            />
            
            {/* Pagination Bar - Always show if we have any leads */}
            {leads.length > 0 && (
              <TablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                pageSizeOptions={PAGE_SIZE_OPTIONS}
                totalItems={leads.length}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            )}
          </div>
        </div>
      </AppShell>

      {/* MODALS */}
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
