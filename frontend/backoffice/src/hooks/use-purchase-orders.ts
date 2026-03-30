import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { isDemo } from '@/lib/api';
import type { PurchaseOrder, PurchaseOrderDetail } from '@retail-platform/shared-types';

const demoPOs = {
  items: [
    { id: 'po1', orderNumber: 'PO-20260327-001', supplierId: 'sup1', supplierName: 'Brooks', status: 'submitted', notes: 'Spring inventory', expectedDate: '2026-04-15', totalCost: 2100.00, lineCount: 3, totalUnitsOrdered: 30, totalUnitsReceived: 15, createdAt: '2026-03-27T09:00:00Z' },
    { id: 'po2', orderNumber: 'PO-20260326-001', supplierId: 'sup2', supplierName: 'Nike', status: 'draft', notes: null, expectedDate: null, totalCost: 350.00, lineCount: 2, totalUnitsOrdered: 20, totalUnitsReceived: 0, createdAt: '2026-03-26T14:00:00Z' },
    { id: 'po3', orderNumber: 'PO-20260325-001', supplierId: 'sup4', supplierName: 'New Balance', status: 'fully_received', notes: 'Restocking 990v6', expectedDate: '2026-03-28', totalCost: 1500.00, lineCount: 2, totalUnitsOrdered: 15, totalUnitsReceived: 15, createdAt: '2026-03-25T10:00:00Z' },
  ],
  totalCount: 3, page: 1, pageSize: 25, totalPages: 1,
};

const demoPODetail: PurchaseOrderDetail = {
  id: 'po1', orderNumber: 'PO-20260327-001', supplierId: 'sup1', supplierName: 'Brooks', status: 'submitted', notes: 'Spring inventory', expectedDate: '2026-04-15', totalCost: 2100.00, createdAt: '2026-03-27T09:00:00Z',
  lines: [
    { id: 'pol1', productId: 'p1', productVariantId: 'v1', productName: 'Brooks Ghost 16', sku: 'BRK-GH16-BLK', variantDescription: '10 / D', quantityOrdered: 12, quantityReceived: 6, unitCost: 70.00, lineCost: 840.00 },
    { id: 'pol2', productId: 'p1', productVariantId: 'v2', productName: 'Brooks Ghost 16', sku: 'BRK-GH16-BLK', variantDescription: '10.5 / D', quantityOrdered: 10, quantityReceived: 5, unitCost: 70.00, lineCost: 700.00 },
    { id: 'pol3', productId: 'p1', productVariantId: 'v3', productName: 'Brooks Ghost 16', sku: 'BRK-GH16-BLK', variantDescription: '11 / D', quantityOrdered: 8, quantityReceived: 4, unitCost: 70.00, lineCost: 560.00 },
  ],
};

export function usePurchaseOrders(params?: { page?: number; pageSize?: number; status?: string; supplierId?: string }) {
  return useQuery({
    queryKey: ['purchase-orders', params],
    queryFn: async () => {
      if (isDemo) {
        let items = demoPOs.items;
        if (params?.status) items = items.filter(p => p.status === params.status);
        if (params?.supplierId) items = items.filter(p => p.supplierId === params.supplierId);
        return { ...demoPOs, items, totalCount: items.length };
      }
      const { data } = await api.get('/inventory/purchase-orders', { params });
      return data as { items: PurchaseOrder[]; totalCount: number; page: number; pageSize: number; totalPages: number };
    },
  });
}

export function usePurchaseOrder(id: string) {
  return useQuery({
    queryKey: ['purchase-orders', id],
    queryFn: async () => {
      if (isDemo) return demoPODetail;
      const { data } = await api.get(`/inventory/purchase-orders/${id}`);
      return data as PurchaseOrderDetail;
    },
    enabled: !!id,
  });
}

export function useCreatePurchaseOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (req: any) => {
      if (isDemo) return { id: crypto.randomUUID() };
      const { data } = await api.post('/inventory/purchase-orders', req);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['purchase-orders'] }),
  });
}

export function useUpdatePurchaseOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...req }: any) => {
      if (isDemo) return {};
      await api.put(`/inventory/purchase-orders/${id}`, req);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['purchase-orders'] }),
  });
}

export function useSubmitPurchaseOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (isDemo) return {};
      await api.post(`/inventory/purchase-orders/${id}/submit`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['purchase-orders'] }),
  });
}

export function useClosePurchaseOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (isDemo) return {};
      await api.post(`/inventory/purchase-orders/${id}/close`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['purchase-orders'] }),
  });
}
