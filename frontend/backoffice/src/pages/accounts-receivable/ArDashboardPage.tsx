import { Link } from 'react-router-dom';
import { useAgingSummary } from '@/hooks/use-accounts-receivable';
import { DollarSign, ArrowRight } from 'lucide-react';

const bucketStyles = [
  { label: 'Current', key: 'current' as const, color: 'text-emerald-700', bg: 'bg-emerald-50', ring: 'ring-emerald-600/10' },
  { label: '1-30 Days', key: 'thirtyDays' as const, color: 'text-amber-700', bg: 'bg-amber-50', ring: 'ring-amber-600/10' },
  { label: '31-60 Days', key: 'sixtyDays' as const, color: 'text-orange-700', bg: 'bg-orange-50', ring: 'ring-orange-600/10' },
  { label: '90+ Days', key: 'ninetyPlus' as const, color: 'text-red-700', bg: 'bg-red-50', ring: 'ring-red-600/10' },
];

export function ArDashboardPage() {
  const { data: aging, isLoading } = useAgingSummary();

  if (isLoading) return <div className="flex items-center justify-center py-20"><div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-amber-500" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Accounts Receivable</h1>
          <p className="mt-1 text-sm text-slate-500">Aging summary and outstanding balances</p>
        </div>
        <Link to="/ar/invoices" className="btn-secondary">View All Invoices</Link>
      </div>

      {/* Total Outstanding */}
      <div className="card p-5 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
          <DollarSign className="h-5 w-5 text-slate-500" />
        </div>
        <div>
          <p className="section-label">Total Outstanding</p>
          <p className="text-2xl font-bold text-slate-900">${aging?.totalOutstanding.toFixed(2) || '0.00'}</p>
        </div>
      </div>

      {/* Aging Buckets */}
      <div className="grid grid-cols-4 gap-4">
        {bucketStyles.map(bucket => (
          <div key={bucket.key} className={`rounded-xl ${bucket.bg} ring-1 ${bucket.ring} p-4`}>
            <p className={`text-xs font-semibold uppercase tracking-wider ${bucket.color} opacity-70`}>{bucket.label}</p>
            <p className={`mt-1 text-xl font-bold ${bucket.color}`}>${aging?.[bucket.key].toFixed(2) || '0.00'}</p>
          </div>
        ))}
      </div>

      {/* Customer Breakdown */}
      <div className="card">
        <div className="border-b border-slate-100 bg-slate-50/50 px-5 py-3">
          <h3 className="section-label">Customer Balances</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="table-header">Customer</th>
                <th className="table-header text-right">Current</th>
                <th className="table-header text-right">1-30</th>
                <th className="table-header text-right">31-60</th>
                <th className="table-header text-right">90+</th>
                <th className="table-header text-right">Total</th>
                <th className="table-header w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {aging?.customers.map(cust => (
                <tr key={cust.customerId} className="group transition-colors hover:bg-amber-50/30">
                  <td className="table-cell font-medium text-slate-900">{cust.customerName}</td>
                  <td className="table-cell text-right tabular-nums text-slate-600">{cust.current > 0 ? `$${cust.current.toFixed(2)}` : '\u2014'}</td>
                  <td className="table-cell text-right tabular-nums text-slate-600">{cust.thirtyDays > 0 ? `$${cust.thirtyDays.toFixed(2)}` : '\u2014'}</td>
                  <td className="table-cell text-right tabular-nums text-slate-600">{cust.sixtyDays > 0 ? `$${cust.sixtyDays.toFixed(2)}` : '\u2014'}</td>
                  <td className="table-cell text-right tabular-nums text-red-600 font-medium">{cust.ninetyPlus > 0 ? `$${cust.ninetyPlus.toFixed(2)}` : '\u2014'}</td>
                  <td className="table-cell text-right tabular-nums font-bold text-slate-900">${cust.totalBalance.toFixed(2)}</td>
                  <td className="table-cell">
                    <Link to={`/ar/invoices?customerId=${cust.customerId}`} className="btn-ghost !p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"><ArrowRight className="h-4 w-4" /></Link>
                  </td>
                </tr>
              ))}
              {(!aging?.customers || aging.customers.length === 0) && (
                <tr><td colSpan={7} className="px-4 py-16 text-center">
                  <DollarSign className="mx-auto h-8 w-8 text-slate-300" />
                  <p className="mt-3 text-sm font-medium text-slate-500">No outstanding balances</p>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
