import { useQuery } from '@tanstack/react-query';
import api, { isDemo } from '@/lib/api';
import { demoSales } from '@/lib/demo-data';
import type { Sale } from '@retail-platform/shared-types';

export function useSales(params?: { page?: number; pageSize?: number; from?: string; to?: string; status?: string }) {
  return useQuery({
    queryKey: ['sales', params],
    queryFn: async () => {
      if (isDemo) return demoSales;
      const { data } = await api.get('/sales', { params });
      return data as { items: Sale[]; totalCount: number; page: number; pageSize: number; totalPages: number };
    },
  });
}

export function useSale(id: string) {
  return useQuery({
    queryKey: ['sales', id],
    queryFn: async () => {
      if (isDemo) return demoSales.items.find(s => s.id === id) as Sale | undefined;
      const { data } = await api.get(`/sales/${id}`);
      return data as Sale;
    },
    enabled: !!id,
  });
}
