import { z } from 'zod';

export interface StockLevel {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantityOnHand: number;
  quantityReserved: number;
  availableQuantity: number;
  reorderPoint: number | null;
}

export interface StockTransaction {
  id: string;
  productId: string;
  transactionType: string;
  quantity: number;
  runningBalance: number;
  reference: string | null;
  notes: string | null;
  createdAt: string;
}

export const ReceiveStockSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive('Quantity must be positive'),
  reference: z.string().optional(),
  notes: z.string().optional(),
});

export type ReceiveStockRequest = z.infer<typeof ReceiveStockSchema>;

export const AdjustStockSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().refine(v => v !== 0, 'Quantity cannot be zero'),
  reason: z.string().min(1, 'Reason is required'),
});

export type AdjustStockRequest = z.infer<typeof AdjustStockSchema>;
