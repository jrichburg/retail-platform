import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { isDemo } from '@/lib/api';
import type { WorkOrder, WorkOrderDetail } from '@retail-platform/shared-types';

const demoWOs = {
  items: [
    { id: 'wo1', orderNumber: 'WO-20260328-001', customerId: 'cust5', customerName: 'Lisa Thompson', customerPhone: '(555) 105-0000', status: 'submitted', dueDate: '2026-04-10', totalAmount: 46.00, lineCount: 2, notes: 'Company uniform embroidery', createdAt: '2026-03-28T09:00:00Z' },
    { id: 'wo2', orderNumber: 'WO-20260329-001', customerId: 'cust1', customerName: 'Sarah Johnson', customerPhone: '(555) 101-0000', status: 'draft', dueDate: '2026-04-15', totalAmount: 44.00, lineCount: 2, notes: null, createdAt: '2026-03-29T14:00:00Z' },
    { id: 'wo3', orderNumber: 'WO-20260327-001', customerId: 'cust2', customerName: 'Michael Chen', customerPhone: '(555) 102-0000', status: 'in_progress', dueDate: '2026-04-05', totalAmount: 76.00, lineCount: 3, notes: 'School uniform package', createdAt: '2026-03-27T10:00:00Z' },
    { id: 'wo4', orderNumber: 'WO-20260325-001', customerId: 'cust3', customerName: 'Emily Rodriguez', customerPhone: '(555) 103-0000', status: 'completed', dueDate: '2026-03-30', totalAmount: 36.00, lineCount: 2, notes: 'Safety vest customization', createdAt: '2026-03-25T11:00:00Z' },
    { id: 'wo5', orderNumber: 'WO-20260320-001', customerId: 'cust4', customerName: 'James Williams', customerPhone: '(555) 104-0000', status: 'picked_up', dueDate: '2026-03-25', totalAmount: 40.00, lineCount: 2, notes: null, createdAt: '2026-03-20T08:00:00Z' },
  ] as WorkOrder[],
  totalCount: 5, page: 1, pageSize: 25, totalPages: 1,
};

const demoWODetail: WorkOrderDetail = {
  id: 'wo1', orderNumber: 'WO-20260328-001', customerId: 'cust5', customerName: 'Lisa Thompson', customerPhone: '(555) 105-0000', customerEmail: 'lisa.thompson@example.com', status: 'submitted', dueDate: '2026-04-10', totalAmount: 46.00, notes: 'Company uniform embroidery', createdAt: '2026-03-28T09:00:00Z',
  lines: [
    { id: 'wol1', description: 'Embroider company logo on left chest', productVariantId: null, productName: null, sku: null, quantity: 2, unitPrice: 15.00, lineTotal: 30.00 },
    { id: 'wol2', description: 'Sew name tape above right pocket', productVariantId: null, productName: null, sku: null, quantity: 2, unitPrice: 8.00, lineTotal: 16.00 },
  ],
};

const demoWODetails: Record<string, WorkOrderDetail> = {
  wo1: demoWODetail,
  wo2: {
    id: 'wo2', orderNumber: 'WO-20260329-001', customerId: 'cust1', customerName: 'Sarah Johnson', customerPhone: '(555) 101-0000', customerEmail: 'sarah.j@example.com', status: 'draft', dueDate: '2026-04-15', totalAmount: 44.00, notes: null, createdAt: '2026-03-29T14:00:00Z',
    lines: [
      { id: 'wol3', description: 'Hem pants to 30 inch inseam', productVariantId: null, productName: null, sku: null, quantity: 2, unitPrice: 12.00, lineTotal: 24.00 },
      { id: 'wol4', description: 'Add department patch to left sleeve', productVariantId: null, productName: null, sku: null, quantity: 2, unitPrice: 10.00, lineTotal: 20.00 },
    ],
  },
  wo3: {
    id: 'wo3', orderNumber: 'WO-20260327-001', customerId: 'cust2', customerName: 'Michael Chen', customerPhone: '(555) 102-0000', customerEmail: 'mchen@example.com', status: 'in_progress', dueDate: '2026-04-05', totalAmount: 76.00, notes: 'School uniform package', createdAt: '2026-03-27T10:00:00Z',
    lines: [
      { id: 'wol5', description: 'Embroider school crest on blazer pocket', productVariantId: null, productName: null, sku: null, quantity: 2, unitPrice: 20.00, lineTotal: 40.00 },
      { id: 'wol6', description: 'Hem skirt to knee length', productVariantId: null, productName: null, sku: null, quantity: 1, unitPrice: 10.00, lineTotal: 10.00 },
      { id: 'wol7', description: 'Sew house badge on blazer', productVariantId: null, productName: null, sku: null, quantity: 2, unitPrice: 8.00, lineTotal: 16.00 },
    ],
  },
  wo4: {
    id: 'wo4', orderNumber: 'WO-20260325-001', customerId: 'cust3', customerName: 'Emily Rodriguez', customerPhone: '(555) 103-0000', customerEmail: 'emily.r@example.com', status: 'completed', dueDate: '2026-03-30', totalAmount: 36.00, notes: 'Safety vest customization', createdAt: '2026-03-25T11:00:00Z',
    lines: [
      { id: 'wol8', description: 'Add reflective safety stripes to jacket', productVariantId: null, productName: null, sku: null, quantity: 1, unitPrice: 18.00, lineTotal: 18.00 },
      { id: 'wol9', description: 'Embroider employee name on jacket back', productVariantId: null, productName: null, sku: null, quantity: 1, unitPrice: 18.00, lineTotal: 18.00 },
    ],
  },
  wo5: {
    id: 'wo5', orderNumber: 'WO-20260320-001', customerId: 'cust4', customerName: 'James Williams', customerPhone: '(555) 104-0000', customerEmail: 'jwilliams@example.com', status: 'picked_up', dueDate: '2026-03-25', totalAmount: 40.00, notes: null, createdAt: '2026-03-20T08:00:00Z',
    lines: [
      { id: 'wol10', description: 'Embroider employee name on polo', productVariantId: null, productName: null, sku: null, quantity: 2, unitPrice: 12.00, lineTotal: 24.00 },
      { id: 'wol11', description: 'Add company patch to cap', productVariantId: null, productName: null, sku: null, quantity: 2, unitPrice: 8.00, lineTotal: 16.00 },
    ],
  },
};

export function useWorkOrders(params?: { page?: number; pageSize?: number; status?: string; customerId?: string }) {
  return useQuery({
    queryKey: ['work-orders', params],
    queryFn: async () => {
      if (isDemo) {
        let items = demoWOs.items;
        if (params?.status) items = items.filter(w => w.status === params.status);
        if (params?.customerId) items = items.filter(w => w.customerId === params.customerId);
        return { ...demoWOs, items, totalCount: items.length };
      }
      const { data } = await api.get('/work-orders', { params });
      return data as { items: WorkOrder[]; totalCount: number; page: number; pageSize: number; totalPages: number };
    },
  });
}

export function useWorkOrder(id: string) {
  return useQuery({
    queryKey: ['work-orders', id],
    queryFn: async () => {
      if (isDemo) return demoWODetails[id] || demoWODetail;
      const { data } = await api.get(`/work-orders/${id}`);
      return data as WorkOrderDetail;
    },
    enabled: !!id,
  });
}

export function useCreateWorkOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (req: any) => {
      if (isDemo) return { id: crypto.randomUUID() };
      const { data } = await api.post('/work-orders', req);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['work-orders'] }),
  });
}

export function useUpdateWorkOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...req }: any) => {
      if (isDemo) return {};
      await api.put(`/work-orders/${id}`, req);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['work-orders'] }),
  });
}

export function useSubmitWorkOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (isDemo) return {};
      await api.post(`/work-orders/${id}/submit`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['work-orders'] }),
  });
}

export function useStartWorkOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (isDemo) return {};
      await api.post(`/work-orders/${id}/start`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['work-orders'] }),
  });
}

export function useCompleteWorkOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (isDemo) return {};
      await api.post(`/work-orders/${id}/complete`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['work-orders'] }),
  });
}

export function usePickupWorkOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (isDemo) return {};
      await api.post(`/work-orders/${id}/pickup`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['work-orders'] }),
  });
}
