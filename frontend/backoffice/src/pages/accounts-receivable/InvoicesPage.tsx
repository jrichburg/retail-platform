import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useInvoices } from '@/hooks/use-accounts-receivable';
import { Plus, FileText, ArrowRight } from 'lucide-react';

const statusTabs = [
  { value: '', label: 'All' },
  { value: 'open', label: 'Open' },
  { value: 'partial', label: 'Partial' },
  { value: 'paid', label: 'Paid' },
  { value: 'void', label: 'Void' },
];

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

export function InvoicesPage() {
  const [status, setStatus] = useState('');
  const { data, isLoading } = useInvoices({ status: status || undefined });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Invoices</h1>
          <p className="mt-1 text-sm text-slate-500">Manage customer invoices and balances</p>
        </div>
        <Link to="/ar/invoices/new" className="btn-primary"><Plus className="h-4 w-4" /> New Invoice</Link>
      </div>

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
                  <th className="table-header">Invoice #</th>
                  <th className="table-header">Customer</th>
                  <th className="table-header">Source</th>
                  <th className="table-header">Invoice Date</th>
                  <th className="table-header">Due Date</th>
                  <th className="table-header text-right">Amount</th>
                  <th className="table-header text-right">Balance Due</th>
                  <th className="table-header text-center">Status</th>
                  <th className="table-header w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {data?.items.map(inv => (
                  <tr key={inv.id} className="group transition-colors hover:bg-amber-50/30">
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-400 group-hover:bg-amber-100 group-hover:text-amber-600 transition-colors">
                          <FileText className="h-4 w-4" />
                        </div>
                        <span className="font-mono text-sm font-medium text-slate-900">{inv.invoiceNumber}</span>
                      </div>
                    </td>
                    <td className="table-cell text-sm text-slate-700">{inv.customerName}</td>
                    <td className="table-cell text-sm text-slate-500">
                      {inv.sourceType ? sourceLabels[inv.sourceType] || inv.sourceType : '\u2014'}
                      {inv.sourceReference && <span className="ml-1 font-mono text-xs text-slate-400">{inv.sourceReference}</span>}
                    </td>
                    <td className="table-cell text-sm text-slate-500">{new Date(inv.invoiceDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                    <td className="table-cell text-sm text-slate-500">{new Date(inv.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                    <td className="table-cell text-right tabular-nums text-slate-600">${inv.amount.toFixed(2)}</td>
                    <td className="table-cell text-right tabular-nums font-semibold text-slate-900">${inv.balanceDue.toFixed(2)}</td>
                    <td className="table-cell text-center"><span className={statusStyles[inv.status] || 'badge-neutral'}>{inv.status}</span></td>
                    <td className="table-cell">
                      <Link to={`/ar/invoices/${inv.id}`} className="btn-ghost !p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"><ArrowRight className="h-4 w-4" /></Link>
                    </td>
                  </tr>
                ))}
                {data?.items.length === 0 && (
                  <tr><td colSpan={9} className="px-4 py-16 text-center">
                    <FileText className="mx-auto h-8 w-8 text-slate-300" />
                    <p className="mt-3 text-sm font-medium text-slate-500">No invoices</p>
                    <Link to="/ar/invoices/new" className="btn-primary mt-4 inline-flex"><Plus className="h-4 w-4" /> Create Invoice</Link>
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
