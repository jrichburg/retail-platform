import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import api from '../lib/api';
import * as SecureStore from 'expo-secure-store';

interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  tenantNodeId: string;
  rootTenantId: string;
  roles: string[];
}

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  login: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    // Sync user with backend
    const tenantNodeId = await SecureStore.getItemAsync('tenantNodeId') || '';
    const rootTenantId = tenantNodeId;
    try {
      const { data } = await api.post('/auth/sync', { tenantNodeId, rootTenantId });
      await SecureStore.setItemAsync('tenantNodeId', data.tenantNodeId);
      set({ user: data, isAuthenticated: true, isLoading: false });
    } catch {
      // If sync fails, still mark as authenticated - will retry on next load
      set({ isAuthenticated: true, isLoading: false });
    }
  },

  logout: async () => {
    await supabase.auth.signOut();
    await SecureStore.deleteItemAsync('tenantNodeId');
    set({ user: null, isAuthenticated: false });
  },

  loadUser: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        set({ isLoading: false });
        return;
      }
      const { data } = await api.get('/auth/me');
      await SecureStore.setItemAsync('tenantNodeId', data.tenantNodeId);
      set({ user: data, isAuthenticated: true, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },
}));
