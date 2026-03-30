import { useParams, Link } from 'react-router-dom';
import { useReceiveDocument } from '@/hooks/use-receiving';
import { ArrowLeft, ClipboardList, Package } from 'lucide-react';

export function ReceiveDocumentDetailPage() {
  const { id } = useParams();
  const { data: doc, isLoading } = useReceiveDocument(id || '');

  if (isLoading) {
    return <div className="flex items-center justify-center py-20"><div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-amber-500" /></div>;
  }

  if (!doc) {
    return <div className="text-center py-20"><p className="text-sm text-red-600">Document not found.</p></div>;
  }

  const totalUnits = doc.lines.reduce((sum, l) => sum + l.quantity, 0);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link to="/inventory/receiving" className="btn-ghost !px-0 mb-4 text-slate-500 hover:text-slate-700">
          <ArrowLeft className="h-4 w-4" /> Back to receiving history
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
            <ClipboardList className="h-5 w-5 text-slate-500" />
          </div>
          <div>
            <h1 className="page-title">{doc.documentNumber}</h1>
            <p className="text-sm text-slate-500">
              {new Date(doc.createdAt).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
            </p>
          </div>
          <span className="ml-auto badge-success">{doc.status}</span>
        </div>
      </div>

      {doc.notes && (
        <div className="card p-4">
          <p className="section-label mb-1">Notes</p>
          <p className="text-sm text-slate-700">{doc.notes}</p>
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/50 px-5 py-3 flex items-center justify-between">
          <h3 className="section-label">Items Received</h3>
          <span className="text-xs font-medium text-slate-500">{doc.lines.length} lines · {totalUnits} units</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="table-header">Product</th>
                <th className="table-header">SKU</th>
                <th className="table-header">Size / Width</th>
                <th className="table-header">UPC</th>
                <th className="table-header text-right">Qty</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {doc.lines.map((line) => (
                <tr key={line.id}>
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <Package className="h-4 w-4 text-slate-400" />
                      <span className="font-medium text-slate-900">{line.productName}</span>
                    </div>
                  </td>
                  <td className="table-cell font-mono text-xs text-slate-600">{line.sku}</td>
                  <td className="table-cell text-sm text-slate-600">{line.variantDescription || '—'}</td>
                  <td className="table-cell font-mono text-xs text-slate-400">{line.upc || '—'}</td>
                  <td className="table-cell text-right font-semibold tabular-nums text-slate-900">{line.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
