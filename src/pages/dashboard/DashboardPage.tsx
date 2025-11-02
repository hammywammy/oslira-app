// src/pages/dashboard/DashboardPage.tsx

/**
 * DASHBOARD PAGE - V6.0 PRODUCTION
 * 
 * LAYOUT:
 * - TopBar (global, fixed)
 * - DashboardHotbar (fixed below TopBar)
 * - Table content (scrollable)
 * - Pagination bar (fixed at bottom)
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
import { useSidebarStore } from '@/shared/stores/sidebarStore';

// =============================================================================
// MOCK DATA
// =============================================================================

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
  const { isCollapsed } = useSidebarStore();
  
  // Use store leads OR mock data
  const leads = storeLeads.length > 0 ? storeLeads : MOCK_LEADS;
  
  // Modal state
  const [showAnalyzeModal, setShowAnalyzeModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  
  // Table state
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  
  // Pagination calculations
  const totalPages = Math.ceil(leads.length / pageSize);

  // ===========================================================================
  // HANDLERS
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
      {/* DASHBOARD HOTBAR - Fixed below TopBar */}
      <DashboardHotbar
        onBulkUpload={() => setShowBulkModal(true)}
        onAnalyzeLead={() => setShowAnalyzeModal(true)}
      />

      {/* MAIN CONTENT */}
      <AppShell>
        <div className="pt-14 pb-20">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <LeadsTable
              selectedLeads={selectedLeads}
              onSelectionChange={setSelectedLeads}
            />
          </div>
        </div>
      </AppShell>

      {/* PAGINATION BAR - Fixed at bottom */}
      {leads.length > 0 && (
        <div className={`
          fixed bottom-0 right-0 bg-background border-t border-border z-30
          transition-[left] duration-200
          ${isCollapsed ? 'left-16' : 'left-60'}
        `}>
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={leads.length}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      )}

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
