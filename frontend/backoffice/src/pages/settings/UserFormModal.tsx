import { useState, useEffect } from 'react';
import { useRoles, useCreateUser, useUpdateUser, useAssignRole } from '@/hooks/use-users';
import type { AppUserItem } from '@/hooks/use-users';
import { X } from 'lucide-react';

interface Props {
  user?: AppUserItem | null;
  onClose: () => void;
}

export function UserFormModal({ user, onClose }: Props) {
  const isEdit = !!user;
  const { data: roles } = useRoles();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const assignRole = useAssignRole();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [roleId, setRoleId] = useState('');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email);
      setIsActive(user.isActive);
      const currentRole = roles?.find(r => r.name === user.roles[0]);
      if (currentRole) setRoleId(currentRole.id);
    } else if (roles && roles.length > 0) {
      const cashier = roles.find(r => r.name === 'cashier');
      setRoleId(cashier?.id || roles[0].id);
    }
  }, [user, roles]);

  const handleSubmit = async () => {
    if (isEdit && user) {
      await updateUser.mutateAsync({ id: user.id, firstName, lastName, isActive });
      const currentRole = roles?.find(r => r.name === user.roles[0]);
      if (currentRole && currentRole.id !== roleId) {
        await assignRole.mutateAsync({ userId: user.id, roleId });
      }
    } else {
      await createUser.mutateAsync({ email, firstName, lastName, roleId });
    }
    onClose();
  };

  const isPending = createUser.isPending || updateUser.isPending || assignRole.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-elevated">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-slate-900">{isEdit ? 'Edit User' : 'Add User'}</h2>
          <button onClick={onClose} className="btn-ghost !p-1.5"><X className="h-4 w-4" /></button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">First Name</label>
              <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Last Name</label>
              <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="input-field" />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isEdit} className="input-field disabled:bg-slate-50 disabled:text-slate-400" />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Role</label>
            <select value={roleId} onChange={(e) => setRoleId(e.target.value)} className="input-field">
              <option value="">Select role...</option>
              {roles?.map(r => <option key={r.id} value={r.id}>{r.name.charAt(0).toUpperCase() + r.name.slice(1)}{r.description ? ` — ${r.description}` : ''}</option>)}
            </select>
          </div>

          {isEdit && (
            <div className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-slate-900">Active</p>
                <p className="text-xs text-slate-500">Inactive users cannot log in</p>
              </div>
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`relative h-6 w-11 rounded-full transition-colors ${isActive ? 'bg-amber-500' : 'bg-slate-200'}`}
              >
                <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${isActive ? 'translate-x-5' : ''}`} />
              </button>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={!firstName || !lastName || !roleId || (!isEdit && !email) || isPending}
            className="btn-primary"
          >
            {isPending ? 'Saving...' : isEdit ? 'Save Changes' : 'Add User'}
          </button>
        </div>
      </div>
    </div>
  );
}
