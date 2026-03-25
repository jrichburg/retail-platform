import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { StockLevel, ReceiveStockRequest } from '@retail-platform/shared-types';

export function useStockLevels(params?: { page?: number; pageSize?: number; search?: string }) {
  return useQuery({
    queryKey: ['stock-levels', params],
    queryFn: async () => {
      const { data } = await api.get('/inventory/stock', { params });
      return data as { items: StockLevel[]; totalCount: number; page: number; pageSize: number; totalPages: number };
    },
  });
}

export function useReceiveStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (request: ReceiveStockRequest) => {
      await api.post('/inventory/receive', request);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['stock-levels'] }),
  });
}
