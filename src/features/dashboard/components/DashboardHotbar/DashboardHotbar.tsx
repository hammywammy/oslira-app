// src/features/dashboard/components/DashboardHotbar/DashboardHotbar.tsx

/**
 * DASHBOARD HOTBAR - INLINE ACTION BAR
 */

import { Icon } from '@iconify/react';
import { useSidebarStore } from '@/shared/stores/sidebarStore';
import { Button } from '@/shared/components/ui/Button';
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
          {currentCredits > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-primary/5 rounded-md">
              <Icon icon="mdi:lightning-bolt" width={16} className="text-primary" />
              <span className="text-sm font-semibold text-foreground">{currentCredits} credits</span>
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={onBulkUpload}
            className="flex items-center gap-2 h-9"
          >
            <Icon icon="mdi:upload" width={18} />
            <span className="font-medium">Bulk Upload</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={onAnalyzeLead}
            className="flex items-center gap-2 h-9"
          >
            <Icon icon="mdi:magnify-plus-outline" width={18} />
            <span className="font-medium">Analyze Lead</span>
          </Button>
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
                h-9 pl-9 pr-3 w-64 text-sm
                bg-muted/50 border border-border rounded-lg
                placeholder:text-muted-foreground
                focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                transition-all
              "
            />
          </div>

          {/* Sort Button */}
          <button className="
            flex items-center gap-2 h-9 px-3
            border border-border rounded-lg
            text-sm font-medium text-foreground
            hover:bg-muted/50 transition-colors
          ">
            <Icon icon="mdi:sort" width={18} />
            <span>Sort</span>
            <Icon icon="mdi:chevron-down" width={16} className="text-muted-foreground" />
          </button>

          {/* Filter Button */}
          <button className="
            flex items-center gap-2 h-9 px-3
            border border-primary/30 rounded-lg
            text-sm font-medium text-primary
            hover:bg-primary/5 transition-colors
          ">
            <Icon icon="mdi:filter-outline" width={18} />
            <span>Filter</span>
          </button>
        </div>
      </div>
    </div>
  );
}
