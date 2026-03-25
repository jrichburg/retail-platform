import { useAuthStore } from '@/stores/auth-store';
import { useTenantStore } from '@/stores/tenant-store';
import { LogOut } from 'lucide-react';
import { useEffect } from 'react';

export function Header() {
  const { user, logout } = useAuthStore();
  const { nodes, currentStoreId, loadTree, selectStore } = useTenantStore();
  const stores = nodes.filter((n) => n.nodeType === 'store');

  useEffect(() => {
    if (nodes.length === 0) loadTree();
  }, [nodes.length, loadTree]);

  return (
    <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div className="flex items-center gap-4">
        <select
          className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm"
          value={currentStoreId || ''}
          onChange={(e) => selectStore(e.target.value)}
        >
          <option value="">Select store...</option>
          {stores.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">{user?.email}</span>
        <button onClick={logout} className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
