import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStockLevels } from '@/hooks/use-inventory';
import { Plus, Search, Warehouse, AlertTriangle } from 'lucide-react';

export function StockLevelsPage() {
  const [search, setSearch] = useState('');
  const { data, isLoading } = useStockLevels({ search: search || undefined });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Inventory</h1>
          <p className="mt-1 text-sm text-slate-500">Current stock levels across all products</p>
        </div>
        <Link to="/inventory/receive" className="btn-primary">
          <Plus className="h-4 w-4" /> Receive stock
        </Link>
      </div>

      <div className="card">
        <div className="border-b border-slate-100 px-4 py-3">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field !pl-10 !border-transparent !shadow-none !bg-slate-50/80 focus:!bg-white focus:!border-slate-200"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-amber-500" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="table-header">Product</th>
                  <th className="table-header">SKU</th>
                  <th className="table-header text-right">On Hand</th>
                  <th className="table-header text-right">Available</th>
                  <th className="table-header text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {data?.items.map((stock) => {
                  const isLow = stock.quantityOnHand <= (stock.reorderPoint ?? 3);
                  return (
                    <tr key={stock.id} className="group transition-colors hover:bg-amber-50/30">
                      <td className="table-cell">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${isLow ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-400 group-hover:bg-amber-100 group-hover:text-amber-600'}`}>
                            {isLow ? <AlertTriangle className="h-4 w-4" /> : <Warehouse className="h-4 w-4" />}
                          </div>
                          <span className="font-medium text-slate-900">{stock.productName}</span>
                        </div>
                      </td>
                      <td className="table-cell font-mono text-xs text-slate-600">{stock.sku}</td>
                      <td className="table-cell text-right tabular-nums font-semibold text-slate-900">{stock.quantityOnHand}</td>
                      <td className="table-cell text-right tabular-nums text-slate-600">{stock.availableQuantity}</td>
                      <td className="table-cell text-center">
                        <span className={isLow ? 'badge-danger' : 'badge-success'}>
                          {isLow ? 'Low stock' : 'In stock'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {data?.items.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-16 text-center">
                      <Warehouse className="mx-auto h-8 w-8 text-slate-300" />
                      <p className="mt-3 text-sm font-medium text-slate-500">No stock records</p>
                      <p className="mt-1 text-xs text-slate-400">Receive stock to get started</p>
                      <Link to="/inventory/receive" className="btn-primary mt-4 inline-flex">
                        <Plus className="h-4 w-4" /> Receive stock
                      </Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
