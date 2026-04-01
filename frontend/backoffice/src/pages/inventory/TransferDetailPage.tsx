import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTransfer, useSubmitTransfer, useCompleteTransfer, useCancelTransfer } from '@/hooks/use-transfers';
import { ArrowLeft, ArrowRightLeft, ChevronRight, Package, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

function StatusBanner({ status, sourceStore, destStore }: { status: string; sourceStore: string; destStore: string }) {
  if (status === 'completed') return (
    <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
      <div>
        <p className="text-sm font-medium text-green-800">Transfer completed</p>
        <p className="text-xs text-green-600">Stock has been received at {destStore}</p>
      </div>
    </div>
  );
  if (status === 'cancelled') return (
    <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
      <XCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
      <p className="text-sm font-medium text-red-700">Transfer cancelled</p>
    </div>
  );
  if (status === 'in_transit') return (
    <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
      <ArrowRightLeft className="h-5 w-5 text-amber-500 flex-shrink-0" />
      <div>
        <p className="text-sm font-medium text-amber-800">In transit</p>
        <p className="text-xs text-amber-600">Stock has been removed from {sourceStore} — confirm receipt at {destStore}</p>
      </div>
    </div>
  );
  return null;
}

export function TransferDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: transfer, isLoading } = useTransfer(id || '');
  const submit = useSubmitTransfer();
  const complete = useCompleteTransfer();
  const cancel = useCancelTransfer();

  const [confirmAction, setConfirmAction] = useState<'submit' | 'complete' | 'cancel' | null>(null);

  if (isLoading) return (
    <div className="flex items-center justify-center py-20">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-amber-500" />
    </div>
  );
  if (!transfer) return (
    <div className="text-center py-20"><p className="text-sm text-red-600">Transfer not found.</p></div>
  );

  const isBusy = submit.isPending || complete.isPending || cancel.isPending;

  const handleAction = async (action: 'submit' | 'complete' | 'cancel') => {
    if (action === 'submit') await submit.mutateAsync(transfer.id);
    if (action === 'complete') await complete.mutateAsync(transfer.id);
    if (action === 'cancel') await cancel.mutateAsync(transfer.id);
    setConfirmAction(null);
    navigate('/inventory/transfers');
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Back */}
      <Link to="/inventory/transfers" className="btn-ghost !px-0 text-slate-500 hover:text-slate-700">
        <ArrowLeft className="h-4 w-4" /> Back to transfers
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <ArrowRightLeft className="h-5 w-5 text-slate-400" />
            <h1 className="page-title">{transfer.documentNumber}</h1>
            {transfer.status === 'draft' && <span className="badge-neutral">Draft</span>}
            {transfer.status === 'in_transit' && <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-700">In Transit</span>}
            {transfer.status === 'completed' && <span className="badge-success">Completed</span>}
            {transfer.status === 'cancelled' && <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-medium text-red-600">Cancelled</span>}
          </div>
          <div className="flex items-center gap-1.5 text-sm text-slate-500">
            <span>{transfer.sourceStoreName}</span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
            <span>{transfer.destinationStoreName}</span>
            <span className="text-slate-300">·</span>
            <span>{new Date(transfer.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {transfer.status === 'draft' && (
            <>
              <button className="btn-ghost text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => setConfirmAction('cancel')}>Cancel</button>
              <button className="btn-primary" onClick={() => setConfirmAction('submit')}>Submit Transfer</button>
            </>
          )}
          {transfer.status === 'in_transit' && (
            <>
              <button className="btn-ghost text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => setConfirmAction('cancel')}>Cancel</button>
              <button className="btn-primary !bg-green-600 hover:!bg-green-700" onClick={() => setConfirmAction('complete')}>Mark as Received</button>
            </>
          )}
        </div>
      </div>

      {/* Status banner */}
      <StatusBanner status={transfer.status} sourceStore={transfer.sourceStoreName} destStore={transfer.destinationStoreName} />

      {/* Confirmation inline */}
      {confirmAction && (
        <div className={`rounded-lg border px-4 py-4 space-y-3 ${
          confirmAction === 'cancel' ? 'border-red-200 bg-red-50' : 'border-amber-200 bg-amber-50'
        }`}>
          <div className="flex items-start gap-2">
            <AlertTriangle className={`h-4 w-4 mt-0.5 flex-shrink-0 ${confirmAction === 'cancel' ? 'text-red-500' : 'text-amber-500'}`} />
            <div>
              {confirmAction === 'submit' && (
                <p className="text-sm font-medium text-amber-800">Submit this transfer? Stock will be removed from <strong>{transfer.sourceStoreName}</strong> immediately.</p>
              )}
              {confirmAction === 'complete' && (
                <p className="text-sm font-medium text-amber-800">Mark as received? Stock will be added to <strong>{transfer.destinationStoreName}</strong>.</p>
              )}
              {confirmAction === 'cancel' && (
                <p className="text-sm font-medium text-red-800">
                  Cancel this transfer?
                  {transfer.status === 'in_transit' && ' Stock will be restored at the source store.'}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button className="btn-ghost" onClick={() => setConfirmAction(null)} disabled={isBusy}>Back</button>
            <button
              className={confirmAction === 'cancel' ? 'btn-danger' : 'btn-primary'}
              onClick={() => handleAction(confirmAction)}
              disabled={isBusy}
            >
              {isBusy ? 'Processing…' : 'Confirm'}
            </button>
          </div>
        </div>
      )}

      {/* Notes */}
      {transfer.notes && (
        <div className="card p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400 mb-1">Notes</p>
          <p className="text-sm text-slate-700">{transfer.notes}</p>
        </div>
      )}

      {/* Lines */}
      <div className="card">
        <div className="border-b border-slate-100 px-5 py-4 flex items-center gap-2">
          <Package className="h-4 w-4 text-slate-400" />
          <h3 className="section-label">Items</h3>
          <span className="ml-auto text-xs text-slate-400">{transfer.lines.length} line{transfer.lines.length !== 1 ? 's' : ''} · {transfer.lines.reduce((s, l) => s + l.quantity, 0)} units</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="table-header">Product</th>
                <th className="table-header">SKU</th>
                <th className="table-header">Size / Width</th>
                <th className="table-header">UPC</th>
                <th className="table-header text-right">Qty</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {transfer.lines.map(line => (
                <tr key={line.id}>
                  <td className="table-cell font-medium text-slate-900 text-sm">{line.productName}</td>
                  <td className="table-cell font-mono text-xs text-slate-500">{line.sku}</td>
                  <td className="table-cell text-sm text-slate-600">{line.variantDescription ?? '—'}</td>
                  <td className="table-cell font-mono text-xs text-slate-400">{line.upc ?? '—'}</td>
                  <td className="table-cell text-right font-semibold tabular-nums text-slate-900">{line.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
