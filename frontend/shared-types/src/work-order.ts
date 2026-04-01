import { z } from 'zod';

export interface WorkOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string | null;
  status: string;
  dueDate: string | null;
  totalAmount: number;
  lineCount: number;
  notes: string | null;
  createdAt: string;
}

export interface WorkOrderDetail {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string | null;
  customerEmail: string | null;
  status: string;
  dueDate: string | null;
  totalAmount: number;
  notes: string | null;
  createdAt: string;
  lines: WorkOrderLine[];
}

export interface WorkOrderLine {
  id: string;
  description: string;
  productVariantId: string | null;
  productName: string | null;
  sku: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export const CreateWorkOrderSchema = z.object({
  customerId: z.string().min(1),
  customerName: z.string().min(1),
  customerPhone: z.string().nullish(),
  customerEmail: z.string().nullish(),
  dueDate: z.string().nullish(),
  notes: z.string().nullish(),
  lines: z.array(z.object({
    description: z.string().min(1, 'Description is required'),
    productVariantId: z.string().nullish(),
    productName: z.string().nullish(),
    sku: z.string().nullish(),
    quantity: z.number().int().positive('Quantity must be positive'),
    unitPrice: z.number().min(0, 'Unit price must be non-negative'),
  })).min(1, 'At least one line item is required'),
});

export type CreateWorkOrderRequest = z.infer<typeof CreateWorkOrderSchema>;
