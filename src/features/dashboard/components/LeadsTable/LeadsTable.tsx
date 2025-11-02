// src/features/dashboard/components/LeadsTable/LeadsTable.tsx

/**
 * LEADS TABLE - PRODUCTION GRADE V3.0
 * 
 * FIXES:
 * ✅ Checkboxes only visible on row hover
 * ✅ No resize handle on checkbox column (left edge)
 * ✅ No resize handle on actions column (right edge)
 * ✅ Professional analysis badges (refined styling)
 * ✅ Fixed score progress bar (proper gradient, smooth rendering)
 * ✅ Clean column resizing (only middle columns)
 * 
 * FEATURES:
 * ✅ Hover-based checkbox visibility (cleaner UI)
 * ✅ Column resizing (only resizable columns)
 * ✅ Rows per page selector (10/25/50/100)
 * ✅ Smart pagination with ellipsis
 * ✅ Visual polish (Stripe-inspired)
 * ✅ localStorage persistence for column widths
 * ✅ Bulk selection toolbar
 * 
 * ARCHITECTURE:
 * - Checkbox visibility: CSS group-hover on <tr>
 * - Column widths: localStorage with fixed/flex mix
 * - Progress bar: Fixed gradient background-size
 * - Professional badges: Subtle shadows, proper contrast
 */

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useDashboardStore } from '../../store/dashboardStore';

// =============================================================================
// MOCK DATA
// =============================================================================

const mockLeads = [
  {
    id: '1',
    username: '@nike',
    platform: 'instagram' as const,
    full_name: 'Nike',
    avatar_url: null,
    overall_score: 87,
    analysis_type: 'deep' as const,
    analysis_status: 'complete' as const,
    followers_count: 285000000,
    credits_charged: 1,
    created_at: '2025-01-15T10:30:00Z',
  },
  {
    id: '2',
    username: '@adidas',
    platform: 'instagram' as const,
    full_name: 'Adidas',
    avatar_url: null,
    overall_score: 82,
    analysis_type: 'xray' as const,
    analysis_status: 'complete' as const,
    followers_count: 29400000,
    credits_charged: 2,
    created_at: '2025-01-14T15:20:00Z',
  },
  {
    id: '3',
    username: '@puma',
    platform: 'instagram' as const,
    full_name: 'PUMA',
    avatar_url: null,
    overall_score: 75,
    analysis_type: 'light' as const,
    analysis_status: 'complete' as const,
    followers_count: 14200000,
    credits_charged: 1,
    created_at: '2025-01-13T09:15:00Z',
  },
  {
    id: '4',
    username: '@underarmour',
    platform: 'instagram' as const,
    full_name: 'Under Armour',
    avatar_url: null,
    overall_score: null,
    analysis_type: null,
    analysis_status: 'pending' as const,
    followers_count: 9100000,
    credits_charged: null,
    created_at: '2025-01-12T14:45:00Z',
  },
];

// =============================================================================
// TYPES
// =============================================================================

interface ColumnWidths {
  checkbox: number;
  lead: number;
  platform: number;
  score: number;
  analysis: number;
  updated: number;
  actions: number;
}

type ResizableColumn = 'lead' | 'platform' | 'score' | 'analysis' | 'updated';

// =============================================================================
// CONSTANTS
// =============================================================================

const DEFAULT_COLUMN_WIDTHS: ColumnWidths = {
  checkbox: 48,
  lead: 280,
  platform: 120,
  score: 180,
  analysis: 140,
  updated: 140,
  actions: 100,
};

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
const STORAGE_KEY_WIDTHS = 'oslira_table_column_widths';

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-600';
  if (score >= 60) return 'text-blue-600';
  if (score >= 40) return 'text-amber-600';
  return 'text-rose-600';
}

function getScoreBgGradient(score: number): string {
  if (score >= 80) return 'linear-gradient(90deg, #10b981, #059669)';
  if (score >= 60) return 'linear-gradient(90deg, #3b82f6, #2563eb)';
  if (score >= 40) return 'linear-gradient(90deg, #f59e0b, #d97706)';
  return 'linear-gradient(90deg, #ef4444, #dc2626)';
}

function getAnalysisBadge(type: 'light' | 'deep' | 'xray' | null) {
  if (!type) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-600 border border-gray-200">
        <Icon icon="mdi:minus-circle-outline" width={14} />
        Not Analyzed
      </span>
    );
  }
  
  const badgeConfig = {
    light: { 
      bg: 'bg-slate-100', 
      text: 'text-slate-700',
      border: 'border-slate-200',
      icon: 'mdi:lightning-bolt',
      label: 'Light'
    },
    deep: { 
      bg: 'bg-blue-50', 
      text: 'text-blue-700',
      border: 'border-blue-200',
      icon: 'mdi:eye',
      label: 'Deep'
    },
    xray: { 
      bg: 'bg-emerald-50', 
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      icon: 'mdi:atom',
      label: 'X-Ray'
    },
  };
  
  const config = badgeConfig[type];
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md ${config.bg} ${config.text} border ${config.border} text-xs font-medium shadow-sm`}>
      <Icon icon={config.icon} width={14} />
      {config.label}
    </span>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
}

// =============================================================================
// COMPONENT
// =============================================================================

export function LeadsTable() {
  const { leads: storeLeads } = useDashboardStore();
  
  // State
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [columnWidths, setColumnWidths] = useState<ColumnWidths>(DEFAULT_COLUMN_WIDTHS);
  const [resizingColumn, setResizingColumn] = useState<ResizableColumn | null>(null);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  
  // Use store leads if available, otherwise use mock data
  const leads = storeLeads.length > 0 ? storeLeads : mockLeads;
  
  // Load column widths from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY_WIDTHS);
    if (saved) {
      try {
        setColumnWidths(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved column widths:', e);
      }
    }
  }, []);
  
  // Save column widths to localStorage when changed
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_WIDTHS, JSON.stringify(columnWidths));
  }, [columnWidths]);
  
  // Pagination logic
  const totalPages = Math.ceil(leads.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentLeads = leads.slice(startIndex, endIndex);
  
  // Selection handlers
  const handleSelectAll = () => {
    if (selectedLeads.size === currentLeads.length) {
      setSelectedLeads(new Set());
    } else {
      setSelectedLeads(new Set(currentLeads.map(lead => lead.id)));
    }
  };

  const handleSelectLead = (id: string) => {
    const newSelected = new Set(selectedLeads);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedLeads(newSelected);
  };

  const handleSort = (field: string) => {
    // TODO: Implement sorting logic
    console.log('Sort by:', field);
  };
  
  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedLeads(new Set());
  };
  
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
    setSelectedLeads(new Set());
  };
  
  // Column resize handlers (only for resizable columns)
  const handleResizeStart = (column: ResizableColumn, e: React.MouseEvent) => {
    e.preventDefault();
    setResizingColumn(column);
    setStartX(e.clientX);
    setStartWidth(columnWidths[column]);
  };
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (resizingColumn) {
        const delta = e.clientX - startX;
        const newWidth = Math.max(80, startWidth + delta);
        setColumnWidths(prev => ({
          ...prev,
          [resizingColumn]: newWidth,
        }));
      }
    };
    
    const handleMouseUp = () => {
      setResizingColumn(null);
    };
    
    if (resizingColumn) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizingColumn, startX, startWidth]);
  
  const allSelected = selectedLeads.size === currentLeads.length && currentLeads.length > 0;
  const someSelected = selectedLeads.size > 0 && selectedLeads.size < currentLeads.length;

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden"
         style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.06), inset 0 -1px 0 0 rgba(0, 0, 0, 0.04)' }}>
      
      {/* TABLE HEADER BAR */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">All Leads</h2>
          {selectedLeads.size > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 tabular-nums">
                {selectedLeads.size} selected
              </span>
              <button className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500">
                <Icon icon="mdi:delete-outline" width={16} className="inline mr-1.5" />
                Delete Selected
              </button>
            </div>
          )}
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full" style={{ tableLayout: 'fixed' }}>
          <thead className="bg-gradient-to-b from-gray-50 to-gray-50/80 border-b-2 border-gray-200/80">
            <tr>
              {/* Checkbox Column - NO RESIZE HANDLE */}
              <th className="px-4 py-3" style={{ width: `${columnWidths.checkbox}px` }}>
                <button
                  onClick={handleSelectAll}
                  className={`
                    w-4 h-4 rounded border-2 flex items-center justify-center transition-all
                    ${allSelected || someSelected 
                      ? 'bg-blue-600 border-blue-600'
                      : 'border-gray-300 hover:border-blue-600'
                    }
                  `}
                  aria-label="Select all leads"
                >
                  {allSelected && <Icon icon="mdi:check" width={12} className="text-white" />}
                  {someSelected && <Icon icon="mdi:minus" width={12} className="text-white" />}
                </button>
              </th>

              {/* Lead Column - RESIZABLE */}
              <th className="px-4 py-3 text-left relative group" style={{ width: `${columnWidths.lead}px` }}>
                <button
                  onClick={() => handleSort('username')}
                  className="flex items-center gap-1.5 font-medium text-xs text-gray-700 hover:text-gray-900 transition-colors uppercase tracking-wider"
                  style={{ letterSpacing: '0.05em' }}
                >
                  Lead
                  <Icon icon="mdi:unfold-more-horizontal" width={14} className="text-gray-400" />
                </button>
                
                <div
                  className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-blue-400 group-hover:bg-blue-200 transition-colors"
                  onMouseDown={(e) => handleResizeStart('lead', e)}
                />
              </th>

              {/* Platform Column - RESIZABLE */}
              <th className="px-4 py-3 text-left relative group" style={{ width: `${columnWidths.platform}px` }}>
                <span className="font-medium text-xs text-gray-700 uppercase tracking-wider" style={{ letterSpacing: '0.05em' }}>
                  Platform
                </span>
                
                <div
                  className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-blue-400 group-hover:bg-blue-200 transition-colors"
                  onMouseDown={(e) => handleResizeStart('platform', e)}
                />
              </th>

              {/* Score Column - RESIZABLE */}
              <th className="px-4 py-3 text-left relative group" style={{ width: `${columnWidths.score}px` }}>
                <button
                  onClick={() => handleSort('overall_score')}
                  className="flex items-center gap-1.5 font-medium text-xs text-gray-700 hover:text-gray-900 transition-colors uppercase tracking-wider"
                  style={{ letterSpacing: '0.05em' }}
                >
                  Score
                  <Icon icon="mdi:unfold-more-horizontal" width={14} className="text-gray-400" />
                </button>
                
                <div
                  className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-blue-400 group-hover:bg-blue-200 transition-colors"
                  onMouseDown={(e) => handleResizeStart('score', e)}
                />
              </th>

              {/* Analysis Column - RESIZABLE */}
              <th className="px-4 py-3 text-left relative group" style={{ width: `${columnWidths.analysis}px` }}>
                <span className="font-medium text-xs text-gray-700 uppercase tracking-wider" style={{ letterSpacing: '0.05em' }}>
                  Analysis
                </span>
                
                <div
                  className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-blue-400 group-hover:bg-blue-200 transition-colors"
                  onMouseDown={(e) => handleResizeStart('analysis', e)}
                />
              </th>

              {/* Updated Column - RESIZABLE */}
              <th className="px-4 py-3 text-left relative group" style={{ width: `${columnWidths.updated}px` }}>
                <button
                  onClick={() => handleSort('created_at')}
                  className="flex items-center gap-1.5 font-medium text-xs text-gray-700 hover:text-gray-900 transition-colors uppercase tracking-wider"
                  style={{ letterSpacing: '0.05em' }}
                >
                  Updated
                  <Icon icon="mdi:unfold-more-horizontal" width={14} className="text-gray-400" />
                </button>
                
                <div
                  className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-blue-400 group-hover:bg-blue-200 transition-colors"
                  onMouseDown={(e) => handleResizeStart('updated', e)}
                />
              </th>

              {/* Actions Column - NO RESIZE HANDLE */}
              <th className="px-4 py-3 text-right" style={{ width: `${columnWidths.actions}px` }}>
                <span className="font-medium text-xs text-gray-700 uppercase tracking-wider" style={{ letterSpacing: '0.05em' }}>
                  Actions
                </span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {currentLeads.map((lead, index) => {
              const isSelected = selectedLeads.has(lead.id);
              
              return (
                <motion.tr
                  key={lead.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`
                    group
                    transition-all duration-150
                    ${isSelected 
                      ? 'bg-blue-50/50 border-l-2 border-l-blue-600' 
                      : 'hover:bg-gray-50 hover:shadow-sm'
                    }
                  `}
                >
                  {/* Checkbox - ONLY VISIBLE ON HOVER */}
                  <td className="px-4 py-3" style={{ width: `${columnWidths.checkbox}px` }}>
                    <button
                      onClick={() => handleSelectLead(lead.id)}
                      className={`
                        w-4 h-4 rounded border-2 flex items-center justify-center transition-all
                        ${isSelected 
                          ? 'bg-blue-600 border-blue-600 opacity-100'
                          : 'border-gray-300 hover:border-blue-600 opacity-0 group-hover:opacity-100'
                        }
                      `}
                      aria-label={`Select ${lead.username}`}
                    >
                      {isSelected && <Icon icon="mdi:check" width={12} className="text-white" />}
                    </button>
                  </td>

                  {/* Lead Info - Stacked */}
                  <td className="px-4 py-3" style={{ width: `${columnWidths.lead}px` }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                        {lead.username.charAt(1).toUpperCase()}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{lead.username}</p>
                        <p className="text-xs text-gray-500 truncate">{lead.full_name}</p>
                        <p className="text-xs text-gray-400 tabular-nums">
                          {lead.followers_count ? formatNumber(lead.followers_count) : '—'} followers
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Platform */}
                  <td className="px-4 py-3" style={{ width: `${columnWidths.platform}px` }}>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-medium shadow-sm">
                      <Icon icon="mdi:instagram" width={14} />
                      Instagram
                    </span>
                  </td>

                  {/* Score with Progress Bar - FIXED GRADIENT */}
                  <td className="px-4 py-3" style={{ width: `${columnWidths.score}px` }}>
                    {lead.overall_score !== null ? (
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-semibold tabular-nums ${getScoreColor(lead.overall_score)}`}>
                            {lead.overall_score}
                          </span>
                          <span className="text-xs text-gray-400 tabular-nums">/ 100</span>
                        </div>
                        {/* Progress Bar Container */}
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full transition-all duration-500 ease-out"
                            style={{ 
                              width: `${lead.overall_score}%`,
                              background: getScoreBgGradient(lead.overall_score)
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                  </td>

                  {/* Analysis Type - PROFESSIONAL BADGES */}
                  <td className="px-4 py-3" style={{ width: `${columnWidths.analysis}px` }}>
                    {getAnalysisBadge(lead.analysis_type)}
                  </td>

                  {/* Date Updated */}
                  <td className="px-4 py-3" style={{ width: `${columnWidths.updated}px` }}>
                    <span className="text-sm text-gray-600 tabular-nums">
                      {formatDate(lead.created_at)}
                    </span>
                  </td>

                  {/* Actions - Eye Only */}
                  <td className="px-4 py-3 text-right" style={{ width: `${columnWidths.actions}px` }}>
                    <button 
                      className="p-2 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      aria-label="View details"
                      onClick={() => console.log('View lead:', lead.id)}
                    >
                      <Icon icon="mdi:eye-outline" width={18} />
                    </button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* PAGINATION FOOTER */}
      <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between">
        {/* Left: Rows count + Rows per page selector */}
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-600">
            Showing{' '}
            <span className="font-medium text-gray-900 tabular-nums">
              {startIndex + 1}-{Math.min(endIndex, leads.length)}
            </span>{' '}
            of{' '}
            <span className="font-medium text-gray-900 tabular-nums">{leads.length}</span>
          </p>
          
          {/* Rows Per Page Selector */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Rows:</label>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="h-8 px-2 pr-8 text-sm border border-gray-300 rounded-md bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer"
            >
              {PAGE_SIZE_OPTIONS.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Right: Pagination Controls */}
        <div className="flex items-center gap-1">
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          >
            Previous
          </button>
          
          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
            const showPage = page === 1 || 
                           page === totalPages || 
                           Math.abs(page - currentPage) <= 1;
            
            if (!showPage && page === 2 && currentPage > 3) {
              return <span key={page} className="px-2 text-gray-400">...</span>;
            }
            if (!showPage && page === totalPages - 1 && currentPage < totalPages - 2) {
              return <span key={page} className="px-2 text-gray-400">...</span>;
            }
            if (!showPage) return null;
            
            return (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`
                  px-3 py-1.5 text-sm font-medium rounded-md transition-colors
                  ${page === currentPage
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                {page}
              </button>
            );
          })}
          
          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
