import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTenants, useDeactivateTenant } from '@/hooks/use-platform';
import { Plus, Building2, Store, Users, ArrowRight, ShieldAlert } from 'lucide-react';

export function TenantsPage() {
  const { data: tenants, isLoading, error } = useTenants();
  const deactivate = useDeactivateTenant();
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const handleDeactivate = async (id: string) => {
    await deactivate.mutateAsync(id);
    setConfirmId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-amber-500" />
            <h1 className="page-title">Tenant Management</h1>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            {tenants?.length ?? 0} tenants on the platform
          </p>
        </div>
        <Link to="/platform/tenants/new" className="btn-primary">
          <Plus className="h-4 w-4" /> New Tenant
        </Link>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {String(error)}
        </div>
      )}

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
                  <th className="table-header">Tenant</th>
                  <th className="table-header text-center">Stores</th>
                  <th className="table-header text-center">Users</th>
                  <th className="table-header">Created</th>
                  <th className="table-header text-center">Status</th>
                  <th className="table-header w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {tenants?.map(tenant => (
                  <tr key={tenant.id} className="group transition-colors hover:bg-amber-50/30">
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 group-hover:bg-amber-100 group-hover:text-amber-700 transition-colors">
                          <Building2 className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{tenant.name}</p>
                          <p className="text-xs text-slate-400 font-mono">{tenant.code}</p>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell text-center">
                      <span className="inline-flex items-center gap-1.5 text-sm text-slate-600">
                        <Store className="h-3.5 w-3.5 text-slate-400" />
                        {tenant.storeCount}
                      </span>
                    </td>
                    <td className="table-cell text-center">
                      <span className="inline-flex items-center gap-1.5 text-sm text-slate-600">
                        <Users className="h-3.5 w-3.5 text-slate-400" />
                        {tenant.userCount}
                      </span>
                    </td>
                    <td className="table-cell text-sm text-slate-500">
                      {new Date(tenant.createdAt).toLocaleDateString()}
                    </td>
                    <td className="table-cell text-center">
                      {tenant.isActive ? (
                        <span className="badge-success">Active</span>
                      ) : (
                        <span className="badge-neutral">Inactive</span>
                      )}
                    </td>
                    <td className="table-cell">
                      <Link
                        to={`/platform/tenants/${tenant.id}`}
                        className="btn-ghost !p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
                {tenants?.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-16 text-center">
                      <Building2 className="mx-auto h-8 w-8 text-slate-300" />
                      <p className="mt-3 text-sm font-medium text-slate-500">No tenants yet</p>
                      <Link to="/platform/tenants/new" className="btn-primary mt-4 inline-flex">
                        <Plus className="h-4 w-4" /> Create first tenant
                      </Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Deactivate confirmation dialog */}
      {confirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="card max-w-sm w-full mx-4 p-6 space-y-4">
            <h2 className="font-semibold text-slate-900">Deactivate Tenant?</h2>
            <p className="text-sm text-slate-500">
              This will deactivate all stores and prevent users from logging in. This can be reversed manually.
            </p>
            <div className="flex gap-3 justify-end">
              <button className="btn-ghost" onClick={() => setConfirmId(null)}>Cancel</button>
              <button
                className="btn-danger"
                onClick={() => handleDeactivate(confirmId)}
                disabled={deactivate.isPending}
              >
                {deactivate.isPending ? 'Deactivating…' : 'Deactivate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
