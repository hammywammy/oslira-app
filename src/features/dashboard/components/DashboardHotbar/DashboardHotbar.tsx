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
        
        {/* Left: Primary Actions */}
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

          {currentCredits > 0 && (
            <div className="inline-flex flex-row items-center gap-1.5 px-3 py-1.5 bg-primary/5 rounded-md">
              <Icon icon="mdi:lightning-bolt" width={16} className="text-primary shrink-0" />
              <span className="text-sm font-semibold text-foreground whitespace-nowrap">{currentCredits} credits</span>
            </div>
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

          {/* Sort Button */}
          <button className="
            inline-flex items-center gap-2 h-9 px-3
            border border-border rounded-lg
            text-sm font-medium text-foreground
            hover:bg-muted/50 transition-colors
            whitespace-nowrap
          ">
            <Icon icon="mdi:swap-vertical" width={18} />
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
