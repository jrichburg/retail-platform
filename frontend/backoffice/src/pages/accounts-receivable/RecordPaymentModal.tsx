import { useState } from 'react';
import { useRecordPayment } from '@/hooks/use-accounts-receivable';
import { X } from 'lucide-react';

interface Props {
  invoiceId: string;
  balanceDue: number;
  onClose: () => void;
}

export function RecordPaymentModal({ invoiceId, balanceDue, onClose }: Props) {
  const recordPayment = useRecordPayment();
  const [amount, setAmount] = useState(balanceDue);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async () => {
    await recordPayment.mutateAsync({
      invoiceId,
      amount,
      paymentMethod,
      paymentDate: new Date(paymentDate).toISOString(),
      reference: reference || null,
      notes: notes || null,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-elevated">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-slate-900">Record Payment</h2>
          <button onClick={onClose} className="btn-ghost !p-1.5"><X className="h-4 w-4" /></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">$</span>
              <input type="number" step="0.01" min={0.01} max={balanceDue} value={amount} onChange={(e) => setAmount(parseFloat(e.target.value) || 0)} className="input-field !pl-7" />
            </div>
            <p className="mt-1 text-xs text-slate-400">Balance due: ${balanceDue.toFixed(2)}</p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Payment Method</label>
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="input-field">
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="check">Check</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Payment Date</label>
            <input type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} className="input-field" />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Reference</label>
            <input type="text" value={reference} onChange={(e) => setReference(e.target.value)} placeholder="Check #, transaction ref, etc." className="input-field" />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Notes</label>
            <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional" className="input-field" />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={handleSubmit} disabled={amount <= 0 || amount > balanceDue || recordPayment.isPending} className="btn-primary">
            {recordPayment.isPending ? 'Recording...' : `Record $${amount.toFixed(2)}`}
          </button>
        </div>
      </div>
    </div>
  );
}
