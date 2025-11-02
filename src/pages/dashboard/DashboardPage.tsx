// src/pages/dashboard/DashboardPage.tsx

/**
 * DASHBOARD PAGE - V4.0 FULL-WIDTH TABLE INTEGRATION
 * 
 * ARCHITECTURE:
 * ✅ Integrated action bar (Bulk Upload + Analyze Lead buttons)
 * ✅ Native table fills entire page width
 * ✅ Bottom pagination bar (Supabase-style)
 * ✅ Selection state managed at page level
 * ✅ Professional CRM layout
 */

import { useState } from 'react';
import { AppShell } from '@/shared/components/layout/AppShell';
import { LeadsTable } from '@/features/dashboard/components/LeadsTable/LeadsTable';
import { TablePagination } from '@/features/dashboard/components/LeadsTable/TablePagination';
import { Button } from '@/shared/components/ui/Button';
import { AnalyzeLeadModal } from '@/features/leads/components/AnalyzeLeadModal';
import { BulkUploadModal } from '@/features/leads/components/BulkUploadModal';
import { useAuth } from '@/features/auth/contexts/AuthProvider';
import { useSelectedBusiness } from '@/core/store/selectors';
import { useDashboardStore } from '@/features/dashboard/store/dashboardStore';
import { Icon } from '@iconify/react';

// =============================================================================
// CONSTANTS
// =============================================================================

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

// =============================================================================
// COMPONENT
// =============================================================================

export function DashboardPage() {
  const { account } = useAuth();
  const selectedBusiness = useSelectedBusiness();
  const { leads } = useDashboardStore();
  
  // Modal state
  const [showAnalyzeModal, setShowAnalyzeModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  
  // Table state
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Get business profile ID and credits
  const businessProfileId = selectedBusiness?.id;
  const currentCredits = account?.credit_balance || 0;
  
  // Pagination calculations
  const totalPages = Math.ceil(leads.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentLeads = leads.slice(startIndex, endIndex);

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
  
  const handleDeleteSelected = () => {
    if (selectedLeads.size === 0) return;
    
    // TODO: Implement delete confirmation modal
    console.log('Delete leads:', Array.from(selectedLeads));
  };

  // ===========================================================================
  // RENDER
  // ===========================================================================

  return (
    <AppShell>
      {/* INTEGRATED ACTION BAR */}
      <div className="mb-6 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between">
          {/* Left: Title + Lead count */}
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900">Leads</h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-blue-50 text-blue-700 rounded-full border border-blue-100">
              {leads.length} total
            </span>
            
            {selectedLeads.size > 0 && (
              <div className="flex items-center gap-2 ml-4 pl-4 border-l border-gray-200">
                <span className="text-sm text-gray-600 font-medium">
                  {selectedLeads.size} selected
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleDeleteSelected}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Icon icon="mdi:delete-outline" width={16} className="mr-1.5" />
                  Delete
                </Button>
              </div>
            )}
          </div>

          {/* Right: Action buttons */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setShowBulkModal(true)}
              disabled={!businessProfileId}
            >
              <Icon icon="mdi:upload" width={18} className="mr-2" />
              Bulk Upload
            </Button>
            
            <Button
              onClick={() => setShowAnalyzeModal(true)}
              disabled={!businessProfileId || currentCredits === 0}
            >
              <Icon icon="mdi:magnify-plus-outline" width={18} className="mr-2" />
              Analyze Lead
            </Button>
          </div>
        </div>
      </div>

      {/* FULL-WIDTH TABLE CONTAINER */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {/* Table */}
        <LeadsTable
          selectedLeads={selectedLeads}
          onSelectionChange={setSelectedLeads}
        />
        
        {/* Pagination Bar */}
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

      {/* MODALS */}
      {showAnalyzeModal && businessProfileId && (
        <AnalyzeLeadModal
          isOpen={showAnalyzeModal}
          onClose={() => setShowAnalyzeModal(false)}
          onSuccess={handleAnalyzeSuccess}
          businessProfileId={businessProfileId}
          currentCredits={currentCredits}
        />
      )}

      {showBulkModal && businessProfileId && (
        <BulkUploadModal
          isOpen={showBulkModal}
          onClose={() => setShowBulkModal(false)}
          onSuccess={handleBulkSuccess}
          businessProfileId={businessProfileId}
          currentCredits={currentCredits}
        />
      )}
    </AppShell>
  );
}
