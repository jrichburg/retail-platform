import { z } from 'zod';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  sourceType: string | null;
  sourceReference: string | null;
  status: string;
  invoiceDate: string;
  dueDate: string;
  amount: number;
  amountPaid: number;
  balanceDue: number;
  paymentCount: number;
  createdAt: string;
}

export interface InvoiceDetail {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  sourceType: string | null;
  sourceId: string | null;
  sourceReference: string | null;
  status: string;
  invoiceDate: string;
  dueDate: string;
  amount: number;
  amountPaid: number;
  balanceDue: number;
  notes: string | null;
  createdAt: string;
  payments: ArPayment[];
}

export interface ArPayment {
  id: string;
  paymentNumber: string;
  invoiceId: string;
  customerId: string;
  amount: number;
  paymentMethod: string;
  paymentDate: string;
  reference: string | null;
  notes: string | null;
  createdAt: string;
}

export interface CustomerBalance {
  customerId: string;
  customerName: string;
  totalBalance: number;
  openInvoiceCount: number;
  openInvoices: Invoice[];
}

export interface AgingSummary {
  current: number;
  thirtyDays: number;
  sixtyDays: number;
  ninetyPlus: number;
  totalOutstanding: number;
  customers: AgingCustomer[];
}

export interface AgingCustomer {
  customerId: string;
  customerName: string;
  current: number;
  thirtyDays: number;
  sixtyDays: number;
  ninetyPlus: number;
  totalBalance: number;
}

export const CreateInvoiceSchema = z.object({
  customerId: z.string().min(1),
  customerName: z.string().min(1),
  sourceType: z.string().nullish(),
  sourceId: z.string().nullish(),
  sourceReference: z.string().nullish(),
  amount: z.number().positive('Amount must be positive'),
  dueDate: z.string().min(1, 'Due date is required'),
  notes: z.string().nullish(),
});

export type CreateInvoiceRequest = z.infer<typeof CreateInvoiceSchema>;

export const RecordPaymentSchema = z.object({
  invoiceId: z.string().min(1),
  amount: z.number().positive('Amount must be positive'),
  paymentMethod: z.enum(['cash', 'card', 'check', 'other']),
  paymentDate: z.string().min(1, 'Payment date is required'),
  reference: z.string().nullish(),
  notes: z.string().nullish(),
});

export type RecordPaymentRequest = z.infer<typeof RecordPaymentSchema>;
