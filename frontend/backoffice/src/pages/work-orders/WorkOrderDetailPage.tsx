import { useParams, Link } from 'react-router-dom';
import { useWorkOrder, useSubmitWorkOrder, useStartWorkOrder, useCompleteWorkOrder, usePickupWorkOrder } from '@/hooks/use-work-orders';
import { ArrowLeft, ClipboardList, Send, Play, CheckCircle2, PackageCheck, User, Phone, Mail, Calendar } from 'lucide-react';

const statusStyles: Record<string, string> = {
  draft: 'badge-neutral',
  submitted: 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/10 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide',
  in_progress: 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/10 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide',
  completed: 'badge-success',
  picked_up: 'badge-neutral',
};

export function WorkOrderDetailPage() {
  const { id } = useParams();
  const { data: wo, isLoading } = useWorkOrder(id || '');
  const submitWO = useSubmitWorkOrder();
  const startWO = useStartWorkOrder();
  const completeWO = useCompleteWorkOrder();
  const pickupWO = usePickupWorkOrder();

  if (isLoading) return <div className="flex items-center justify-center py-20"><div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-amber-500" /></div>;
  if (!wo) return <div className="text-center py-20"><p className="text-sm text-red-600">Work order not found.</p></div>;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link to="/work-orders" className="btn-ghost !px-0 mb-4 text-slate-500 hover:text-slate-700">
          <ArrowLeft className="h-4 w-4" /> Back to work orders
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
            <ClipboardList className="h-5 w-5 text-slate-500" />
          </div>
          <div>
            <h1 className="page-title">{wo.orderNumber}</h1>
            <p className="text-sm text-slate-500">{wo.customerName} · {new Date(wo.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>
          <span className={`ml-auto ${statusStyles[wo.status] || 'badge-neutral'}`}>{wo.status.replace(/_/g, ' ')}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {wo.status === 'draft' && (
          <>
            <Link to={`/work-orders/${wo.id}/edit`} className="btn-secondary">Edit</Link>
            <button onClick={() => submitWO.mutate(wo.id)} className="btn-primary"><Send className="h-4 w-4" /> Submit</button>
          </>
        )}
        {wo.status === 'submitted' && (
          <button onClick={() => startWO.mutate(wo.id)} className="btn-primary"><Play className="h-4 w-4" /> Start Work</button>
        )}
        {wo.status === 'in_progress' && (
          <button onClick={() => completeWO.mutate(wo.id)} className="btn-primary"><CheckCircle2 className="h-4 w-4" /> Mark Complete</button>
        )}
        {wo.status === 'completed' && (
          <button onClick={() => pickupWO.mutate(wo.id)} className="btn-primary"><PackageCheck className="h-4 w-4" /> Mark Picked Up</button>
        )}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Amount', value: `$${wo.totalAmount.toFixed(2)}` },
          { label: 'Line Items', value: wo.lines.length.toString() },
          { label: 'Due Date', value: wo.dueDate ? new Date(wo.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '\u2014' },
          { label: 'Status', value: wo.status.replace(/_/g, ' ') },
        ].map(kpi => (
          <div key={kpi.label} className="card p-4">
            <p className="section-label">{kpi.label}</p>
            <p className="mt-1 text-xl font-semibold text-slate-900 capitalize">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Customer Info */}
      <div className="card p-5">
        <h3 className="section-label mb-3">Customer</h3>
        <div className="flex gap-8">
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <User className="h-4 w-4 text-slate-400" />
            {wo.customerName}
          </div>
          {wo.customerPhone && (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Phone className="h-4 w-4 text-slate-400" />
              {wo.customerPhone}
            </div>
          )}
          {wo.customerEmail && (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Mail className="h-4 w-4 text-slate-400" />
              {wo.customerEmail}
            </div>
          )}
        </div>
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
                <th className="table-header">Description</th>
                <th className="table-header">Product</th>
                <th className="table-header text-right">Qty</th>
                <th className="table-header text-right">Unit Price</th>
                <th className="table-header text-right">Line Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {wo.lines.map(line => (
                <tr key={line.id}>
                  <td className="table-cell">
                    <p className="font-medium text-slate-900">{line.description}</p>
                  </td>
                  <td className="table-cell text-sm text-slate-500">
                    {line.productName ? (
                      <div>
                        <p>{line.productName}</p>
                        {line.sku && <p className="font-mono text-xs text-slate-400">{line.sku}</p>}
                      </div>
                    ) : '\u2014'}
                  </td>
                  <td className="table-cell text-right tabular-nums text-slate-600">{line.quantity}</td>
                  <td className="table-cell text-right tabular-nums text-slate-600">${line.unitPrice.toFixed(2)}</td>
                  <td className="table-cell text-right tabular-nums font-semibold text-slate-900">${line.lineTotal.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-slate-200">
                <td colSpan={4} className="px-4 py-3 text-right text-sm font-medium text-slate-500">Total</td>
                <td className="px-4 py-3 text-right text-base font-bold tabular-nums text-slate-900">${wo.totalAmount.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {wo.notes && (
        <div className="card p-4">
          <p className="section-label mb-1">Notes</p>
          <p className="text-sm text-slate-700">{wo.notes}</p>
        </div>
      )}
    </div>
  );
}
