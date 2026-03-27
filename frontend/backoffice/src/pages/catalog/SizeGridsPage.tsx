import { Link } from 'react-router-dom';
import { useSizeGrids } from '@/hooks/use-size-grids';
import { Plus, Grid3X3 } from 'lucide-react';

export function SizeGridsPage() {
  const { data: grids, isLoading } = useSizeGrids();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Size Grids</h1>
          <p className="mt-1 text-sm text-slate-500">Reusable size templates for products</p>
        </div>
        <Link to="/catalog/size-grids/new" className="btn-primary"><Plus className="h-4 w-4" /> New grid</Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-amber-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {grids?.map((grid) => {
            const dim1Values = grid.values.filter(v => v.dimension === 1).sort((a, b) => a.sortOrder - b.sortOrder);
            const dim2Values = grid.values.filter(v => v.dimension === 2).sort((a, b) => a.sortOrder - b.sortOrder);
            return (
              <Link key={grid.id} to={`/catalog/size-grids/${grid.id}/edit`} className="card p-5 transition-shadow hover:shadow-elevated group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 group-hover:bg-amber-100 transition-colors">
                    <Grid3X3 className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{grid.name}</p>
                    <p className="text-xs text-slate-400">{grid.dimension1Label}{grid.dimension2Label ? ` × ${grid.dimension2Label}` : ''}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {dim1Values.slice(0, 8).map(v => (
                    <span key={v.id} className="rounded bg-slate-100 px-2 py-0.5 text-xs font-mono text-slate-600">{v.value}</span>
                  ))}
                  {dim1Values.length > 8 && <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-400">+{dim1Values.length - 8}</span>}
                </div>
                {dim2Values.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {dim2Values.map(v => (
                      <span key={v.id} className="rounded bg-blue-50 px-2 py-0.5 text-xs font-mono text-blue-600">{v.value}</span>
                    ))}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
