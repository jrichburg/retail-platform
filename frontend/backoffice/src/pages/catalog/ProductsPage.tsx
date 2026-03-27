import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '@/hooks/use-products';
import { Plus, Search, Package, ArrowUpDown } from 'lucide-react';

export function ProductsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const { data, isLoading } = useProducts({ page, search: search || undefined });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Products</h1>
          <p className="mt-1 text-sm text-slate-500">{data?.totalCount ?? 0} items in catalog</p>
        </div>
        <Link to="/catalog/products/new" className="btn-primary">
          <Plus className="h-4 w-4" /> Add product
        </Link>
      </div>

      <div className="card">
        {/* Search bar inside card */}
        <div className="border-b border-slate-100 px-4 py-3">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="input-field !pl-10 !border-transparent !shadow-none !bg-slate-50/80 focus:!bg-white focus:!border-slate-200"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-amber-500" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="table-header">Product</th>
                    <th className="table-header">SKU</th>
                    <th className="table-header">Supplier</th>
                    <th className="table-header">Color</th>
                    <th className="table-header">Category</th>
                    <th className="table-header text-right">Price</th>
                    <th className="table-header text-center">Status</th>
                    <th className="table-header w-20"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {data?.items.map((product) => (
                    <tr key={product.id} className="group transition-colors hover:bg-amber-50/30">
                      <td className="table-cell">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-400 group-hover:bg-amber-100 group-hover:text-amber-600 transition-colors">
                            <Package className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">
                              {product.name}
                              {product.variantCount > 0 && <span className="badge-neutral ml-2">{product.variantCount} sizes</span>}
                            </p>
                            {product.upc && <p className="text-xs text-slate-400">UPC: {product.upc}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="table-cell font-mono text-xs text-slate-600">{product.sku}</td>
                      <td className="table-cell text-sm text-slate-600">{product.supplierName || '—'}</td>
                      <td className="table-cell text-sm text-slate-600">{product.color || '—'}</td>
                      <td className="table-cell">
                        <span className="text-slate-500">{product.departmentName}</span>
                        <span className="mx-1 text-slate-300">/</span>
                        <span className="text-slate-700">{product.categoryName}</span>
                      </td>
                      <td className="table-cell text-right font-semibold tabular-nums text-slate-900">
                        ${product.retailPrice.toFixed(2)}
                        {product.costPrice && (
                          <p className="text-xs font-normal text-slate-400">${product.costPrice.toFixed(2)} cost</p>
                        )}
                      </td>
                      <td className="table-cell text-center">
                        <span className={product.isActive ? 'badge-success' : 'badge-neutral'}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="table-cell text-right">
                        <Link to={`/catalog/products/${product.id}/edit`} className="btn-ghost !px-2 !py-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {data && data.totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
                <p className="text-xs text-slate-500">
                  Showing {((page - 1) * data.pageSize) + 1}–{Math.min(page * data.pageSize, data.totalCount)} of {data.totalCount}
                </p>
                <div className="flex items-center gap-1">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-ghost !py-1 !px-2 text-xs disabled:opacity-30">
                    Previous
                  </button>
                  <span className="px-2 text-xs tabular-nums text-slate-500">{page} / {data.totalPages}</span>
                  <button onClick={() => setPage(p => Math.min(data.totalPages, p + 1))} disabled={page === data.totalPages} className="btn-ghost !py-1 !px-2 text-xs disabled:opacity-30">
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
