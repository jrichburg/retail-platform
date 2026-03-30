import { useParams, Link } from 'react-router-dom';
import { usePurchaseOrder, useSubmitPurchaseOrder, useClosePurchaseOrder } from '@/hooks/use-purchase-orders';
import { ArrowLeft, FileText, Send, XCircle, Package, Truck } from 'lucide-react';

const statusStyles: Record<string, string> = {
  draft: 'badge-neutral',
  submitted: 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/10 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide',
  partially_received: 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/10 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide',
  fully_received: 'badge-success',
  closed: 'badge-neutral',
};

export function PurchaseOrderDetailPage() {
  const { id } = useParams();
  const { data: po, isLoading } = usePurchaseOrder(id || '');
  const submitPO = useSubmitPurchaseOrder();
  const closePO = useClosePurchaseOrder();

  if (isLoading) return <div className="flex items-center justify-center py-20"><div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-amber-500" /></div>;
  if (!po) return <div className="text-center py-20"><p className="text-sm text-red-600">Purchase order not found.</p></div>;

  const totalOrdered = po.lines.reduce((s, l) => s + l.quantityOrdered, 0);
  const totalReceived = po.lines.reduce((s, l) => s + l.quantityReceived, 0);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link to="/inventory/purchase-orders" className="btn-ghost !px-0 mb-4 text-slate-500 hover:text-slate-700">
          <ArrowLeft className="h-4 w-4" /> Back to purchase orders
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
            <FileText className="h-5 w-5 text-slate-500" />
          </div>
          <div>
            <h1 className="page-title">{po.orderNumber}</h1>
            <p className="text-sm text-slate-500">{po.supplierName} · {new Date(po.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>
          <span className={`ml-auto ${statusStyles[po.status] || 'badge-neutral'}`}>{po.status.replace('_', ' ')}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {po.status === 'draft' && (
          <>
            <Link to={`/inventory/purchase-orders/${po.id}/edit`} className="btn-secondary">Edit</Link>
            <button onClick={() => submitPO.mutate(po.id)} className="btn-primary"><Send className="h-4 w-4" /> Submit to Supplier</button>
          </>
        )}
        {(po.status === 'submitted' || po.status === 'partially_received') && (
          <Link to={`/inventory/purchase-orders/${po.id}/receive`} className="btn-primary"><Truck className="h-4 w-4" /> Receive</Link>
        )}
        {po.status !== 'closed' && (
          <button onClick={() => closePO.mutate(po.id)} className="btn-ghost text-red-500 hover:text-red-700"><XCircle className="h-4 w-4" /> Close</button>
        )}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Cost', value: `$${po.totalCost.toFixed(2)}` },
          { label: 'Units Ordered', value: totalOrdered.toString() },
          { label: 'Units Received', value: totalReceived.toString() },
          { label: 'Expected', value: po.expectedDate ? new Date(po.expectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '\u2014' },
        ].map(kpi => (
          <div key={kpi.label} className="card p-4">
            <p className="section-label">{kpi.label}</p>
            <p className="mt-1 text-xl font-semibold text-slate-900">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Lines */}
      <div className="card overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/50 px-5 py-3">
          <h3 className="section-label">Line Items</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="table-header">Product</th>
                <th className="table-header">Size / Width</th>
                <th className="table-header text-right">Ordered</th>
                <th className="table-header text-right">Received</th>
                <th className="table-header text-right">Remaining</th>
                <th className="table-header text-right">Unit Cost</th>
                <th className="table-header text-right">Line Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {po.lines.map(line => {
                const remaining = line.quantityOrdered - line.quantityReceived;
                return (
                  <tr key={line.id}>
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <Package className="h-4 w-4 text-slate-400" />
                        <div>
                          <p className="font-medium text-slate-900">{line.productName}</p>
                          <p className="font-mono text-xs text-slate-400">{line.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell text-sm text-slate-600">{line.variantDescription || '\u2014'}</td>
                    <td className="table-cell text-right tabular-nums text-slate-600">{line.quantityOrdered}</td>
                    <td className="table-cell text-right tabular-nums font-medium text-slate-900">{line.quantityReceived}</td>
                    <td className="table-cell text-right">
                      <span className={`tabular-nums font-medium ${remaining > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>{remaining}</span>
                    </td>
                    <td className="table-cell text-right tabular-nums text-slate-600">${line.unitCost.toFixed(2)}</td>
                    <td className="table-cell text-right tabular-nums font-semibold text-slate-900">${line.lineCost.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {po.notes && (
        <div className="card p-4">
          <p className="section-label mb-1">Notes</p>
          <p className="text-sm text-slate-700">{po.notes}</p>
        </div>
      )}
    </div>
  );
}
