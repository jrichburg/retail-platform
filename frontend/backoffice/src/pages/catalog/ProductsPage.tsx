import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '@/hooks/use-products';
import { useSuppliers } from '@/hooks/use-suppliers';
import { useDepartments } from '@/hooks/use-departments';
import { Plus, Search, Package, Filter, X } from 'lucide-react';

export function ProductsPage() {
  const [search, setSearch] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [page, setPage] = useState(1);

  const { data: suppliers } = useSuppliers();
  const { data: departments } = useDepartments();

  const hasFilters = !!(search || supplierId || categoryId);

  const { data, isLoading } = useProducts({
    page,
    search: search || undefined,
    supplierId: supplierId || undefined,
    categoryId: categoryId || undefined,
  });

  const allCategories = departments?.flatMap(d =>
    d.categories.map(c => ({ ...c, departmentName: d.name }))
  ) || [];

  const clearFilters = () => {
    setSearch('');
    setSupplierId('');
    setCategoryId('');
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Products</h1>
          <p className="mt-1 text-sm text-slate-500">Search and filter your product catalog</p>
        </div>
        <Link to="/catalog/products/new" className="btn-primary">
          <Plus className="h-4 w-4" /> Add product
        </Link>
      </div>

      {/* Filter Section */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-4 w-4 text-slate-400" />
          <span className="text-sm font-semibold text-slate-700">Search & Filter</span>
          {hasFilters && (
            <button onClick={clearFilters} className="ml-auto btn-ghost !py-1 !px-2 text-xs text-slate-500">
              <X className="h-3 w-3" /> Clear all
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">Supplier</label>
            <select
              value={supplierId}
              onChange={(e) => { setSupplierId(e.target.value); setPage(1); }}
              className="input-field"
            >
              <option value="">All suppliers</option>
              {suppliers?.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">Category</label>
            <select
              value={categoryId}
              onChange={(e) => { setCategoryId(e.target.value); setPage(1); }}
              className="input-field"
            >
              <option value="">All categories</option>
              {allCategories.map(c => (
                <option key={c.id} value={c.id}>{c.departmentName} / {c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">Product / SKU</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search name, SKU, or style..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="input-field !pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {!hasFilters ? (
        <div className="card">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 mb-4">
              <Search className="h-6 w-6 text-amber-500" />
            </div>
            <p className="text-sm font-medium text-slate-700">Search your catalog</p>
            <p className="mt-1 max-w-sm text-sm text-slate-400">
              Use the filters above to find products by supplier, category, or name. Select at least one filter to see results.
            </p>
          </div>
        </div>
      ) : isLoading ? (
        <div className="card">
          <div className="flex items-center justify-center py-20">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-amber-500" />
          </div>
        </div>
      ) : data?.items.length === 0 ? (
        <div className="card">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Package className="h-8 w-8 text-slate-300 mb-3" />
            <p className="text-sm font-medium text-slate-500">No products found</p>
            <p className="mt-1 text-sm text-slate-400">Try adjusting your filters or search term</p>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="border-b border-slate-100 px-4 py-3">
            <p className="text-xs font-medium text-slate-500">{data?.totalCount ?? 0} product{(data?.totalCount ?? 0) !== 1 ? 's' : ''} found</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="table-header">Product</th>
                  <th className="table-header">SKU</th>
                  <th className="table-header">Supplier</th>
                  <th className="table-header">Style / Color</th>
                  <th className="table-header">Category</th>
                  <th className="table-header text-right">Price</th>
                  <th className="table-header text-center">Sizes</th>
                  <th className="table-header text-center">Status</th>
                  <th className="table-header w-16"></th>
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
                        <span className="font-medium text-slate-900">{product.name}</span>
                      </div>
                    </td>
                    <td className="table-cell font-mono text-xs text-slate-600">{product.sku}</td>
                    <td className="table-cell text-sm text-slate-600">{product.supplierName || '—'}</td>
                    <td className="table-cell">
                      {product.style && <span className="text-sm text-slate-700">{product.style}</span>}
                      {product.style && product.color && <span className="mx-1 text-slate-300">/</span>}
                      {product.color && <span className="text-sm text-slate-500">{product.color}</span>}
                      {!product.style && !product.color && <span className="text-slate-300">—</span>}
                    </td>
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
                      {product.variantCount > 0 ? (
                        <span className="badge-neutral">{product.variantCount}</span>
                      ) : (
                        <span className="text-xs text-slate-300">—</span>
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
        </div>
      )}
    </div>
  );
}
