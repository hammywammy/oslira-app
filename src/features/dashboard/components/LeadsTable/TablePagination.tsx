// src/features/dashboard/components/LeadsTable/TablePagination.tsx

/**
 * TABLE PAGINATION - SUPABASE STYLE
 * 
 * Bottom bar with:
 * - Rows per page selector
 * - Page info display
 * - Navigation controls
 * - Professional styling matching Supabase
 */

import { Icon } from '@iconify/react';

// =============================================================================
// TYPES
// =============================================================================

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  pageSizeOptions: number[];
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function TablePagination({
  currentPage,
  totalPages,
  pageSize,
  pageSizeOptions,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: TablePaginationProps) {
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    
    if (totalPages <= 7) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('ellipsis');
      }
      
      // Show pages around current
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('ellipsis');
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className="px-6 py-3.5 border-t border-gray-200 bg-white flex items-center justify-between">
      {/* LEFT: Row count + page size selector */}
      <div className="flex items-center gap-4">
        <p className="text-sm text-gray-600">
          Showing{' '}
          <span className="font-semibold text-gray-900 tabular-nums">
            {startIndex + 1}-{endIndex}
          </span>{' '}
          of{' '}
          <span className="font-semibold text-gray-900 tabular-nums">{totalItems}</span>
        </p>
        
        {/* Rows per page selector */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 font-medium">Rows:</label>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="
              h-9 px-3 pr-8 text-sm font-medium 
              border border-gray-300 rounded-lg bg-white 
              hover:border-blue-400 hover:bg-gray-50
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
              transition-all cursor-pointer
            "
          >
            {pageSizeOptions.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
      </div>

      {/* RIGHT: Pagination controls */}
      <div className="flex items-center gap-1.5">
        {/* Previous button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="
            p-2 rounded-lg text-gray-600 
            hover:bg-gray-100 hover:text-gray-900
            disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent
            transition-all
          "
          aria-label="Previous page"
        >
          <Icon icon="mdi:chevron-left" width={20} />
        </button>
        
        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => {
            if (page === 'ellipsis') {
              return (
                <span key={`ellipsis-${index}`} className="px-2 text-gray-400 select-none">
                  ...
                </span>
              );
            }
            
            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`
                  min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition-all
                  ${currentPage === page
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                {page}
              </button>
            );
          })}
        </div>
        
        {/* Next button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="
            p-2 rounded-lg text-gray-600 
            hover:bg-gray-100 hover:text-gray-900
            disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent
            transition-all
          "
          aria-label="Next page"
        >
          <Icon icon="mdi:chevron-right" width={20} />
        </button>
      </div>
    </div>
  );
}
