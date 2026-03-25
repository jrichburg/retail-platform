import { z } from 'zod';

export interface Sale {
  id: string;
  transactionNumber: string;
  transactionDate: string;
  status: string;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  tenderedAmount: number;
  changeAmount: number;
  lineItems: SaleLineItem[];
  tenders: SaleTender[];
}

export interface SaleLineItem {
  productId: string;
  sku: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  discountAmount: number;
}

export interface SaleTender {
  tenderType: string;
  amount: number;
  paymentReference: string | null;
}

export const CreateSaleSchema = z.object({
  items: z.array(z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().positive(),
  })).min(1),
  tenders: z.array(z.object({
    tenderType: z.string(),
    amount: z.number().positive(),
  })).min(1),
  clientTransactionId: z.string().uuid().optional(),
});

export type CreateSaleRequest = z.infer<typeof CreateSaleSchema>;
