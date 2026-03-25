import { create } from 'zustand';
import api from '@/lib/api';

interface TenantNode {
  id: string;
  rootTenantId: string;
  parentId: string | null;
  nodeType: string;
  name: string;
  code: string | null;
  path: string;
  depth: number;
  isActive: boolean;
}

interface TenantState {
  nodes: TenantNode[];
  currentStoreId: string | null;
  loadTree: () => Promise<void>;
  selectStore: (storeId: string) => void;
  stores: () => TenantNode[];
  root: () => TenantNode | undefined;
}

export const useTenantStore = create<TenantState>((set, get) => ({
  nodes: [],
  currentStoreId: null,

  loadTree: async () => {
    const { data } = await api.get('/tenants/tree');
    set({ nodes: data });
  },

  selectStore: (storeId) => {
    localStorage.setItem('tenantNodeId', storeId);
    set({ currentStoreId: storeId });
  },

  stores: () => get().nodes.filter((n) => n.nodeType === 'store'),
  root: () => get().nodes.find((n) => n.nodeType === 'root'),
}));
