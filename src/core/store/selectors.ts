/**
 * @file Zustand Selectors
 * @description Computed selectors - replaces Selectors.js
 * 
 * Features Preserved:
 * - Memoized computed values
 * - Complex derived state
 * - Dashboard summaries
 * - Performance optimized
 */

import { useAppStore } from './appStore';
import { useCurrentBalance } from '@/features/credits/store/creditsStore';
import {
  useCurrentTier,
  useSubscriptionStore,
  useFullSubscription,
} from '@/features/billing/store/subscriptionStore';
import type { BusinessProfile } from '@/shared/types/business.types';

type AppState = ReturnType<typeof useAppStore.getState>;

export interface Lead {
  id: string;
  business_id: string;
  name: string;
  email?: string;
  phone?: string;
  status?: string;
  score?: number;
  created_at: string;
  updated_at: string;
}

// AUTH SELECTORS
export const useUser = () => useAppStore((state: AppState) => state.auth.user);
export const useSession = () => useAppStore((state: AppState) => state.auth.session);
export const useIsAuthenticated = () => useAppStore((state: AppState) => state.auth.isAuthenticated);

// BUSINESS SELECTORS
export const useBusinesses = () => useAppStore((state: AppState) => state.business.all);
export const useSelectedBusiness = () => useAppStore((state: AppState) => state.business.selected);
export const useSelectedBusinessId = () =>
  useAppStore((state: AppState) => state.business.selected?.id ?? null);
export const useHasBusinesses = () =>
  useAppStore((state: AppState) => state.business.all.length > 0);

// Alias for components that need profile list (e.g., dropdown selector)
export const useBusinessProfiles = () => useAppStore((state: AppState) => state.business.all);

// Check if profiles are loaded
export const useHasBusinessProfiles = () =>
  useAppStore((state: AppState) => state.business.all.length > 0);

export const useBusinessById = (businessId: string) =>
  useAppStore((state: AppState) => state.business.all.find((b: BusinessProfile) => b.id === businessId));

// LEADS SELECTORS
export const useLeads = () => useAppStore((state: AppState) => state.leads.all);
export const useFilteredLeads = () => useAppStore((state: AppState) => state.leads.filtered);
export const useSelectedLeads = () => useAppStore((state: AppState) => state.leads.selected);
export const useLeadCount = () => useAppStore((state: AppState) => state.leads.all.length);

export const useLeadById = (leadId: string) =>
  useAppStore((state: AppState) => state.leads.all.find((l: Lead) => l.id === leadId));

// High quality leads (score >= 70)
export const useHighQualityLeads = () =>
  useAppStore((state: AppState) => state.leads.all.filter((l: Lead) => (l.score || 0) >= 70));

// Leads created today
export const useLeadsCreatedToday = () =>
  useAppStore((state: AppState) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return state.leads.all.filter((l: Lead) => {
      const created = new Date(l.created_at);
      return created >= today;
    });
  });

// UI SELECTORS
export const useIsSidebarOpen = () => useAppStore((state: AppState) => state.ui.sidebarOpen);
export const useIsSidebarCollapsed = () => useAppStore((state: AppState) => state.ui.sidebarCollapsed);
export const useActiveModal = () => useAppStore((state: AppState) => state.ui.activeModal);
export const useIsLoading = () => useAppStore((state: AppState) => state.ui.loading);
export const useFilters = () => useAppStore((state: AppState) => state.ui.filters);
export const useHasActiveFilters = () =>
  useAppStore((state: AppState) => Object.keys(state.ui.filters).length > 0);

// SUBSCRIPTION SELECTORS
// Re-export from subscription store for backward compatibility
export const useSubscription = useFullSubscription;
export const useSubscriptionPlan = useCurrentTier;
export const useCreditsRemaining = useCurrentBalance;

// COMPLEX COMPUTED SELECTORS (from Selectors.js)
/**
 * Dashboard summary - computed from multiple state slices
 * Preserves Selectors.getDashboardSummary()
 */
export const useDashboardSummary = () =>
  useAppStore((state: AppState) => {
    const leads = state.leads.all;
    const businesses = state.business.all;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return {
      totalLeads: leads.length,
      totalBusinesses: businesses.length,
      highQualityLeads: leads.filter((l: Lead) => (l.score || 0) >= 70).length,
      leadsCreatedToday: leads.filter((l: Lead) => {
        const created = new Date(l.created_at);
        return created >= today;
      }).length,
      averageLeadScore:
        leads.length > 0
          ? leads.reduce((sum: number, l: Lead) => sum + (l.score || 0), 0) / leads.length
          : 0,
    };
  });

/**
 * Lead statistics by status
 * Preserves Selectors.getLeadsByStatus()
 */
export const useLeadsByStatus = () =>
  useAppStore((state: AppState) => {
    const statusCounts: Record<string, number> = {};

    state.leads.all.forEach((lead: Lead) => {
      const status = lead.status || 'unknown';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    return statusCounts;
  });

/**
 * Selected leads details (full lead objects)
 */
export const useSelectedLeadsDetails = () =>
  useAppStore((state: AppState) => {
    const selectedIds = state.leads.selected;
    return state.leads.all.filter((l: Lead) => selectedIds.includes(l.id));
  });

/**
 * Filter status - check if any filters are active
 */
export const useFilterStatus = () =>
  useAppStore((state: AppState) => ({
    hasFilters: Object.keys(state.ui.filters).length > 0,
    filterCount: Object.keys(state.ui.filters).length,
    filters: state.ui.filters,
  }));

/**
 * Business with lead count
 */
export const useBusinessesWithLeadCount = () =>
  useAppStore((state: AppState) => {
    return state.business.all.map((business: BusinessProfile) => ({
      ...business,
      leadCount: state.leads.all.filter((l: Lead) => l.business_id === business.id).length,
    }));
  });

/**
 * User profile with subscription
 * Note: subscription now comes from subscription store
 */
export const useUserProfile = () => {
  const appState = useAppStore((state: AppState) => ({
    user: state.auth.user,
    isAuthenticated: state.auth.isAuthenticated,
  }));
  const subscription = useFullSubscription();

  return {
    ...appState,
    subscription,
  };
};

export const useAuthActions = () =>
  useAppStore((state: AppState) => ({
    setAuth: state.setAuth,
    clearAuth: state.clearAuth,
  }));

export const useBusinessActions = () =>
  useAppStore((state: AppState) => ({
    setBusinesses: state.setBusinesses,
    selectBusiness: state.selectBusiness,
    addBusiness: state.addBusiness,
    updateBusiness: state.updateBusiness,
  }));

export const useLeadActions = () =>
  useAppStore((state: AppState) => ({
    setLeads: state.setLeads,
    addLead: state.addLead,
    updateLead: state.updateLead,
    removeLead: state.removeLead,
    setFilteredLeads: state.setFilteredLeads,
    setSelectedLeads: state.setSelectedLeads,
    clearSelectedLeads: state.clearSelectedLeads,
  }));

export const useUIActions = () =>
  useAppStore((state: AppState) => ({
    toggleSidebar: state.toggleSidebar,
    setSidebarOpen: state.setSidebarOpen,
    toggleSidebarCollapse: state.toggleSidebarCollapse,
    setActiveModal: state.setActiveModal,
    setLoading: state.setLoading,
    setFilters: state.setFilters,
    clearFilters: state.clearFilters,
  }));

export const useSubscriptionActions = () => ({
  setSubscription: useSubscriptionStore.getState().setSubscription,
  clearSubscription: useSubscriptionStore.getState().clearSubscription,
});
