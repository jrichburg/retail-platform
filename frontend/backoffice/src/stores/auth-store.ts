import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import api, { isDemo } from '@/lib/api';
import { demoUser } from '@/lib/demo-data';

interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  tenantNodeId: string;
  rootTenantId: string;
  roles: string[];
  permissions: string[];
}

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  syncUser: (tenantNodeId: string, rootTenantId: string) => Promise<void>;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  login: async (email, password) => {
    if (isDemo) {
      set({ user: demoUser, isAuthenticated: true, isLoading: false });
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  },

  logout: async () => {
    if (!isDemo) await supabase.auth.signOut();
    localStorage.removeItem('tenantNodeId');
    set({ user: null, isAuthenticated: false });
  },

  syncUser: async (tenantNodeId, rootTenantId) => {
    if (isDemo) {
      set({ user: demoUser, isAuthenticated: true, isLoading: false });
      return;
    }
    const { data } = await api.post('/auth/sync', { tenantNodeId, rootTenantId });
    localStorage.setItem('tenantNodeId', data.tenantNodeId);
    set({ user: data, isAuthenticated: true, isLoading: false });
  },

  loadUser: async () => {
    if (isDemo) {
      set({ user: demoUser, isAuthenticated: true, isLoading: false });
      return;
    }
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        set({ isLoading: false });
        return;
      }
      const { data } = await api.get('/auth/me');
      localStorage.setItem('tenantNodeId', data.tenantNodeId);
      set({ user: data, isAuthenticated: true, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },
}));
