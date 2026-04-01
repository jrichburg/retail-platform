import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWorkOrders } from '@/hooks/use-work-orders';
import { Plus, ClipboardList, ArrowRight } from 'lucide-react';

const statusTabs = [
  { value: '', label: 'All' },
  { value: 'draft', label: 'Draft' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'picked_up', label: 'Picked Up' },
];

const statusStyles: Record<string, string> = {
  draft: 'badge-neutral',
  submitted: 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/10 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide',
  in_progress: 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/10 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide',
  completed: 'badge-success',
  picked_up: 'badge-neutral',
};

export function WorkOrdersPage() {
  const [status, setStatus] = useState('');
  const { data, isLoading } = useWorkOrders({ status: status || undefined });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Work Orders</h1>
          <p className="mt-1 text-sm text-slate-500">Manage uniform customization and alteration orders</p>
        </div>
        <Link to="/work-orders/new" className="btn-primary"><Plus className="h-4 w-4" /> New Work Order</Link>
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
                  <th className="table-header">WO #</th>
                  <th className="table-header">Customer</th>
                  <th className="table-header">Due Date</th>
                  <th className="table-header text-center">Lines</th>
                  <th className="table-header text-right">Total</th>
                  <th className="table-header text-center">Status</th>
                  <th className="table-header w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {data?.items.map(wo => (
                  <tr key={wo.id} className="group transition-colors hover:bg-amber-50/30">
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-400 group-hover:bg-amber-100 group-hover:text-amber-600 transition-colors">
                          <ClipboardList className="h-4 w-4" />
                        </div>
                        <span className="font-mono text-sm font-medium text-slate-900">{wo.orderNumber}</span>
                      </div>
                    </td>
                    <td className="table-cell text-sm text-slate-700">{wo.customerName}</td>
                    <td className="table-cell text-sm text-slate-500">{wo.dueDate ? new Date(wo.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '\u2014'}</td>
                    <td className="table-cell text-center tabular-nums text-slate-600">{wo.lineCount}</td>
                    <td className="table-cell text-right tabular-nums font-semibold text-slate-900">${wo.totalAmount.toFixed(2)}</td>
                    <td className="table-cell text-center"><span className={statusStyles[wo.status] || 'badge-neutral'}>{wo.status.replace(/_/g, ' ')}</span></td>
                    <td className="table-cell">
                      <Link to={`/work-orders/${wo.id}`} className="btn-ghost !p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"><ArrowRight className="h-4 w-4" /></Link>
                    </td>
                  </tr>
                ))}
                {data?.items.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-16 text-center">
                    <ClipboardList className="mx-auto h-8 w-8 text-slate-300" />
                    <p className="mt-3 text-sm font-medium text-slate-500">No work orders</p>
                    <Link to="/work-orders/new" className="btn-primary mt-4 inline-flex"><Plus className="h-4 w-4" /> Create Work Order</Link>
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
