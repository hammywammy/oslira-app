// src/features/dashboard/components/LeadsTable/LeadsTable.tsx

import { useState } from 'react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { Badge } from '@/shared/components/ui/Badge';
import { useDashboardStore } from '../../store/dashboardStore';

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

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-600 font-semibold';
  if (score >= 60) return 'text-blue-600 font-semibold';
  if (score >= 40) return 'text-amber-600 font-semibold';
  return 'text-rose-600 font-semibold';
}

function getAnalysisBadge(type: 'light' | 'deep' | 'xray' | null) {
  if (!type) return <span className="text-xs text-gray-400">Not Analyzed</span>;
  
  const badgeConfig = {
    light: { 
      bg: 'bg-gray-100', 
      text: 'text-gray-700',
      icon: 'mdi:lightning-bolt-outline',
      label: 'Light'
    },
    deep: { 
      bg: 'bg-blue-50', 
      text: 'text-blue-700',
      icon: 'mdi:brain',
      label: 'Deep'
    },
    xray: { 
      bg: 'bg-emerald-50', 
      text: 'text-emerald-700',
      icon: 'mdi:telescope',
      label: 'X-Ray'
    },
  };
  
  const config = badgeConfig[type];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${config.bg} ${config.text}`}>
      <Icon icon={config.icon} width={12} />
      {config.label}
    </span>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  
  if (diffHours < 24) return 'Today';
  if (diffHours < 48) return 'Yesterday';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

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

  if (leads.length === 0) {
    return (
      <div className="bg-white rounded-lg p-16 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon icon="mdi:account-search" width={32} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No leads yet</h3>
        <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
          Start analyzing Instagram profiles to discover qualified leads.
        </p>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2 font-medium text-sm">
          <Icon icon="mdi:plus" width={16} />
          Analyze Lead
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* HEADER */}
          <thead>
            <tr className="border-b border-gray-100">
              <th className="w-12 px-6 py-3 text-left">
                <button
                  onClick={handleSelectAll}
                  className={`
                    w-4 h-4 rounded border flex items-center justify-center
                    transition-all duration-150
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

              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('username')}
                  className="flex items-center gap-1.5 font-medium text-xs text-gray-600 hover:text-gray-900 transition-colors uppercase tracking-wider"
                >
                  Lead
                  <Icon icon="mdi:unfold-more-horizontal" width={14} className="text-gray-400" />
                </button>
              </th>

              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('followers_count')}
                  className="flex items-center gap-1.5 font-medium text-xs text-gray-600 hover:text-gray-900 transition-colors uppercase tracking-wider"
                >
                  Followers
                  <Icon icon="mdi:unfold-more-horizontal" width={14} className="text-gray-400" />
                </button>
              </th>

              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('overall_score')}
                  className="flex items-center gap-1.5 font-medium text-xs text-gray-600 hover:text-gray-900 transition-colors uppercase tracking-wider"
                >
                  Score
                  <Icon icon="mdi:unfold-more-horizontal" width={14} className="text-gray-400" />
                </button>
              </th>

              <th className="px-6 py-3 text-left">
                <span className="font-medium text-xs text-gray-600 uppercase tracking-wider">
                  Analysis
                </span>
              </th>

              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('created_at')}
                  className="flex items-center gap-1.5 font-medium text-xs text-gray-600 hover:text-gray-900 transition-colors uppercase tracking-wider"
                >
                  Added
                  <Icon icon="mdi:unfold-more-horizontal" width={14} className="text-gray-400" />
                </button>
              </th>

              <th className="px-6 py-3 text-right">
                <span className="font-medium text-xs text-gray-600 uppercase tracking-wider">
                  Actions
                </span>
              </th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody className="divide-y divide-gray-50">
            {leads.map((lead, index) => {
              const isSelected = selectedLeadIds.includes(lead.id);

              return (
                <motion.tr
                  key={lead.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03, duration: 0.2 }}
                  className={`
                    transition-colors duration-150
                    ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50/50'}
                  `}
                >
                  {/* Checkbox */}
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleLeadSelection(lead.id)}
                      className={`
                        w-4 h-4 rounded border flex items-center justify-center
                        transition-all duration-150
                        ${isSelected
                          ? 'bg-blue-600 border-blue-600'
                          : 'border-gray-300 hover:border-blue-600'
                        }
                      `}
                      aria-label={`Select ${lead.username}`}
                    >
                      {isSelected && <Icon icon="mdi:check" width={12} className="text-white" />}
                    </button>
                  </td>

                  {/* Lead Info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-semibold text-white">
                          {lead.username.charAt(1).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {lead.username}
                        </p>
                        {lead.full_name && (
                          <p className="text-xs text-gray-500 truncate">
                            {lead.full_name}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Followers */}
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700">
                      {lead.followers_count ? formatNumber(lead.followers_count) : '—'}
                    </span>
                  </td>

                  {/* Score */}
                  <td className="px-6 py-4">
                    {lead.overall_score !== null ? (
                      <span className={`text-sm ${getScoreColor(lead.overall_score)}`}>
                        {lead.overall_score}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                  </td>

                  {/* Analysis Type */}
                  <td className="px-6 py-4">
                    {getAnalysisBadge(lead.analysis_type)}
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500">
                      {formatDate(lead.created_at)}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button 
                        className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                        aria-label="View details"
                      >
                        <Icon icon="mdi:eye-outline" width={18} className="text-gray-400 hover:text-gray-600" />
                      </button>
                      <button 
                        className="p-1.5 hover:bg-red-50 rounded transition-colors"
                        aria-label="Delete lead"
                      >
                        <Icon icon="mdi:delete-outline" width={18} className="text-gray-400 hover:text-red-600" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing <span className="font-medium text-gray-900">1-{leads.length}</span> of{' '}
          <span className="font-medium text-gray-900">{leads.length}</span> leads
        </p>
        <div className="flex items-center gap-1">
          <button 
            className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled
          >
            Previous
          </button>
          <button className="px-3 py-1.5 text-sm font-medium bg-blue-600 text-white rounded">
            1
          </button>
          <button 
            className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
