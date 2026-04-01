import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { isDemo } from '@/lib/api';

export interface TenantSummary {
  id: string;
  name: string;
  code: string;
  storeCount: number;
  userCount: number;
  isActive: boolean;
  createdAt: string;
}

export interface TenantStore {
  id: string;
  name: string;
  code: string | null;
  isActive: boolean;
}

export interface TenantUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
}

export interface TenantDetail extends TenantSummary {
  stores: TenantStore[];
  users: TenantUser[];
}

export interface CreateTenantPayload {
  name: string;
  code: string;
  adminEmail: string;
  adminFirstName: string;
  adminLastName: string;
}

// ── Demo data ────────────────────────────────────────────────────────────────

const demoTenants: TenantSummary[] = [
  {
    id: '00000000-0000-0000-0000-000000000010',
    name: 'Demo Retailer',
    code: 'DEMO',
    storeCount: 2,
    userCount: 3,
    isActive: true,
    createdAt: '2026-01-15T10:00:00Z',
  },
  {
    id: '00000000-0000-0000-0000-000000000020',
    name: 'City Running Co.',
    code: 'CRC',
    storeCount: 1,
    userCount: 2,
    isActive: true,
    createdAt: '2026-02-01T10:00:00Z',
  },
  {
    id: '00000000-0000-0000-0000-000000000030',
    name: 'Uptown Uniforms',
    code: 'UU',
    storeCount: 1,
    userCount: 1,
    isActive: false,
    createdAt: '2026-02-20T10:00:00Z',
  },
];

const demoDetails: Record<string, TenantDetail> = {
  '00000000-0000-0000-0000-000000000010': {
    ...demoTenants[0],
    stores: [
      { id: '00000000-0000-0000-0000-000000000011', name: 'Main Street Store', code: 'MAIN', isActive: true },
      { id: '00000000-0000-0000-0000-000000000012', name: 'Mall Location', code: 'MALL', isActive: true },
    ],
    users: [
      { id: 'u1', email: 'owner@demo.com', firstName: 'Demo', lastName: 'Owner', isActive: true },
      { id: 'u2', email: 'manager@demo.com', firstName: 'Demo', lastName: 'Manager', isActive: true },
      { id: 'u3', email: 'cashier@demo.com', firstName: 'Demo', lastName: 'Cashier', isActive: true },
    ],
  },
  '00000000-0000-0000-0000-000000000020': {
    ...demoTenants[1],
    stores: [{ id: 's2', name: 'Main Store', code: 'MAIN', isActive: true }],
    users: [
      { id: 'u4', email: 'owner@cityrunning.com', firstName: 'Alex', lastName: 'Rivera', isActive: true },
      { id: 'u5', email: 'staff@cityrunning.com', firstName: 'Jordan', lastName: 'Lee', isActive: true },
    ],
  },
  '00000000-0000-0000-0000-000000000030': {
    ...demoTenants[2],
    stores: [{ id: 's3', name: 'Main Store', code: 'MAIN', isActive: false }],
    users: [{ id: 'u6', email: 'owner@uptownuniforms.com', firstName: 'Sam', lastName: 'Park', isActive: false }],
  },
};

// ── Hooks ─────────────────────────────────────────────────────────────────────

export function useTenants() {
  return useQuery<TenantSummary[]>({
    queryKey: ['platform', 'tenants'],
    queryFn: async () => {
      if (isDemo) return demoTenants;
      const { data } = await api.get('/platform/tenants');
      return data;
    },
  });
}

export function useTenantDetail(id: string) {
  return useQuery<TenantDetail>({
    queryKey: ['platform', 'tenants', id],
    queryFn: async () => {
      if (isDemo) {
        const detail = demoDetails[id];
        if (!detail) throw new Error('Tenant not found');
        return detail;
      }
      const { data } = await api.get(`/platform/tenants/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateTenant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateTenantPayload) => {
      if (isDemo) {
        await new Promise(r => setTimeout(r, 400));
        return { id: crypto.randomUUID() };
      }
      const { data } = await api.post('/platform/tenants', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platform', 'tenants'] });
    },
  });
}

export function useDeactivateTenant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (isDemo) {
        await new Promise(r => setTimeout(r, 300));
        return;
      }
      await api.put(`/platform/tenants/${id}/deactivate`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platform', 'tenants'] });
    },
  });
}
