import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { isDemo } from '@/lib/api';

export interface AppUserItem {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  roles: string[];
  createdAt: string;
}

export interface RoleItem {
  id: string;
  name: string;
  description: string | null;
}

const demoRoles: RoleItem[] = [
  { id: 'role-owner', name: 'owner', description: 'Full access to all features' },
  { id: 'role-manager', name: 'manager', description: 'Store management and reporting' },
  { id: 'role-cashier', name: 'cashier', description: 'POS and basic operations' },
];

const demoUsers: AppUserItem[] = [
  { id: 'user1', email: 'demo@retailplatform.com', firstName: 'Demo', lastName: 'Owner', isActive: true, roles: ['owner'], createdAt: '2026-01-01T10:00:00Z' },
  { id: 'user2', email: 'sarah.m@retailplatform.com', firstName: 'Sarah', lastName: 'Mitchell', isActive: true, roles: ['manager'], createdAt: '2026-01-15T09:00:00Z' },
  { id: 'user3', email: 'james.k@retailplatform.com', firstName: 'James', lastName: 'Kim', isActive: true, roles: ['cashier'], createdAt: '2026-02-01T11:00:00Z' },
  { id: 'user4', email: 'maria.g@retailplatform.com', firstName: 'Maria', lastName: 'Garcia', isActive: true, roles: ['cashier'], createdAt: '2026-02-15T08:00:00Z' },
  { id: 'user5', email: 'tom.w@retailplatform.com', firstName: 'Tom', lastName: 'Wilson', isActive: false, roles: ['cashier'], createdAt: '2026-01-10T14:00:00Z' },
];

export function useUsers(params?: { page?: number; pageSize?: number; search?: string; isActive?: boolean }) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: async () => {
      if (isDemo) {
        let items = demoUsers;
        if (params?.search) {
          const s = params.search.toLowerCase();
          items = items.filter(u =>
            u.firstName.toLowerCase().includes(s) ||
            u.lastName.toLowerCase().includes(s) ||
            u.email.toLowerCase().includes(s));
        }
        if (params?.isActive !== undefined) items = items.filter(u => u.isActive === params.isActive);
        return { items, totalCount: items.length, page: 1, pageSize: 25, totalPages: 1 };
      }
      const { data } = await api.get('/auth/users', { params });
      return data as { items: AppUserItem[]; totalCount: number; page: number; pageSize: number; totalPages: number };
    },
  });
}

export function useRoles() {
  return useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      if (isDemo) return demoRoles;
      const { data } = await api.get('/auth/roles');
      return data as RoleItem[];
    },
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (req: { email: string; firstName: string; lastName: string; roleId: string }) => {
      if (isDemo) return { id: crypto.randomUUID() };
      const { data } = await api.post('/auth/users', req);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...req }: { id: string; firstName: string; lastName: string; isActive: boolean }) => {
      if (isDemo) return {};
      await api.put(`/auth/users/${id}`, req);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
}

export function useAssignRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, roleId }: { userId: string; roleId: string }) => {
      if (isDemo) return {};
      await api.put(`/auth/users/${userId}/role`, { roleId });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
}
