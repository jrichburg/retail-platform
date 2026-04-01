import { useState } from 'react';
import { useUsers } from '@/hooks/use-users';
import type { AppUserItem } from '@/hooks/use-users';
import { UserFormModal } from './UserFormModal';
import { Plus, Search, Users, Edit2 } from 'lucide-react';

const roleStyles: Record<string, string> = {
  owner: 'bg-purple-50 text-purple-700 ring-1 ring-purple-600/10 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide',
  manager: 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/10 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide',
  cashier: 'badge-neutral',
};

const filterTabs = [
  { value: undefined as boolean | undefined, label: 'All' },
  { value: true, label: 'Active' },
  { value: false, label: 'Inactive' },
];

export function UsersPage() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<boolean | undefined>(undefined);
  const { data, isLoading } = useUsers({ search: search || undefined, isActive: activeFilter });
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState<AppUserItem | null>(null);

  const handleEdit = (user: AppUserItem) => {
    setEditUser(user);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditUser(null);
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Users</h1>
          <p className="mt-1 text-sm text-slate-500">Manage team members and their roles</p>
        </div>
        <button onClick={handleAdd} className="btn-primary"><Plus className="h-4 w-4" /> Add User</button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="input-field !pl-10"
          />
        </div>
        <div className="flex gap-1 rounded-lg border border-slate-200 bg-white p-0.5">
          {filterTabs.map(tab => (
            <button
              key={String(tab.value)}
              onClick={() => setActiveFilter(tab.value)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                activeFilter === tab.value ? 'bg-amber-100 text-amber-800' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        {isLoading ? (
          <div className="flex items-center justify-center py-20"><div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-amber-500" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="table-header">Name</th>
                  <th className="table-header">Email</th>
                  <th className="table-header text-center">Role</th>
                  <th className="table-header text-center">Status</th>
                  <th className="table-header">Joined</th>
                  <th className="table-header w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {data?.items.map(user => (
                  <tr key={user.id} className="group transition-colors hover:bg-amber-50/30">
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500">
                          <span className="text-xs font-bold text-white">{user.firstName[0]}{user.lastName[0]}</span>
                        </div>
                        <span className="font-medium text-slate-900">{user.firstName} {user.lastName}</span>
                      </div>
                    </td>
                    <td className="table-cell text-sm text-slate-500">{user.email}</td>
                    <td className="table-cell text-center">
                      {user.roles.map(role => (
                        <span key={role} className={roleStyles[role] || 'badge-neutral'}>{role}</span>
                      ))}
                    </td>
                    <td className="table-cell text-center">
                      {user.isActive ? (
                        <span className="badge-success">Active</span>
                      ) : (
                        <span className="badge-neutral">Inactive</span>
                      )}
                    </td>
                    <td className="table-cell text-sm text-slate-500">
                      {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="table-cell">
                      <button onClick={() => handleEdit(user)} className="btn-ghost !p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Edit2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {data?.items.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-16 text-center">
                    <Users className="mx-auto h-8 w-8 text-slate-300" />
                    <p className="mt-3 text-sm font-medium text-slate-500">No users found</p>
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <UserFormModal user={editUser} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
