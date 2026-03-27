import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { isDemo } from '@/lib/api';
import { demoSuppliers } from '@/lib/demo-data';
import type { Supplier, CreateSupplierRequest } from '@retail-platform/shared-types';

export function useSuppliers() {
  return useQuery({
    queryKey: ['suppliers'],
    queryFn: async () => {
      if (isDemo) return demoSuppliers as Supplier[];
      const { data } = await api.get('/catalog/suppliers');
      return data as Supplier[];
    },
  });
}

export function useCreateSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (supplier: CreateSupplierRequest) => {
      if (isDemo) return { id: crypto.randomUUID() };
      const { data } = await api.post('/catalog/suppliers', supplier);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['suppliers'] }),
  });
}
