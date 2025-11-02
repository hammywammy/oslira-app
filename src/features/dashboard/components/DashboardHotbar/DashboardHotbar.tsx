// src/features/dashboard/components/DashboardHotbar/DashboardHotbar.tsx

import { Icon } from '@iconify/react';
import { useSidebarStore } from '@/shared/stores/sidebarStore';
import { useState } from 'react';

interface DashboardHotbarProps {
  onBulkUpload: () => void;
  onAnalyzeLead: () => void;
  currentCredits?: number;
}

export function DashboardHotbar({
  onBulkUpload,
  onAnalyzeLead,
  currentCredits = 0,
}: DashboardHotbarProps) {
  const { isCollapsed } = useSidebarStore();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className={`
      fixed top-[57px] right-0 h-14 bg-background border-b border-border z-30
      transition-[left] duration-200
      ${isCollapsed ? 'left-16' : 'left-60'}
    `}>
      <div className="h-full px-6 flex items-center justify-between gap-6">
        
        {/* Left: Primary Actions + Credits + Analysis Remaining */}
        <div className="flex items-center gap-3">
          <button
            onClick={onAnalyzeLead}
            className="
              inline-flex flex-row items-center gap-2 h-9 px-4
              bg-primary text-white rounded-lg
              text-sm font-medium whitespace-nowrap
              hover:bg-primary/90 transition-colors
              border border-primary/10 shadow-sm
            "
          >
            <Icon icon="mdi:magnify-plus-outline" width={18} className="shrink-0" />
            <span>Analyze Lead</span>
          </button>

          <button
            onClick={onBulkUpload}
            className="
              inline-flex flex-row items-center gap-2 h-9 px-4
              bg-transparent text-foreground rounded-lg
              text-sm font-medium whitespace-nowrap
              hover:bg-muted/50 transition-colors
              border border-border
            "
          >
            <Icon icon="mdi:upload" width={18} className="shrink-0" />
            <span>Bulk Upload</span>
          </button>

          {/* Credits Display */}
          {currentCredits > 0 && (
            <>
              <div className="inline-flex flex-row items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 rounded-lg border border-amber-500/20">
                <Icon icon="ph:coin" width={16} className="text-amber-600 shrink-0" />
                <span className="text-sm font-semibold text-amber-700 whitespace-nowrap">{currentCredits}</span>
                <span className="text-xs text-amber-600/70 whitespace-nowrap">credits</span>
              </div>

              {/* Analysis Remaining Display */}
              <div className="inline-flex flex-row items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <Icon icon="ph:sparkle" width={16} className="text-blue-600 shrink-0" />
                <span className="text-sm font-semibold text-blue-700 whitespace-nowrap">10/10</span>
                <span className="text-xs text-blue-600/70 whitespace-nowrap">light</span>
              </div>
            </>
          )}
        </div>

        {/* Right: Search, Filter, Sort Controls */}
        <div className="flex items-center gap-3">
          {/* Search Leads */}
          <div className="relative">
            <Icon 
              icon="mdi:magnify" 
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" 
            />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="
                h-9 pl-9 pr-3 w-80 text-sm
                bg-muted/50 border border-border rounded-lg
                placeholder:text-muted-foreground
                focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                transition-all
              "
            />
          </div>

          {/* Refresh Button */}
          <button 
            className="
              inline-flex items-center justify-center h-9 w-9
              border border-border rounded-lg
              text-muted-foreground
              hover:bg-muted/50 hover:text-foreground transition-colors
              group
            "
            title="Refresh table"
          >
            <Icon 
              icon="ph:arrows-clockwise-bold" 
              width={18}
              className="group-active:rotate-180 transition-transform duration-300"
            />
          </button>

          {/* Sort Button */}
          <button className="
            inline-flex items-center gap-2 h-9 px-3
            border border-border rounded-lg
            text-sm font-medium text-foreground
            hover:bg-muted/50 transition-colors
            whitespace-nowrap
          ">
            <Icon icon="ph:arrows-down-up-bold" width={18} />
            <span>Sort</span>
            <Icon icon="mdi:chevron-down" width={16} className="text-muted-foreground" />
          </button>

          {/* Filter Button */}
          <button className="
            inline-flex items-center gap-2 h-9 px-3
            border border-primary/30 rounded-lg
            text-sm font-medium text-primary
            hover:bg-primary/5 transition-colors
            whitespace-nowrap
          ">
            <Icon icon="mdi:filter-outline" width={18} />
            <span>Filter</span>
          </button>
        </div>
      </div>
    </div>
  );
}
