import { create } from 'zustand';

export interface TransferLineItem {
  productId: string;
  productVariantId: string | null;
  productName: string;
  sku: string;
  upc: string | null;
  variantDescription: string | null;
  quantity: number;
}

interface TransferDocumentStore {
  destinationTenantNodeId: string | null;
  lines: TransferLineItem[];
  notes: string;
  setDestination: (id: string) => void;
  addLine: (item: Omit<TransferLineItem, 'quantity'>) => void;
  updateQuantity: (index: number, quantity: number) => void;
  removeLine: (index: number) => void;
  setNotes: (notes: string) => void;
  clear: () => void;
}

export const useTransferDocumentStore = create<TransferDocumentStore>((set, get) => ({
  destinationTenantNodeId: null,
  lines: [],
  notes: '',

  setDestination: (id) => set({ destinationTenantNodeId: id }),

  addLine: (item) => {
    const lines = [...get().lines];
    const existingIndex = lines.findIndex(
      l => l.productId === item.productId && l.productVariantId === item.productVariantId
    );
    if (existingIndex >= 0) {
      lines[existingIndex].quantity += 1;
    } else {
      lines.push({ ...item, quantity: 1 });
    }
    set({ lines });
  },

  updateQuantity: (index, quantity) => {
    const lines = [...get().lines];
    if (quantity <= 0) {
      lines.splice(index, 1);
    } else {
      lines[index].quantity = quantity;
    }
    set({ lines });
  },

  removeLine: (index) => {
    const lines = get().lines.filter((_, i) => i !== index);
    set({ lines });
  },

  setNotes: (notes) => set({ notes }),

  clear: () => set({ destinationTenantNodeId: null, lines: [], notes: '' }),
}));
