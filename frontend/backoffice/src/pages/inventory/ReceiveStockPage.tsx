import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '@/hooks/use-products';
import { useReceiveStock } from '@/hooks/use-inventory';
import { ArrowLeft, Search, Package, Check } from 'lucide-react';

export function ReceiveStockPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<{ id: string; name: string; sku: string } | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [reference, setReference] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const { data: products } = useProducts({ search: search || undefined, pageSize: 8 });
  const receiveStock = useReceiveStock();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    await receiveStock.mutateAsync({ productId: selectedProduct.id, quantity, reference: reference || undefined });
    navigate('/inventory');
  };

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <button onClick={() => navigate('/inventory')} className="btn-ghost !px-0 mb-4 text-slate-500 hover:text-slate-700">
          <ArrowLeft className="h-4 w-4" /> Back to inventory
        </button>
        <h1 className="page-title">Receive Stock</h1>
        <p className="mt-1 text-sm text-slate-500">Record incoming inventory for a product</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-6 space-y-5">
          <h3 className="section-label">Product</h3>

          {selectedProduct ? (
            <div className="flex items-center justify-between rounded-lg bg-emerald-50 border border-emerald-100 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100">
                  <Check className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{selectedProduct.name}</p>
                  <p className="font-mono text-xs text-slate-500">{selectedProduct.sku}</p>
                </div>
              </div>
              <button type="button" onClick={() => { setSelectedProduct(null); setSearch(''); }} className="btn-ghost text-xs">
                Change
              </button>
            </div>
          ) : (
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setShowDropdown(true); }}
                onFocus={() => setShowDropdown(true)}
                placeholder="Search by name or SKU..."
                className="input-field !pl-10"
              />
              {showDropdown && products?.items && products.items.length > 0 && search && (
                <div className="absolute left-0 right-0 top-full z-10 mt-1 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-elevated">
                  {products.items.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => { setSelectedProduct({ id: p.id, name: p.name, sku: p.sku }); setShowDropdown(false); }}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-amber-50/50"
                    >
                      <Package className="h-4 w-4 text-slate-400" />
                      <div>
                        <p className="text-sm font-medium text-slate-900">{p.name}</p>
                        <p className="font-mono text-xs text-slate-400">{p.sku}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="card p-6 space-y-5">
          <h3 className="section-label">Details</h3>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Quantity</label>
            <input type="number" min={1} value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} className="input-field tabular-nums max-w-[120px]" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Reference <span className="font-normal text-slate-400">(optional)</span></label>
            <input type="text" value={reference} onChange={(e) => setReference(e.target.value)} placeholder="PO number, vendor, etc." className="input-field" />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button type="button" onClick={() => navigate('/inventory')} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={!selectedProduct || receiveStock.isPending} className="btn-primary">
            {receiveStock.isPending ? 'Receiving...' : 'Receive stock'}
          </button>
        </div>
      </form>
    </div>
  );
}
