// src/features/dashboard/components/LeadsTable/TablePagination.tsx

/**
 * TABLE PAGINATION - SUPABASE STYLE
 */

import { Icon } from '@iconify/react';

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  pageSizeOptions: number[];
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function TablePagination({
  currentPage,
  totalPages,
  pageSize,
  pageSizeOptions,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: TablePaginationProps) {
  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const handlePageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value >= 1 && value <= totalPages) {
      onPageChange(value);
    }
  };

  return (
    <div className="w-full flex items-center justify-between">
      {/* Left: Navigation */}
      <div className="flex items-center gap-2">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="
            p-1.5 rounded hover:bg-muted transition-colors
            disabled:opacity-30 disabled:cursor-not-allowed
          "
          aria-label="Previous page"
        >
          <Icon icon="mdi:chevron-left" width={20} />
        </button>

        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Page</span>
          <input
            type="number"
            value={currentPage}
            onChange={handlePageInput}
            min={1}
            max={totalPages}
            className="
              w-12 h-7 px-2 text-center text-sm
              bg-background border border-border rounded
              focus:outline-none focus:ring-1 focus:ring-primary/30
            "
          />
          <span className="text-muted-foreground">of {totalPages}</span>
        </div>

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="
            p-1.5 rounded hover:bg-muted transition-colors
            disabled:opacity-30 disabled:cursor-not-allowed
          "
          aria-label="Next page"
        >
          <Icon icon="mdi:chevron-right" width={20} />
        </button>
      </div>

      {/* Center: Row count selector */}
      <div className="flex items-center gap-2">
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="
            h-7 px-2 pr-7 text-sm
            bg-background border border-border rounded
            appearance-none
            focus:outline-none focus:ring-1 focus:ring-primary/30
            cursor-pointer
          "
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size} rows
            </option>
          ))}
        </select>
        <span className="text-sm text-muted-foreground">
          {totalItems} records
        </span>
      </div>

      {/* Right: View toggle */}
      <div className="flex items-center gap-1">
        <button
          className="
            inline-flex items-center gap-1.5 h-7 px-3
            text-xs font-medium text-foreground
            bg-muted/50 border border-border rounded-l
            hover:bg-muted transition-colors
          "
        >
          <Icon icon="mdi:table" width={14} />
          <span>Data</span>
        </button>
        <button
          className="
            inline-flex items-center gap-1.5 h-7 px-3
            text-xs font-medium text-muted-foreground
            bg-background border border-border rounded-r
            hover:bg-muted/50 transition-colors
          "
        >
          <Icon icon="mdi:download" width={14} />
          <span>Export</span>
        </button>
      </div>
    </div>
  );
}
