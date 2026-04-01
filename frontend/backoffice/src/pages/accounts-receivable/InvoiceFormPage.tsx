import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomers } from '@/hooks/use-customers';
import { useCreateInvoice } from '@/hooks/use-accounts-receivable';
import { ArrowLeft } from 'lucide-react';

export function InvoiceFormPage() {
  const navigate = useNavigate();
  const { data: customers } = useCustomers({ pageSize: 100 });
  const createInvoice = useCreateInvoice();

  const [customerId, setCustomerId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [sourceType, setSourceType] = useState('manual');
  const [sourceReference, setSourceReference] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');

  const handleCustomerChange = (selectedId: string) => {
    setCustomerId(selectedId);
    const cust = customers?.items?.find((c: any) => c.id === selectedId);
    if (cust) setCustomerName(`${cust.firstName} ${cust.lastName}`);
  };

  const handleSubmit = async () => {
    await createInvoice.mutateAsync({
      customerId,
      customerName,
      sourceType,
      sourceId: null,
      sourceReference: sourceReference || null,
      amount,
      dueDate: new Date(dueDate).toISOString(),
      notes: notes || null,
    });
    navigate('/ar/invoices');
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <button onClick={() => navigate('/ar/invoices')} className="btn-ghost !px-0 mb-4 text-slate-500 hover:text-slate-700">
          <ArrowLeft className="h-4 w-4" /> Back to invoices
        </button>
        <h1 className="page-title">New Invoice</h1>
      </div>

      <div className="card p-6 space-y-5">
        <h3 className="section-label">Invoice Details</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Customer</label>
            <select value={customerId} onChange={(e) => handleCustomerChange(e.target.value)} className="input-field">
              <option value="">Select customer...</option>
              {customers?.items?.map((c: any) => <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Source Type</label>
            <select value={sourceType} onChange={(e) => setSourceType(e.target.value)} className="input-field">
              <option value="manual">Manual</option>
              <option value="sale">Sale</option>
              <option value="work_order">Work Order</option>
            </select>
          </div>
        </div>

        {sourceType !== 'manual' && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Source Reference</label>
            <input type="text" value={sourceReference} onChange={(e) => setSourceReference(e.target.value)} placeholder={sourceType === 'sale' ? 'Transaction number' : 'Work order number'} className="input-field" />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">$</span>
              <input type="number" step="0.01" min={0.01} value={amount || ''} onChange={(e) => setAmount(parseFloat(e.target.value) || 0)} className="input-field !pl-7" placeholder="0.00" />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Due Date</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="input-field" />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Notes</label>
          <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional" className="input-field" />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <button onClick={() => navigate('/ar/invoices')} className="btn-secondary">Cancel</button>
        <button onClick={handleSubmit} disabled={!customerId || amount <= 0 || !dueDate || createInvoice.isPending} className="btn-primary">
          {createInvoice.isPending ? 'Creating...' : 'Create Invoice'}
        </button>
      </div>
    </div>
  );
}
