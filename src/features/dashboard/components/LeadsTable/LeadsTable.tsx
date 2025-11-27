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

import { useCallback, memo, useState, useMemo, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { LeadDetailModal } from './LeadDetailModal';
import { LeadAvatar } from '@/shared/components/ui/LeadAvatar';
import { useLeads } from '@/features/leads/hooks/useLeads';
import { useSelectedBusinessId } from '@/core/store/selectors';
import { useBusinessProfile } from '@/features/business/providers/BusinessProfileProvider';
import { deleteLead } from '@/features/leads/api/leadsApi';
import { logger } from '@/core/utils/logger';
import type { SortField, SortOrder, TableFilters } from '@/pages/dashboard/DashboardPage';

// =============================================================================
// TYPES
// =============================================================================

import type { Lead } from '@/shared/types/leads.types';

interface LeadsTableProps {
  selectedLeads: Set<string>;
  onSelectionChange: (selectedIds: Set<string>) => void;
  searchQuery: string;
  sortField: SortField;
  sortOrder: SortOrder;
  filters: TableFilters;
  refreshTrigger: number;
  onDeleteSuccess: () => void;
}

// =============================================================================
// CONSTANTS - FIXED WIDTHS (NO RESIZING)
// =============================================================================

const COLUMN_WIDTHS = {
  checkbox: 56,
  lead: 280,
  niche: 120,
  accountType: 140,
  platform: 120,
  score: 200,
  analysis: 130,
  updated: 110,
  actions: 100,
};

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

function AccountTypeBadge({ isBusiness }: { isBusiness: boolean | undefined }) {
  const config = isBusiness
    ? {
        bg: 'bg-purple-50',
        text: 'text-purple-700',
        border: 'border-purple-200',
        icon: 'mdi:briefcase',
        label: 'Business Account',
      }
    : {
        bg: 'bg-gray-50',
        text: 'text-gray-700',
        border: 'border-gray-200',
        icon: 'mdi:account',
        label: 'Personal Account',
      };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded border text-xs font-medium ${config.bg} ${config.text} ${config.border}`}>
      <Icon icon={config.icon} width={14} />
      {config.label}
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
  onDeleteLead: (id: string) => void;
  index: number;
}

const TableRow = memo(({ lead, isSelected, onSelectLead, onViewLead, onDeleteLead, index }: TableRowProps) => {
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
          sticky left-0 z-stickyTable text-center
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
          <LeadAvatar
            key={lead.id}
            url={lead.profile_pic_url}
            username={lead.username}
            displayName={lead.display_name}
            size="md"
          />
          <div className="min-w-0 flex-1">
            <div className="font-medium text-sm text-foreground truncate">{lead.display_name || lead.username}</div>
            <div className="text-xs text-muted-foreground truncate">{lead.username}</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {lead.follower_count ? formatFollowers(lead.follower_count) : '0'} followers
            </div>
          </div>
        </div>
      </td>

      {/* Niche */}
      <td className="px-4 border-r border-border" style={{ width: `${COLUMN_WIDTHS.niche}px`, padding: '12px 16px' }}>
        {lead.niche ? (
          <span className="text-sm text-foreground truncate" title="Niche">{lead.niche}</span>
        ) : (
          <span className="text-sm text-muted-foreground" title="Niche">—</span>
        )}
      </td>

      {/* Account Type */}
      <td className="px-4 border-r border-border" style={{ width: `${COLUMN_WIDTHS.accountType}px`, padding: '12px 16px' }}>
        <div title="Account type">
          <AccountTypeBadge isBusiness={lead.is_business} />
        </div>
      </td>

      {/* Platform */}
      <td className="px-4 border-r border-border" style={{ width: `${COLUMN_WIDTHS.platform}px`, padding: '12px 16px' }}>
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-pink-50 text-pink-700 border border-pink-200" title="Platform analyzed">
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
          sticky right-0 z-stickyTable text-center
          ${isSelected ? 'bg-primary/5' : 'bg-background group-hover:bg-muted/30'}
          border-l border-border
        `}
        style={{ width: `${COLUMN_WIDTHS.actions}px`, minWidth: `${COLUMN_WIDTHS.actions}px`, padding: '12px 0' }}
      >
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={() => onViewLead(lead.id)}
            className="inline-flex items-center justify-center p-1.5 rounded hover:bg-muted transition-colors"
            aria-label="View details"
          >
            <Icon icon="mdi:eye-outline" width={18} className="text-muted-foreground" />
          </button>
          <button
            onClick={() => onDeleteLead(lead.id)}
            className="inline-flex items-center justify-center p-1.5 rounded hover:bg-destructive/10 transition-colors"
            aria-label="Delete lead"
          >
            <Icon icon="mdi:delete-outline" width={18} className="text-destructive" />
          </button>
        </div>
      </td>
    </motion.tr>
  );
});

TableRow.displayName = 'TableRow';

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function LeadsTable({
  selectedLeads,
  onSelectionChange,
  searchQuery,
  sortField,
  sortOrder,
  filters,
  refreshTrigger,
  onDeleteSuccess,
}: LeadsTableProps) {
  // Get selected business ID and profile loading state
  const businessProfileId = useSelectedBusinessId();
  const { isLoading: isLoadingProfile } = useBusinessProfile();

  // Fetch real leads from API
  const { leads: rawLeads, isLoading, refresh } = useLeads({
    autoFetch: true,
    sortBy: sortField,
    sortOrder,
    businessProfileId,
  });

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Refresh when trigger changes
  useEffect(() => {
    if (refreshTrigger > 0) {
      refresh();
    }
  }, [refreshTrigger, refresh]);

  // Filter and search leads
  const leads = useMemo(() => {
    let filtered = [...rawLeads];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (lead) =>
          lead.username.toLowerCase().includes(query) ||
          lead.display_name?.toLowerCase().includes(query) ||
          false
      );
    }

    // Apply analysis status filter
    if (filters.analysisStatus && filters.analysisStatus.length > 0) {
      filtered = filtered.filter(
        (lead) => lead.analysis_status && filters.analysisStatus!.includes(lead.analysis_status)
      );
    }

    // Apply score range filter
    if (filters.scoreMin !== undefined || filters.scoreMax !== undefined) {
      filtered = filtered.filter((lead) => {
        if (lead.overall_score === null) return false;
        const score = lead.overall_score;
        const min = filters.scoreMin ?? 0;
        const max = filters.scoreMax ?? 100;
        return score >= min && score <= max;
      });
    }

    return filtered;
  }, [rawLeads, searchQuery, filters]);

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
    const lead = leads.find((l) => l.id === id);
    if (lead) {
      setSelectedLead(lead);
      setIsModalOpen(true);
    }
  }, [leads]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLead(null);
  };

  const handleDeleteLead = useCallback(
    async (id: string) => {
      const lead = leads.find((l) => l.id === id);
      const leadName = lead?.display_name || lead?.username || 'this lead';

      const confirmed = window.confirm(
        `Are you sure you want to delete ${leadName}? This action cannot be undone.`
      );

      if (!confirmed) return;

      try {
        logger.info('[LeadsTable] Deleting lead', { id });
        const success = await deleteLead(id);

        if (success) {
          logger.info('[LeadsTable] Lead deleted successfully', { id });
          onDeleteSuccess();
          refresh();
        } else {
          logger.warn('[LeadsTable] Failed to delete lead', { id });
          alert('Failed to delete lead. Please try again.');
        }
      } catch (error) {
        logger.error('[LeadsTable] Error deleting lead', error as Error, { id });
        alert('An error occurred while deleting the lead. Please try again.');
      }
    },
    [leads, onDeleteSuccess, refresh]
  );

  // Show loading state while profile is loading or businessProfileId is not yet set
  if (isLoadingProfile || !businessProfileId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Icon icon="mdi:loading" className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Loading business profile...</p>
        </div>
      </div>
    );
  }

  // Show loading state while leads are loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Icon icon="mdi:loading" className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Loading your leads...</p>
        </div>
      </div>
    );
  }

  // Show empty state
  if (leads.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center max-w-md">
          <Icon icon="mdi:account-search-outline" className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No leads yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Start by analyzing Instagram profiles to find potential leads for your business
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
    <table className="w-full border-collapse">
      <thead className="sticky top-0 z-stickyTable bg-muted/80 backdrop-blur-sm">
        <tr className="border-b border-border">
          {/* Checkbox Header - Frozen, Centered */}
          <th
            className="sticky left-0 z-stickyTableColumn text-center bg-muted/80 backdrop-blur-sm border-r border-border"
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

          {/* Niche */}
          <th className="px-4 py-3 text-left bg-muted/80 backdrop-blur-sm border-r border-border" style={{ width: `${COLUMN_WIDTHS.niche}px` }}>
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider">Niche</span>
          </th>

          {/* Account Type */}
          <th className="px-4 py-3 text-left bg-muted/80 backdrop-blur-sm border-r border-border" style={{ width: `${COLUMN_WIDTHS.accountType}px` }}>
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider">Account Type</span>
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
            className="sticky right-0 z-stickyTableColumn text-center bg-muted/80 backdrop-blur-sm border-l border-border"
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
            onDeleteLead={handleDeleteLead}
            index={index}
          />
        ))}
      </tbody>
    </table>

    {/* Lead Detail Modal */}
    <LeadDetailModal
      isOpen={isModalOpen}
      onClose={handleCloseModal}
      lead={selectedLead}
    />
  </>
  );
}
