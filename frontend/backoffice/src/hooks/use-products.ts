import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Product, CreateProductRequest, UpdateProductRequest } from '@retail-platform/shared-types';

export function useProducts(params?: { page?: number; pageSize?: number; search?: string; categoryId?: string; isActive?: boolean }) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      const { data } = await api.get('/catalog/products', { params });
      return data as { items: Product[]; totalCount: number; page: number; pageSize: number; totalPages: number };
    },
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['products', id],
    queryFn: async () => {
      const { data } = await api.get(`/catalog/products/${id}`);
      return data as Product;
    },
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (product: CreateProductRequest) => {
      const { data } = await api.post('/catalog/products', product);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...product }: UpdateProductRequest & { id: string }) => {
      const { data } = await api.put(`/catalog/products/${id}`, product);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });
}
