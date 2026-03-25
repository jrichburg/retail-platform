import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Sale } from '@retail-platform/shared-types';

export function useSales(params?: { page?: number; pageSize?: number; from?: string; to?: string; status?: string }) {
  return useQuery({
    queryKey: ['sales', params],
    queryFn: async () => {
      const { data } = await api.get('/sales', { params });
      return data as { items: Sale[]; totalCount: number; page: number; pageSize: number; totalPages: number };
    },
  });
}

export function useSale(id: string) {
  return useQuery({
    queryKey: ['sales', id],
    queryFn: async () => {
      const { data } = await api.get(`/sales/${id}`);
      return data as Sale;
    },
    enabled: !!id,
  });
}
