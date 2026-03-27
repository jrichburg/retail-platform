import { useAuthStore } from '@/stores/auth-store';
import { useTenantStore } from '@/stores/tenant-store';
import { LogOut, Store, ChevronDown } from 'lucide-react';
import { useEffect } from 'react';

export function Header() {
  const { user, logout } = useAuthStore();
  const { nodes, currentStoreId, loadTree, selectStore } = useTenantStore();
  const stores = nodes.filter((n) => n.nodeType === 'store');
  const currentStore = stores.find((s) => s.id === currentStoreId);

  useEffect(() => {
    if (nodes.length === 0) loadTree();
  }, [nodes.length, loadTree]);

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200/60 bg-white/80 px-6 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Store className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <select
            className="appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-8 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
            value={currentStoreId || ''}
            onChange={(e) => selectStore(e.target.value)}
          >
            <option value="">All locations</option>
            {stores.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-slate-700">{user?.firstName} {user?.lastName}</p>
          <p className="text-xs text-slate-400">{user?.email}</p>
        </div>
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
          <span className="text-xs font-bold text-white">{user?.firstName?.[0]}{user?.lastName?.[0]}</span>
        </div>
        <button onClick={logout} className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600" title="Sign out">
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
