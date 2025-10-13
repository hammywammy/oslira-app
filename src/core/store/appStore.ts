/**
 * @file Global Application Store
 * @description Zustand store for global application state
 * 
 * Features:
 * - Centralized state management
 * - Type-safe state updates
 * - DevTools integration
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { User, Session } from '@supabase/supabase-js';

// =============================================================================
// TYPES
// =============================================================================

interface Business {
  id: string;
  name: string;
  industry?: string;
  created_at: string;
}

interface Lead {
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

interface UserSubscription {
  id: string;
  user_id: string;
  plan: 'free' | 'starter' | 'pro' | 'enterprise';
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  credits: number;
  credits_used: number;
  period_start: string;
  period_end: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
}

// =============================================================================
// STATE INTERFACE
// =============================================================================

interface AppState {
  // Auth State
  auth: {
    user: User | null;
    session: Session | null;
    isAuthenticated: boolean;
  };

  // Business State
  business: {
    all: Business[];
    selected: Business | null;
  };

  // Leads State
  leads: {
    all: Lead[];
    filtered: Lead[];
    selected: string[];
  };

  // UI State
  ui: {
    sidebarOpen: boolean;
    sidebarCollapsed: boolean;
    activeModal: string | null;
    loading: boolean;
    filters: Record<string, unknown>;
  };

  // Subscription State
  subscription: UserSubscription | null;

  // Actions
  setAuth: (user: User | null, session: Session | null) => void;
  clearAuth: () => void;

  setBusinesses: (businesses: Business[]) => void;
  selectBusiness: (business: Business | null) => void;
  addBusiness: (business: Business) => void;
  updateBusiness: (id: string, updates: Partial<Business>) => void;

  setLeads: (leads: Lead[]) => void;
  addLead: (lead: Lead) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  removeLead: (id: string) => void;
  setFilteredLeads: (leads: Lead[]) => void;
  setSelectedLeads: (ids: string[]) => void;
  clearSelectedLeads: () => void;

  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebarCollapse: () => void;
  setActiveModal: (modal: string | null) => void;
  setLoading: (loading: boolean) => void;
  setFilters: (filters: Record<string, unknown>) => void;
  clearFilters: () => void;

  setSubscription: (subscription: UserSubscription | null) => void;
}

// =============================================================================
// INITIAL STATE
// =============================================================================

const initialState = {
  auth: {
    user: null,
    session: null,
    isAuthenticated: false,
  },
  business: {
    all: [],
    selected: null,
  },
  leads: {
    all: [],
    filtered: [],
    selected: [],
  },
  ui: {
    sidebarOpen: true,
    sidebarCollapsed: false,
    activeModal: null,
    loading: false,
    filters: {},
  },
  subscription: null,
};

// =============================================================================
// STORE CREATION
// =============================================================================

export const useAppStore = create<AppState>()(
  devtools(
    (set) => ({
      ...initialState,

      // Auth Actions
      setAuth: (user: User | null, session: Session | null) =>
        set({
          auth: {
            user,
            session,
            isAuthenticated: !!user,
          },
        }),

      clearAuth: () =>
        set({
          auth: {
            user: null,
            session: null,
            isAuthenticated: false,
          },
        }),

      // Business Actions
      setBusinesses: (businesses: Business[]) =>
        set((state: AppState) => ({
          business: {
            ...state.business,
            all: businesses,
          },
        })),

      selectBusiness: (business: Business | null) =>
        set((state: AppState) => ({
          business: {
            ...state.business,
            selected: business,
          },
        })),

      addBusiness: (business: Business) =>
        set((state: AppState) => ({
          business: {
            ...state.business,
            all: [...state.business.all, business],
          },
        })),

      updateBusiness: (id: string, updates: Partial<Business>) =>
        set((state: AppState) => ({
          business: {
            ...state.business,
            all: state.business.all.map((b: Business) =>
              b.id === id ? { ...b, ...updates } : b
            ),
          },
        })),

      // Lead Actions
      setLeads: (leads: Lead[]) =>
        set((state: AppState) => ({
          leads: {
            ...state.leads,
            all: leads,
          },
        })),

      addLead: (lead: Lead) =>
        set((state: AppState) => ({
          leads: {
            ...state.leads,
            all: [...state.leads.all, lead],
          },
        })),

      updateLead: (id: string, updates: Partial<Lead>) =>
        set((state: AppState) => ({
          leads: {
            ...state.leads,
            all: state.leads.all.map((l: Lead) =>
              l.id === id ? { ...l, ...updates } : l
            ),
          },
        })),

      removeLead: (id: string) =>
        set((state: AppState) => ({
          leads: {
            ...state.leads,
            all: state.leads.all.filter((l: Lead) => l.id !== id),
          },
        })),

      setFilteredLeads: (leads: Lead[]) =>
        set((state: AppState) => ({
          leads: {
            ...state.leads,
            filtered: leads,
          },
        })),

      setSelectedLeads: (ids: string[]) =>
        set((state: AppState) => ({
          leads: {
            ...state.leads,
            selected: ids,
          },
        })),

      clearSelectedLeads: () =>
        set((state: AppState) => ({
          leads: {
            ...state.leads,
            selected: [],
          },
        })),

      // UI Actions
      toggleSidebar: () =>
        set((state: AppState) => ({
          ui: {
            ...state.ui,
            sidebarOpen: !state.ui.sidebarOpen,
          },
        })),

      setSidebarOpen: (open: boolean) =>
        set((state: AppState) => ({
          ui: {
            ...state.ui,
            sidebarOpen: open,
          },
        })),

      toggleSidebarCollapse: () =>
        set((state: AppState) => ({
          ui: {
            ...state.ui,
            sidebarCollapsed: !state.ui.sidebarCollapsed,
          },
        })),

      setActiveModal: (modal: string | null) =>
        set((state: AppState) => ({
          ui: {
            ...state.ui,
            activeModal: modal,
          },
        })),

      setLoading: (loading: boolean) =>
        set((state: AppState) => ({
          ui: {
            ...state.ui,
            loading,
          },
        })),

      setFilters: (filters: Record<string, unknown>) =>
        set((state: AppState) => ({
          ui: {
            ...state.ui,
            filters,
          },
        })),

      clearFilters: () =>
        set((state: AppState) => ({
          ui: {
            ...state.ui,
            filters: {},
          },
        })),

      // Subscription Actions
      setSubscription: (subscription: UserSubscription | null) =>
        set({ subscription }),
    }),
    {
      name: 'OsliraAppStore',
    }
  )
);

export default useAppStore;
