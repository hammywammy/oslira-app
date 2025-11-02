// src/features/dashboard/components/LeadsTable/LeadsTable.tsx

/**
 * LEADS TABLE - SUPABASE STYLE PRODUCTION V2.0
 * 
 * CHANGES:
 * - Removed wrapping div (overflow now handled by TableViewLayout)
 * - Table renders directly for edge-to-edge integration
 * - All business logic unchanged
 * 
 * Full-width table bounded by hotbar, sidebar, and pagination
 * Column resizing with localStorage persistence
 * Frozen columns (checkbox left, actions right)
 * Native table for browser optimization
 */

import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

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
  followers_count: number | null;
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

interface LeadsTableProps {
  selectedLeads: Set<string>;
  onSelectionChange: (selectedIds: Set<string>) => void;
}

type ResizableColumn = Exclude<keyof ColumnWidths, 'checkbox' | 'actions'>;

// =============================================================================
// CONSTANTS
// =============================================================================

const DEFAULT_COLUMN_WIDTHS: ColumnWidths = {
  checkbox: 48,
  lead: 250,
  platform: 140,
  score: 180,
  analysis: 150,
  updated: 120,
  actions: 80,
};

const MIN_COLUMN_WIDTH = 100;
const STORAGE_KEY_WIDTHS = 'oslira_leads_table_widths';

// =============================================================================
// MOCK DATA
// =============================================================================

const MOCK_LEADS: Lead[] = [
  {
    id: '1',
    username: '@nike',
    full_name: 'Nike',
    platform: 'instagram',
    avatar_url: null,
    overall_score: 87,
    analysis_type: 'deep',
    followers_count: 250000000,
    created_at: '2025-01-15T10:00:00Z',
  },
  {
    id: '2',
    username: '@adidas',
    full_name: 'Adidas',
    platform: 'instagram',
    avatar_url: null,
    overall_score: 82,
    analysis_type: 'xray',
    followers_count: 28000000,
    created_at: '2025-01-14T10:00:00Z',
  },
  {
    id: '3',
    username: '@puma',
    full_name: 'PUMA',
    platform: 'instagram',
    avatar_url: null,
    overall_score: 75,
    analysis_type: 'light',
    followers_count: 10000000,
    created_at: '2025-01-13T10:00:00Z',
  },
  {
    id: '4',
    username: '@underarmour',
    full_name: 'Under Armour',
    platform: 'instagram',
    avatar_url: null,
    overall_score: null,
    analysis_type: null,
    followers_count: 5000000,
    created_at: '2025-01-12T10:00:00Z',
  },
  {
    id: '5',
    username: '@newbalance',
    full_name: 'New Balance',
    platform: 'instagram',
    avatar_url: null,
    overall_score: 91,
    analysis_type: 'xray',
    followers_count: 4000000,
    created_at: '2025-01-11T10:00:00Z',
  },
];

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

function ScoreBadge({ score }: { score: number | null }) {
  if (score === null) return <span className="text-xs text-muted-foreground">Not scored</span>;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 60) return 'text-blue-600 bg-blue-50 border-blue-200';
    return 'text-amber-600 bg-amber-50 border-amber-200';
  };

  return (
    <div className="flex items-center gap-3">
      <span className={`inline-flex items-center justify-center w-12 h-6 rounded border text-xs font-semibold ${getScoreColor(score)}`}>
        {score}
      </span>
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full ${score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-blue-500' : 'bg-amber-500'}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

function AnalysisTypeBadge({ type }: { type: 'light' | 'deep' | 'xray' | null }) {
  if (!type) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded border bg-muted/30 text-muted-foreground border-border">
        <Icon icon="mdi:minus-circle-outline" width={14} />
        Not Analyzed
      </span>
    );
  }

  const config = {
    light: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      icon: 'mdi:lightning-bolt',
    },
    deep: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      icon: 'mdi:brain',
    },
    xray: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      icon: 'mdi:atom',
    },
  }[type];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded border text-xs font-medium ${config.bg} ${config.text} ${config.border}`}>
      <Icon icon={config.icon} width={14} />
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// =============================================================================
// TABLE ROW COMPONENT
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.02, duration: 0.15 }}
      className={`
        group border-b border-border transition-colors
        ${isSelected ? 'bg-primary/5' : 'hover:bg-muted/30'}
      `}
    >
      {/* Checkbox - Frozen Left */}
      <td
        className={`
          sticky left-0 z-10 px-4 py-3
          ${isSelected ? 'bg-primary/5' : 'bg-background group-hover:bg-muted/30'}
          border-r border-border
        `}
        style={{ width: `${columnWidths.checkbox}px`, minWidth: `${columnWidths.checkbox}px` }}
      >
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelectLead(lead.id)}
          className="w-4 h-4 rounded border-border text-primary focus:ring-primary focus:ring-offset-0"
        />
      </td>

      {/* Lead */}
      <td className="px-4 py-3 border-r border-border" style={{ width: `${columnWidths.lead}px`, minWidth: `${MIN_COLUMN_WIDTH}px` }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-semibold text-primary">
              {lead.full_name?.charAt(0) || lead.username.charAt(1)}
            </span>
          </div>
          <div className="min-w-0">
            <div className="font-medium text-sm text-foreground truncate">{lead.full_name || lead.username}</div>
            <div className="text-xs text-muted-foreground truncate">{lead.username}</div>
          </div>
        </div>
      </td>

      {/* Platform */}
      <td className="px-4 py-3 border-r border-border" style={{ width: `${columnWidths.platform}px`, minWidth: `${MIN_COLUMN_WIDTH}px` }}>
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-pink-50 text-pink-700 border border-pink-200">
          <Icon icon="mdi:instagram" width={16} />
          <span className="text-xs font-medium">Instagram</span>
        </div>
      </td>

      {/* Score */}
      <td className="px-4 py-3 border-r border-border" style={{ width: `${columnWidths.score}px`, minWidth: `${MIN_COLUMN_WIDTH}px` }}>
        <ScoreBadge score={lead.overall_score} />
      </td>

      {/* Analysis */}
      <td className="px-4 py-3 border-r border-border" style={{ width: `${columnWidths.analysis}px`, minWidth: `${MIN_COLUMN_WIDTH}px` }}>
        <AnalysisTypeBadge type={lead.analysis_type} />
      </td>

      {/* Updated */}
      <td className="px-4 py-3 border-r border-border" style={{ width: `${columnWidths.updated}px`, minWidth: `${MIN_COLUMN_WIDTH}px` }}>
        <span className="text-sm text-muted-foreground">{formatDate(lead.created_at)}</span>
      </td>

      {/* Actions - Frozen Right */}
      <td
        className={`
          sticky right-0 z-10 px-4 py-3
          ${isSelected ? 'bg-primary/5' : 'bg-background group-hover:bg-muted/30'}
          border-l border-border
        `}
        style={{ width: `${columnWidths.actions}px`, minWidth: `${columnWidths.actions}px` }}
      >
        <button
          onClick={() => onViewLead(lead.id)}
          className="p-1.5 rounded hover:bg-muted transition-colors"
          aria-label="View details"
        >
          <Icon icon="mdi:eye-outline" width={18} className="text-muted-foreground" />
        </button>
      </td>
    </motion.tr>
  );
});

TableRow.displayName = 'TableRow';

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function LeadsTable({ selectedLeads, onSelectionChange }: LeadsTableProps) {
  const [columnWidths, setColumnWidths] = useState<ColumnWidths>(DEFAULT_COLUMN_WIDTHS);
  const [resizingColumn, setResizingColumn] = useState<ResizableColumn | null>(null);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  const rafRef = useRef<number | null>(null);

  const leads = MOCK_LEADS;

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY_WIDTHS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setColumnWidths({ ...DEFAULT_COLUMN_WIDTHS, ...parsed });
      } catch (e) {
        console.error('Failed to parse saved column widths');
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (resizingColumn === null) {
      localStorage.setItem(STORAGE_KEY_WIDTHS, JSON.stringify(columnWidths));
    }
  }, [columnWidths, resizingColumn]);

  // Resize handlers
  const handleResizeStart = (column: ResizableColumn, e: React.MouseEvent) => {
    e.preventDefault();
    setResizingColumn(column);
    setStartX(e.clientX);
    setStartWidth(columnWidths[column]);
  };

  const handleResizeMove = useCallback(
    (e: MouseEvent) => {
      if (!resizingColumn) return;

      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        const diff = e.clientX - startX;
        const newWidth = Math.max(MIN_COLUMN_WIDTH, startWidth + diff);
        setColumnWidths((prev) => ({ ...prev, [resizingColumn]: newWidth }));
      });
    },
    [resizingColumn, startX, startWidth]
  );

  const handleResizeEnd = useCallback(() => {
    setResizingColumn(null);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => {
    if (resizingColumn) {
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);
      return () => {
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('mouseup', handleResizeEnd);
      };
    }
    return undefined;
  }, [resizingColumn, handleResizeMove, handleResizeEnd]);

  // Selection handlers
  const handleSelectAll = () => {
    if (selectedLeads.size === leads.length) {
      onSelectionChange(new Set());
    } else {
      onSelectionChange(new Set(leads.map((lead) => lead.id)));
    }
  };

  const handleSelectLead = useCallback(
    (id: string) => {
      const newSelected = new Set(selectedLeads);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      onSelectionChange(newSelected);
    },
    [selectedLeads, onSelectionChange]
  );

  const handleViewLead = useCallback((id: string) => {
    console.log('View lead:', id);
  }, []);

  return (
    <table className="w-full border-collapse">
      <thead className="sticky top-0 z-20 bg-muted/50 backdrop-blur-sm">
        <tr className="border-b border-border">
          {/* Checkbox Header - Frozen */}
          <th
            className="sticky left-0 z-30 px-4 py-3 bg-muted/80 backdrop-blur-sm border-r border-border"
            style={{ width: `${columnWidths.checkbox}px`, minWidth: `${columnWidths.checkbox}px` }}
          >
            <input
              type="checkbox"
              checked={selectedLeads.size === leads.length && leads.length > 0}
              onChange={handleSelectAll}
              className="w-4 h-4 rounded border-border text-primary focus:ring-primary focus:ring-offset-0"
            />
          </th>

          {/* Lead */}
          <th className="px-4 py-3 text-left relative group bg-muted/80 backdrop-blur-sm border-r border-border" style={{ width: `${columnWidths.lead}px`, minWidth: `${MIN_COLUMN_WIDTH}px` }}>
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider">Lead</span>
            <div
              className={`absolute top-0 right-0 w-1 h-full cursor-col-resize transition-colors ${resizingColumn === 'lead' ? 'bg-primary' : 'hover:bg-primary/50'}`}
              onMouseDown={(e) => handleResizeStart('lead', e)}
            />
          </th>

          {/* Platform */}
          <th className="px-4 py-3 text-left relative group bg-muted/80 backdrop-blur-sm border-r border-border" style={{ width: `${columnWidths.platform}px`, minWidth: `${MIN_COLUMN_WIDTH}px` }}>
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider">Platform</span>
            <div
              className={`absolute top-0 right-0 w-1 h-full cursor-col-resize transition-colors ${resizingColumn === 'platform' ? 'bg-primary' : 'hover:bg-primary/50'}`}
              onMouseDown={(e) => handleResizeStart('platform', e)}
            />
          </th>

          {/* Score */}
          <th className="px-4 py-3 text-left relative group bg-muted/80 backdrop-blur-sm border-r border-border" style={{ width: `${columnWidths.score}px`, minWidth: `${MIN_COLUMN_WIDTH}px` }}>
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider">Score</span>
            <div
              className={`absolute top-0 right-0 w-1 h-full cursor-col-resize transition-colors ${resizingColumn === 'score' ? 'bg-primary' : 'hover:bg-primary/50'}`}
              onMouseDown={(e) => handleResizeStart('score', e)}
            />
          </th>

          {/* Analysis */}
          <th className="px-4 py-3 text-left relative group bg-muted/80 backdrop-blur-sm border-r border-border" style={{ width: `${columnWidths.analysis}px`, minWidth: `${MIN_COLUMN_WIDTH}px` }}>
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider">Analysis</span>
            <div
              className={`absolute top-0 right-0 w-1 h-full cursor-col-resize transition-colors ${resizingColumn === 'analysis' ? 'bg-primary' : 'hover:bg-primary/50'}`}
              onMouseDown={(e) => handleResizeStart('analysis', e)}
            />
          </th>

          {/* Updated */}
          <th className="px-4 py-3 text-left relative group bg-muted/80 backdrop-blur-sm border-r border-border" style={{ width: `${columnWidths.updated}px`, minWidth: `${MIN_COLUMN_WIDTH}px` }}>
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider">Updated</span>
            <div
              className={`absolute top-0 right-0 w-1 h-full cursor-col-resize transition-colors ${resizingColumn === 'updated' ? 'bg-primary' : 'hover:bg-primary/50'}`}
              onMouseDown={(e) => handleResizeStart('updated', e)}
            />
          </th>

          {/* Actions Header - Frozen */}
          <th
            className="sticky right-0 z-30 px-4 py-3 text-center bg-muted/80 backdrop-blur-sm border-l border-border"
            style={{ width: `${columnWidths.actions}px`, minWidth: `${columnWidths.actions}px` }}
          >
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider">Actions</span>
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
  );
}
