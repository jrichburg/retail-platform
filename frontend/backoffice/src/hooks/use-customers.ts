import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { isDemo } from '@/lib/api';
import { demoCustomers } from '@/lib/demo-data';
import type { Customer, CreateCustomerRequest, UpdateCustomerRequest } from '@retail-platform/shared-types';

export function useCustomers(params?: { page?: number; pageSize?: number; search?: string }) {
  return useQuery({
    queryKey: ['customers', params],
    queryFn: async () => {
      if (isDemo) {
        let items = demoCustomers.items;
        if (params?.search) {
          const s = params.search.toLowerCase();
          items = items.filter(c =>
            c.firstName.toLowerCase().includes(s) || c.lastName.toLowerCase().includes(s) ||
            c.email?.toLowerCase().includes(s) || c.phone?.includes(s)
          );
        }
        return { ...demoCustomers, items, totalCount: items.length };
      }
      const { data } = await api.get('/customers', { params });
      return data as { items: Customer[]; totalCount: number; page: number; pageSize: number; totalPages: number };
    },
  });
}

export function useCustomer(id: string) {
  return useQuery({
    queryKey: ['customers', id],
    queryFn: async () => {
      if (isDemo) return demoCustomers.items.find(c => c.id === id) as Customer | undefined;
      const { data } = await api.get(`/customers/${id}`);
      return data as Customer;
    },
    enabled: !!id,
  });
}

export function useCreateCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (req: CreateCustomerRequest) => {
      if (isDemo) return { id: crypto.randomUUID() };
      const { data } = await api.post('/customers', req);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['customers'] }),
  });
}

export function useUpdateCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...req }: UpdateCustomerRequest & { id: string }) => {
      if (isDemo) return {};
      await api.put(`/customers/${id}`, req);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['customers'] }),
  });
}
