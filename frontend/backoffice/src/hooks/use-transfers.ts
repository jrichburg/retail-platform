import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { isDemo } from '@/lib/api';
import type { TransferDocument, TransferDocumentDetail, CreateTransferRequest } from '@retail-platform/shared-types';

// ── Demo data ─────────────────────────────────────────────────────────────────

const MAIN_STORE_ID = '00000000-0000-0000-0000-000000000011';
const MALL_STORE_ID = '00000000-0000-0000-0000-000000000012';

const demoTransfers: TransferDocument[] = [
  {
    id: 'trf1',
    documentNumber: 'TRF-20260401-001',
    sourceTenantNodeId: MAIN_STORE_ID,
    sourceStoreName: 'Main Street Store',
    destinationTenantNodeId: MALL_STORE_ID,
    destinationStoreName: 'Mall Location',
    status: 'in_transit',
    notes: 'Restocking mall location for weekend',
    lineCount: 2,
    totalUnits: 8,
    createdAt: '2026-04-01T09:00:00Z',
  },
  {
    id: 'trf2',
    documentNumber: 'TRF-20260330-001',
    sourceTenantNodeId: MALL_STORE_ID,
    sourceStoreName: 'Mall Location',
    destinationTenantNodeId: MAIN_STORE_ID,
    destinationStoreName: 'Main Street Store',
    status: 'completed',
    notes: null,
    lineCount: 1,
    totalUnits: 3,
    createdAt: '2026-03-30T14:00:00Z',
  },
  {
    id: 'trf3',
    documentNumber: 'TRF-20260401-002',
    sourceTenantNodeId: MAIN_STORE_ID,
    sourceStoreName: 'Main Street Store',
    destinationTenantNodeId: MALL_STORE_ID,
    destinationStoreName: 'Mall Location',
    status: 'draft',
    notes: 'Seasonal size run',
    lineCount: 3,
    totalUnits: 12,
    createdAt: '2026-04-01T11:30:00Z',
  },
];

const demoDetails: Record<string, TransferDocumentDetail> = {
  trf1: {
    id: 'trf1',
    documentNumber: 'TRF-20260401-001',
    sourceTenantNodeId: MAIN_STORE_ID,
    sourceStoreName: 'Main Street Store',
    destinationTenantNodeId: MALL_STORE_ID,
    destinationStoreName: 'Mall Location',
    status: 'in_transit',
    notes: 'Restocking mall location for weekend',
    createdAt: '2026-04-01T09:00:00Z',
    lines: [
      { id: 'tl1', productId: 'prod1', productVariantId: 'var1', productName: 'Brooks Ghost 16', sku: 'BGH16-M-10D', upc: '012345678901', variantDescription: '10 / D', quantity: 5 },
      { id: 'tl2', productId: 'prod1', productVariantId: 'var2', productName: 'Brooks Ghost 16', sku: 'BGH16-M-105D', upc: '012345678902', variantDescription: '10.5 / D', quantity: 3 },
    ],
  },
  trf2: {
    id: 'trf2',
    documentNumber: 'TRF-20260330-001',
    sourceTenantNodeId: MALL_STORE_ID,
    sourceStoreName: 'Mall Location',
    destinationTenantNodeId: MAIN_STORE_ID,
    destinationStoreName: 'Main Street Store',
    status: 'completed',
    notes: null,
    createdAt: '2026-03-30T14:00:00Z',
    lines: [
      { id: 'tl3', productId: 'prod2', productVariantId: 'var3', productName: 'Nike Pegasus 41', sku: 'NP41-M-9D', upc: '012345679001', variantDescription: '9 / D', quantity: 3 },
    ],
  },
  trf3: {
    id: 'trf3',
    documentNumber: 'TRF-20260401-002',
    sourceTenantNodeId: MAIN_STORE_ID,
    sourceStoreName: 'Main Street Store',
    destinationTenantNodeId: MALL_STORE_ID,
    destinationStoreName: 'Mall Location',
    status: 'draft',
    notes: 'Seasonal size run',
    createdAt: '2026-04-01T11:30:00Z',
    lines: [
      { id: 'tl4', productId: 'prod3', productVariantId: 'var4', productName: 'ASICS Gel-Kayano 31', sku: 'AGK31-M-8D', upc: '012345680001', variantDescription: '8 / D', quantity: 4 },
      { id: 'tl5', productId: 'prod3', productVariantId: 'var5', productName: 'ASICS Gel-Kayano 31', sku: 'AGK31-M-9D', upc: '012345680002', variantDescription: '9 / D', quantity: 4 },
      { id: 'tl6', productId: 'prod3', productVariantId: 'var6', productName: 'ASICS Gel-Kayano 31', sku: 'AGK31-M-10D', upc: '012345680003', variantDescription: '10 / D', quantity: 4 },
    ],
  },
};

// ── Hooks ─────────────────────────────────────────────────────────────────────

export function useTransfers(params?: { page?: number; pageSize?: number; status?: string }) {
  return useQuery({
    queryKey: ['transfers', params],
    queryFn: async () => {
      if (isDemo) {
        let items = [...demoTransfers];
        if (params?.status) items = items.filter(t => t.status === params.status);
        return { items, totalCount: items.length, page: 1, pageSize: 25, totalPages: 1 };
      }
      const { data } = await api.get('/inventory/transfers', { params });
      return data;
    },
  });
}

export function useTransfer(id: string) {
  return useQuery<TransferDocumentDetail>({
    queryKey: ['transfers', id],
    queryFn: async () => {
      if (isDemo) {
        const detail = demoDetails[id];
        if (!detail) throw new Error('Transfer not found');
        return detail;
      }
      const { data } = await api.get(`/inventory/transfers/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateTransfer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateTransferRequest) => {
      if (isDemo) {
        await new Promise(r => setTimeout(r, 400));
        return { id: 'trf-new-' + Date.now() };
      }
      const { data } = await api.post('/inventory/transfers', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transfers'] });
      queryClient.invalidateQueries({ queryKey: ['stock-levels'] });
    },
  });
}

export function useSubmitTransfer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (isDemo) { await new Promise(r => setTimeout(r, 400)); return; }
      await api.post(`/inventory/transfers/${id}/submit`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transfers'] });
      queryClient.invalidateQueries({ queryKey: ['stock-levels'] });
    },
  });
}

export function useCompleteTransfer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (isDemo) { await new Promise(r => setTimeout(r, 400)); return; }
      await api.post(`/inventory/transfers/${id}/complete`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transfers'] });
      queryClient.invalidateQueries({ queryKey: ['stock-levels'] });
    },
  });
}

export function useCancelTransfer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (isDemo) { await new Promise(r => setTimeout(r, 400)); return; }
      await api.post(`/inventory/transfers/${id}/cancel`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transfers'] });
      queryClient.invalidateQueries({ queryKey: ['stock-levels'] });
    },
  });
}
