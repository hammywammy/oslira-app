// src/features/dashboard/components/LeadsTable/LeadsTable.tsx

/**
 * LEADS TABLE - SUPABASE STYLE V3.0
 * 
 * CHANGES IN V3.0:
 * - Removed column resizing completely
 * - Added follower count (3-line stacked lead info)
 * - Adjusted column widths (checkbox/actions thinner, lead wider)
 * - Fixed column dividers to extend into headers
 * - Increased vertical padding for better readability
 * - Centered checkbox and actions columns
 * 
 * Full-width table bounded by hotbar, sidebar, and pagination
 * Frozen columns (checkbox left, actions right)
 * Native table for browser optimization
 */

import { useCallback, memo } from 'react';
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

interface LeadsTableProps {
  selectedLeads: Set<string>;
  onSelectionChange: (selectedIds: Set<string>) => void;
}

// =============================================================================
// CONSTANTS - FIXED WIDTHS (NO RESIZING)
// =============================================================================

const COLUMN_WIDTHS = {
  checkbox: 56,
  lead: 280,
  platform: 160,
  score: 200,
  analysis: 160,
  updated: 140,
  actions: 80,
};

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
// HELPER FUNCTIONS
// =============================================================================

function formatFollowers(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

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

// =============================================================================
// TABLE ROW COMPONENT
// =============================================================================

interface TableRowProps {
  lead: Lead;
  isSelected: boolean;
  onSelectLead: (id: string) => void;
  onViewLead: (id: string) => void;
  index: number;
}

const TableRow = memo(({ lead, isSelected, onSelectLead, onViewLead, index }: TableRowProps) => {
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
      {/* Checkbox - Frozen Left, Centered */}
      <td
        className={`
          sticky left-0 z-10 text-center
          ${isSelected ? 'bg-primary/5' : 'bg-background group-hover:bg-muted/30'}
          border-r border-border
        `}
        style={{ width: `${COLUMN_WIDTHS.checkbox}px`, minWidth: `${COLUMN_WIDTHS.checkbox}px`, padding: '12px 0' }}
      >
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelectLead(lead.id)}
          className="w-4 h-4 rounded border-border text-primary focus:ring-primary focus:ring-offset-0"
        />
      </td>

      {/* Lead - 3 Lines Stacked */}
      <td className="px-4 border-r border-border" style={{ width: `${COLUMN_WIDTHS.lead}px`, padding: '12px 16px' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-semibold text-primary">
              {lead.full_name?.charAt(0) || lead.username.charAt(1)}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-medium text-sm text-foreground truncate">{lead.full_name || lead.username}</div>
            <div className="text-xs text-muted-foreground truncate">{lead.username}</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {lead.followers_count ? formatFollowers(lead.followers_count) : '0'} followers
            </div>
          </div>
        </div>
      </td>

      {/* Platform */}
      <td className="px-4 border-r border-border" style={{ width: `${COLUMN_WIDTHS.platform}px`, padding: '12px 16px' }}>
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-pink-50 text-pink-700 border border-pink-200">
          <Icon icon="mdi:instagram" width={16} />
          <span className="text-xs font-medium">Instagram</span>
        </div>
      </td>

      {/* Score */}
      <td className="px-4 border-r border-border" style={{ width: `${COLUMN_WIDTHS.score}px`, padding: '12px 16px' }}>
        <ScoreBadge score={lead.overall_score} />
      </td>

      {/* Analysis */}
      <td className="px-4 border-r border-border" style={{ width: `${COLUMN_WIDTHS.analysis}px`, padding: '12px 16px' }}>
        <AnalysisTypeBadge type={lead.analysis_type} />
      </td>

      {/* Updated */}
      <td className="px-4 border-r border-border" style={{ width: `${COLUMN_WIDTHS.updated}px`, padding: '12px 16px' }}>
        <span className="text-sm text-muted-foreground">{formatDate(lead.created_at)}</span>
      </td>

      {/* Actions - Frozen Right, Centered */}
      <td
        className={`
          sticky right-0 z-10 text-center
          ${isSelected ? 'bg-primary/5' : 'bg-background group-hover:bg-muted/30'}
          border-l border-border
        `}
        style={{ width: `${COLUMN_WIDTHS.actions}px`, minWidth: `${COLUMN_WIDTHS.actions}px`, padding: '12px 0' }}
      >
        <button
          onClick={() => onViewLead(lead.id)}
          className="inline-flex items-center justify-center p-1.5 rounded hover:bg-muted transition-colors"
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
  const leads = MOCK_LEADS;

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
      <thead className="sticky top-0 z-20 bg-muted/80 backdrop-blur-sm">
        <tr className="border-b border-border">
          {/* Checkbox Header - Frozen, Centered */}
          <th
            className="sticky left-0 z-30 text-center bg-muted/80 backdrop-blur-sm border-r border-border"
            style={{ width: `${COLUMN_WIDTHS.checkbox}px`, minWidth: `${COLUMN_WIDTHS.checkbox}px`, padding: '12px 0' }}
          >
            <input
              type="checkbox"
              checked={selectedLeads.size === leads.length && leads.length > 0}
              onChange={handleSelectAll}
              className="w-4 h-4 rounded border-border text-primary focus:ring-primary focus:ring-offset-0"
            />
          </th>

          {/* Lead */}
          <th className="px-4 py-3 text-left bg-muted/80 backdrop-blur-sm border-r border-border" style={{ width: `${COLUMN_WIDTHS.lead}px` }}>
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider">Lead</span>
          </th>

          {/* Platform */}
          <th className="px-4 py-3 text-left bg-muted/80 backdrop-blur-sm border-r border-border" style={{ width: `${COLUMN_WIDTHS.platform}px` }}>
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider">Platform</span>
          </th>

          {/* Score */}
          <th className="px-4 py-3 text-left bg-muted/80 backdrop-blur-sm border-r border-border" style={{ width: `${COLUMN_WIDTHS.score}px` }}>
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider">Score</span>
          </th>

          {/* Analysis */}
          <th className="px-4 py-3 text-left bg-muted/80 backdrop-blur-sm border-r border-border" style={{ width: `${COLUMN_WIDTHS.analysis}px` }}>
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider">Analysis</span>
          </th>

          {/* Updated */}
          <th className="px-4 py-3 text-left bg-muted/80 backdrop-blur-sm border-r border-border" style={{ width: `${COLUMN_WIDTHS.updated}px` }}>
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider">Updated</span>
          </th>

          {/* Actions Header - Frozen, Centered */}
          <th
            className="sticky right-0 z-30 text-center bg-muted/80 backdrop-blur-sm border-l border-border"
            style={{ width: `${COLUMN_WIDTHS.actions}px`, minWidth: `${COLUMN_WIDTHS.actions}px`, padding: '12px 0' }}
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
            onSelectLead={handleSelectLead}
            onViewLead={handleViewLead}
            index={index}
          />
        ))}
      </tbody>
    </table>
  );
}
