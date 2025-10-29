// src/features/dashboard/components/LeadsTable/LeadsTable.tsx
/**
 * LEADS TABLE - The Core Component
 * 
 * Professional data table:
 * - Row height: 44px (fixed, non-configurable)
 * - Font size: 14px
 * - Padding: 16px horizontal, 12px vertical
 * - Hover states
 * - Bulk selection via checkboxes
 * - Sortable columns
 * 
 * This IS the product. Everything else supports it.
 */

import { useState } from 'react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { Badge } from '@/shared/components/ui/Badge';
import { useDashboardStore } from '../../store/dashboardStore';

// =============================================================================
// MOCK DATA (Replace with API call)
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
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-success';
  if (score >= 60) return 'text-primary';
  if (score >= 40) return 'text-warning';
  return 'text-danger';
}

function getAnalysisTypeBadge(type: 'light' | 'deep' | 'xray' | null) {
  if (!type) return null;
  
  const config = {
    light: { variant: 'neutral' as const, label: 'Light' },
    deep: { variant: 'info' as const, label: 'Deep' },
    xray: { variant: 'success' as const, label: 'X-Ray' },
  };
  
  return <Badge variant={config[type].variant} size="sm">{config[type].label}</Badge>;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function LeadsTable() {
  const { selectedLeadIds, toggleLeadSelection, selectAllLeads, clearSelection } = useDashboardStore();
  const [sortColumn, setSortColumn] = useState<string>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const leads = mockLeads; // Replace with API call

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

  // Empty state
  if (leads.length === 0) {
    return (
      <div className="bg-surface-raised rounded-lg border border-border p-12 text-center">
        <Icon icon="mdi:account-search" width={48} className="text-muted mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-text mb-2">No leads yet</h3>
        <p className="text-text-secondary mb-4">
          Get started by analyzing your first Instagram profile
        </p>
        <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors">
          Analyze Lead
        </button>
      </div>
    );
  }

  return (
    <div className="bg-surface-raised rounded-lg border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Table Header */}
          <thead className="bg-surface-base border-b border-border">
            <tr>
              {/* Checkbox Column */}
              <th className="px-4 py-3 text-left w-12">
                <button
                  onClick={handleSelectAll}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    allSelected
                      ? 'bg-primary border-primary'
                      : someSelected
                      ? 'bg-primary border-primary'
                      : 'border-border hover:border-primary'
                  }`}
                >
                  {allSelected && <Icon icon="mdi:check" width={14} className="text-white" />}
                  {someSelected && <Icon icon="mdi:minus" width={14} className="text-white" />}
                </button>
              </th>

              {/* Lead Column */}
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('username')}
                  className="flex items-center gap-2 font-semibold text-sm text-text hover:text-primary transition-colors"
                >
                  Lead
                  <Icon icon="mdi:unfold-more-horizontal" width={16} />
                </button>
              </th>

              {/* Followers Column */}
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('followers_count')}
                  className="flex items-center gap-2 font-semibold text-sm text-text hover:text-primary transition-colors"
                >
                  Followers
                  <Icon icon="mdi:unfold-more-horizontal" width={16} />
                </button>
              </th>

              {/* Score Column */}
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('overall_score')}
                  className="flex items-center gap-2 font-semibold text-sm text-text hover:text-primary transition-colors"
                >
                  Score
                  <Icon icon="mdi:unfold-more-horizontal" width={16} />
                </button>
              </th>

              {/* Analysis Column */}
              <th className="px-4 py-3 text-left">
                <span className="font-semibold text-sm text-text">Analysis</span>
              </th>

              {/* Date Column */}
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('created_at')}
                  className="flex items-center gap-2 font-semibold text-sm text-text hover:text-primary transition-colors"
                >
                  Added
                  <Icon icon="mdi:unfold-more-horizontal" width={16} />
                </button>
              </th>

              {/* Actions Column */}
              <th className="px-4 py-3 text-right">
                <span className="font-semibold text-sm text-text">Actions</span>
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {leads.map((lead, index) => {
              const isSelected = selectedLeadIds.includes(lead.id);

              return (
                <motion.tr
                  key={lead.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`border-b border-border transition-colors ${
                    isSelected ? 'bg-primary-light/50' : 'hover:bg-muted-light'
                  }`}
                  style={{ height: '44px' }}
                >
                  {/* Checkbox */}
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleLeadSelection(lead.id)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-primary border-primary'
                          : 'border-border hover:border-primary'
                      }`}
                    >
                      {isSelected && <Icon icon="mdi:check" width={14} className="text-white" />}
                    </button>
                  </td>

                  {/* Lead Info */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-semibold text-white">
                          {lead.username.charAt(1).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text">{lead.username}</p>
                        {lead.full_name && (
                          <p className="text-xs text-text-secondary">{lead.full_name}</p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Followers */}
                  <td className="px-4 py-3">
                    <span className="text-sm text-text">
                      {lead.followers_count ? formatNumber(lead.followers_count) : '—'}
                    </span>
                  </td>

                  {/* Score */}
                  <td className="px-4 py-3">
                    {lead.overall_score !== null ? (
                      <span className={`text-sm font-semibold ${getScoreColor(lead.overall_score)}`}>
                        {lead.overall_score}
                      </span>
                    ) : (
                      <span className="text-sm text-muted">—</span>
                    )}
                  </td>

                  {/* Analysis Type */}
                  <td className="px-4 py-3">
                    {getAnalysisTypeBadge(lead.analysis_type)}
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3">
                    <span className="text-sm text-text-secondary">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 hover:bg-primary-light rounded transition-colors">
                        <Icon icon="mdi:eye" width={18} className="text-text-secondary" />
                      </button>
                      <button className="p-1.5 hover:bg-danger-light rounded transition-colors">
                        <Icon icon="mdi:delete" width={18} className="text-text-secondary" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 border-t border-border flex items-center justify-between">
        <p className="text-sm text-text-secondary">
          Showing <span className="font-medium text-text">1-5</span> of{' '}
          <span className="font-medium text-text">5</span> leads
        </p>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-sm font-medium text-text hover:bg-muted-light rounded transition-colors">
            Previous
          </button>
          <button className="px-3 py-1.5 text-sm font-medium bg-primary text-white rounded">
            1
          </button>
          <button className="px-3 py-1.5 text-sm font-medium text-text hover:bg-muted-light rounded transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
