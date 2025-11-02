// src/features/dashboard/components/DashboardHotbar/DashboardHotbar.tsx

/**
 * DASHBOARD HOTBAR - INLINE ACTION BAR
 * 
 * ARCHITECTURE:
 * ✅ Positioned below TopBar, respects Sidebar width
 * ✅ Fixed position with smooth sidebar transitions
 * ✅ "Leads" section on left with total count
 * ✅ "Bulk Upload" + "Analyze Lead" buttons on right
 * ✅ Matches TopBar height and styling patterns
 * ✅ Professional styling distinct from TopBar
 * 
 * LAYOUT:
 * - Height: 56px (same as TopBar for consistency)
 * - Left margin: Syncs with Sidebar (16px collapsed, 240px expanded)
 * - Background: Slight visual distinction from TopBar
 * - Border: Bottom border for separation
 */

import { Icon } from '@iconify/react';
import { useSidebarStore } from '@/shared/stores/sidebarStore';
import { Button } from '@/shared/components/ui/Button';

// =============================================================================
// TYPES
// =============================================================================

interface DashboardHotbarProps {
  totalLeads: number;
  onBulkUpload: () => void;
  onAnalyzeLead: () => void;
  currentCredits?: number;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function DashboardHotbar({
  totalLeads,
  onBulkUpload,
  onAnalyzeLead,
  currentCredits = 0,
}: DashboardHotbarProps) {
  const { isCollapsed } = useSidebarStore();

  return (
    <div className={`
      fixed top-[57px] right-0 h-14 bg-background/95 backdrop-blur-sm border-b border-border z-30
      transition-[left] duration-200
      ${isCollapsed ? 'left-16' : 'left-60'}
    `}>
      <div className="h-full px-6 flex items-center justify-between">
        
        {/* Left: Leads Section */}
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold text-foreground">
            Leads
          </h1>
          <span className="text-sm text-muted-foreground font-medium">
            {totalLeads} total
          </span>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Credits Display (Optional - can be removed if redundant with TopBar) */}
          {currentCredits > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-md mr-2">
              <Icon icon="mdi:lightning-bolt" width={14} className="text-primary" />
              <span className="text-xs font-semibold text-muted-foreground">
                {currentCredits} credits
              </span>
            </div>
          )}

          {/* Bulk Upload Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onBulkUpload}
            className="flex items-center gap-2"
          >
            <Icon icon="mdi:upload" width={18} />
            <span>Bulk Upload</span>
          </Button>

          {/* Analyze Lead Button - Primary Action */}
          <Button
            variant="primary"
            size="sm"
            onClick={onAnalyzeLead}
            className="flex items-center gap-2"
          >
            <Icon icon="mdi:target-account" width={18} />
            <span>Analyze Lead</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
