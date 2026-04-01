import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateTenant } from '@/hooks/use-platform';
import { ShieldAlert, Building2, User } from 'lucide-react';

export function CreateTenantPage() {
  const navigate = useNavigate();
  const { mutateAsync: createTenant, isPending } = useCreateTenant();
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    code: '',
    adminEmail: '',
    adminFirstName: '',
    adminLastName: '',
  });

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await createTenant(form);
      navigate('/platform/tenants');
    } catch (err: any) {
      setError(err.message || 'Failed to create tenant');
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-2">
        <ShieldAlert className="h-5 w-5 text-amber-500" />
        <h1 className="page-title">New Tenant</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tenant info */}
        <div className="card p-6 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="h-4 w-4 text-slate-400" />
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Tenant Details</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="form-label">Business Name</label>
              <input
                className="input-field"
                type="text"
                placeholder="City Running Co."
                value={form.name}
                onChange={set('name')}
                required
              />
            </div>
            <div>
              <label className="form-label">Short Code</label>
              <input
                className="input-field uppercase"
                type="text"
                placeholder="CRC"
                maxLength={10}
                value={form.code}
                onChange={(e) => setForm(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                required
              />
              <p className="mt-1 text-xs text-slate-400">Used in paths and doc numbers. Uppercase, no spaces.</p>
            </div>
          </div>
        </div>

        {/* Initial admin user */}
        <div className="card p-6 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <User className="h-4 w-4 text-slate-400" />
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Initial Admin User</h2>
          </div>
          <p className="text-xs text-slate-400 -mt-2">
            This creates the owner account. They'll need to create a Supabase Auth login and sync on first login.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">First Name</label>
              <input
                className="input-field"
                type="text"
                placeholder="Alex"
                value={form.adminFirstName}
                onChange={set('adminFirstName')}
                required
              />
            </div>
            <div>
              <label className="form-label">Last Name</label>
              <input
                className="input-field"
                type="text"
                placeholder="Rivera"
                value={form.adminLastName}
                onChange={set('adminLastName')}
                required
              />
            </div>
            <div className="col-span-2">
              <label className="form-label">Email Address</label>
              <input
                className="input-field"
                type="email"
                placeholder="owner@cityrunning.com"
                value={form.adminEmail}
                onChange={set('adminEmail')}
                required
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex items-center gap-3">
          <button type="submit" className="btn-primary" disabled={isPending}>
            {isPending ? 'Creating…' : 'Create Tenant'}
          </button>
          <button type="button" className="btn-ghost" onClick={() => navigate('/platform/tenants')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
