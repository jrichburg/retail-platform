import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth-store';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, syncUser } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      const tenantNodeId = localStorage.getItem('tenantNodeId') || '';
      const rootTenantId = tenantNodeId;
      if (tenantNodeId) {
        await syncUser(tenantNodeId, rootTenantId);
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left — branding panel */}
      <div className="hidden lg:flex lg:w-[45%] bg-slate-925 flex-col justify-between p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-900/20 via-transparent to-transparent" />
        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/90">
              <span className="text-lg font-bold text-slate-900">R</span>
            </div>
            <span className="text-lg font-semibold tracking-tight">Retail Platform</span>
          </div>
        </div>
        <div className="relative space-y-6">
          <h1 className="font-display text-5xl leading-tight tracking-tight">
            Manage your<br />
            <span className="italic text-amber-400">entire retail</span><br />
            operation.
          </h1>
          <p className="max-w-md text-base leading-relaxed text-slate-400">
            Footwear, apparel, and uniforms — POS, inventory, catalog, and reporting in one platform.
          </p>
        </div>
        <p className="relative text-xs text-slate-600">© 2026 Retail Platform</p>
      </div>

      {/* Right — login form */}
      <div className="flex flex-1 items-center justify-center bg-surface px-6">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-10">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/90">
                <span className="text-lg font-bold text-slate-900">R</span>
              </div>
              <span className="text-lg font-semibold tracking-tight text-slate-900">Retail Platform</span>
            </div>
          </div>

          <h2 className="font-display text-3xl text-slate-900 tracking-tight">Welcome back</h2>
          <p className="mt-2 text-sm text-slate-500">Sign in to your back office account</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-100 p-3.5">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@company.com"
                className="input-field"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="input-field"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full !py-3">
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Signing in...
                </span>
              ) : 'Sign in'}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-slate-400">
            Demo mode — enter any credentials to explore
          </p>
        </div>
      </div>
    </div>
  );
}
