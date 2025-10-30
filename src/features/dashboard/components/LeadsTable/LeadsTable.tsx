// src/features/dashboard/components/LeadsTable/LeadsTable.tsx

/**
 * LEADS TABLE - OSLIRA PRODUCTION
 * 
 * Professional data table with Linear-style minimalism.
 * This IS the product. 85% of screen real estate.
 * 
 * SPECS:
 * - Row height: 44px (fixed, non-configurable)
 * - Font size: 14px
 * - Hover: Subtle background change
 * - Score colors: Green (80+), Blue (60-79), Amber (40-59), Red (<40)
 * - Analysis badges: Light/Deep/X-Ray with semantic colors
 * 
 * FEATURES:
 * - Bulk selection via checkboxes
 * - Sortable columns
 * - Proper hover states
 * - Score visualization
 * - Empty state
 * - Loading skeleton (TODO)
 */

import { useState } from 'react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { Badge } from '@/shared/components/ui/Badge';
import { useDashboardStore } from '../../store/dashboardStore';

// =============================================================================
// MOCK DATA (Replace with API)
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
    created_at: '2025-01-12T14:45:00Z',
  },
  {
    id: '5',
    username: '@newbalance',
    platform: 'instagram' as const,
    full_name: 'New Balance',
    avatar_url: null,
    overall_score: 68,
    analysis_type: 'light' as const,
    analysis_status: 'complete' as const,
    followers_count: 5800000,
    created_at: '2025-01-11T11:00:00Z',
  },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-success font-semibold';
  if (score >= 60) return 'text-primary font-semibold';
  if (score >= 40) return 'text-warning font-semibold';
  return 'text-danger font-semibold';
}

function getAnalysisBadge(type: 'light' | 'deep' | 'xray' | null) {
  if (!type) return <span className="text-xs text-muted">—</span>;
  
  const badgeConfig = {
    light: { variant: 'neutral' as const, label: 'Light' },
    deep: { variant: 'primary' as const, label: 'Deep' },
    xray: { variant: 'success' as const, label: 'X-Ray' },
  };
  
  const config = badgeConfig[type];
  return <Badge variant={config.variant} size="sm">{config.label}</Badge>;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  
  if (diffHours < 24) {
    return 'Today';
  } else if (diffHours < 48) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}

// =============================================================================
// COMPONENT
// =============================================================================

export function LeadsTable() {
  const { selectedLeadIds, toggleLeadSelection, selectAllLeads, clearSelection } = useDashboardStore();
  const [sortColumn, setSortColumn] = useState<string>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const leads = mockLeads;

  const allSelected = leads.length > 0 && selectedLeadIds.length === leads.length;
  const someSelected = selectedLeadIds.length > 0 && !allSelected;

  const handleSelectAll = () => {
    if (allSelected) {
      clearSelection();
    } else {
      selectAllLeads();
    }
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  // Empty State
  if (leads.length === 0) {
    return (
      <div className="bg-surface-raised rounded-lg border border-border p-16 text-center">
        <div className="w-16 h-16 bg-muted-light rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon icon="mdi:account-search" width={32} className="text-muted" />
        </div>
        <h3 className="text-lg font-semibold text-text mb-2">No leads yet</h3>
        <p className="text-sm text-text-secondary mb-6 max-w-sm mx-auto">
          Get started by analyzing your first Instagram profile. 
          Enter a username and we'll analyze their potential as a business lead.
        </p>
        <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors inline-flex items-center gap-2 font-medium text-sm">
          <Icon icon="mdi:plus" width={16} />
          Analyze Lead
        </button>
      </div>
    );
  }

  return (
    <div className="bg-surface-raised rounded-lg border border-border overflow-hidden">
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full">
          {/* ===== TABLE HEADER ===== */}
          <thead className="bg-surface-base border-b border-border">
            <tr className="h-11">
              {/* Checkbox Column */}
              <th className="w-12 px-4 text-left">
                <button
                  onClick={handleSelectAll}
                  className={`
                    w-4 h-4 rounded border flex items-center justify-center
                    transition-all duration-150
                    ${allSelected || someSelected
                      ? 'bg-primary border-primary'
                      : 'border-border hover:border-primary'
                    }
                  `}
                  aria-label="Select all leads"
                >
                  {allSelected && <Icon icon="mdi:check" width={12} className="text-white" />}
                  {someSelected && <Icon icon="mdi:minus" width={12} className="text-white" />}
                </button>
              </th>

              {/* Lead Column */}
              <th className="px-4 text-left">
                <button
                  onClick={() => handleSort('username')}
                  className="flex items-center gap-1.5 font-semibold text-xs text-text hover:text-primary transition-colors uppercase tracking-wide"
                >
                  Lead
                  <Icon icon="mdi:unfold-more-horizontal" width={14} className="text-text-secondary" />
                </button>
              </th>

              {/* Followers Column */}
              <th className="px-4 text-left">
                <button
                  onClick={() => handleSort('followers_count')}
                  className="flex items-center gap-1.5 font-semibold text-xs text-text hover:text-primary transition-colors uppercase tracking-wide"
                >
                  Followers
                  <Icon icon="mdi:unfold-more-horizontal" width={14} className="text-text-secondary" />
                </button>
              </th>

              {/* Score Column */}
              <th className="px-4 text-left">
                <button
                  onClick={() => handleSort('overall_score')}
                  className="flex items-center gap-1.5 font-semibold text-xs text-text hover:text-primary transition-colors uppercase tracking-wide"
                >
                  Score
                  <Icon icon="mdi:unfold-more-horizontal" width={14} className="text-text-secondary" />
                </button>
              </th>

              {/* Analysis Column */}
              <th className="px-4 text-left">
                <span className="font-semibold text-xs text-text uppercase tracking-wide">
                  Analysis
                </span>
              </th>

              {/* Date Column */}
              <th className="px-4 text-left">
                <button
                  onClick={() => handleSort('created_at')}
                  className="flex items-center gap-1.5 font-semibold text-xs text-text hover:text-primary transition-colors uppercase tracking-wide"
                >
                  Added
                  <Icon icon="mdi:unfold-more-horizontal" width={14} className="text-text-secondary" />
                </button>
              </th>

              {/* Actions Column */}
              <th className="px-4 text-right">
                <span className="font-semibold text-xs text-text uppercase tracking-wide">
                  Actions
                </span>
              </th>
            </tr>
          </thead>

          {/* ===== TABLE BODY ===== */}
          <tbody>
            {leads.map((lead, index) => {
              const isSelected = selectedLeadIds.includes(lead.id);

              return (
                <motion.tr
                  key={lead.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03, duration: 0.2 }}
                  className={`
                    h-11 border-b border-border transition-colors duration-150
                    ${isSelected ? 'bg-primary-light/30' : 'hover:bg-muted-light/50'}
                  `}
                >
                  {/* Checkbox */}
                  <td className="px-4">
                    <button
                      onClick={() => toggleLeadSelection(lead.id)}
                      className={`
                        w-4 h-4 rounded border flex items-center justify-center
                        transition-all duration-150
                        ${isSelected
                          ? 'bg-primary border-primary'
                          : 'border-border hover:border-primary'
                        }
                      `}
                      aria-label={`Select ${lead.username}`}
                    >
                      {isSelected && <Icon icon="mdi:check" width={12} className="text-white" />}
                    </button>
                  </td>

                  {/* Lead Info */}
                  <td className="px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-semibold text-white">
                          {lead.username.charAt(1).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-text truncate">
                          {lead.username}
                        </p>
                        {lead.full_name && (
                          <p className="text-xs text-text-secondary truncate">
                            {lead.full_name}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Followers */}
                  <td className="px-4">
                    <span className="text-sm text-text">
                      {lead.followers_count ? formatNumber(lead.followers_count) : '—'}
                    </span>
                  </td>

                  {/* Score */}
                  <td className="px-4">
                    {lead.overall_score !== null ? (
                      <span className={`text-sm ${getScoreColor(lead.overall_score)}`}>
                        {lead.overall_score}
                      </span>
                    ) : (
                      <span className="text-sm text-muted">—</span>
                    )}
                  </td>

                  {/* Analysis Type */}
                  <td className="px-4">
                    {getAnalysisBadge(lead.analysis_type)}
                  </td>

                  {/* Date */}
                  <td className="px-4">
                    <span className="text-sm text-text-secondary">
                      {formatDate(lead.created_at)}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4">
                    <div className="flex items-center justify-end gap-1">
                      <button 
                        className="p-1.5 hover:bg-muted-light rounded transition-colors"
                        aria-label="View details"
                      >
                        <Icon icon="mdi:eye-outline" width={16} className="text-text-secondary hover:text-text" />
                      </button>
                      <button 
                        className="p-1.5 hover:bg-danger-light rounded transition-colors"
                        aria-label="Delete lead"
                      >
                        <Icon icon="mdi:delete-outline" width={16} className="text-text-secondary hover:text-danger" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ===== PAGINATION ===== */}
      <div className="px-4 py-3 border-t border-border flex items-center justify-between bg-surface-base">
        <p className="text-sm text-text-secondary">
          Showing <span className="font-medium text-text">1-5</span> of{' '}
          <span className="font-medium text-text">5</span> leads
        </p>
        <div className="flex items-center gap-1">
          <button 
            className="px-3 py-1.5 text-sm font-medium text-text hover:bg-muted-light rounded transition-colors"
            disabled
          >
            Previous
          </button>
          <button className="px-3 py-1.5 text-sm font-medium bg-primary text-white rounded">
            1
          </button>
          <button 
            className="px-3 py-1.5 text-sm font-medium text-text hover:bg-muted-light rounded transition-colors"
            disabled
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
