// src/features/dashboard/components/LeadsTable/LeadsTable.tsx

/**
 * LEADS TABLE - PRODUCTION V5.0 (NATIVE TABLE ARCHITECTURE)
 * 
 * ARCHITECTURE:
 * ✅ Native HTML <table> for browser-optimized performance
 * ✅ Sticky columns: checkbox (left), actions (right)
 * ✅ Column resizing with smooth performance (only inline styles change)
 * ✅ Visible column dividers for clarity
 * ✅ CRM personality - engaging design with professional structure
 * ✅ localStorage persistence for column widths
 * 
 * DESIGN:
 * - Stronger vertical borders (1px solid gray-200)
 * - Blue accent highlights (10% usage)
 * - Smooth hover states
 * - Professional spacing
 * 
 * PERFORMANCE:
 * - Browser-native table rendering
 * - Only width property changes on resize
 * - RequestAnimationFrame for smooth updates
 * - Memoized row components
 */

import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useDashboardStore } from '../../store/dashboardStore';

// =============================================================================
// TYPES
// =============================================================================

interface Lead {
  id: string;
  username: string;
  platform: 'instagram';
  full_name: string | null;
  avatar_url: string | null;
  overall_score: number | null;
  analysis_type: 'light' | 'deep' | 'xray' | null;
  analysis_status: 'pending' | 'processing' | 'complete' | 'failed';
  followers_count: number;
  credits_charged?: number | null;
  created_at: string;
}

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
  checkbox: 52,      // Fixed, sticky left
  lead: 280,
  platform: 140,
  score: 200,
  analysis: 150,
  updated: 120,
  actions: 80,       // Fixed, sticky right
};

const STORAGE_KEY_WIDTHS = 'oslira_leads_column_widths';
const MIN_COLUMN_WIDTH = 80;

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-600';
  if (score >= 60) return 'text-blue-600';
  if (score >= 40) return 'text-amber-600';
  return 'text-rose-600';
}

function getScoreBgGradient(score: number): string {
  if (score >= 80) return 'from-emerald-500 to-emerald-600';
  if (score >= 60) return 'from-blue-500 to-blue-600';
  if (score >= 40) return 'from-amber-500 to-amber-600';
  return 'from-rose-500 to-rose-600';
}

function getAnalysisBadge(type: 'light' | 'deep' | 'xray' | null) {
  if (!type) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md bg-gray-50 text-gray-500 border border-gray-200">
        <Icon icon="mdi:minus-circle-outline" width={14} />
        Not Analyzed
      </span>
    );
  }
  
  const config = {
    light: { 
      bg: 'bg-slate-50', 
      text: 'text-slate-700',
      border: 'border-slate-200',
      icon: 'mdi:lightning-bolt',
      iconColor: 'text-slate-500',
    },
    deep: { 
      bg: 'bg-blue-50', 
      text: 'text-blue-700',
      border: 'border-blue-200',
      icon: 'mdi:eye',
      iconColor: 'text-blue-500',
    },
    xray: { 
      bg: 'bg-emerald-50', 
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      icon: 'mdi:atom',
      iconColor: 'text-emerald-500',
    },
  }[type];
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md ${config.bg} ${config.text} border ${config.border} text-xs font-medium shadow-sm`}>
      <Icon icon={config.icon} width={14} className={config.iconColor} />
      {type.charAt(0).toUpperCase() + type.slice(1)}
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
// TABLE ROW COMPONENT (MEMOIZED FOR PERFORMANCE)
// =============================================================================

interface TableRowProps {
  lead: Lead;
  isSelected: boolean;
  columnWidths: ColumnWidths;
  onSelectLead: (id: string) => void;
  onViewLead: (id: string) => void;
  index: number;
}

const TableRow = memo(({ lead, isSelected, columnWidths, onSelectLead, onViewLead, index }: TableRowProps) => {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02, duration: 0.2 }}
      className={`
        group border-b border-gray-200
        transition-colors duration-150
        ${isSelected 
          ? 'bg-blue-50/60' 
          : 'hover:bg-gray-50/70'
        }
      `}
    >
      {/* CHECKBOX - STICKY LEFT */}
      <td 
        className={`
          px-4 py-3.5
          sticky left-0 z-10
          ${isSelected ? 'bg-blue-50/60' : 'bg-white group-hover:bg-gray-50/70'}
          border-r border-gray-200
        `}
        style={{ width: `${columnWidths.checkbox}px`, minWidth: `${columnWidths.checkbox}px` }}
      >
        <div className="flex items-center justify-center">
          <button
            onClick={() => onSelectLead(lead.id)}
            className={`
              w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200
              ${isSelected 
                ? 'bg-blue-600 border-blue-600 shadow-sm' 
                : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
              }
            `}
            aria-label={`Select ${lead.username}`}
          >
            {isSelected && <Icon icon="mdi:check" width={14} className="text-white" />}
          </button>
        </div>
      </td>

      {/* LEAD INFO */}
      <td 
        className="px-4 py-3.5 border-r border-gray-200"
        style={{ width: `${columnWidths.lead}px`, maxWidth: `${columnWidths.lead}px` }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            {(lead.full_name || lead.username).charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-gray-900 truncate text-sm">{lead.full_name || lead.username}</p>
            <p className="text-xs text-gray-500 truncate">{lead.username}</p>
          </div>
        </div>
      </td>

      {/* PLATFORM */}
      <td 
        className="px-4 py-3.5 border-r border-gray-200"
        style={{ width: `${columnWidths.platform}px`, maxWidth: `${columnWidths.platform}px` }}
      >
        <div className="flex items-center gap-2">
          <Icon icon="mdi:instagram" width={18} className="text-pink-500 flex-shrink-0" />
          <span className="text-sm text-gray-700 font-medium truncate">Instagram</span>
        </div>
      </td>

      {/* SCORE */}
      <td 
        className="px-4 py-3.5 border-r border-gray-200"
        style={{ width: `${columnWidths.score}px`, maxWidth: `${columnWidths.score}px` }}
      >
        {lead.overall_score !== null ? (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className={`text-sm font-bold tabular-nums ${getScoreColor(lead.overall_score)}`}>
                {lead.overall_score}
              </span>
              <span className="text-xs text-gray-400 font-medium">/ 100</span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${getScoreBgGradient(lead.overall_score)} transition-all duration-500 rounded-full`}
                style={{ width: `${lead.overall_score}%` }}
              />
            </div>
          </div>
        ) : (
          <span className="text-sm text-gray-400 italic">Not scored</span>
        )}
      </td>

      {/* ANALYSIS TYPE */}
      <td 
        className="px-4 py-3.5 border-r border-gray-200"
        style={{ width: `${columnWidths.analysis}px`, maxWidth: `${columnWidths.analysis}px` }}
      >
        {getAnalysisBadge(lead.analysis_type)}
      </td>

      {/* UPDATED */}
      <td 
        className="px-4 py-3.5 border-r border-gray-200"
        style={{ width: `${columnWidths.updated}px`, maxWidth: `${columnWidths.updated}px` }}
      >
        <span className="text-sm text-gray-600 tabular-nums">
          {formatDate(lead.created_at)}
        </span>
      </td>

      {/* ACTIONS - STICKY RIGHT */}
      <td 
        className={`
          px-4 py-3.5 text-center
          sticky right-0 z-10
          ${isSelected ? 'bg-blue-50/60' : 'bg-white group-hover:bg-gray-50/70'}
          border-l border-gray-200
        `}
        style={{ width: `${columnWidths.actions}px`, minWidth: `${columnWidths.actions}px` }}
      >
        <button 
          className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 inline-flex items-center justify-center"
          aria-label="View details"
          onClick={() => onViewLead(lead.id)}
        >
          <Icon icon="mdi:eye-outline" width={18} />
        </button>
      </td>
    </motion.tr>
  );
});

TableRow.displayName = 'TableRow';

// =============================================================================
// MAIN COMPONENT
// =============================================================================

interface LeadsTableProps {
  selectedLeads: Set<string>;
  onSelectionChange: (selectedIds: Set<string>) => void;
}

export function LeadsTable({ selectedLeads, onSelectionChange }: LeadsTableProps) {
  const { leads: storeLeads } = useDashboardStore();
  
  // State
  const [columnWidths, setColumnWidths] = useState<ColumnWidths>(DEFAULT_COLUMN_WIDTHS);
  const [resizingColumn, setResizingColumn] = useState<ResizableColumn | null>(null);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  
  // Refs
  const rafRef = useRef<number | null>(null);
  
  // Mock data fallback
  const leads: Lead[] = storeLeads.length > 0 ? storeLeads : [];
  
  // Load column widths from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY_WIDTHS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setColumnWidths({ ...DEFAULT_COLUMN_WIDTHS, ...parsed });
      } catch (e) {
        console.error('Failed to parse saved column widths:', e);
      }
    }
  }, []);
  
  // Save column widths when resizing ends
  useEffect(() => {
    if (resizingColumn === null) {
      localStorage.setItem(STORAGE_KEY_WIDTHS, JSON.stringify(columnWidths));
    }
  }, [columnWidths, resizingColumn]);
  
  // Selection handlers
  const handleSelectAll = () => {
    if (selectedLeads.size === leads.length) {
      onSelectionChange(new Set());
    } else {
      onSelectionChange(new Set(leads.map(lead => lead.id)));
    }
  };

  const handleSelectLead = useCallback((id: string) => {
    const newSelected = new Set(selectedLeads);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    onSelectionChange(newSelected);
  }, [selectedLeads, onSelectionChange]);

  const handleSort = (field: string) => {
    console.log('Sort by:', field);
    // TODO: Implement sorting
  };
  
  const handleViewLead = useCallback((id: string) => {
    console.log('View lead:', id);
    // TODO: Implement view logic
  }, []);
  
  // Column resize handlers - OPTIMIZED
  const handleResizeStart = (column: ResizableColumn, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setResizingColumn(column);
    setStartX(e.clientX);
    setStartWidth(columnWidths[column]);
  };
  
  useEffect(() => {
    if (!resizingColumn) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Use RAF for smooth updates
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      
      rafRef.current = requestAnimationFrame(() => {
        const delta = e.clientX - startX;
        const newWidth = Math.max(MIN_COLUMN_WIDTH, startWidth + delta);
        
        setColumnWidths(prev => ({
          ...prev,
          [resizingColumn]: newWidth,
        }));
      });
    };
    
    const handleMouseUp = () => {
      setResizingColumn(null);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    // Prevent text selection during resize
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
      
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [resizingColumn, startX, startWidth]);
  
  const allSelected = leads.length > 0 && selectedLeads.size === leads.length;
  const someSelected = selectedLeads.size > 0 && selectedLeads.size < leads.length;

  return (
    <div className="overflow-x-auto overflow-y-visible">
      <table className="w-full border-collapse bg-white">
        <thead>
          <tr className="bg-gradient-to-b from-gray-50 to-gray-50/80 border-b-2 border-gray-200">
            {/* CHECKBOX COLUMN - STICKY LEFT */}
            <th 
              className="px-4 py-3 bg-gray-50/95 sticky left-0 z-20 border-r border-gray-200"
              style={{ width: `${columnWidths.checkbox}px`, minWidth: `${columnWidths.checkbox}px` }}
            >
              <div className="flex items-center justify-center">
                <button
                  onClick={handleSelectAll}
                  className={`
                    w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200
                    ${allSelected || someSelected 
                      ? 'bg-blue-600 border-blue-600 shadow-sm' 
                      : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                    }
                  `}
                  aria-label="Select all leads"
                >
                  {allSelected && <Icon icon="mdi:check" width={14} className="text-white" />}
                  {someSelected && <Icon icon="mdi:minus" width={14} className="text-white" />}
                </button>
              </div>
            </th>

            {/* LEAD COLUMN - RESIZABLE */}
            <th 
              className="px-4 py-3 text-left relative group bg-gray-50/95 border-r border-gray-200"
              style={{ width: `${columnWidths.lead}px`, minWidth: '150px' }}
            >
              <button
                onClick={() => handleSort('username')}
                className="flex items-center gap-1.5 font-semibold text-xs text-gray-700 hover:text-blue-600 transition-colors uppercase tracking-wider"
              >
                Lead
                <Icon icon="mdi:unfold-more-horizontal" width={14} className="text-gray-400 group-hover:text-blue-500" />
              </button>
              
              {/* Resize Handle */}
              <div
                className={`
                  absolute top-0 right-0 w-1 h-full cursor-col-resize transition-colors z-30
                  ${resizingColumn === 'lead' 
                    ? 'bg-blue-500' 
                    : 'hover:bg-blue-400 group-hover:bg-blue-200'
                  }
                `}
                onMouseDown={(e) => handleResizeStart('lead', e)}
              />
            </th>

            {/* PLATFORM COLUMN - RESIZABLE */}
            <th 
              className="px-4 py-3 text-left relative group bg-gray-50/95 border-r border-gray-200"
              style={{ width: `${columnWidths.platform}px`, minWidth: '100px' }}
            >
              <span className="font-semibold text-xs text-gray-700 uppercase tracking-wider">
                Platform
              </span>
              
              <div
                className={`
                  absolute top-0 right-0 w-1 h-full cursor-col-resize transition-colors z-30
                  ${resizingColumn === 'platform' 
                    ? 'bg-blue-500' 
                    : 'hover:bg-blue-400 group-hover:bg-blue-200'
                  }
                `}
                onMouseDown={(e) => handleResizeStart('platform', e)}
              />
            </th>

            {/* SCORE COLUMN - RESIZABLE */}
            <th 
              className="px-4 py-3 text-left relative group bg-gray-50/95 border-r border-gray-200"
              style={{ width: `${columnWidths.score}px`, minWidth: '120px' }}
            >
              <button
                onClick={() => handleSort('overall_score')}
                className="flex items-center gap-1.5 font-semibold text-xs text-gray-700 hover:text-blue-600 transition-colors uppercase tracking-wider"
              >
                Score
                <Icon icon="mdi:unfold-more-horizontal" width={14} className="text-gray-400 group-hover:text-blue-500" />
              </button>
              
              <div
                className={`
                  absolute top-0 right-0 w-1 h-full cursor-col-resize transition-colors z-30
                  ${resizingColumn === 'score' 
                    ? 'bg-blue-500' 
                    : 'hover:bg-blue-400 group-hover:bg-blue-200'
                  }
                `}
                onMouseDown={(e) => handleResizeStart('score', e)}
              />
            </th>

            {/* ANALYSIS COLUMN - RESIZABLE */}
            <th 
              className="px-4 py-3 text-left relative group bg-gray-50/95 border-r border-gray-200"
              style={{ width: `${columnWidths.analysis}px`, minWidth: '100px' }}
            >
              <span className="font-semibold text-xs text-gray-700 uppercase tracking-wider">
                Analysis
              </span>
              
              <div
                className={`
                  absolute top-0 right-0 w-1 h-full cursor-col-resize transition-colors z-30
                  ${resizingColumn === 'analysis' 
                    ? 'bg-blue-500' 
                    : 'hover:bg-blue-400 group-hover:bg-blue-200'
                  }
                `}
                onMouseDown={(e) => handleResizeStart('analysis', e)}
              />
            </th>

            {/* UPDATED COLUMN - RESIZABLE */}
            <th 
              className="px-4 py-3 text-left relative group bg-gray-50/95 border-r border-gray-200"
              style={{ width: `${columnWidths.updated}px`, minWidth: '100px' }}
            >
              <button
                onClick={() => handleSort('created_at')}
                className="flex items-center gap-1.5 font-semibold text-xs text-gray-700 hover:text-blue-600 transition-colors uppercase tracking-wider"
              >
                Updated
                <Icon icon="mdi:unfold-more-horizontal" width={14} className="text-gray-400 group-hover:text-blue-500" />
              </button>
              
              <div
                className={`
                  absolute top-0 right-0 w-1 h-full cursor-col-resize transition-colors z-30
                  ${resizingColumn === 'updated' 
                    ? 'bg-blue-500' 
                    : 'hover:bg-blue-400 group-hover:bg-blue-200'
                  }
                `}
                onMouseDown={(e) => handleResizeStart('updated', e)}
              />
            </th>

            {/* ACTIONS COLUMN - STICKY RIGHT */}
            <th 
              className="px-4 py-3 text-center bg-gray-50/95 sticky right-0 z-20 border-l border-gray-200"
              style={{ width: `${columnWidths.actions}px`, minWidth: `${columnWidths.actions}px` }}
            >
              <span className="font-semibold text-xs text-gray-700 uppercase tracking-wider">
                Actions
              </span>
            </th>
          </tr>
        </thead>

        <tbody>
          {leads.map((lead, index) => (
            <TableRow
              key={lead.id}
              lead={lead}
              isSelected={selectedLeads.has(lead.id)}
              columnWidths={columnWidths}
              onSelectLead={handleSelectLead}
              onViewLead={handleViewLead}
              index={index}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
