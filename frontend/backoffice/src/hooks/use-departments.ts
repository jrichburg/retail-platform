import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Department } from '@retail-platform/shared-types';

export function useDepartments() {
  return useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const { data } = await api.get('/catalog/departments');
      return data as Department[];
    },
  });
}

export function useCreateDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dept: { name: string; sortOrder: number }) => {
      const { data } = await api.post('/catalog/departments', dept);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['departments'] }),
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ departmentId, ...cat }: { departmentId: string; name: string; sortOrder: number }) => {
      const { data } = await api.post(`/catalog/departments/${departmentId}/categories`, cat);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['departments'] }),
  });
}
