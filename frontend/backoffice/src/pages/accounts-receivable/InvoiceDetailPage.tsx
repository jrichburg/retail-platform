import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useInvoice, useVoidInvoice } from '@/hooks/use-accounts-receivable';
import { RecordPaymentModal } from './RecordPaymentModal';
import { ArrowLeft, FileText, DollarSign, XCircle, CreditCard } from 'lucide-react';

const statusStyles: Record<string, string> = {
  open: 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/10 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide',
  partial: 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/10 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide',
  paid: 'badge-success',
  void: 'badge-neutral',
};

const sourceLabels: Record<string, string> = {
  sale: 'Sale',
  work_order: 'Work Order',
  manual: 'Manual',
};

const methodLabels: Record<string, string> = {
  cash: 'Cash',
  card: 'Card',
  check: 'Check',
  other: 'Other',
};

export function InvoiceDetailPage() {
  const { id } = useParams();
  const { data: inv, isLoading } = useInvoice(id || '');
  const voidInvoice = useVoidInvoice();
  const [showPayment, setShowPayment] = useState(false);

  if (isLoading) return <div className="flex items-center justify-center py-20"><div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-amber-500" /></div>;
  if (!inv) return <div className="text-center py-20"><p className="text-sm text-red-600">Invoice not found.</p></div>;

  const sourceLink = inv.sourceType === 'work_order' && inv.sourceId ? `/work-orders/${inv.sourceId}`
    : inv.sourceType === 'sale' && inv.sourceId ? `/sales/${inv.sourceId}` : null;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link to="/ar/invoices" className="btn-ghost !px-0 mb-4 text-slate-500 hover:text-slate-700">
          <ArrowLeft className="h-4 w-4" /> Back to invoices
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
            <FileText className="h-5 w-5 text-slate-500" />
          </div>
          <div>
            <h1 className="page-title">{inv.invoiceNumber}</h1>
            <p className="text-sm text-slate-500">
              {inv.customerName} · {new Date(inv.invoiceDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          <span className={`ml-auto ${statusStyles[inv.status] || 'badge-neutral'}`}>{inv.status}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {(inv.status === 'open' || inv.status === 'partial') && (
          <button onClick={() => setShowPayment(true)} className="btn-primary"><DollarSign className="h-4 w-4" /> Record Payment</button>
        )}
        {inv.status === 'open' && inv.amountPaid === 0 && (
          <button onClick={() => voidInvoice.mutate(inv.id)} className="btn-ghost text-red-500 hover:text-red-700"><XCircle className="h-4 w-4" /> Void Invoice</button>
        )}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Amount', value: `$${inv.amount.toFixed(2)}` },
          { label: 'Paid', value: `$${inv.amountPaid.toFixed(2)}` },
          { label: 'Balance Due', value: `$${inv.balanceDue.toFixed(2)}` },
          { label: 'Due Date', value: new Date(inv.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) },
        ].map(kpi => (
          <div key={kpi.label} className="card p-4">
            <p className="section-label">{kpi.label}</p>
            <p className="mt-1 text-xl font-semibold text-slate-900">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Source Info */}
      {inv.sourceType && (
        <div className="card p-5">
          <h3 className="section-label mb-2">Source</h3>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-700">{sourceLabels[inv.sourceType] || inv.sourceType}</span>
            {inv.sourceReference && (
              sourceLink ? (
                <Link to={sourceLink} className="font-mono text-amber-600 hover:text-amber-700">{inv.sourceReference}</Link>
              ) : (
                <span className="font-mono text-slate-500">{inv.sourceReference}</span>
              )
            )}
          </div>
        </div>
      )}

      {/* Payments */}
      <div className="card overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/50 px-5 py-3">
          <h3 className="section-label">Payment History</h3>
        </div>
        {inv.payments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CreditCard className="h-8 w-8 text-slate-300 mb-3" />
            <p className="text-sm font-medium text-slate-500">No payments recorded</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="table-header">Payment #</th>
                  <th className="table-header">Date</th>
                  <th className="table-header">Method</th>
                  <th className="table-header">Reference</th>
                  <th className="table-header text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {inv.payments.map(pmt => (
                  <tr key={pmt.id}>
                    <td className="table-cell font-mono text-sm font-medium text-slate-900">{pmt.paymentNumber}</td>
                    <td className="table-cell text-sm text-slate-500">{new Date(pmt.paymentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td className="table-cell text-sm text-slate-600">{methodLabels[pmt.paymentMethod] || pmt.paymentMethod}</td>
                    <td className="table-cell text-sm text-slate-500">{pmt.reference || '\u2014'}</td>
                    <td className="table-cell text-right tabular-nums font-semibold text-emerald-700">${pmt.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {inv.notes && (
        <div className="card p-4">
          <p className="section-label mb-1">Notes</p>
          <p className="text-sm text-slate-700">{inv.notes}</p>
        </div>
      )}

      {showPayment && (
        <RecordPaymentModal invoiceId={inv.id} balanceDue={inv.balanceDue} onClose={() => setShowPayment(false)} />
      )}
    </div>
  );
}
