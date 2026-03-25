import { create } from 'zustand';
import api from '../lib/api';
import { getDatabase } from '../lib/database';

interface LineItem {
  productId: string;
  sku: string;
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

interface TransactionState {
  lineItems: LineItem[];
  taxRate: number;
  subtotal: number;
  taxAmount: number;
  total: number;
  addItem: (product: { id: string; sku: string; name: string; retail_price: number }) => void;
  removeItem: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clearTransaction: () => void;
  completeSale: (tenderType: string, tenderedAmount: number) => Promise<any>;
}

function recalculate(items: LineItem[], taxRate: number) {
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const taxAmount = Math.round(subtotal * taxRate * 100) / 100;
  return { subtotal, taxAmount, total: subtotal + taxAmount };
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  lineItems: [],
  taxRate: 0.08,
  subtotal: 0,
  taxAmount: 0,
  total: 0,

  addItem: (product) => {
    const items = [...get().lineItems];
    const existing = items.findIndex(i => i.productId === product.id);
    if (existing >= 0) {
      items[existing].quantity += 1;
      items[existing].lineTotal = items[existing].quantity * items[existing].unitPrice;
    } else {
      items.push({
        productId: product.id,
        sku: product.sku,
        name: product.name,
        quantity: 1,
        unitPrice: product.retail_price,
        lineTotal: product.retail_price,
      });
    }
    const totals = recalculate(items, get().taxRate);
    set({ lineItems: items, ...totals });
  },

  removeItem: (index) => {
    const items = get().lineItems.filter((_, i) => i !== index);
    const totals = recalculate(items, get().taxRate);
    set({ lineItems: items, ...totals });
  },

  updateQuantity: (index, quantity) => {
    const items = [...get().lineItems];
    if (quantity <= 0) {
      items.splice(index, 1);
    } else {
      items[index].quantity = quantity;
      items[index].lineTotal = quantity * items[index].unitPrice;
    }
    const totals = recalculate(items, get().taxRate);
    set({ lineItems: items, ...totals });
  },

  clearTransaction: () => set({ lineItems: [], subtotal: 0, taxAmount: 0, total: 0 }),

  completeSale: async (tenderType, tenderedAmount) => {
    const state = get();
    const clientTransactionId = crypto.randomUUID();
    const payload = {
      items: state.lineItems.map(i => ({ productId: i.productId, quantity: i.quantity })),
      tenders: [{ tenderType, amount: tenderedAmount }],
      clientTransactionId,
    };

    try {
      const { data } = await api.post('/sales', payload);
      set({ lineItems: [], subtotal: 0, taxAmount: 0, total: 0 });
      return data;
    } catch {
      // Queue for offline sync
      const db = await getDatabase();
      await db.runAsync(
        'INSERT INTO transaction_queue (id, payload, status, created_at) VALUES (?, ?, ?, ?)',
        [clientTransactionId, JSON.stringify(payload), 'pending', new Date().toISOString()]
      );
      set({ lineItems: [], subtotal: 0, taxAmount: 0, total: 0 });
      return { id: clientTransactionId, transactionNumber: 'PENDING', status: 'pending' };
    }
  },
}));
