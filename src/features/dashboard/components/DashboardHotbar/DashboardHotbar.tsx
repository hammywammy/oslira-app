// src/features/dashboard/components/DashboardHotbar/DashboardHotbar.tsx

/**
 * DASHBOARD HOTBAR - V3.0 FULL FUNCTIONALITY
 *
 * FEATURES:
 * - Search leads with real-time filtering
 * - Sort by multiple fields (created_at, updated_at, overall_score)
 * - Filter by analysis status and score range
 * - Refresh button to reload data
 * - Mass delete when leads are selected
 */

import { Icon } from '@iconify/react';
import { useState, useRef } from 'react';
import type { SortField, SortOrder, TableFilters } from '@/pages/dashboard/DashboardPage';
import { DropdownPortal } from '@/shared/components/ui/DropdownPortal';

interface DashboardHotbarProps {
  onBulkUpload: () => void;
  onAnalyzeLead: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortField: SortField;
  sortOrder: SortOrder;
  onSortChange: (field: SortField, order: SortOrder) => void;
  filters: TableFilters;
  onFilterChange: (filters: TableFilters) => void;
  onRefresh: () => void;
  selectedCount: number;
  onDeleteSelected: () => void;
}

export function DashboardHotbar({
  onBulkUpload,
  onAnalyzeLead,
  searchQuery,
  onSearchChange,
  sortField,
  sortOrder,
  onSortChange,
  filters,
  onFilterChange,
  onRefresh,
  selectedCount,
  onDeleteSelected,
}: DashboardHotbarProps) {
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const sortButtonRef = useRef<HTMLButtonElement>(null);
  const filterButtonRef = useRef<HTMLButtonElement>(null);

  const handleMassDelete = async () => {
    if (selectedCount === 0) return;
    setIsDeleting(true);
    try {
      await onDeleteSelected();
    } finally {
      setIsDeleting(false);
    }
  };

  const getSortLabel = () => {
    const fieldLabels = {
      created_at: 'Created',
      updated_at: 'Updated',
      overall_score: 'Score',
    };
    const orderIcon = sortOrder === 'asc' ? '↑' : '↓';
    return `${fieldLabels[sortField]} ${orderIcon}`;
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.analysisStatus && filters.analysisStatus.length > 0) count++;
    if (filters.scoreMin !== undefined || filters.scoreMax !== undefined) count++;
    return count;
  };

  return (
    <div className="h-14 bg-background border-b border-border w-full">
      <div className="h-full px-6 flex items-center justify-between gap-6">

        {/* Left: Primary Actions */}
        <div className="flex items-center gap-3">
          {selectedCount > 0 ? (
            <>
              <div className="text-sm text-muted-foreground">
                {selectedCount} lead{selectedCount > 1 ? 's' : ''} selected
              </div>
              <button
                onClick={handleMassDelete}
                disabled={isDeleting}
                className="
                  inline-flex flex-row items-center gap-2 h-9 px-4
                  bg-destructive text-white rounded-lg
                  text-sm font-medium whitespace-nowrap
                  hover:bg-destructive/90 transition-colors
                  border border-destructive/10 shadow-sm
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              >
                {isDeleting ? (
                  <>
                    <Icon icon="mdi:loading" width={18} className="shrink-0 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Icon icon="mdi:delete-outline" width={18} className="shrink-0" />
                    <span>Delete Selected</span>
                  </>
                )}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onAnalyzeLead}
                className="
                  inline-flex flex-row items-center gap-2 h-9 px-4
                  bg-primary text-white rounded-lg
                  text-sm font-medium whitespace-nowrap
                  hover:bg-primary/90 transition-colors
                  border border-primary/10 shadow-sm
                "
              >
                <Icon icon="mdi:magnify-plus-outline" width={18} className="shrink-0" />
                <span>Analyze Lead</span>
              </button>

              <button
                onClick={onBulkUpload}
                className="
                  inline-flex flex-row items-center gap-2 h-9 px-4
                  bg-transparent text-foreground rounded-lg
                  text-sm font-medium whitespace-nowrap
                  hover:bg-muted/50 transition-colors
                  border border-border
                "
              >
                <Icon icon="mdi:upload" width={18} className="shrink-0" />
                <span>Bulk Upload</span>
              </button>
            </>
          )}
        </div>

        {/* Right: Search, Filter, Sort Controls */}
        <div className="flex items-center gap-3">
          {/* Search Leads */}
          <div className="relative">
            <Icon
              icon="mdi:magnify"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="
                h-9 pl-9 pr-3 w-80 text-sm
                bg-muted/50 border border-border rounded-lg
                placeholder:text-muted-foreground
                focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                transition-all
              "
            />
          </div>

          {/* Sort Button with Dropdown */}
          <button
            ref={sortButtonRef}
            onClick={() => setShowSortMenu(!showSortMenu)}
            className="
              inline-flex items-center gap-2 h-9 px-3
              border border-border rounded-lg
              text-sm font-medium text-foreground
              hover:bg-muted/50 transition-colors
              whitespace-nowrap
            "
          >
            <Icon icon="mdi:sort-variant" width={18} />
            <span>{getSortLabel()}</span>
            <Icon icon="mdi:chevron-down" width={16} className="text-muted-foreground" />
          </button>

          <DropdownPortal
            isOpen={showSortMenu}
            onClose={() => setShowSortMenu(false)}
            triggerRef={sortButtonRef}
            width={192}
            alignment="right"
          >
            <div className="p-2">
              <div className="text-xs font-semibold text-muted-foreground px-2 py-1">Sort by</div>
              {[
                { field: 'created_at' as SortField, label: 'Created Date' },
                { field: 'updated_at' as SortField, label: 'Updated Date' },
                { field: 'overall_score' as SortField, label: 'Score' },
              ].map(({ field, label }) => (
                <div key={field} className="space-y-1">
                  <button
                    onClick={() => {
                      onSortChange(field, 'desc');
                      setShowSortMenu(false);
                    }}
                    className={`
                      w-full text-left px-2 py-1.5 text-sm rounded
                      hover:bg-muted/50 transition-colors
                      ${sortField === field && sortOrder === 'desc' ? 'bg-primary/10 text-primary' : ''}
                    `}
                  >
                    {label} (Newest)
                  </button>
                  <button
                    onClick={() => {
                      onSortChange(field, 'asc');
                      setShowSortMenu(false);
                    }}
                    className={`
                      w-full text-left px-2 py-1.5 text-sm rounded
                      hover:bg-muted/50 transition-colors
                      ${sortField === field && sortOrder === 'asc' ? 'bg-primary/10 text-primary' : ''}
                    `}
                  >
                    {label} (Oldest)
                  </button>
                </div>
              ))}
            </div>
          </DropdownPortal>

          {/* Filter Button with Dropdown */}
          <button
            ref={filterButtonRef}
            onClick={() => setShowFilterMenu(!showFilterMenu)}
            className={`
              inline-flex items-center gap-2 h-9 px-3
              border rounded-lg text-sm font-medium
              hover:bg-primary/5 transition-colors whitespace-nowrap
              ${getActiveFilterCount() > 0 ? 'border-primary/30 text-primary' : 'border-border text-foreground'}
            `}
          >
            <Icon icon="mdi:filter-outline" width={18} />
            <span>Filter</span>
            {getActiveFilterCount() > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white text-xs font-semibold">
                {getActiveFilterCount()}
              </span>
            )}
          </button>

          <DropdownPortal
            isOpen={showFilterMenu}
            onClose={() => setShowFilterMenu(false)}
            triggerRef={filterButtonRef}
            width={288}
            alignment="right"
          >
            <div className="p-4 space-y-4">
              <div>
                <div className="text-xs font-semibold text-foreground mb-2">Analysis Status</div>
                <div className="space-y-1">
                  {['pending', 'processing', 'complete', 'failed'].map((status) => (
                    <label key={status} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.analysisStatus?.includes(status as any) || false}
                        onChange={(e) => {
                          const current = filters.analysisStatus || [];
                          const updated = e.target.checked
                            ? [...current, status as any]
                            : current.filter((s) => s !== status);
                          onFilterChange({ ...filters, analysisStatus: updated.length > 0 ? updated : undefined });
                        }}
                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary focus:ring-offset-0"
                      />
                      <span className="text-sm capitalize">{status}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-foreground mb-2">Score Range</div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    min="0"
                    max="100"
                    value={filters.scoreMin ?? ''}
                    onChange={(e) => {
                      const value = e.target.value ? parseInt(e.target.value) : undefined;
                      onFilterChange({ ...filters, scoreMin: value });
                    }}
                    className="w-20 h-8 px-2 text-sm border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <span className="text-muted-foreground">to</span>
                  <input
                    type="number"
                    placeholder="Max"
                    min="0"
                    max="100"
                    value={filters.scoreMax ?? ''}
                    onChange={(e) => {
                      const value = e.target.value ? parseInt(e.target.value) : undefined;
                      onFilterChange({ ...filters, scoreMax: value });
                    }}
                    className="w-20 h-8 px-2 text-sm border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border">
                <button
                  onClick={() => {
                    onFilterChange({});
                    setShowFilterMenu(false);
                  }}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowFilterMenu(false)}
                  className="px-3 py-1.5 text-sm font-medium bg-primary text-white rounded hover:bg-primary/90 transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          </DropdownPortal>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            className="
              inline-flex items-center justify-center h-9 w-9
              border border-border rounded-lg
              text-foreground
              hover:bg-muted/50 transition-colors
            "
            aria-label="Refresh"
          >
            <Icon icon="mdi:refresh" width={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
