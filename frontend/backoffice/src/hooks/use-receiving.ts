import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { isDemo } from '@/lib/api';
import type { ReceiveDocument, ReceiveDocumentDetail, CreateReceiveDocumentRequest } from '@retail-platform/shared-types';

const demoReceiveDocuments = {
  items: [
    { id: 'rcv1', documentNumber: 'RCV-20260327-001', purchaseOrderId: null, status: 'completed', notes: 'Weekly shipment from Brooks', lineCount: 3, totalUnits: 15, createdAt: '2026-03-27T10:00:00Z' },
    { id: 'rcv2', documentNumber: 'RCV-20260326-001', purchaseOrderId: null, status: 'completed', notes: null, lineCount: 2, totalUnits: 8, createdAt: '2026-03-26T14:30:00Z' },
  ],
  totalCount: 2, page: 1, pageSize: 25, totalPages: 1,
};

const demoReceiveDocumentDetail: ReceiveDocumentDetail = {
  id: 'rcv1',
  documentNumber: 'RCV-20260327-001',
  purchaseOrderId: null,
  status: 'completed',
  notes: 'Weekly shipment from Brooks',
  createdAt: '2026-03-27T10:00:00Z',
  lines: [
    { id: 'rl1', productId: 'p1', productVariantId: 'v1', productName: 'Brooks Ghost 16', sku: 'BRK-GH16-BLK', upc: '190340123456', variantDescription: '10 / D', quantity: 6 },
    { id: 'rl2', productId: 'p1', productVariantId: 'v2', productName: 'Brooks Ghost 16', sku: 'BRK-GH16-BLK', upc: '190340123457', variantDescription: '10.5 / D', quantity: 4 },
    { id: 'rl3', productId: 'p1', productVariantId: 'v3', productName: 'Brooks Ghost 16', sku: 'BRK-GH16-BLK', upc: '190340123458', variantDescription: '11 / D', quantity: 5 },
  ],
};

export function useReceiveDocuments(params?: { page?: number; pageSize?: number }) {
  return useQuery({
    queryKey: ['receive-documents', params],
    queryFn: async () => {
      if (isDemo) return demoReceiveDocuments;
      const { data } = await api.get('/inventory/receiving', { params });
      return data as { items: ReceiveDocument[]; totalCount: number; page: number; pageSize: number; totalPages: number };
    },
  });
}

export function useReceiveDocument(id: string) {
  return useQuery({
    queryKey: ['receive-documents', id],
    queryFn: async () => {
      if (isDemo) return demoReceiveDocumentDetail;
      const { data } = await api.get(`/inventory/receiving/${id}`);
      return data as ReceiveDocumentDetail;
    },
    enabled: !!id,
  });
}

export function useCreateReceiveDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (request: CreateReceiveDocumentRequest) => {
      if (isDemo) return { id: crypto.randomUUID() };
      const { data } = await api.post('/inventory/receiving', request);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receive-documents'] });
      queryClient.invalidateQueries({ queryKey: ['stock-levels'] });
    },
  });
}
