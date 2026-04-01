export type TransferStatus = 'draft' | 'in_transit' | 'completed' | 'cancelled';

export interface TransferDocument {
  id: string;
  documentNumber: string;
  sourceTenantNodeId: string;
  sourceStoreName: string;
  destinationTenantNodeId: string;
  destinationStoreName: string;
  status: TransferStatus;
  notes: string | null;
  lineCount: number;
  totalUnits: number;
  createdAt: string;
}

export interface TransferDocumentDetail {
  id: string;
  documentNumber: string;
  sourceTenantNodeId: string;
  sourceStoreName: string;
  destinationTenantNodeId: string;
  destinationStoreName: string;
  status: TransferStatus;
  notes: string | null;
  createdAt: string;
  lines: TransferDocumentLine[];
}

export interface TransferDocumentLine {
  id: string;
  productId: string;
  productVariantId: string | null;
  productName: string;
  sku: string;
  upc: string | null;
  variantDescription: string | null;
  quantity: number;
}

export interface CreateTransferRequest {
  destinationTenantNodeId: string;
  lines: {
    productId: string;
    productVariantId?: string | null;
    productName: string;
    sku: string;
    upc?: string | null;
    variantDescription?: string | null;
    quantity: number;
  }[];
  notes?: string | null;
}
