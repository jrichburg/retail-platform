import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { isDemo } from '@/lib/api';
import type { Invoice, InvoiceDetail, ArPayment, CustomerBalance, AgingSummary } from '@retail-platform/shared-types';

const demoInvoices: Invoice[] = [
  { id: 'inv1', invoiceNumber: 'INV-20260328-001', customerId: 'cust5', customerName: 'Lisa Thompson', sourceType: 'work_order', sourceReference: 'WO-20260328-001', status: 'open', invoiceDate: '2026-03-28T09:00:00Z', dueDate: '2026-04-27T00:00:00Z', amount: 46.00, amountPaid: 0, balanceDue: 46.00, paymentCount: 0, createdAt: '2026-03-28T09:00:00Z' },
  { id: 'inv2', invoiceNumber: 'INV-20260315-001', customerId: 'cust2', customerName: 'Michael Chen', sourceType: 'work_order', sourceReference: 'WO-20260327-001', status: 'partial', invoiceDate: '2026-03-15T10:00:00Z', dueDate: '2026-03-15T00:00:00Z', amount: 76.00, amountPaid: 40.00, balanceDue: 36.00, paymentCount: 1, createdAt: '2026-03-15T10:00:00Z' },
  { id: 'inv3', invoiceNumber: 'INV-20260301-001', customerId: 'cust3', customerName: 'Emily Rodriguez', sourceType: 'sale', sourceReference: 'TXN-20260301-003', status: 'open', invoiceDate: '2026-03-01T11:00:00Z', dueDate: '2026-02-15T00:00:00Z', amount: 189.99, amountPaid: 0, balanceDue: 189.99, paymentCount: 0, createdAt: '2026-03-01T11:00:00Z' },
  { id: 'inv4', invoiceNumber: 'INV-20260220-001', customerId: 'cust1', customerName: 'Sarah Johnson', sourceType: 'manual', sourceReference: null, status: 'paid', invoiceDate: '2026-02-20T14:00:00Z', dueDate: '2026-03-20T00:00:00Z', amount: 125.00, amountPaid: 125.00, balanceDue: 0, paymentCount: 1, createdAt: '2026-02-20T14:00:00Z' },
  { id: 'inv5', invoiceNumber: 'INV-20260110-001', customerId: 'cust4', customerName: 'James Williams', sourceType: 'sale', sourceReference: 'TXN-20260110-001', status: 'open', invoiceDate: '2026-01-10T08:00:00Z', dueDate: '2025-12-15T00:00:00Z', amount: 245.00, amountPaid: 0, balanceDue: 245.00, paymentCount: 0, createdAt: '2026-01-10T08:00:00Z' },
];

const demoPayments: ArPayment[] = [
  { id: 'pmt1', paymentNumber: 'PMT-20260320-001', invoiceId: 'inv2', customerId: 'cust2', amount: 40.00, paymentMethod: 'check', paymentDate: '2026-03-20T10:00:00Z', reference: 'Check #1045', notes: null, createdAt: '2026-03-20T10:00:00Z' },
  { id: 'pmt2', paymentNumber: 'PMT-20260318-001', invoiceId: 'inv4', customerId: 'cust1', amount: 125.00, paymentMethod: 'card', paymentDate: '2026-03-18T14:00:00Z', reference: null, notes: 'Paid in full', createdAt: '2026-03-18T14:00:00Z' },
];

const demoInvoiceDetails: Record<string, InvoiceDetail> = {
  inv1: { ...demoInvoices[0], sourceId: 'wo1', notes: 'Company uniform embroidery', payments: [] },
  inv2: { ...demoInvoices[1], sourceId: 'wo3', notes: 'School uniform package', payments: [demoPayments[0]] },
  inv3: { ...demoInvoices[2], sourceId: 'sale3', notes: 'Store purchase on account', payments: [] },
  inv4: { ...demoInvoices[3], sourceId: null, notes: 'Custom order balance', payments: [demoPayments[1]] },
  inv5: { ...demoInvoices[4], sourceId: 'sale1', notes: null, payments: [] },
};

const demoAging: AgingSummary = {
  current: 46.00,
  thirtyDays: 36.00,
  sixtyDays: 189.99,
  ninetyPlus: 245.00,
  totalOutstanding: 516.99,
  customers: [
    { customerId: 'cust4', customerName: 'James Williams', current: 0, thirtyDays: 0, sixtyDays: 0, ninetyPlus: 245.00, totalBalance: 245.00 },
    { customerId: 'cust3', customerName: 'Emily Rodriguez', current: 0, thirtyDays: 0, sixtyDays: 189.99, ninetyPlus: 0, totalBalance: 189.99 },
    { customerId: 'cust5', customerName: 'Lisa Thompson', current: 46.00, thirtyDays: 0, sixtyDays: 0, ninetyPlus: 0, totalBalance: 46.00 },
    { customerId: 'cust2', customerName: 'Michael Chen', current: 0, thirtyDays: 36.00, sixtyDays: 0, ninetyPlus: 0, totalBalance: 36.00 },
  ],
};

export function useInvoices(params?: { page?: number; pageSize?: number; status?: string; customerId?: string }) {
  return useQuery({
    queryKey: ['ar-invoices', params],
    queryFn: async () => {
      if (isDemo) {
        let items = demoInvoices;
        if (params?.status) items = items.filter(i => i.status === params.status);
        if (params?.customerId) items = items.filter(i => i.customerId === params.customerId);
        return { items, totalCount: items.length, page: 1, pageSize: 25, totalPages: 1 };
      }
      const { data } = await api.get('/ar/invoices', { params });
      return data as { items: Invoice[]; totalCount: number; page: number; pageSize: number; totalPages: number };
    },
  });
}

export function useInvoice(id: string) {
  return useQuery({
    queryKey: ['ar-invoices', id],
    queryFn: async () => {
      if (isDemo) return demoInvoiceDetails[id] || demoInvoiceDetails.inv1;
      const { data } = await api.get(`/ar/invoices/${id}`);
      return data as InvoiceDetail;
    },
    enabled: !!id,
  });
}

export function useCreateInvoice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (req: any) => {
      if (isDemo) return { id: crypto.randomUUID() };
      const { data } = await api.post('/ar/invoices', req);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ar-invoices'] }),
  });
}

export function useVoidInvoice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (isDemo) return {};
      await api.post(`/ar/invoices/${id}/void`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['ar-invoices'] }),
  });
}

export function useRecordPayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (req: any) => {
      if (isDemo) return { id: crypto.randomUUID() };
      const { data } = await api.post('/ar/payments', req);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['ar-invoices'] });
      qc.invalidateQueries({ queryKey: ['ar-payments'] });
      qc.invalidateQueries({ queryKey: ['ar-aging'] });
      qc.invalidateQueries({ queryKey: ['ar-customer-balance'] });
    },
  });
}

export function usePayments(params?: { page?: number; pageSize?: number; customerId?: string; invoiceId?: string }) {
  return useQuery({
    queryKey: ['ar-payments', params],
    queryFn: async () => {
      if (isDemo) {
        let items = demoPayments;
        if (params?.customerId) items = items.filter(p => p.customerId === params.customerId);
        if (params?.invoiceId) items = items.filter(p => p.invoiceId === params.invoiceId);
        return { items, totalCount: items.length, page: 1, pageSize: 25, totalPages: 1 };
      }
      const { data } = await api.get('/ar/payments', { params });
      return data as { items: ArPayment[]; totalCount: number; page: number; pageSize: number; totalPages: number };
    },
  });
}

export function useAgingSummary() {
  return useQuery({
    queryKey: ['ar-aging'],
    queryFn: async () => {
      if (isDemo) return demoAging;
      const { data } = await api.get('/ar/aging');
      return data as AgingSummary;
    },
  });
}

export function useCustomerBalance(customerId: string) {
  return useQuery({
    queryKey: ['ar-customer-balance', customerId],
    queryFn: async () => {
      if (isDemo) {
        const invoices = demoInvoices.filter(i => i.customerId === customerId && (i.status === 'open' || i.status === 'partial'));
        const customerName = invoices[0]?.customerName || '';
        return {
          customerId,
          customerName,
          totalBalance: invoices.reduce((sum, i) => sum + i.balanceDue, 0),
          openInvoiceCount: invoices.length,
          openInvoices: invoices,
        } as CustomerBalance;
      }
      const { data } = await api.get(`/ar/customers/${customerId}/balance`);
      return data as CustomerBalance;
    },
    enabled: !!customerId,
  });
}
