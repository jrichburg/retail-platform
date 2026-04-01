import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransferDocumentStore } from '@/stores/transfer-document-store';
import { useCreateTransfer } from '@/hooks/use-transfers';
import { useProducts } from '@/hooks/use-products';
import { useTenantStore } from '@/stores/tenant-store';
import { isDemo } from '@/lib/api';
import { demoProducts } from '@/lib/demo-data';
import { ArrowRightLeft, Scan, Search, Plus, Minus, Trash2, ChevronRight } from 'lucide-react';

export function TransferFormPage() {
  const navigate = useNavigate();
  const store = useTransferDocumentStore();
  const { mutateAsync: createTransfer, isPending } = useCreateTransfer();
  const tenantStore = useTenantStore();

  const [scanInput, setScanInput] = useState('');
  const [scanMessage, setScanMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [manualSearch, setManualSearch] = useState('');
  const [showManual, setShowManual] = useState(false);
  const [manualQty, setManualQty] = useState(1);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const scanRef = useRef<HTMLInputElement>(null);
  const { data: manualResults } = useProducts({ search: manualSearch || undefined, pageSize: 8 });

  // Other stores (exclude current)
  const currentStoreId = tenantStore.currentStoreId;
  const otherStores = tenantStore.stores().filter(s => s.id !== currentStoreId);

  // Autofocus scan input
  useEffect(() => { scanRef.current?.focus(); }, []);

  // Clean up store on unmount
  useEffect(() => () => store.clear(), []);

  const handleScan = async () => {
    const upc = scanInput.trim();
    if (!upc) return;
    setScanInput('');

    let found = false;
    if (isDemo) {
      for (const product of demoProducts.items) {
        const variant = product.variants?.find((v: any) => v.upc === upc);
        if (variant) {
          const desc = [variant.dimension1Value, variant.dimension2Value].filter(Boolean).join(' / ');
          store.addLine({
            productId: product.id,
            productVariantId: variant.id,
            productName: product.name,
            sku: product.sku,
            upc: variant.upc,
            variantDescription: desc || null,
          });
          setScanMessage({ type: 'success', text: `Added: ${product.name} (${desc || 'default'})` });
          found = true;
          break;
        }
      }
    }

    if (!found) setScanMessage({ type: 'error', text: `No product found for UPC: ${upc}` });
    setTimeout(() => setScanMessage(null), 3000);
    scanRef.current?.focus();
  };

  const addManualProduct = (product: any, variant?: any) => {
    if (variant) {
      const desc = [variant.dimension1Value, variant.dimension2Value].filter(Boolean).join(' / ');
      for (let i = 0; i < manualQty; i++) {
        store.addLine({
          productId: product.id,
          productVariantId: variant.id,
          productName: product.name,
          sku: variant.sku ?? product.sku,
          upc: variant.upc ?? null,
          variantDescription: desc || null,
        });
      }
    } else {
      for (let i = 0; i < manualQty; i++) {
        store.addLine({
          productId: product.id,
          productVariantId: null,
          productName: product.name,
          sku: product.sku,
          upc: null,
          variantDescription: null,
        });
      }
    }
    setManualSearch('');
  };

  const handleSubmit = async () => {
    if (!store.destinationTenantNodeId) {
      setSubmitError('Please select a destination store.');
      return;
    }
    if (store.lines.length === 0) {
      setSubmitError('Please add at least one item.');
      return;
    }
    setSubmitError(null);
    try {
      const result = await createTransfer({
        destinationTenantNodeId: store.destinationTenantNodeId,
        lines: store.lines.map(l => ({
          productId: l.productId,
          productVariantId: l.productVariantId,
          productName: l.productName,
          sku: l.sku,
          upc: l.upc,
          variantDescription: l.variantDescription,
          quantity: l.quantity,
        })),
        notes: store.notes || null,
      });
      store.clear();
      navigate(`/inventory/transfers/${result.id}`);
    } catch (e: any) {
      setSubmitError(e.message || 'Failed to create transfer');
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-2">
        <ArrowRightLeft className="h-5 w-5 text-slate-400" />
        <h1 className="page-title">New Transfer</h1>
      </div>

      {/* Destination store selector */}
      <div className="card p-5 space-y-3">
        <h2 className="section-label">Destination Store</h2>
        {otherStores.length === 0 ? (
          <p className="text-sm text-slate-400">No other stores found. This tenant may only have one store.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {otherStores.map(store_ => (
              <button
                key={store_.id}
                onClick={() => store.setDestination(store_.id)}
                className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                  store.destinationTenantNodeId === store_.id
                    ? 'border-amber-400 bg-amber-50 text-amber-700'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {store.destinationTenantNodeId === store_.id && (
                  <ChevronRight className="h-3.5 w-3.5 text-amber-500" />
                )}
                {store_.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Scan input */}
      <div className="card p-5 space-y-3">
        <h2 className="section-label">Scan Items</h2>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Scan className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              ref={scanRef}
              type="text"
              placeholder="Scan UPC barcode..."
              value={scanInput}
              onChange={e => setScanInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleScan(); }}
              className="input-field !pl-10"
            />
          </div>
          <button onClick={handleScan} className="btn-secondary">Add</button>
        </div>
        {scanMessage && (
          <p className={`text-sm ${scanMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {scanMessage.text}
          </p>
        )}
      </div>

      {/* Manual add */}
      <div className="card">
        <button
          className="flex w-full items-center gap-2 px-5 py-3.5 text-sm font-medium text-slate-600 hover:bg-slate-50/50 transition-colors"
          onClick={() => setShowManual(!showManual)}
        >
          <Search className="h-4 w-4 text-slate-400" />
          <span>Search &amp; add manually</span>
        </button>
        {showManual && (
          <div className="border-t border-slate-100 px-5 pb-4 pt-3 space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search by name or SKU..."
                value={manualSearch}
                onChange={e => setManualSearch(e.target.value)}
                className="input-field flex-1"
                autoFocus
              />
              <div className="flex items-center gap-1">
                <button onClick={() => setManualQty(q => Math.max(1, q - 1))} className="btn-ghost !p-1.5"><Minus className="h-3.5 w-3.5" /></button>
                <span className="w-8 text-center text-sm font-medium">{manualQty}</span>
                <button onClick={() => setManualQty(q => q + 1)} className="btn-ghost !p-1.5"><Plus className="h-3.5 w-3.5" /></button>
              </div>
            </div>
            {manualSearch && (
              <div className="space-y-1">
                {manualResults?.items.map((product: any) => (
                  <div key={product.id} className="rounded-lg border border-slate-100 bg-slate-50/50 p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-sm font-medium text-slate-900">{product.name}</p>
                        <p className="font-mono text-xs text-slate-400">{product.sku}</p>
                      </div>
                      {(!product.variants || product.variants.length === 0) && (
                        <button onClick={() => addManualProduct(product)} className="btn-ghost !py-1 text-xs">
                          Add (no sizes)
                        </button>
                      )}
                    </div>
                    {product.variants && product.variants.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {product.variants.map((v: any) => {
                          const label = [v.dimension1Value, v.dimension2Value].filter(Boolean).join('/');
                          return (
                            <button
                              key={v.id}
                              onClick={() => addManualProduct(product, v)}
                              className="rounded border border-slate-200 bg-white px-2 py-0.5 text-xs font-medium text-slate-600 hover:border-amber-400 hover:text-amber-600 transition-colors"
                            >
                              {label || 'Default'}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
                {manualResults?.items.length === 0 && (
                  <p className="text-sm text-slate-400">No products found.</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lines table */}
      {store.lines.length > 0 && (
        <div className="card">
          <div className="border-b border-slate-100 px-5 py-3.5 flex items-center justify-between">
            <p className="text-sm font-medium text-slate-700">
              {store.lines.length} line{store.lines.length !== 1 ? 's' : ''} ·{' '}
              {store.lines.reduce((s, l) => s + l.quantity, 0)} units
            </p>
            <button onClick={store.clear} className="btn-ghost !py-1 text-xs text-slate-400 hover:text-red-500">Clear all</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="table-header">Product</th>
                  <th className="table-header">SKU</th>
                  <th className="table-header">Size</th>
                  <th className="table-header text-center">Qty</th>
                  <th className="table-header w-8"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {store.lines.map((line, index) => (
                  <tr key={`${line.productId}-${line.productVariantId}`}>
                    <td className="table-cell text-sm font-medium text-slate-900">{line.productName}</td>
                    <td className="table-cell font-mono text-xs text-slate-500">{line.sku}</td>
                    <td className="table-cell text-sm text-slate-500">{line.variantDescription ?? '—'}</td>
                    <td className="table-cell">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => store.updateQuantity(index, line.quantity - 1)} className="btn-ghost !p-1"><Minus className="h-3 w-3" /></button>
                        <input
                          type="number"
                          min={1}
                          value={line.quantity}
                          onChange={e => store.updateQuantity(index, parseInt(e.target.value) || 0)}
                          className="w-12 rounded border border-slate-200 px-1 py-0.5 text-center text-sm"
                        />
                        <button onClick={() => store.updateQuantity(index, line.quantity + 1)} className="btn-ghost !p-1"><Plus className="h-3 w-3" /></button>
                      </div>
                    </td>
                    <td className="table-cell">
                      <button onClick={() => store.removeLine(index)} className="btn-ghost !p-1 text-slate-300 hover:text-red-400">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Notes */}
      <div className="card p-5">
        <label className="form-label">Notes (optional)</label>
        <textarea
          className="input-field mt-1 h-20 resize-none"
          placeholder="Reason for transfer, season restock, etc."
          value={store.notes}
          onChange={e => store.setNotes(e.target.value)}
        />
      </div>

      {submitError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {submitError}
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          className="btn-primary"
          onClick={handleSubmit}
          disabled={isPending || store.lines.length === 0 || !store.destinationTenantNodeId}
        >
          {isPending ? 'Creating…' : 'Create Transfer'}
        </button>
        <button className="btn-ghost" onClick={() => navigate('/inventory/transfers')}>Cancel</button>
      </div>
    </div>
  );
}
