import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCustomers } from '@/hooks/use-customers';
import { Plus, Search, Users, ArrowRight, Mail, Phone } from 'lucide-react';

export function CustomersPage() {
  const [search, setSearch] = useState('');
  const { data, isLoading } = useCustomers({ search: search || undefined });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Customers</h1>
          <p className="mt-1 text-sm text-slate-500">{data?.totalCount ?? 0} customers in directory</p>
        </div>
        <Link to="/customers/new" className="btn-primary"><Plus className="h-4 w-4" /> Add customer</Link>
      </div>

      <div className="card">
        <div className="border-b border-slate-100 px-4 py-3">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search by name, email, or phone..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="input-field !pl-10 !border-transparent !shadow-none !bg-slate-50/80 focus:!bg-white focus:!border-slate-200" />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20"><div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-amber-500" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="table-header">Name</th>
                  <th className="table-header">Contact</th>
                  <th className="table-header">Location</th>
                  <th className="table-header text-center">Status</th>
                  <th className="table-header w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {data?.items.map(customer => (
                  <tr key={customer.id} className="group transition-colors hover:bg-amber-50/30">
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 group-hover:bg-amber-100 group-hover:text-amber-600 transition-colors">
                          <span className="text-xs font-bold">{customer.firstName[0]}{customer.lastName[0]}</span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{customer.firstName} {customer.lastName}</p>
                          {customer.notes && <p className="text-xs text-slate-400 truncate max-w-[200px]">{customer.notes}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      {customer.email && <p className="flex items-center gap-1.5 text-sm text-slate-600"><Mail className="h-3 w-3 text-slate-400" />{customer.email}</p>}
                      {customer.phone && <p className="flex items-center gap-1.5 text-sm text-slate-500"><Phone className="h-3 w-3 text-slate-400" />{customer.phone}</p>}
                      {!customer.email && !customer.phone && <span className="text-xs text-slate-300">&mdash;</span>}
                    </td>
                    <td className="table-cell text-sm text-slate-500">
                      {customer.city && customer.state ? `${customer.city}, ${customer.state}` : customer.city || customer.state || '\u2014'}
                    </td>
                    <td className="table-cell text-center">
                      <span className={customer.isActive ? 'badge-success' : 'badge-neutral'}>{customer.isActive ? 'Active' : 'Inactive'}</span>
                    </td>
                    <td className="table-cell">
                      <Link to={`/customers/${customer.id}`} className="btn-ghost !p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"><ArrowRight className="h-4 w-4" /></Link>
                    </td>
                  </tr>
                ))}
                {data?.items.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-16 text-center">
                    <Users className="mx-auto h-8 w-8 text-slate-300" />
                    <p className="mt-3 text-sm font-medium text-slate-500">No customers found</p>
                    <Link to="/customers/new" className="btn-primary mt-4 inline-flex"><Plus className="h-4 w-4" /> Add customer</Link>
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
