import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { isDemo } from '@/lib/api';
import { demoSizeGrids } from '@/lib/demo-data';
import type { SizeGrid } from '@retail-platform/shared-types';

export function useSizeGrids() {
  return useQuery({
    queryKey: ['size-grids'],
    queryFn: async () => {
      if (isDemo) return demoSizeGrids as SizeGrid[];
      const { data } = await api.get('/catalog/size-grids');
      return data as SizeGrid[];
    },
  });
}

export function useSizeGrid(id: string) {
  return useQuery({
    queryKey: ['size-grids', id],
    queryFn: async () => {
      if (isDemo) return demoSizeGrids.find(g => g.id === id) as SizeGrid | undefined;
      const { data } = await api.get(`/catalog/size-grids/${id}`);
      return data as SizeGrid;
    },
    enabled: !!id,
  });
}

export function useCreateSizeGrid() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (grid: any) => {
      if (isDemo) return { id: crypto.randomUUID() };
      const { data } = await api.post('/catalog/size-grids', grid);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['size-grids'] }),
  });
}
