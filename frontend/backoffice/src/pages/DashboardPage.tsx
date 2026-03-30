import { useProducts } from '@/hooks/use-products';
import { useStockLevels } from '@/hooks/use-inventory';
import { useSales } from '@/hooks/use-sales';
import { Link } from 'react-router-dom';
import { Package, Warehouse, ShoppingCart, TrendingUp, ArrowRight, ArrowUpRight, ArrowDownRight, Monitor } from 'lucide-react';

export function DashboardPage() {
  const { data: products } = useProducts();
  const { data: stock } = useStockLevels();
  const { data: sales } = useSales();

  const totalRevenue = sales?.items.reduce((sum, s) => s.status === 'completed' ? sum + s.totalAmount : sum, 0) ?? 0;
  const avgTransaction = sales?.items.length ? totalRevenue / sales.items.filter(s => s.status === 'completed').length : 0;
  const totalUnits = stock?.items.reduce((sum, s) => sum + s.quantityOnHand, 0) ?? 0;

  const kpis = [
    {
      label: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      change: '+12.5%',
      trend: 'up' as const,
      icon: TrendingUp,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Transactions',
      value: sales?.totalCount?.toString() ?? '0',
      change: '+3',
      trend: 'up' as const,
      icon: ShoppingCart,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Avg. Transaction',
      value: `$${avgTransaction.toFixed(2)}`,
      change: '-2.1%',
      trend: 'down' as const,
      icon: ShoppingCart,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      label: 'Units in Stock',
      value: totalUnits.toLocaleString(),
      change: `${products?.totalCount ?? 0} SKUs`,
      trend: 'neutral' as const,
      icon: Warehouse,
      color: 'text-violet-600',
      bg: 'bg-violet-50',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="page-title">Overview</h1>
        <p className="mt-1 text-sm text-slate-500">Your retail performance at a glance</p>
      </div>

      {/* POS Launch */}
      <Link to="/pos" className="card p-5 flex items-center gap-4 group hover:shadow-elevated transition-shadow">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 group-hover:bg-emerald-100 transition-colors">
          <Monitor className="h-6 w-6 text-emerald-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">Open POS Terminal</p>
          <p className="text-xs text-slate-500">Launch the point-of-sale interface</p>
        </div>
        <ArrowRight className="ml-auto h-5 w-5 text-slate-300 group-hover:text-amber-500 transition-colors" />
      </Link>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="card p-5">
            <div className="flex items-center justify-between">
              <span className="section-label">{kpi.label}</span>
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${kpi.bg}`}>
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
              </div>
            </div>
            <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">{kpi.value}</p>
            <div className="mt-1 flex items-center gap-1">
              {kpi.trend === 'up' && <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" />}
              {kpi.trend === 'down' && <ArrowDownRight className="h-3.5 w-3.5 text-red-500" />}
              <span className={`text-xs font-medium ${kpi.trend === 'up' ? 'text-emerald-600' : kpi.trend === 'down' ? 'text-red-600' : 'text-slate-500'}`}>
                {kpi.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Sales */}
        <div className="card">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h2 className="text-sm font-semibold text-slate-900">Recent Transactions</h2>
            <Link to="/sales" className="flex items-center gap-1 text-xs font-medium text-amber-600 hover:text-amber-700">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {sales?.items.slice(0, 5).map((sale) => (
              <Link key={sale.id} to={`/sales/${sale.id}`} className="flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-slate-50/50">
                <div>
                  <p className="text-sm font-medium text-slate-900">{sale.transactionNumber}</p>
                  <p className="text-xs text-slate-400">{new Date(sale.transactionDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">${sale.totalAmount.toFixed(2)}</p>
                  <p className="text-xs text-slate-400">{sale.lineItems.length} item{sale.lineItems.length !== 1 ? 's' : ''}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="card">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h2 className="text-sm font-semibold text-slate-900">Inventory Snapshot</h2>
            <Link to="/inventory" className="flex items-center gap-1 text-xs font-medium text-amber-600 hover:text-amber-700">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {stock?.items.slice(0, 5).map((item) => (
              <div key={item.id} className="flex items-center justify-between px-5 py-3.5">
                <div>
                  <p className="text-sm font-medium text-slate-900">{item.productName}</p>
                  <p className="font-mono text-xs text-slate-400">{item.sku}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`badge ${item.quantityOnHand <= (item.reorderPoint ?? 3) ? 'badge-danger' : 'badge-success'}`}>
                    {item.quantityOnHand} units
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
