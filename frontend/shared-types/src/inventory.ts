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

// Receive Document
export interface ReceiveDocument {
  id: string;
  documentNumber: string;
  purchaseOrderId: string | null;
  status: string;
  notes: string | null;
  lineCount: number;
  totalUnits: number;
  createdAt: string;
}

export interface ReceiveDocumentDetail {
  id: string;
  documentNumber: string;
  purchaseOrderId: string | null;
  status: string;
  notes: string | null;
  createdAt: string;
  lines: ReceiveDocumentLine[];
}

export interface ReceiveDocumentLine {
  id: string;
  productId: string;
  productVariantId: string | null;
  productName: string;
  sku: string;
  upc: string | null;
  variantDescription: string | null;
  quantity: number;
}

export const CreateReceiveDocumentSchema = z.object({
  lines: z.array(z.object({
    productId: z.string().uuid(),
    productVariantId: z.string().uuid().nullish(),
    productName: z.string(),
    sku: z.string(),
    upc: z.string().nullish(),
    variantDescription: z.string().nullish(),
    quantity: z.number().int().positive(),
  })).min(1, 'At least one item is required'),
  notes: z.string().nullish(),
});

export type CreateReceiveDocumentRequest = z.infer<typeof CreateReceiveDocumentSchema>;

// Purchase Order
export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplierId: string;
  supplierName: string;
  status: string;
  notes: string | null;
  expectedDate: string | null;
  totalCost: number;
  lineCount: number;
  totalUnitsOrdered: number;
  totalUnitsReceived: number;
  createdAt: string;
}

export interface PurchaseOrderDetail {
  id: string;
  orderNumber: string;
  supplierId: string;
  supplierName: string;
  status: string;
  notes: string | null;
  expectedDate: string | null;
  totalCost: number;
  createdAt: string;
  lines: PurchaseOrderLine[];
}

export interface PurchaseOrderLine {
  id: string;
  productId: string;
  productVariantId: string | null;
  productName: string;
  sku: string;
  variantDescription: string | null;
  quantityOrdered: number;
  quantityReceived: number;
  unitCost: number;
  lineCost: number;
}
