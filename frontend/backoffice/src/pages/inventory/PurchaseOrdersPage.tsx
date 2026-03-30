import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePurchaseOrders } from '@/hooks/use-purchase-orders';
import { Plus, FileText, ArrowRight } from 'lucide-react';

const statusTabs = [
  { value: '', label: 'All' },
  { value: 'draft', label: 'Draft' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'partially_received', label: 'Partial' },
  { value: 'fully_received', label: 'Received' },
  { value: 'closed', label: 'Closed' },
];

const statusStyles: Record<string, string> = {
  draft: 'badge-neutral',
  submitted: 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/10 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide',
  partially_received: 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/10 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide',
  fully_received: 'badge-success',
  closed: 'badge-neutral',
};

export function PurchaseOrdersPage() {
  const [status, setStatus] = useState('');
  const { data, isLoading } = usePurchaseOrders({ status: status || undefined });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Purchase Orders</h1>
          <p className="mt-1 text-sm text-slate-500">Manage vendor purchase orders</p>
        </div>
        <Link to="/inventory/purchase-orders/new" className="btn-primary"><Plus className="h-4 w-4" /> New PO</Link>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 border-b border-slate-200">
        {statusTabs.map(tab => (
          <button
            key={tab.value}
            onClick={() => setStatus(tab.value)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              status === tab.value ? 'border-amber-500 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="card">
        {isLoading ? (
          <div className="flex items-center justify-center py-20"><div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-amber-500" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="table-header">PO #</th>
                  <th className="table-header">Supplier</th>
                  <th className="table-header">Expected</th>
                  <th className="table-header text-center">Lines</th>
                  <th className="table-header text-right">Ordered</th>
                  <th className="table-header text-right">Received</th>
                  <th className="table-header text-right">Cost</th>
                  <th className="table-header text-center">Status</th>
                  <th className="table-header w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {data?.items.map(po => (
                  <tr key={po.id} className="group transition-colors hover:bg-amber-50/30">
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-400 group-hover:bg-amber-100 group-hover:text-amber-600 transition-colors">
                          <FileText className="h-4 w-4" />
                        </div>
                        <span className="font-mono text-sm font-medium text-slate-900">{po.orderNumber}</span>
                      </div>
                    </td>
                    <td className="table-cell text-sm text-slate-700">{po.supplierName}</td>
                    <td className="table-cell text-sm text-slate-500">{po.expectedDate ? new Date(po.expectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '\u2014'}</td>
                    <td className="table-cell text-center tabular-nums text-slate-600">{po.lineCount}</td>
                    <td className="table-cell text-right tabular-nums text-slate-600">{po.totalUnitsOrdered}</td>
                    <td className="table-cell text-right tabular-nums font-medium text-slate-900">{po.totalUnitsReceived}</td>
                    <td className="table-cell text-right tabular-nums font-semibold text-slate-900">${po.totalCost.toFixed(2)}</td>
                    <td className="table-cell text-center"><span className={statusStyles[po.status] || 'badge-neutral'}>{po.status.replace('_', ' ')}</span></td>
                    <td className="table-cell">
                      <Link to={`/inventory/purchase-orders/${po.id}`} className="btn-ghost !p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"><ArrowRight className="h-4 w-4" /></Link>
                    </td>
                  </tr>
                ))}
                {data?.items.length === 0 && (
                  <tr><td colSpan={9} className="px-4 py-16 text-center">
                    <FileText className="mx-auto h-8 w-8 text-slate-300" />
                    <p className="mt-3 text-sm font-medium text-slate-500">No purchase orders</p>
                    <Link to="/inventory/purchase-orders/new" className="btn-primary mt-4 inline-flex"><Plus className="h-4 w-4" /> Create PO</Link>
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
