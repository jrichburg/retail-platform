import { useState, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePurchaseOrder } from '@/hooks/use-purchase-orders';
import { useReceiveAgainstPO } from '@/hooks/use-receiving';
import api, { isDemo } from '@/lib/api';
import { demoProducts } from '@/lib/demo-data';
import { Scan, CheckCircle2, ArrowLeft, Package, AlertTriangle, Truck } from 'lucide-react';

interface ReceiveLine {
  productId: string;
  productVariantId: string | null;
  productName: string;
  sku: string;
  upc: string | null;
  variantDescription: string | null;
  quantity: number;
  onPO: boolean;
  expectedQty: number;
  previouslyReceived: number;
}

export function ReceiveAgainstPOPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: po, isLoading } = usePurchaseOrder(id || '');
  const receiveAgainstPO = useReceiveAgainstPO();
  const scanRef = useRef<HTMLInputElement>(null);
  const [scanValue, setScanValue] = useState('');
  const [scanStatus, setScanStatus] = useState<{ type: 'success' | 'error' | 'warning'; message: string } | null>(null);
  const [lines, setLines] = useState<ReceiveLine[]>([]);
  const [notes, setNotes] = useState('');

  const totalUnits = lines.reduce((s, l) => s + l.quantity, 0);

  const handleScan = useCallback(async () => {
    if (!scanValue.trim() || !po) return;
    const upc = scanValue.trim();
    setScanValue('');
    setScanStatus(null);

    try {
      let product: any;
      if (isDemo) {
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

      // Check if on PO
      const poLine = po.lines.find(l =>
        l.productId === product.id &&
        l.productVariantId === (product.matchedVariantId || null)
      );

      const existingIdx = lines.findIndex(l =>
        l.productId === product.id &&
        l.productVariantId === (product.matchedVariantId || null)
      );

      if (existingIdx >= 0) {
        const updated = [...lines];
        updated[existingIdx].quantity += 1;
        setLines(updated);
      } else {
        setLines([...lines, {
          productId: product.id,
          productVariantId: product.matchedVariantId || null,
          productName: product.name,
          sku: product.sku,
          upc,
          variantDescription: variantDesc,
          quantity: 1,
          onPO: !!poLine,
          expectedQty: poLine?.quantityOrdered || 0,
          previouslyReceived: poLine?.quantityReceived || 0,
        }]);
      }

      if (poLine) {
        setScanStatus({ type: 'success', message: `${product.name} ${variantDesc ? `(${variantDesc})` : ''} — on PO` });
      } else {
        setScanStatus({ type: 'warning', message: `${product.name} ${variantDesc ? `(${variantDesc})` : ''} — NOT on this PO` });
      }
    } catch {
      setScanStatus({ type: 'error', message: `Product not found for UPC ${upc}` });
    }

    scanRef.current?.focus();
  }, [scanValue, po, lines]);

  const updateQty = (index: number, qty: number) => {
    const updated = [...lines];
    if (qty <= 0) { updated.splice(index, 1); } else { updated[index].quantity = qty; }
    setLines(updated);
  };

  const handleSubmit = async () => {
    if (!po) return;
    await receiveAgainstPO.mutateAsync({
      purchaseOrderId: po.id,
      lines: lines.map(l => ({
        productId: l.productId,
        productVariantId: l.productVariantId,
        productName: l.productName,
        sku: l.sku,
        upc: l.upc,
        variantDescription: l.variantDescription,
        quantity: l.quantity,
      })),
      notes: notes || null,
    });
    navigate(`/inventory/purchase-orders/${po.id}`);
  };

  if (isLoading) return <div className="flex items-center justify-center py-20"><div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-amber-500" /></div>;
  if (!po) return <div className="text-center py-20"><p className="text-sm text-red-600">Purchase order not found.</p></div>;

  return (
    <div className="space-y-6">
      <div>
        <button onClick={() => navigate(`/inventory/purchase-orders/${po.id}`)} className="btn-ghost !px-0 mb-2 text-slate-500 hover:text-slate-700">
          <ArrowLeft className="h-4 w-4" /> Back to {po.orderNumber}
        </button>
        <div className="flex items-center gap-3">
          <Truck className="h-6 w-6 text-amber-600" />
          <div>
            <h1 className="page-title">Receive Against {po.orderNumber}</h1>
            <p className="mt-1 text-sm text-slate-500">{po.supplierName} — scan or add items to receive</p>
          </div>
        </div>
      </div>

      {/* Scan */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-3">
          <Scan className="h-4 w-4 text-amber-600" />
          <span className="text-sm font-semibold text-slate-700">Scan UPC</span>
        </div>
        <div className="flex gap-3">
          <input ref={scanRef} type="text" value={scanValue} onChange={(e) => setScanValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleScan()} placeholder="Scan or type UPC..." autoFocus className="input-field font-mono flex-1 max-w-md" />
          <button onClick={handleScan} className="btn-primary">Lookup</button>
        </div>
        {scanStatus && (
          <div className={`mt-3 rounded-lg px-4 py-2.5 text-sm flex items-center gap-2 ${
            scanStatus.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
            scanStatus.type === 'warning' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
            'bg-red-50 text-red-700 border border-red-100'
          }`}>
            {scanStatus.type === 'success' && <CheckCircle2 className="h-4 w-4" />}
            {scanStatus.type === 'warning' && <AlertTriangle className="h-4 w-4" />}
            {scanStatus.message}
          </div>
        )}
      </div>

      {/* Lines */}
      <div className="card">
        <div className="border-b border-slate-100 px-4 py-3">
          <p className="text-sm font-semibold text-slate-700">{lines.length} line{lines.length !== 1 ? 's' : ''} · {totalUnits} unit{totalUnits !== 1 ? 's' : ''}</p>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Package className="h-8 w-8 text-slate-300 mb-3" />
            <p className="text-sm font-medium text-slate-500">Scan items to receive against this PO</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="table-header">Product</th>
                  <th className="table-header">Size / Width</th>
                  <th className="table-header text-center">Expected</th>
                  <th className="table-header text-center">Prev. Received</th>
                  <th className="table-header text-center w-28">Receiving Now</th>
                  <th className="table-header text-center">On PO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {lines.map((line, i) => (
                  <tr key={`${line.productId}-${line.productVariantId}`} className={!line.onPO ? 'bg-amber-50/30' : ''}>
                    <td className="table-cell">
                      <p className="font-medium text-slate-900">{line.productName}</p>
                      <p className="font-mono text-xs text-slate-400">{line.sku}</p>
                    </td>
                    <td className="table-cell text-sm text-slate-600">{line.variantDescription || '—'}</td>
                    <td className="table-cell text-center tabular-nums text-slate-600">{line.onPO ? line.expectedQty : '—'}</td>
                    <td className="table-cell text-center tabular-nums text-slate-600">{line.onPO ? line.previouslyReceived : '—'}</td>
                    <td className="table-cell text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => updateQty(i, line.quantity - 1)} className="h-7 w-7 rounded bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center text-sm font-bold">−</button>
                        <input type="number" min={1} value={line.quantity} onChange={(e) => updateQty(i, parseInt(e.target.value) || 0)} className="w-14 rounded border border-slate-200 px-2 py-1 text-center text-sm font-semibold tabular-nums focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/20" />
                        <button onClick={() => updateQty(i, line.quantity + 1)} className="h-7 w-7 rounded bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center text-sm font-bold">+</button>
                      </div>
                    </td>
                    <td className="table-cell text-center">
                      {line.onPO ? <span className="badge-success">Yes</span> : <span className="bg-amber-50 text-amber-700 ring-1 ring-amber-600/10 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold">No</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {lines.length > 0 && (
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Notes</label>
            <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Receiving notes..." className="input-field" />
          </div>
          <button onClick={handleSubmit} disabled={receiveAgainstPO.isPending} className="btn-primary !py-3 !px-8">
            {receiveAgainstPO.isPending ? 'Submitting...' : `Receive ${totalUnits} unit${totalUnits !== 1 ? 's' : ''}`}
          </button>
        </div>
      )}
    </div>
  );
}
