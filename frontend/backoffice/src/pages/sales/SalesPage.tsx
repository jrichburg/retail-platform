import { Link } from 'react-router-dom';
import { useSales } from '@/hooks/use-sales';
import { ShoppingCart, ArrowRight, Receipt } from 'lucide-react';

export function SalesPage() {
  const { data, isLoading } = useSales();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Sales</h1>
        <p className="mt-1 text-sm text-slate-500">Transaction history across all registers</p>
      </div>

      <div className="card">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-amber-500" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="table-header">Transaction</th>
                  <th className="table-header">Date</th>
                  <th className="table-header text-center">Items</th>
                  <th className="table-header text-right">Total</th>
                  <th className="table-header text-center">Payment</th>
                  <th className="table-header text-center">Status</th>
                  <th className="table-header w-16"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {data?.items.map((sale) => (
                  <tr key={sale.id} className="group transition-colors hover:bg-amber-50/30">
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-400 group-hover:bg-amber-100 group-hover:text-amber-600 transition-colors">
                          <Receipt className="h-4 w-4" />
                        </div>
                        <span className="font-mono text-sm font-medium text-slate-900">{sale.transactionNumber}</span>
                      </div>
                    </td>
                    <td className="table-cell text-slate-500">
                      {new Date(sale.transactionDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      <p className="text-xs text-slate-400">{new Date(sale.transactionDate).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</p>
                    </td>
                    <td className="table-cell text-center tabular-nums text-slate-600">{sale.lineItems.length}</td>
                    <td className="table-cell text-right font-semibold tabular-nums text-slate-900">${sale.totalAmount.toFixed(2)}</td>
                    <td className="table-cell text-center">
                      <span className="badge-neutral capitalize">{sale.tenders[0]?.tenderType || '—'}</span>
                    </td>
                    <td className="table-cell text-center">
                      <span className={sale.status === 'completed' ? 'badge-success' : 'badge-danger'}>{sale.status}</span>
                    </td>
                    <td className="table-cell">
                      <Link to={`/sales/${sale.id}`} className="btn-ghost !p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
                {data?.items.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-16 text-center">
                      <ShoppingCart className="mx-auto h-8 w-8 text-slate-300" />
                      <p className="mt-3 text-sm font-medium text-slate-500">No transactions yet</p>
                      <p className="mt-1 text-xs text-slate-400">Ring up sales from the POS to see them here</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
