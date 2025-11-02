// src/features/dashboard/components/LeadsTable/LeadsTable.tsx

/**
 * LEADS TABLE - PRODUCTION GRADE V4.0
 * 
 * FINAL VERSION - ALL ISSUES RESOLVED:
 * ✅ Clean column resizing (no interference)
 * ✅ Pagination shows "4 of 4" format
 * ✅ Professional analysis badges
 * ✅ Clean action icon button
 * ✅ Solid blue avatars (no gradient)
 * ✅ Checkboxes on hover only
 * ✅ No resize on checkbox/actions columns
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
];

// =============================================================================
// TYPES
// =============================================================================

interface ColumnWidths {
  lead: number;
  platform: number;
  score: number;
  analysis: number;
  updated: number;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const DEFAULT_WIDTHS: ColumnWidths = {
  lead: 280,
  platform: 140,
  score: 200,
  analysis: 140,
  updated: 120,
};

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
const STORAGE_KEY = 'oslira_column_widths';

// =============================================================================
// UTILITIES
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

function getScoreGradient(score: number): string {
  if (score >= 80) return 'linear-gradient(90deg, #10b981 0%, #059669 100%)';
  if (score >= 60) return 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)';
  if (score >= 40) return 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)';
  return 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)';
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.ceil((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff < 7) return `${diff}d ago`;
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
}

// =============================================================================
// ANALYSIS BADGE COMPONENT
// =============================================================================

function AnalysisBadge({ type }: { type: 'light' | 'deep' | 'xray' | null }) {
  if (!type) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 text-gray-600 border border-gray-200 text-xs font-medium">
        <Icon icon="mdi:help-circle-outline" width={14} />
        Not Analyzed
      </span>
    );
  }
  
  const configs = {
    light: {
      bg: 'bg-slate-50',
      text: 'text-slate-700',
      border: 'border-slate-300',
      icon: 'mdi:flash',
    },
    deep: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-300',
      icon: 'mdi:eye',
    },
    xray: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-300',
      icon: 'mdi:atom-variant',
    },
  };
  
  const cfg = configs[type];
  const label = type.charAt(0).toUpperCase() + type.slice(1);
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${cfg.bg} ${cfg.text} border ${cfg.border} text-xs font-medium`}>
      <Icon icon={cfg.icon} width={14} />
      {label}
    </span>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function LeadsTable() {
  const { leads: storeLeads } = useDashboardStore();
  const leads = storeLeads.length > 0 ? storeLeads : mockLeads;
  
  // State
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [widths, setWidths] = useState<ColumnWidths>(DEFAULT_WIDTHS);
  
  // Resize state
  const [resizing, setResizing] = useState<keyof ColumnWidths | null>(null);
  const [resizeStart, setResizeStart] = useState({ x: 0, width: 0 });
  
  // Load widths
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setWidths(JSON.parse(saved));
      } catch (e) {
        // Ignore
      }
    }
  }, []);
  
  // Save widths
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(widths));
  }, [widths]);
  
  // Resize logic
  useEffect(() => {
    if (!resizing) return;
    
    const onMove = (e: MouseEvent) => {
      const delta = e.clientX - resizeStart.x;
      const newWidth = Math.max(100, resizeStart.width + delta);
      setWidths(prev => ({ ...prev, [resizing]: newWidth }));
    };
    
    const onUp = () => setResizing(null);
    
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
  }, [resizing, resizeStart]);
  
  // Pagination
  const totalPages = Math.ceil(leads.length / pageSize);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const visible = leads.slice(start, end);
  
  // Selection
  const toggleSelect = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };
  
  const toggleAll = () => {
    if (selected.size === visible.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(visible.map(l => l.id)));
    }
  };
  
  const allSelected = visible.length > 0 && selected.size === visible.length;
  const someSelected = selected.size > 0 && selected.size < visible.length;
  
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      {/* HEADER */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">All Leads</h2>
          {selected.size > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">{selected.size} selected</span>
              <button className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {/* Checkbox */}
              <th className="w-12 px-4 py-3">
                <button
                  onClick={toggleAll}
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                    allSelected || someSelected
                      ? 'bg-blue-600 border-blue-600'
                      : 'border-gray-300 hover:border-blue-500'
                  }`}
                >
                  {allSelected && <Icon icon="mdi:check" width={12} className="text-white" />}
                  {someSelected && <Icon icon="mdi:minus" width={12} className="text-white" />}
                </button>
              </th>

              {/* Lead */}
              <th className="px-4 py-3 text-left relative" style={{ width: widths.lead }}>
                <span className="text-xs font-medium text-gray-700 uppercase tracking-wider">Lead</span>
                <div
                  className="absolute top-0 right-0 w-1.5 h-full cursor-col-resize hover:bg-blue-500 active:bg-blue-600 transition-colors"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setResizing('lead');
                    setResizeStart({ x: e.clientX, width: widths.lead });
                  }}
                />
              </th>

              {/* Platform */}
              <th className="px-4 py-3 text-left relative" style={{ width: widths.platform }}>
                <span className="text-xs font-medium text-gray-700 uppercase tracking-wider">Platform</span>
                <div
                  className="absolute top-0 right-0 w-1.5 h-full cursor-col-resize hover:bg-blue-500 active:bg-blue-600 transition-colors"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setResizing('platform');
                    setResizeStart({ x: e.clientX, width: widths.platform });
                  }}
                />
              </th>

              {/* Score */}
              <th className="px-4 py-3 text-left relative" style={{ width: widths.score }}>
                <span className="text-xs font-medium text-gray-700 uppercase tracking-wider">Score</span>
                <div
                  className="absolute top-0 right-0 w-1.5 h-full cursor-col-resize hover:bg-blue-500 active:bg-blue-600 transition-colors"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setResizing('score');
                    setResizeStart({ x: e.clientX, width: widths.score });
                  }}
                />
              </th>

              {/* Analysis */}
              <th className="px-4 py-3 text-left relative" style={{ width: widths.analysis }}>
                <span className="text-xs font-medium text-gray-700 uppercase tracking-wider">Analysis</span>
                <div
                  className="absolute top-0 right-0 w-1.5 h-full cursor-col-resize hover:bg-blue-500 active:bg-blue-600 transition-colors"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setResizing('analysis');
                    setResizeStart({ x: e.clientX, width: widths.analysis });
                  }}
                />
              </th>

              {/* Updated */}
              <th className="px-4 py-3 text-left relative" style={{ width: widths.updated }}>
                <span className="text-xs font-medium text-gray-700 uppercase tracking-wider">Updated</span>
                <div
                  className="absolute top-0 right-0 w-1.5 h-full cursor-col-resize hover:bg-blue-500 active:bg-blue-600 transition-colors"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setResizing('updated');
                    setResizeStart({ x: e.clientX, width: widths.updated });
                  }}
                />
              </th>

              {/* Actions */}
              <th className="w-24 px-4 py-3 text-right">
                <span className="text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {visible.map((lead, i) => {
              const isSelected = selected.has(lead.id);
              
              return (
                <motion.tr
                  key={lead.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={`group ${
                    isSelected
                      ? 'bg-blue-50/50 border-l-2 border-l-blue-600'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {/* Checkbox */}
                  <td className="px-4 py-4">
                    <button
                      onClick={() => toggleSelect(lead.id)}
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-blue-600 border-blue-600 opacity-100'
                          : 'border-gray-300 opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      {isSelected && <Icon icon="mdi:check" width={12} className="text-white" />}
                    </button>
                  </td>

                  {/* Lead */}
                  <td className="px-4 py-4" style={{ width: widths.lead }}>
                    <div className="flex items-center gap-3">
                      {/* SOLID BLUE AVATAR */}
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                        {lead.username.charAt(1).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{lead.username}</p>
                        <p className="text-xs text-gray-500 truncate">{lead.full_name}</p>
                        <p className="text-xs text-gray-400 tabular-nums">
                          {formatNumber(lead.followers_count)} followers
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Platform */}
                  <td className="px-4 py-4" style={{ width: widths.platform }}>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-medium shadow-sm">
                      <Icon icon="mdi:instagram" width={14} />
                      Instagram
                    </span>
                  </td>

                  {/* Score */}
                  <td className="px-4 py-4" style={{ width: widths.score }}>
                    {lead.overall_score ? (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-semibold tabular-nums ${getScoreColor(lead.overall_score)}`}>
                            {lead.overall_score}
                          </span>
                          <span className="text-xs text-gray-400">/ 100</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full transition-all duration-500"
                            style={{
                              width: `${lead.overall_score}%`,
                              background: getScoreGradient(lead.overall_score),
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                  </td>

                  {/* Analysis */}
                  <td className="px-4 py-4" style={{ width: widths.analysis }}>
                    <AnalysisBadge type={lead.analysis_type} />
                  </td>

                  {/* Updated */}
                  <td className="px-4 py-4" style={{ width: widths.updated }}>
                    <span className="text-sm text-gray-600">{formatDate(lead.created_at)}</span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-4 text-right">
                    <button
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                      onClick={() => console.log('View:', lead.id)}
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

      {/* FOOTER */}
      <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* SHOWING X OF Y FORMAT */}
          <p className="text-sm text-gray-600">
            Showing <span className="font-medium text-gray-900">{visible.length} of {leads.length}</span>
          </p>
          
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Rows:</label>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
                setSelected(new Set());
              }}
              className="h-8 px-2 pr-7 text-sm border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {PAGE_SIZE_OPTIONS.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => {
            if (p === 1 || p === totalPages || Math.abs(p - page) <= 1) {
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    p === page
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {p}
                </button>
              );
            }
            if (p === 2 && page > 3) return <span key={p} className="px-2 text-gray-400">...</span>;
            if (p === totalPages - 1 && page < totalPages - 2) return <span key={p} className="px-2 text-gray-400">...</span>;
            return null;
          })}
          
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
