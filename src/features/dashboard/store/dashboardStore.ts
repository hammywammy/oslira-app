/**
 * DASHBOARD STORE (Zustand)
 *
 * Global state management for dashboard
 * - Leads state
 * - Selected leads (bulk selection)
 * - Filters (before applying to URL)
 * - Modals (research, bulk, details)
 * - UI state (sidebar, queue panel)
 */

import { create } from 'zustand';

interface Lead {
  id: string;
  account_id: string;
  business_profile_id: string | null;
  username: string;
  display_name: string | null;
  profile_pic_url: string | null;
  profile_url: string | null;
  follower_count: number | null;
  following_count: number | null;
  post_count: number | null;
  platform: 'instagram' | null;
  created_at: string;
  updated_at: string;
  analysis_type: 'light' | 'deep' | 'xray' | null;
  analysis_status: 'pending' | 'processing' | 'complete' | 'failed' | null;
  analysis_completed_at: string | null;
  overall_score: number | null;
  summary: string | null;
  confidence: number | null;
}

interface FilterState {
  platform?: string;
  analysisType?: string;
  scoreMin?: number;
  scoreMax?: number;
  search?: string;
}

interface ModalState {
  research: boolean;
  bulk: boolean;
  details: string | null; // lead ID
  filter: boolean;
}

interface UIState {
  sidebarCollapsed: boolean;
  queuePanelOpen: boolean;
}

interface DashboardState {
  // Leads data
  leads: Lead[];
  selectedLeadIds: string[];
  
  // Filters (ephemeral, before applying to URL)
  filters: FilterState;
  
  // Modals
  modals: ModalState;
  
  // UI
  ui: UIState;
  
  // Actions
  setLeads: (leads: Lead[]) => void;
  selectLead: (id: string) => void;
  toggleLeadSelection: (id: string) => void;
  selectAllLeads: () => void;
  clearSelection: () => void;
  
  setFilters: (filters: FilterState) => void;
  clearFilters: () => void;
  
  openModal: (type: keyof ModalState, context?: string) => void;
  closeModal: (type: keyof ModalState) => void;
  
  toggleSidebar: () => void;
  toggleQueuePanel: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  // Initial state
  leads: [],
  selectedLeadIds: [],
  filters: {},
  modals: {
    research: false,
    bulk: false,
    details: null,
    filter: false,
  },
  ui: {
    sidebarCollapsed: false,
    queuePanelOpen: false,
  },

  // Lead actions
  setLeads: (leads) => set({ leads }),
  
  selectLead: (id) => set({ selectedLeadIds: [id] }),
  
  toggleLeadSelection: (id) => set((state) => ({
    selectedLeadIds: state.selectedLeadIds.includes(id)
      ? state.selectedLeadIds.filter((selectedId) => selectedId !== id)
      : [...state.selectedLeadIds, id],
  })),
  
  selectAllLeads: () => set((state) => ({
    selectedLeadIds: state.leads.map((lead) => lead.id),
  })),
  
  clearSelection: () => set({ selectedLeadIds: [] }),
  
  // Filter actions
  setFilters: (filters) => set({ filters }),
  
  clearFilters: () => set({ filters: {} }),
  
  // Modal actions
  openModal: (type, context) => set((state) => ({
    modals: {
      ...state.modals,
      [type]: type === 'details' ? (context ?? null) : true,
    },
  })),
  
  closeModal: (type) => set((state) => ({
    modals: {
      ...state.modals,
      [type]: type === 'details' ? null : false,
    },
  })),
  
  // UI actions
  toggleSidebar: () => set((state) => ({
    ui: {
      ...state.ui,
      sidebarCollapsed: !state.ui.sidebarCollapsed,
    },
  })),
  
  toggleQueuePanel: () => set((state) => ({
    ui: {
      ...state.ui,
      queuePanelOpen: !state.ui.queuePanelOpen,
    },
  })),
}));
