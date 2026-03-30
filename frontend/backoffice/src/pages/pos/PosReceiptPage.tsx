import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle2, Printer, RotateCcw } from 'lucide-react';

export function PosReceiptPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { total = 0, tenderedAmount = 0, change = 0, tenderType = 'cash', transactionNumber = '' } = (location.state as any) || {};

  return (
    <div className="flex h-screen flex-col bg-gray-100">
      {/* Header */}
      <div className="flex h-14 items-center justify-center bg-slate-900">
        <span className="text-sm font-semibold text-white">Transaction Complete</span>
      </div>

      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-sm text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="h-12 w-12 text-emerald-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-1">Sale Complete</h1>
          <p className="text-sm text-gray-500 font-mono mb-8">{transactionNumber}</p>

          <div className="rounded-2xl bg-white border border-gray-200 p-6 mb-8 text-left space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Total</span>
              <span className="text-sm font-bold tabular-nums">${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500 capitalize">{tenderType} tendered</span>
              <span className="text-sm font-bold tabular-nums">${tenderedAmount.toFixed(2)}</span>
            </div>
            {change > 0 && (
              <div className="flex justify-between border-t border-gray-100 pt-3">
                <span className="text-sm font-medium text-emerald-600">Change due</span>
                <span className="text-lg font-bold tabular-nums text-emerald-600">${change.toFixed(2)}</span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <button onClick={() => navigate('/pos')} className="w-full rounded-xl bg-slate-900 py-4 text-base font-bold text-white hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
              <RotateCcw className="h-5 w-5" /> New Transaction
            </button>
            <button className="w-full rounded-xl border border-gray-200 bg-white py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
              <Printer className="h-4 w-4" /> Print Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
