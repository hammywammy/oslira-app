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

// =============================================================================
// AUTH SELECTORS
// =============================================================================

export const useUser = () => useAppStore((state) => state.auth.user);
export const useSession = () => useAppStore((state) => state.auth.session);
export const useIsAuthenticated = () => useAppStore((state) => state.auth.isAuthenticated);

// =============================================================================
// BUSINESS SELECTORS
// =============================================================================

export const useBusinesses = () => useAppStore((state) => state.business.all);
export const useSelectedBusiness = () => useAppStore((state) => state.business.selected);
export const useSelectedBusinessId = () => 
  useAppStore((state) => state.business.selected?.id ?? null);
export const useHasBusinesses = () => 
  useAppStore((state) => state.business.all.length > 0);

export const useBusinessById = (businessId: string) =>
  useAppStore((state) => state.business.all.find((b) => b.id === businessId));

// =============================================================================
// LEADS SELECTORS
// =============================================================================

export const useLeads = () => useAppStore((state) => state.leads.all);
export const useFilteredLeads = () => useAppStore((state) => state.leads.filtered);
export const useSelectedLeads = () => useAppStore((state) => state.leads.selected);
export const useLeadCount = () => useAppStore((state) => state.leads.all.length);

export const useLeadById = (leadId: string) =>
  useAppStore((state) => state.leads.all.find((l) => l.id === leadId));

// High quality leads (score >= 70)
export const useHighQualityLeads = () =>
  useAppStore((state) => state.leads.all.filter((l) => (l.score || 0) >= 70));

// Leads created today
export const useLeadsCreatedToday = () =>
  useAppStore((state) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return state.leads.all.filter((l) => {
      const created = new Date(l.created_at);
      return created >= today;
    });
  });

// =============================================================================
// UI SELECTORS
// =============================================================================

export const useIsSidebarOpen = () => useAppStore((state) => state.ui.sidebarOpen);
export const useIsSidebarCollapsed = () => useAppStore((state) => state.ui.sidebarCollapsed);
export const useActiveModal = () => useAppStore((state) => state.ui.activeModal);
export const useIsLoading = () => useAppStore((state) => state.ui.loading);
export const useFilters = () => useAppStore((state) => state.ui.filters);
export const useHasActiveFilters = () =>
  useAppStore((state) => Object.keys(state.ui.filters).length > 0);

// =============================================================================
// SUBSCRIPTION SELECTORS
// =============================================================================

export const useSubscription = () => useAppStore((state) => state.subscription);
export const useSubscriptionPlan = () => useAppStore((state) => state.subscription?.plan);
export const useCreditsRemaining = () => 
  useAppStore((state) => state.subscription?.credits ?? 0);

// =============================================================================
// COMPLEX COMPUTED SELECTORS (from Selectors.js)
// =============================================================================

/**
 * Dashboard summary - computed from multiple state slices
 * Preserves Selectors.getDashboardSummary()
 */
export const useDashboardSummary = () =>
  useAppStore((state) => {
    const leads = state.leads.all;
    const businesses = state.business.all;
    const subscription = state.subscription;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return {
      totalLeads: leads.length,
      totalBusinesses: businesses.length,
      creditsRemaining: subscription?.credits ?? 0,
      highQualityLeads: leads.filter((l) => (l.score || 0) >= 70).length,
      leadsCreatedToday: leads.filter((l) => {
        const created = new Date(l.created_at);
        return created >= today;
      }).length,
      averageLeadScore:
        leads.length > 0
          ? leads.reduce((sum, l) => sum + (l.score || 0), 0) / leads.length
          : 0,
    };
  });

/**
 * Lead statistics by status
 * Preserves Selectors.getLeadsByStatus()
 */
export const useLeadsByStatus = () =>
  useAppStore((state) => {
    const statusCounts: Record<string, number> = {};

    state.leads.all.forEach((lead) => {
      const status = lead.status || 'unknown';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    return statusCounts;
  });

/**
 * Selected leads details (full lead objects)
 */
export const useSelectedLeadsDetails = () =>
  useAppStore((state) => {
    const selectedIds = state.leads.selected;
    return state.leads.all.filter((l) => selectedIds.includes(l.id));
  });

/**
 * Filter status - check if any filters are active
 */
export const useFilterStatus = () =>
  useAppStore((state) => ({
    hasFilters: Object.keys(state.ui.filters).length > 0,
    filterCount: Object.keys(state.ui.filters).length,
    filters: state.ui.filters,
  }));

/**
 * Business with lead count
 */
export const useBusinessesWithLeadCount = () =>
  useAppStore((state) => {
    return state.business.all.map((business) => ({
      ...business,
      leadCount: state.leads.all.filter((l) => l.business_id === business.id).length,
    }));
  });

/**
 * User profile with subscription
 */
export const useUserProfile = () =>
  useAppStore((state) => ({
    user: state.auth.user,
    subscription: state.subscription,
    isAuthenticated: state.auth.isAuthenticated,
  }));

// =============================================================================
// ACTIONS SELECTORS (for components that only need actions)
// =============================================================================

export const useAuthActions = () =>
  useAppStore((state) => ({
    setAuth: state.setAuth,
    clearAuth: state.clearAuth,
  }));

export const useBusinessActions = () =>
  useAppStore((state) => ({
    setBusinesses: state.setBusinesses,
    selectBusiness: state.selectBusiness,
    addBusiness: state.addBusiness,
    updateBusiness: state.updateBusiness,
  }));

export const useLeadActions = () =>
  useAppStore((state) => ({
    setLeads: state.setLeads,
    addLead: state.addLead,
    updateLead: state.updateLead,
    removeLead: state.removeLead,
    setFilteredLeads: state.setFilteredLeads,
    setSelectedLeads: state.setSelectedLeads,
    clearSelectedLeads: state.clearSelectedLeads,
  }));

export const useUIActions = () =>
  useAppStore((state) => ({
    toggleSidebar: state.toggleSidebar,
    setSidebarOpen: state.setSidebarOpen,
    toggleSidebarCollapse: state.toggleSidebarCollapse,
    setActiveModal: state.setActiveModal,
    setLoading: state.setLoading,
    setFilters: state.setFilters,
    clearFilters: state.clearFilters,
  }));

export const useSubscriptionActions = () =>
  useAppStore((state) => ({
    setSubscription: state.setSubscription,
  }));
