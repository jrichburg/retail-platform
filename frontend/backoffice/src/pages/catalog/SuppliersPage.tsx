import { useState } from 'react';
import { useSuppliers, useCreateSupplier } from '@/hooks/use-suppliers';
import { Plus, Building2 } from 'lucide-react';

export function SuppliersPage() {
  const { data: suppliers, isLoading } = useSuppliers();
  const createSupplier = useCreateSupplier();
  const [name, setName] = useState('');
  const [code, setCode] = useState('');

  const handleAdd = async () => {
    if (!name.trim()) return;
    await createSupplier.mutateAsync({ name, code: code || undefined });
    setName('');
    setCode('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Suppliers</h1>
        <p className="mt-1 text-sm text-slate-500">Manage your vendor and brand directory</p>
      </div>

      <div className="flex items-end gap-3">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAdd()} placeholder="e.g. Brooks" className="input-field w-60" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Code</label>
          <input value={code} onChange={(e) => setCode(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAdd()} placeholder="e.g. BRK" className="input-field w-28" />
        </div>
        <button onClick={handleAdd} disabled={!name.trim()} className="btn-primary"><Plus className="h-4 w-4" /> Add</button>
      </div>

      <div className="card">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-amber-500" />
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="table-header">Supplier</th>
                <th className="table-header">Code</th>
                <th className="table-header text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {suppliers?.map((s) => (
                <tr key={s.id} className="group transition-colors hover:bg-amber-50/30">
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-400 group-hover:bg-amber-100 group-hover:text-amber-600 transition-colors">
                        <Building2 className="h-4 w-4" />
                      </div>
                      <span className="font-medium text-slate-900">{s.name}</span>
                    </div>
                  </td>
                  <td className="table-cell font-mono text-xs text-slate-600">{s.code || '—'}</td>
                  <td className="table-cell text-center">
                    <span className={s.isActive ? 'badge-success' : 'badge-neutral'}>{s.isActive ? 'Active' : 'Inactive'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
