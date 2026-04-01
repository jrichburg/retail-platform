import { useParams, Link } from 'react-router-dom';
import { useCustomer } from '@/hooks/use-customers';
import { useSales } from '@/hooks/use-sales';
import { useCustomerBalance } from '@/hooks/use-accounts-receivable';
import { ArrowLeft, Mail, Phone, MapPin, Edit, Receipt, DollarSign, FileText } from 'lucide-react';

export function CustomerDetailPage() {
  const { id } = useParams();
  const { data: customer, isLoading } = useCustomer(id || '');
  const { data: sales } = useSales();
  const { data: arBalance } = useCustomerBalance(id || '');

  // Filter sales for this customer (demo mode - in real mode would pass customerId param)
  const customerSales = sales?.items.filter((s: any) => s.customerId === id) || [];

  if (isLoading) return <div className="flex items-center justify-center py-20"><div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-amber-500" /></div>;
  if (!customer) return <div className="text-center py-20"><p className="text-sm text-red-600">Customer not found.</p></div>;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link to="/customers" className="btn-ghost !px-0 mb-4 text-slate-500 hover:text-slate-700">
          <ArrowLeft className="h-4 w-4" /> Back to customers
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500">
            <span className="text-lg font-bold text-white">{customer.firstName[0]}{customer.lastName[0]}</span>
          </div>
          <div>
            <h1 className="page-title">{customer.firstName} {customer.lastName}</h1>
            <p className="text-sm text-slate-500">Customer since {new Date(customer.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
          </div>
          <Link to={`/customers/${customer.id}/edit`} className="btn-secondary ml-auto"><Edit className="h-4 w-4" /> Edit</Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="card p-5 space-y-4">
          <h3 className="section-label">Contact</h3>
          {customer.email && <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-slate-400" /><span className="text-sm text-slate-700">{customer.email}</span></div>}
          {customer.phone && <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-slate-400" /><span className="text-sm text-slate-700">{customer.phone}</span></div>}
          {!customer.email && !customer.phone && <p className="text-sm text-slate-400">No contact info</p>}
        </div>

        <div className="card p-5 space-y-4">
          <h3 className="section-label">Address</h3>
          {customer.street ? (
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
              <div className="text-sm text-slate-700">
                <p>{customer.street}</p>
                {customer.city && <p>{customer.city}, {customer.state} {customer.zip}</p>}
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-400">No address on file</p>
          )}
        </div>
      </div>

      {customer.notes && (
        <div className="card p-5">
          <h3 className="section-label mb-2">Notes</h3>
          <p className="text-sm text-slate-700">{customer.notes}</p>
        </div>
      )}

      {/* Account Balance */}
      <div className="card">
        <div className="border-b border-slate-100 px-5 py-4 flex items-center justify-between">
          <h3 className="section-label">Account Balance</h3>
          {arBalance && arBalance.totalBalance > 0 && (
            <Link to={`/ar/invoices?customerId=${id}`} className="text-xs font-medium text-amber-600 hover:text-amber-700">View all invoices</Link>
          )}
        </div>
        {!arBalance || arBalance.totalBalance === 0 ? (
          <div className="px-5 py-10 text-center">
            <DollarSign className="mx-auto h-6 w-6 text-slate-300" />
            <p className="mt-2 text-sm text-slate-400">No outstanding balance</p>
          </div>
        ) : (
          <div>
            <div className="px-5 py-4 flex items-center gap-4 border-b border-slate-50">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Balance Due</p>
                <p className="text-2xl font-bold text-slate-900">${arBalance.totalBalance.toFixed(2)}</p>
              </div>
              <span className="text-xs text-slate-400">{arBalance.openInvoiceCount} open invoice{arBalance.openInvoiceCount !== 1 ? 's' : ''}</span>
            </div>
            <div className="divide-y divide-slate-50">
              {arBalance.openInvoices.map(inv => (
                <Link key={inv.id} to={`/ar/invoices/${inv.id}`} className="flex items-center justify-between px-5 py-3 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="font-mono text-sm font-medium text-slate-900">{inv.invoiceNumber}</p>
                      <p className="text-xs text-slate-400">Due {new Date(inv.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold tabular-nums text-slate-900">${inv.balanceDue.toFixed(2)}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Purchase History */}
      <div className="card">
        <div className="border-b border-slate-100 px-5 py-4">
          <h3 className="section-label">Purchase History</h3>
        </div>
        {customerSales.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <Receipt className="mx-auto h-6 w-6 text-slate-300" />
            <p className="mt-2 text-sm text-slate-400">No purchases yet</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {customerSales.map((sale: any) => (
              <Link key={sale.id} to={`/sales/${sale.id}`} className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50/50 transition-colors">
                <div>
                  <p className="font-mono text-sm font-medium text-slate-900">{sale.transactionNumber}</p>
                  <p className="text-xs text-slate-400">{new Date(sale.transactionDate).toLocaleDateString()}</p>
                </div>
                <span className="text-sm font-semibold tabular-nums text-slate-900">${sale.totalAmount.toFixed(2)}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
