import { useParams, Link } from 'react-router-dom';
import { useTenantDetail, useDeactivateTenant } from '@/hooks/use-platform';
import { ArrowLeft, Building2, Store, Users, Mail, ShieldAlert, ToggleLeft, ToggleRight } from 'lucide-react';
import { useState } from 'react';

export function TenantDetailPage() {
  const { id } = useParams();
  const { data: tenant, isLoading } = useTenantDetail(id || '');
  const deactivate = useDeactivateTenant();
  const [confirmDeactivate, setConfirmDeactivate] = useState(false);

  if (isLoading) return (
    <div className="flex items-center justify-center py-20">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-amber-500" />
    </div>
  );
  if (!tenant) return (
    <div className="text-center py-20">
      <p className="text-sm text-red-600">Tenant not found.</p>
    </div>
  );

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <Link to="/platform/tenants" className="btn-ghost !px-0 mb-4 text-slate-500 hover:text-slate-700">
          <ArrowLeft className="h-4 w-4" /> Back to tenants
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="page-title">{tenant.name}</h1>
              <span className={tenant.isActive ? 'badge-success' : 'badge-neutral'}>
                {tenant.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <p className="text-sm text-slate-500 font-mono">{tenant.code} · Created {new Date(tenant.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>
          {tenant.isActive && (
            <button
              className="ml-auto btn-ghost text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={() => setConfirmDeactivate(true)}
            >
              <ToggleRight className="h-4 w-4" /> Deactivate
            </button>
          )}
          {!tenant.isActive && (
            <div className="ml-auto flex items-center gap-1.5 text-xs text-slate-400">
              <ToggleLeft className="h-4 w-4" /> Inactive
            </div>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card p-5 flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
            <Store className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{tenant.stores.length}</p>
            <p className="text-xs text-slate-400 uppercase tracking-wide">Stores</p>
          </div>
        </div>
        <div className="card p-5 flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
            <Users className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{tenant.users.length}</p>
            <p className="text-xs text-slate-400 uppercase tracking-wide">Users</p>
          </div>
        </div>
      </div>

      {/* Stores */}
      <div className="card">
        <div className="border-b border-slate-100 px-5 py-4 flex items-center gap-2">
          <Store className="h-4 w-4 text-slate-400" />
          <h3 className="section-label">Stores</h3>
        </div>
        {tenant.stores.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <Store className="mx-auto h-6 w-6 text-slate-300" />
            <p className="mt-2 text-sm text-slate-400">No stores</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {tenant.stores.map(store => (
              <div key={store.id} className="flex items-center justify-between px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                    <Store className="h-3.5 w-3.5 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{store.name}</p>
                    {store.code && <p className="text-xs font-mono text-slate-400">{store.code}</p>}
                  </div>
                </div>
                <span className={store.isActive ? 'badge-success' : 'badge-neutral'}>
                  {store.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Users */}
      <div className="card">
        <div className="border-b border-slate-100 px-5 py-4 flex items-center gap-2">
          <Users className="h-4 w-4 text-slate-400" />
          <h3 className="section-label">Users</h3>
        </div>
        {tenant.users.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <Users className="mx-auto h-6 w-6 text-slate-300" />
            <p className="mt-2 text-sm text-slate-400">No users</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {tenant.users.map(user => (
              <div key={user.id} className="flex items-center justify-between px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                    <span className="text-xs font-bold">{user.firstName[0]}{user.lastName[0]}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{user.firstName} {user.lastName}</p>
                    <p className="flex items-center gap-1 text-xs text-slate-400">
                      <Mail className="h-3 w-3" />{user.email}
                    </p>
                  </div>
                </div>
                <span className={user.isActive ? 'badge-success' : 'badge-neutral'}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Platform admin badge */}
      <div className="flex items-center gap-2 px-1">
        <ShieldAlert className="h-3.5 w-3.5 text-amber-500/60" />
        <p className="text-xs text-slate-400">Platform Admin view — changes apply across all stores in this tenant</p>
      </div>

      {/* Deactivate confirmation */}
      {confirmDeactivate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="card max-w-sm w-full mx-4 p-6 space-y-4">
            <h2 className="font-semibold text-slate-900">Deactivate {tenant.name}?</h2>
            <p className="text-sm text-slate-500">
              This will deactivate all stores under this tenant and prevent users from logging in.
            </p>
            <div className="flex gap-3 justify-end">
              <button className="btn-ghost" onClick={() => setConfirmDeactivate(false)}>Cancel</button>
              <button
                className="btn-danger"
                onClick={async () => {
                  await deactivate.mutateAsync(id!);
                  setConfirmDeactivate(false);
                }}
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
