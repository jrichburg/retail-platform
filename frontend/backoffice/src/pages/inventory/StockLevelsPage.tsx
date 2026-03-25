import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStockLevels } from '@/hooks/use-inventory';
import { Plus, Search } from 'lucide-react';

export function StockLevelsPage() {
  const [search, setSearch] = useState('');
  const { data, isLoading } = useStockLevels({ search: search || undefined });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Inventory</h2>
        <Link to="/inventory/receive" className="inline-flex items-center gap-2 rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800">
          <Plus className="h-4 w-4" /> Receive Stock
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Search by name or SKU..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
      </div>

      {isLoading ? <p className="text-sm text-gray-500">Loading...</p> : (
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">SKU</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Product</th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">On Hand</th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">Available</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {data?.items.map((stock) => (
                <tr key={stock.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-mono text-gray-900">{stock.sku}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{stock.productName}</td>
                  <td className="px-4 py-3 text-right text-sm text-gray-900">{stock.quantityOnHand}</td>
                  <td className="px-4 py-3 text-right text-sm text-gray-900">{stock.availableQuantity}</td>
                </tr>
              ))}
              {data?.items.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-500">No stock records. Receive stock to get started.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
