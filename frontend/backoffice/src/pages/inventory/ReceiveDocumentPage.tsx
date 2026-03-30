import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReceiveDocumentStore, type ReceiveLineItem } from '@/stores/receive-document-store';
import { useCreateReceiveDocument } from '@/hooks/use-receiving';
import { useProducts } from '@/hooks/use-products';
import api, { isDemo } from '@/lib/api';
import { demoProducts } from '@/lib/demo-data';
import { Scan, Plus, Trash2, Package, ArrowLeft, CheckCircle2, Search, X } from 'lucide-react';

export function ReceiveDocumentPage() {
  const navigate = useNavigate();
  const { lines, notes, addLine, updateQuantity, removeLine, setNotes, clear } = useReceiveDocumentStore();
  const createDoc = useCreateReceiveDocument();
  const scanInputRef = useRef<HTMLInputElement>(null);
  const [scanValue, setScanValue] = useState('');
  const [scanStatus, setScanStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showManualAdd, setShowManualAdd] = useState(false);
  const [manualSearch, setManualSearch] = useState('');
  const [manualQty, setManualQty] = useState(1);
  const { data: searchResults } = useProducts({ search: manualSearch || undefined, pageSize: 8 });

  const totalUnits = lines.reduce((sum, l) => sum + l.quantity, 0);

  const handleScan = useCallback(async () => {
    if (!scanValue.trim()) return;
    const upc = scanValue.trim();
    setScanValue('');
    setScanStatus(null);

    try {
      let product: any;
      if (isDemo) {
        // Find in demo data
        for (const p of demoProducts.items) {
          const variant = p.variants?.find(v => v.upc === upc);
          if (variant) {
            product = { ...p, matchedVariantId: variant.id, matchedDimension1Value: variant.dimension1Value, matchedDimension2Value: variant.dimension2Value, upc };
            break;
          }
        }
      } else {
        const { data } = await api.get('/catalog/products/lookup', { params: { upc } });
        product = data;
      }

      if (!product) {
        setScanStatus({ type: 'error', message: `No product found for UPC ${upc}` });
        return;
      }

      const variantDesc = [product.matchedDimension1Value, product.matchedDimension2Value].filter(Boolean).join(' / ') || null;

      addLine({
        productId: product.id,
        productVariantId: product.matchedVariantId || null,
        productName: product.name,
        sku: product.sku,
        upc,
        variantDescription: variantDesc,
      });

      setScanStatus({ type: 'success', message: `${product.name} ${variantDesc ? `(${variantDesc})` : ''} — added` });
    } catch {
      setScanStatus({ type: 'error', message: `Product not found for UPC ${upc}` });
    }

    scanInputRef.current?.focus();
  }, [scanValue, addLine]);

  const handleManualAdd = (product: any, variant?: any) => {
    const variantDesc = variant ? [variant.dimension1Value, variant.dimension2Value].filter(Boolean).join(' / ') : null;
    for (let i = 0; i < manualQty; i++) {
      addLine({
        productId: product.id,
        productVariantId: variant?.id || null,
        productName: product.name,
        sku: product.sku,
        upc: variant?.upc || null,
        variantDescription: variantDesc,
      });
    }
    setShowManualAdd(false);
    setManualSearch('');
    setManualQty(1);
  };

  const handleSubmit = async () => {
    const request = {
      lines: lines.map(l => ({
        productId: l.productId,
        productVariantId: l.productVariantId,
        productName: l.productName,
        sku: l.sku,
        upc: l.upc,
        variantDescription: l.variantDescription,
        quantity: l.quantity,
      })),
      notes: notes || undefined,
    };
    const result = await createDoc.mutateAsync(request);
    clear();
    navigate(`/inventory/receiving/${result.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <button onClick={() => navigate('/inventory')} className="btn-ghost !px-0 mb-2 text-slate-500 hover:text-slate-700">
            <ArrowLeft className="h-4 w-4" /> Back to inventory
          </button>
          <h1 className="page-title">Receive Stock</h1>
          <p className="mt-1 text-sm text-slate-500">Scan or manually add items to receive</p>
        </div>
      </div>

      {/* Scan Input */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-3">
          <Scan className="h-4 w-4 text-amber-600" />
          <span className="text-sm font-semibold text-slate-700">Scan UPC</span>
        </div>
        <div className="flex gap-3">
          <div className="relative flex-1 max-w-md">
            <input
              ref={scanInputRef}
              type="text"
              value={scanValue}
              onChange={(e) => setScanValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleScan()}
              placeholder="Scan or type UPC barcode..."
              autoFocus
              className="input-field font-mono"
            />
          </div>
          <button onClick={handleScan} className="btn-primary">Lookup</button>
          <button onClick={() => setShowManualAdd(true)} className="btn-secondary">
            <Search className="h-4 w-4" /> Add manually
          </button>
        </div>
        {scanStatus && (
          <div className={`mt-3 rounded-lg px-4 py-2.5 text-sm ${scanStatus.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
            {scanStatus.type === 'success' ? <CheckCircle2 className="inline h-4 w-4 mr-1.5" /> : null}
            {scanStatus.message}
          </div>
        )}
      </div>

      {/* Manual Add Modal */}
      {showManualAdd && (
        <div className="card p-5 border-amber-200 bg-amber-50/30">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-slate-700">Add Product Manually</span>
            <button onClick={() => { setShowManualAdd(false); setManualSearch(''); }} className="btn-ghost !p-1"><X className="h-4 w-4" /></button>
          </div>
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={manualSearch}
              onChange={(e) => setManualSearch(e.target.value)}
              placeholder="Search by name or SKU..."
              autoFocus
              className="input-field !pl-10"
            />
          </div>
          {searchResults?.items && manualSearch && (
            <div className="max-h-60 overflow-y-auto space-y-1">
              {searchResults.items.map((product) => (
                <div key={product.id} className="rounded-lg border border-slate-200 bg-white p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{product.name}</p>
                      <p className="font-mono text-xs text-slate-400">{product.sku} {product.supplierName ? `· ${product.supplierName}` : ''}</p>
                    </div>
                  </div>
                  {product.variants && product.variants.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {product.variants.map((v) => (
                        <button
                          key={v.id}
                          onClick={() => handleManualAdd(product, v)}
                          className="rounded bg-slate-100 px-2.5 py-1 text-xs font-mono text-slate-700 hover:bg-amber-100 hover:text-amber-700 transition-colors"
                        >
                          {[v.dimension1Value, v.dimension2Value].filter(Boolean).join(' / ')}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <button onClick={() => handleManualAdd(product)} className="btn-ghost text-xs">
                      <Plus className="h-3 w-3" /> Add (no sizes)
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Lines Table */}
      <div className="card">
        <div className="border-b border-slate-100 px-4 py-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-700">{lines.length} line{lines.length !== 1 ? 's' : ''} · {totalUnits} unit{totalUnits !== 1 ? 's' : ''}</p>
          {lines.length > 0 && (
            <button onClick={clear} className="btn-ghost text-xs text-red-500 hover:text-red-700"><Trash2 className="h-3 w-3" /> Clear all</button>
          )}
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Package className="h-8 w-8 text-slate-300 mb-3" />
            <p className="text-sm font-medium text-slate-500">No items yet</p>
            <p className="mt-1 text-xs text-slate-400">Scan a UPC or add products manually to begin receiving</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="table-header">Product</th>
                  <th className="table-header">SKU</th>
                  <th className="table-header">Size / Width</th>
                  <th className="table-header">UPC</th>
                  <th className="table-header text-center w-32">Qty</th>
                  <th className="table-header w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {lines.map((line, index) => (
                  <tr key={`${line.productId}-${line.productVariantId}-${index}`} className="group">
                    <td className="table-cell font-medium text-slate-900">{line.productName}</td>
                    <td className="table-cell font-mono text-xs text-slate-600">{line.sku}</td>
                    <td className="table-cell text-sm text-slate-600">{line.variantDescription || '—'}</td>
                    <td className="table-cell font-mono text-xs text-slate-400">{line.upc || '—'}</td>
                    <td className="table-cell text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => updateQuantity(index, line.quantity - 1)} className="h-7 w-7 rounded bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center text-sm font-bold">−</button>
                        <input
                          type="number"
                          min={1}
                          value={line.quantity}
                          onChange={(e) => updateQuantity(index, parseInt(e.target.value) || 1)}
                          className="w-14 rounded border border-slate-200 px-2 py-1 text-center text-sm font-semibold tabular-nums focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/20"
                        />
                        <button onClick={() => updateQuantity(index, line.quantity + 1)} className="h-7 w-7 rounded bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center text-sm font-bold">+</button>
                      </div>
                    </td>
                    <td className="table-cell">
                      <button onClick={() => removeLine(index)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 className="h-4 w-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Notes + Submit */}
      {lines.length > 0 && (
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Notes <span className="font-normal text-slate-400">(optional)</span></label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Shipment reference, vendor, etc."
              className="input-field"
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={createDoc.isPending}
            className="btn-primary !py-3 !px-8"
          >
            {createDoc.isPending ? 'Submitting...' : `Receive ${totalUnits} unit${totalUnits !== 1 ? 's' : ''}`}
          </button>
        </div>
      )}
    </div>
  );
}
