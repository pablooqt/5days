import { create } from 'zustand';

interface ToastItem {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message?: string;
  durationMs?: number;
}

interface UIState {
  mobileMenuOpen: boolean;
  sidebarCollapsed: boolean;
  rightPanelOpen: boolean;
  activeManagementTab: 'overview' | 'devices' | 'rooms' | 'activity' | 'settings';
  toasts: ToastItem[];
  realtimeStatus: 'preview' | 'connecting' | 'connected' | 'reconnecting' | 'disconnected';
  setMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  setRightPanelOpen: (open: boolean) => void;
  setActiveManagementTab: (tab: 'overview' | 'devices' | 'rooms' | 'activity' | 'settings') => void;
  addToast: (toast: Omit<ToastItem, 'id'>) => void;
  removeToast: (id: string) => void;
  setRealtimeStatus: (status: UIState['realtimeStatus']) => void;
}

export const useUIStore = create<UIState>((set) => ({
  mobileMenuOpen: false,
  sidebarCollapsed: false,
  rightPanelOpen: true,
  activeManagementTab: 'overview',
  toasts: [],
  realtimeStatus: 'preview',
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setRightPanelOpen: (open) => set({ rightPanelOpen: open }),
  setActiveManagementTab: (tab) => set({ activeManagementTab: tab }),
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    if (toast.durationMs !== 0) {
      setTimeout(() => {
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
      }, toast.durationMs ?? 4000);
    }
  },
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
  setRealtimeStatus: (realtimeStatus) => set({ realtimeStatus }),
}));
