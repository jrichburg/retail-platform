import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { isDemo } from '@/lib/api';
import { demoProducts } from '@/lib/demo-data';
import type { Product, CreateProductRequest, UpdateProductRequest } from '@retail-platform/shared-types';

export function useProducts(params?: { page?: number; pageSize?: number; search?: string; categoryId?: string; isActive?: boolean }) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      if (isDemo) {
        let items = demoProducts.items;
        if (params?.search) {
          const s = params.search.toLowerCase();
          items = items.filter(p => p.name.toLowerCase().includes(s) || p.sku.toLowerCase().includes(s));
        }
        return { ...demoProducts, items, totalCount: items.length };
      }
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
