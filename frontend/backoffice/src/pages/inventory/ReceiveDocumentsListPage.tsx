import { Link } from 'react-router-dom';
import { useReceiveDocuments } from '@/hooks/use-receiving';
import { Plus, ClipboardList, ArrowRight } from 'lucide-react';

export function ReceiveDocumentsListPage() {
  const { data, isLoading } = useReceiveDocuments();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Receiving History</h1>
          <p className="mt-1 text-sm text-slate-500">Past receiving documents</p>
        </div>
        <Link to="/inventory/receive" className="btn-primary">
          <Plus className="h-4 w-4" /> New receive
        </Link>
      </div>

      <div className="card">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-amber-500" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="table-header">Document #</th>
                  <th className="table-header">Date</th>
                  <th className="table-header text-center">Lines</th>
                  <th className="table-header text-center">Units</th>
                  <th className="table-header">Type</th>
                  <th className="table-header text-center">Status</th>
                  <th className="table-header w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {data?.items.map((doc) => (
                  <tr key={doc.id} className="group transition-colors hover:bg-amber-50/30">
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-400 group-hover:bg-amber-100 group-hover:text-amber-600 transition-colors">
                          <ClipboardList className="h-4 w-4" />
                        </div>
                        <span className="font-mono text-sm font-medium text-slate-900">{doc.documentNumber}</span>
                      </div>
                    </td>
                    <td className="table-cell text-sm text-slate-500">
                      {new Date(doc.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      <p className="text-xs text-slate-400">{new Date(doc.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</p>
                    </td>
                    <td className="table-cell text-center tabular-nums text-slate-600">{doc.lineCount}</td>
                    <td className="table-cell text-center tabular-nums font-semibold text-slate-900">{doc.totalUnits}</td>
                    <td className="table-cell">
                      <span className={doc.purchaseOrderId ? 'badge-neutral' : 'badge-neutral'}>
                        {doc.purchaseOrderId ? 'Against PO' : 'Blind'}
                      </span>
                    </td>
                    <td className="table-cell text-center">
                      <span className="badge-success">{doc.status}</span>
                    </td>
                    <td className="table-cell">
                      <Link to={`/inventory/receiving/${doc.id}`} className="btn-ghost !p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
                {data?.items.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-16 text-center">
                      <ClipboardList className="mx-auto h-8 w-8 text-slate-300" />
                      <p className="mt-3 text-sm font-medium text-slate-500">No receive documents yet</p>
                      <Link to="/inventory/receive" className="btn-primary mt-4 inline-flex"><Plus className="h-4 w-4" /> New receive</Link>
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
