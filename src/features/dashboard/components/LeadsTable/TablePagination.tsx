/**
 * TABLE PAGINATION - POSTGRES/SUPABASE STYLE
 */

import { Icon } from '@iconify/react';
import { useState } from 'react';

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

export function TablePagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  onRefresh,
}: TablePaginationProps) {
  const [isEditingRows, setIsEditingRows] = useState(false);
  const [rowsInput, setRowsInput] = useState(String(pageSize));

  const handleRowsSubmit = () => {
    const newSize = parseInt(rowsInput, 10);
    if (newSize > 0 && newSize <= 1000) {
      onPageSizeChange(newSize);
    } else {
      setRowsInput(String(pageSize));
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
      
      {/* LEFT: Page navigation + Row count + Record count */}
      <div className="flex items-center gap-4">
        {/* Page Navigation */}
        <div className="flex items-center gap-2">
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
            <span>of {totalPages}</span>
          </div>

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

        {/* Editable rows */}
        <div className="flex items-center gap-1 text-muted-foreground">
          {isEditingRows ? (
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
                w-14 h-6 px-2 text-center bg-accent rounded border border-primary
                text-foreground font-medium
                focus:outline-none focus:ring-1 focus:ring-primary
                [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
              "
            />
          ) : (
            <button
              onClick={() => {
                setIsEditingRows(true);
                setRowsInput(String(pageSize));
              }}
              className="
                flex items-center gap-1 px-2 py-0.5 rounded
                hover:bg-accent hover:text-foreground transition-colors
              "
            >
              <span className="text-foreground font-semibold">{pageSize}</span>
            </button>
          )}
          <span>rows</span>
        </div>

        {/* Record count */}
        <div className="flex items-center gap-1 text-muted-foreground">
          <span className="text-foreground font-semibold">{totalItems}</span>
          <span>records</span>
        </div>
      </div>

      {/* RIGHT: Refresh + View toggle */}
      <div className="flex items-center gap-2">
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="
              w-7 h-7 rounded flex items-center justify-center
              text-muted-foreground hover:bg-accent hover:text-foreground
              transition-colors group
            "
            aria-label="Refresh"
          >
            <Icon 
              icon="ph:arrows-clockwise-bold" 
              width={14}
              className="group-active:rotate-180 transition-transform duration-300"
            />
          </button>
        )}

        <div className="flex items-center gap-1">
          <button
            className="
              inline-flex items-center gap-1.5 h-7 px-2.5 rounded-l
              text-xs font-medium text-foreground
              bg-muted border border-border
              hover:bg-accent transition-colors
            "
          >
            <Icon icon="mdi:table" width={14} />
            <span>Data</span>
          </button>
          <button
            className="
              inline-flex items-center gap-1.5 h-7 px-2.5 rounded-r
              text-xs font-medium text-muted-foreground
              bg-background border border-border border-l-0
              hover:bg-muted/50 transition-colors
            "
          >
            <Icon icon="mdi:download" width={14} />
            <span>Export</span>
          </button>
        </div>
      </div>
    </div>
  );
}
