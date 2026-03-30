import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSuppliers } from '@/hooks/use-suppliers';
import { useProducts } from '@/hooks/use-products';
import { useCreatePurchaseOrder } from '@/hooks/use-purchase-orders';
import { ArrowLeft, Plus, Trash2, Search, Package, X } from 'lucide-react';

interface POLine {
  productId: string;
  productVariantId: string | null;
  productName: string;
  sku: string;
  variantDescription: string | null;
  quantityOrdered: number;
  unitCost: number;
}

export function PurchaseOrderFormPage() {
  const navigate = useNavigate();
  const { data: suppliers } = useSuppliers();
  const createPO = useCreatePurchaseOrder();

  const [supplierId, setSupplierId] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [notes, setNotes] = useState('');
  const [expectedDate, setExpectedDate] = useState('');
  const [lines, setLines] = useState<POLine[]>([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const { data: searchResults } = useProducts({ search: productSearch || undefined, pageSize: 8 });

  const totalCost = lines.reduce((sum, l) => sum + l.quantityOrdered * l.unitCost, 0);

  const handleSupplierChange = (id: string) => {
    setSupplierId(id);
    const sup = suppliers?.find(s => s.id === id);
    setSupplierName(sup?.name || '');
  };

  const addProduct = (product: any, variant?: any) => {
    const variantDesc = variant ? [variant.dimension1Value, variant.dimension2Value].filter(Boolean).join(' / ') : null;
    setLines([...lines, {
      productId: product.id,
      productVariantId: variant?.id || null,
      productName: product.name,
      sku: product.sku,
      variantDescription: variantDesc,
      quantityOrdered: 1,
      unitCost: product.costPrice || 0,
    }]);
    setShowAddProduct(false);
    setProductSearch('');
  };

  const updateLine = (index: number, field: 'quantityOrdered' | 'unitCost', value: number) => {
    const updated = [...lines];
    updated[index] = { ...updated[index], [field]: value };
    setLines(updated);
  };

  const removeLine = (index: number) => setLines(lines.filter((_, i) => i !== index));

  const handleSubmit = async () => {
    await createPO.mutateAsync({
      supplierId,
      supplierName,
      notes: notes || null,
      expectedDate: expectedDate || null,
      lines,
    });
    navigate('/inventory/purchase-orders');
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <button onClick={() => navigate('/inventory/purchase-orders')} className="btn-ghost !px-0 mb-4 text-slate-500 hover:text-slate-700">
          <ArrowLeft className="h-4 w-4" /> Back to purchase orders
        </button>
        <h1 className="page-title">New Purchase Order</h1>
      </div>

      {/* Header */}
      <div className="card p-6 space-y-5">
        <h3 className="section-label">Order Details</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Supplier</label>
            <select value={supplierId} onChange={(e) => handleSupplierChange(e.target.value)} className="input-field">
              <option value="">Select supplier...</option>
              {suppliers?.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Expected Date</label>
            <input type="date" value={expectedDate} onChange={(e) => setExpectedDate(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Notes</label>
            <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional" className="input-field" />
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="card">
        <div className="border-b border-slate-100 px-5 py-3 flex items-center justify-between">
          <h3 className="section-label">Line Items</h3>
          <button onClick={() => setShowAddProduct(true)} className="btn-secondary text-xs"><Plus className="h-3.5 w-3.5" /> Add product</button>
        </div>

        {showAddProduct && (
          <div className="border-b border-amber-200 bg-amber-50/30 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-slate-700">Add Product</span>
              <button onClick={() => { setShowAddProduct(false); setProductSearch(''); }} className="btn-ghost !p-1"><X className="h-4 w-4" /></button>
            </div>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input type="text" value={productSearch} onChange={(e) => setProductSearch(e.target.value)} placeholder="Search by name or SKU..." autoFocus className="input-field !pl-10" />
            </div>
            {searchResults?.items && productSearch && (
              <div className="max-h-48 overflow-y-auto space-y-1">
                {searchResults.items.map(product => (
                  <div key={product.id} className="rounded-lg border border-slate-200 bg-white p-3">
                    <p className="text-sm font-medium text-slate-900">{product.name} <span className="font-mono text-xs text-slate-400">{product.sku}</span></p>
                    {product.variants && product.variants.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {product.variants.map(v => (
                          <button key={v.id} onClick={() => addProduct(product, v)} className="rounded bg-slate-100 px-2.5 py-1 text-xs font-mono text-slate-700 hover:bg-amber-100 hover:text-amber-700 transition-colors">
                            {[v.dimension1Value, v.dimension2Value].filter(Boolean).join(' / ')}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <button onClick={() => addProduct(product)} className="btn-ghost text-xs mt-1"><Plus className="h-3 w-3" /> Add</button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {lines.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Package className="h-8 w-8 text-slate-300 mb-3" />
            <p className="text-sm font-medium text-slate-500">No items yet</p>
            <p className="mt-1 text-xs text-slate-400">Add products to this purchase order</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="table-header">Product</th>
                  <th className="table-header">Size / Width</th>
                  <th className="table-header text-center w-28">Qty</th>
                  <th className="table-header text-right w-32">Unit Cost</th>
                  <th className="table-header text-right w-28">Line Total</th>
                  <th className="table-header w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {lines.map((line, i) => (
                  <tr key={i}>
                    <td className="table-cell">
                      <p className="font-medium text-slate-900">{line.productName}</p>
                      <p className="font-mono text-xs text-slate-400">{line.sku}</p>
                    </td>
                    <td className="table-cell text-sm text-slate-600">{line.variantDescription || '\u2014'}</td>
                    <td className="table-cell text-center">
                      <input type="number" min={1} value={line.quantityOrdered} onChange={(e) => updateLine(i, 'quantityOrdered', parseInt(e.target.value) || 1)} className="w-20 rounded border border-slate-200 px-2 py-1 text-center text-sm tabular-nums focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/20" />
                    </td>
                    <td className="table-cell text-right">
                      <div className="relative inline-block">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-slate-400">$</span>
                        <input type="number" step="0.01" min={0} value={line.unitCost} onChange={(e) => updateLine(i, 'unitCost', parseFloat(e.target.value) || 0)} className="w-24 rounded border border-slate-200 pl-5 pr-2 py-1 text-right text-sm tabular-nums focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/20" />
                      </div>
                    </td>
                    <td className="table-cell text-right font-semibold tabular-nums text-slate-900">${(line.quantityOrdered * line.unitCost).toFixed(2)}</td>
                    <td className="table-cell"><button onClick={() => removeLine(i)} className="text-slate-300 hover:text-red-500"><Trash2 className="h-4 w-4" /></button></td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-slate-200">
                  <td colSpan={4} className="px-4 py-3 text-right text-sm font-medium text-slate-500">Total Cost</td>
                  <td className="px-4 py-3 text-right text-base font-bold tabular-nums text-slate-900">${totalCost.toFixed(2)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <button onClick={() => navigate('/inventory/purchase-orders')} className="btn-secondary">Cancel</button>
        <button onClick={handleSubmit} disabled={!supplierId || lines.length === 0 || createPO.isPending} className="btn-primary">
          {createPO.isPending ? 'Creating...' : 'Create PO (Draft)'}
        </button>
      </div>
    </div>
  );
}
