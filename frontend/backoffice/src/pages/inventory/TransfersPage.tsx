import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTransfers } from '@/hooks/use-transfers';
import type { TransferDocument } from '@retail-platform/shared-types';
import { ArrowRightLeft, Plus, ArrowRight, ChevronRight } from 'lucide-react';

const STATUS_TABS = [
  { label: 'All', value: undefined },
  { label: 'Draft', value: 'draft' },
  { label: 'In Transit', value: 'in_transit' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
] as const;

function statusBadge(status: string) {
  switch (status) {
    case 'draft': return <span className="badge-neutral">Draft</span>;
    case 'in_transit': return <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-700">In Transit</span>;
    case 'completed': return <span className="badge-success">Completed</span>;
    case 'cancelled': return <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-medium text-red-600">Cancelled</span>;
    default: return <span className="badge-neutral">{status}</span>;
  }
}

export function TransfersPage() {
  const [activeStatus, setActiveStatus] = useState<string | undefined>(undefined);
  const { data, isLoading } = useTransfers({ status: activeStatus });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Transfers</h1>
          <p className="mt-1 text-sm text-slate-500">{data?.totalCount ?? 0} transfer{data?.totalCount !== 1 ? 's' : ''}</p>
        </div>
        <Link to="/inventory/transfers/new" className="btn-primary">
          <Plus className="h-4 w-4" /> New Transfer
        </Link>
      </div>

      <div className="card">
        {/* Status filter tabs */}
        <div className="flex gap-1 border-b border-slate-100 px-4 pt-3">
          {STATUS_TABS.map(tab => (
            <button
              key={String(tab.value)}
              onClick={() => setActiveStatus(tab.value)}
              className={`px-3 py-2 text-[13px] font-medium rounded-t transition-colors ${
                activeStatus === tab.value
                  ? 'text-amber-600 border-b-2 border-amber-500 -mb-px bg-transparent'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
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
                  <th className="table-header">Document</th>
                  <th className="table-header">From → To</th>
                  <th className="table-header text-center">Lines</th>
                  <th className="table-header text-center">Units</th>
                  <th className="table-header">Date</th>
                  <th className="table-header text-center">Status</th>
                  <th className="table-header w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {data?.items.map((transfer: TransferDocument) => (
                  <tr key={transfer.id} className="group transition-colors hover:bg-amber-50/30">
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 group-hover:bg-amber-100 group-hover:text-amber-600 transition-colors">
                          <ArrowRightLeft className="h-3.5 w-3.5" />
                        </div>
                        <span className="font-mono text-sm font-medium text-slate-900">{transfer.documentNumber}</span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-1.5 text-sm text-slate-600">
                        <span>{transfer.sourceStoreName}</span>
                        <ChevronRight className="h-3 w-3 text-slate-300" />
                        <span>{transfer.destinationStoreName}</span>
                      </div>
                    </td>
                    <td className="table-cell text-center text-sm text-slate-600">{transfer.lineCount}</td>
                    <td className="table-cell text-center text-sm text-slate-600">{transfer.totalUnits}</td>
                    <td className="table-cell text-sm text-slate-500">
                      {new Date(transfer.createdAt).toLocaleDateString()}
                    </td>
                    <td className="table-cell text-center">{statusBadge(transfer.status)}</td>
                    <td className="table-cell">
                      <Link
                        to={`/inventory/transfers/${transfer.id}`}
                        className="btn-ghost !p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
                {data?.items.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-16 text-center">
                      <ArrowRightLeft className="mx-auto h-8 w-8 text-slate-300" />
                      <p className="mt-3 text-sm font-medium text-slate-500">No transfers found</p>
                      <Link to="/inventory/transfers/new" className="btn-primary mt-4 inline-flex">
                        <Plus className="h-4 w-4" /> Create transfer
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
