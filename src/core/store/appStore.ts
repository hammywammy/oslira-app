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
import type { BusinessProfile } from '@/shared/types/business.types';

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
  account_id: string;
  plan_type: 'free' | 'growth' | 'pro' | 'agency' | 'enterprise';
  status: 'active' | 'canceled' | 'past_due';
  current_period_start: string;
  current_period_end: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
}

interface AppState {
  // Auth State
  auth: {
    user: User | null;
    session: Session | null;
    isAuthenticated: boolean;
  };

  // Business State
  business: {
    all: BusinessProfile[];
    selected: BusinessProfile | null;
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

  setBusinesses: (businesses: BusinessProfile[]) => void;
  selectBusiness: (business: BusinessProfile | null) => void;
  addBusiness: (business: BusinessProfile) => void;
  updateBusiness: (id: string, updates: Partial<BusinessProfile>) => void;

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

// INITIAL STATE
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
      setBusinesses: (businesses: BusinessProfile[]) =>
        set((state: AppState) => ({
          business: {
            ...state.business,
            all: businesses,
          },
        })),

      selectBusiness: (business: BusinessProfile | null) =>
        set((state: AppState) => ({
          business: {
            ...state.business,
            selected: business,
          },
        })),

      addBusiness: (business: BusinessProfile) =>
        set((state: AppState) => ({
          business: {
            ...state.business,
            all: [...state.business.all, business],
          },
        })),

      updateBusiness: (id: string, updates: Partial<BusinessProfile>) =>
        set((state: AppState) => ({
          business: {
            ...state.business,
            all: state.business.all.map((b: BusinessProfile) =>
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
