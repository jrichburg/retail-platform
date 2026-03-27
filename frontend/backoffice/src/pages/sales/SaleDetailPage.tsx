import { useParams, Link } from 'react-router-dom';
import { useSale } from '@/hooks/use-sales';
import { ArrowLeft, Receipt, CreditCard, Banknote, CheckCircle2, XCircle } from 'lucide-react';

export function SaleDetailPage() {
  const { id } = useParams();
  const { data: sale, isLoading } = useSale(id || '');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-amber-500" />
      </div>
    );
  }

  if (!sale) {
    return (
      <div className="text-center py-20">
        <p className="text-sm text-red-600">Transaction not found.</p>
        <Link to="/sales" className="btn-ghost mt-4 inline-flex">Back to sales</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link to="/sales" className="btn-ghost !px-0 mb-4 text-slate-500 hover:text-slate-700">
          <ArrowLeft className="h-4 w-4" /> Back to sales
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
            <Receipt className="h-5 w-5 text-slate-500" />
          </div>
          <div>
            <h1 className="page-title">{sale.transactionNumber}</h1>
            <p className="text-sm text-slate-500">
              {new Date(sale.transactionDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
            </p>
          </div>
          <span className={`ml-auto ${sale.status === 'completed' ? 'badge-success' : 'badge-danger'}`}>
            {sale.status === 'completed' ? <CheckCircle2 className="mr-1 h-3 w-3" /> : <XCircle className="mr-1 h-3 w-3" />}
            {sale.status}
          </span>
        </div>
      </div>

      {/* Line Items */}
      <div className="card overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/50 px-5 py-3">
          <h3 className="section-label">Items</h3>
        </div>
        <div className="divide-y divide-slate-50">
          {sale.lineItems.map((item, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-sm font-medium text-slate-900">{item.productName}</p>
                <p className="font-mono text-xs text-slate-400">{item.sku}</p>
              </div>
              <div className="text-right">
                <p className="text-sm tabular-nums text-slate-900">${item.lineTotal.toFixed(2)}</p>
                <p className="text-xs text-slate-400">{item.quantity} × ${item.unitPrice.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="card p-5 space-y-3">
        <h3 className="section-label">Summary</h3>
        <div className="space-y-2 pt-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Subtotal</span>
            <span className="tabular-nums text-slate-700">${sale.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Tax ({(sale.taxRate * 100).toFixed(1)}%)</span>
            <span className="tabular-nums text-slate-700">${sale.taxAmount.toFixed(2)}</span>
          </div>
          <div className="border-t border-slate-100 pt-2 flex justify-between">
            <span className="text-base font-semibold text-slate-900">Total</span>
            <span className="text-base font-semibold tabular-nums text-slate-900">${sale.totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Tenders */}
      <div className="card p-5 space-y-3">
        <h3 className="section-label">Payment</h3>
        <div className="space-y-3 pt-2">
          {sale.tenders.map((tender, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${tender.tenderType === 'card' ? 'bg-blue-50' : 'bg-emerald-50'}`}>
                  {tender.tenderType === 'card' ? <CreditCard className="h-4 w-4 text-blue-500" /> : <Banknote className="h-4 w-4 text-emerald-500" />}
                </div>
                <div>
                  <p className="text-sm font-medium capitalize text-slate-900">{tender.tenderType}</p>
                  {tender.paymentReference && <p className="text-xs text-slate-400">Ref: {tender.paymentReference}</p>}
                </div>
              </div>
              <span className="text-sm font-semibold tabular-nums text-slate-900">${tender.amount.toFixed(2)}</span>
            </div>
          ))}
          {sale.changeAmount > 0 && (
            <div className="flex justify-between border-t border-slate-100 pt-2 text-sm">
              <span className="text-slate-500">Change</span>
              <span className="tabular-nums font-medium text-slate-700">${sale.changeAmount.toFixed(2)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
