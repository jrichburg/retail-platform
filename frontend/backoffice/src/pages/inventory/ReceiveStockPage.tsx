import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '@/hooks/use-products';
import { useReceiveStock } from '@/hooks/use-inventory';

export function ReceiveStockPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [reference, setReference] = useState('');
  const { data: products } = useProducts({ search: search || undefined, pageSize: 10 });
  const receiveStock = useReceiveStock();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await receiveStock.mutateAsync({ productId: selectedProductId, quantity, reference: reference || undefined });
    navigate('/inventory');
  };

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Receive Stock</h2>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-gray-200 bg-white p-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Search Product</label>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or SKU..." className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
          {products?.items && products.items.length > 0 && search && (
            <div className="mt-1 max-h-40 overflow-y-auto rounded-md border border-gray-200 bg-white">
              {products.items.map((p) => (
                <button key={p.id} type="button" onClick={() => { setSelectedProductId(p.id); setSearch(p.name + ' (' + p.sku + ')'); }} className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-50">
                  <span className="font-medium">{p.name}</span> <span className="text-gray-500">{p.sku}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Quantity</label>
          <input type="number" min={1} value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Reference (PO#, etc.)</label>
          <input type="text" value={reference} onChange={(e) => setReference(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={!selectedProductId || receiveStock.isPending} className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50">
            {receiveStock.isPending ? 'Receiving...' : 'Receive Stock'}
          </button>
          <button type="button" onClick={() => navigate('/inventory')} className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
        </div>
      </form>
    </div>
  );
}
