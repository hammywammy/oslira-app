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
import { bulkDeleteLeads } from '@/features/leads/api/leadsApi';
import { logger } from '@/core/utils/logger';
import type { AnalysisStatus } from '@/shared/types/leads.types';

export type SortField = 'created_at' | 'updated_at' | 'overall_score';
export type SortOrder = 'asc' | 'desc';

export interface TableFilters {
  analysisStatus?: AnalysisStatus[];
  scoreMin?: number;
  scoreMax?: number;
}

export function DashboardPage() {
  // Modal state
  const [showAnalyzeModal, setShowAnalyzeModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);

  // Table state
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Search, sort, filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [filters, setFilters] = useState<TableFilters>({});
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Note: Pagination will be handled server-side in future iterations
  // For now, showing all leads without pagination
  const totalPages = 1;

  // ===========================================================================
  // HANDLERS
  // ===========================================================================

  const handleAnalyzeSuccess = (leadId: string) => {
    console.log('✅ Lead analysis started:', leadId);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleBulkSuccess = (jobId: string, count: number) => {
    console.log('✅ Bulk analysis started:', jobId, 'for', count, 'leads');
    setRefreshTrigger((prev) => prev + 1);
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

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleSort = (field: SortField, order: SortOrder) => {
    setSortField(field);
    setSortOrder(order);
  };

  const handleFilterChange = (newFilters: TableFilters) => {
    setFilters(newFilters);
  };

  const handleDeleteSuccess = () => {
    setSelectedLeads(new Set());
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleMassDelete = async () => {
    if (selectedLeads.size === 0) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedLeads.size} lead${selectedLeads.size > 1 ? 's' : ''}? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      logger.info('[DashboardPage] Mass deleting leads', { count: selectedLeads.size });
      const success = await bulkDeleteLeads(Array.from(selectedLeads));

      if (success) {
        logger.info('[DashboardPage] Mass delete completed successfully');
        handleDeleteSuccess();
      } else {
        logger.warn('[DashboardPage] Mass delete failed');
        alert('Failed to delete leads. Please try again.');
      }
    } catch (error) {
      logger.error('[DashboardPage] Mass delete error', error as Error);
      alert('An error occurred while deleting leads. Please try again.');
    }
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
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortField={sortField}
            sortOrder={sortOrder}
            onSortChange={handleSort}
            filters={filters}
            onFilterChange={handleFilterChange}
            onRefresh={handleRefresh}
            selectedCount={selectedLeads.size}
            onDeleteSelected={handleMassDelete}
          />
        }
        table={
          <LeadsTable
            selectedLeads={selectedLeads}
            onSelectionChange={setSelectedLeads}
            searchQuery={searchQuery}
            sortField={sortField}
            sortOrder={sortOrder}
            filters={filters}
            refreshTrigger={refreshTrigger}
            onDeleteSuccess={handleDeleteSuccess}
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
