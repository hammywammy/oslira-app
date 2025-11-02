// src/features/dashboard/components/LeadsTable/TablePagination.tsx

/**
 * TABLE PAGINATION - POSTGRES/SUPABASE STYLE
 * 
 * Design matches Postgres admin:
 * - Left: Page navigation (arrow buttons + "Page 1 of 1")
 * - Center: "100 rows" (editable inline) + "64 records"
 * - Right: Refresh button + Data/Schema toggle (placeholder)
 */

import { Icon } from '@iconify/react';
import { useState } from 'react';

// =============================================================================
// TYPES
// =============================================================================

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onRefresh?: () => void;
  viewMode?: 'data' | 'analytics' | 'export';
  onViewModeChange?: (mode: 'data' | 'analytics' | 'export') => void;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function TablePagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  onRefresh,
  viewMode = 'data',
  onViewModeChange,
}: TablePaginationProps) {
  const [isEditingRows, setIsEditingRows] = useState(false);
  const [rowsInput, setRowsInput] = useState(String(pageSize));

  // Handle rows input submission
  const handleRowsSubmit = () => {
    const newSize = parseInt(rowsInput, 10);
    if (newSize > 0 && newSize <= 1000) {
      onPageSizeChange(newSize);
    } else {
      setRowsInput(String(pageSize)); // Reset invalid input
    }
    setIsEditingRows(false);
  };

  const handleRowsKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRowsSubmit();
    } else if (e.key === 'Escape') {
      setRowsInput(String(pageSize));
      setIsEditingRows(false);
    }
  };

  return (
    <div className="h-11 px-4 border-t border-border bg-background flex items-center justify-between text-xs font-medium">
      
      {/* ===================================================================
          LEFT: Page navigation controls
          =================================================================== */}
      <div className="flex items-center gap-2">
        {/* Previous page */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="
            w-7 h-7 rounded flex items-center justify-center
            text-muted-foreground hover:bg-accent hover:text-foreground
            disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent
            transition-colors
          "
          aria-label="Previous page"
        >
          <Icon icon="ph:caret-left-bold" width={14} />
        </button>

        {/* Page indicator with editable input */}
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <span>Page</span>
          <input
            type="number"
            value={currentPage}
            onChange={(e) => {
              const page = parseInt(e.target.value, 10);
              if (page >= 1 && page <= totalPages) {
                onPageChange(page);
              }
            }}
            min={1}
            max={totalPages}
            className="
              w-10 h-6 px-1.5 text-center bg-accent rounded border border-border
              text-foreground font-medium
              focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary
              [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
            "
          />
          <span>of</span>
          <span className="text-foreground">{totalPages}</span>
        </div>

        {/* Next page */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="
            w-7 h-7 rounded flex items-center justify-center
            text-muted-foreground hover:bg-accent hover:text-foreground
            disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent
            transition-colors
          "
          aria-label="Next page"
        >
          <Icon icon="ph:caret-right-bold" width={14} />
        </button>
      </div>

      {/* ===================================================================
          CENTER: Editable rows per page + total record count
          =================================================================== */}
      <div className="flex items-center gap-3 text-muted-foreground">
        {/* Editable rows input */}
        {isEditingRows ? (
          <div className="flex items-center gap-1">
            <input
              type="number"
              value={rowsInput}
              onChange={(e) => setRowsInput(e.target.value)}
              onBlur={handleRowsSubmit}
              onKeyDown={handleRowsKeyDown}
              autoFocus
              min="1"
              max="1000"
              className="
                w-16 h-6 px-2 text-center bg-accent rounded border border-primary
                text-foreground font-medium
                focus:outline-none focus:ring-1 focus:ring-primary
                [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
              "
            />
            <span>rows</span>
          </div>
        ) : (
          <button
            onClick={() => {
              setIsEditingRows(true);
              setRowsInput(String(pageSize));
            }}
            className="
              flex items-center gap-1 px-2 py-1 rounded
              hover:bg-accent hover:text-foreground transition-colors
            "
          >
            <span className="text-foreground font-semibold">{pageSize}</span>
            <span>rows</span>
          </button>
        )}

        {/* Total record count */}
        <div className="flex items-center gap-1">
          <span className="text-foreground font-semibold">{totalItems}</span>
          <span>records</span>
        </div>
      </div>

      {/* ===================================================================
          RIGHT: Refresh button + View mode toggle
          =================================================================== */}
      <div className="flex items-center gap-2">
        {/* Refresh button */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="
              w-7 h-7 rounded flex items-center justify-center
              text-muted-foreground hover:bg-accent hover:text-foreground
              transition-colors group
            "
            aria-label="Refresh table"
            title="Refresh table data"
          >
            <Icon 
              icon="ph:arrows-clockwise-bold" 
              width={14}
              className="group-active:rotate-180 transition-transform duration-300"
            />
          </button>
        )}

        {/* View mode toggle */}
        <div 
          className={`
            flex items-center gap-1 px-2.5 py-1 rounded 
            ${onViewModeChange 
              ? 'bg-muted text-muted-foreground cursor-pointer hover:bg-accent hover:text-foreground transition-colors' 
              : 'bg-muted/50 text-muted-foreground/40 cursor-not-allowed'
            }
          `}
          onClick={() => onViewModeChange && onViewModeChange(viewMode)}
          title={onViewModeChange ? 'Switch view mode' : 'Coming soon'}
        >
          <span className="text-[10px] uppercase tracking-wider font-semibold">
            {viewMode}
          </span>
        </div>
      </div>
    </div>
  );
}
