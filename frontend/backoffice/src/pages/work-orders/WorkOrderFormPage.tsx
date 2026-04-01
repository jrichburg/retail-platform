import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCustomers } from '@/hooks/use-customers';
import { useCreateWorkOrder, useUpdateWorkOrder, useWorkOrder } from '@/hooks/use-work-orders';
import { ArrowLeft, Plus, Trash2, ClipboardList } from 'lucide-react';

interface WOLine {
  description: string;
  productVariantId: string | null;
  productName: string | null;
  sku: string | null;
  quantity: number;
  unitPrice: number;
}

export function WorkOrderFormPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { data: customers } = useCustomers({ pageSize: 100 });
  const createWO = useCreateWorkOrder();
  const updateWO = useUpdateWorkOrder();
  const { data: existing } = useWorkOrder(id || '');

  const [customerId, setCustomerId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [lines, setLines] = useState<WOLine[]>([]);

  useEffect(() => {
    if (existing && isEdit) {
      setCustomerId(existing.customerId);
      setCustomerName(existing.customerName);
      setCustomerPhone(existing.customerPhone || '');
      setCustomerEmail(existing.customerEmail || '');
      setDueDate(existing.dueDate || '');
      setNotes(existing.notes || '');
      setLines(existing.lines.map(l => ({
        description: l.description,
        productVariantId: l.productVariantId,
        productName: l.productName,
        sku: l.sku,
        quantity: l.quantity,
        unitPrice: l.unitPrice,
      })));
    }
  }, [existing, isEdit]);

  const totalAmount = lines.reduce((sum, l) => sum + l.quantity * l.unitPrice, 0);

  const handleCustomerChange = (selectedId: string) => {
    setCustomerId(selectedId);
    const cust = customers?.items?.find((c: any) => c.id === selectedId);
    if (cust) {
      setCustomerName(`${cust.firstName} ${cust.lastName}`);
      setCustomerPhone(cust.phone || '');
      setCustomerEmail(cust.email || '');
    }
  };

  const addLine = () => {
    setLines([...lines, { description: '', productVariantId: null, productName: null, sku: null, quantity: 1, unitPrice: 0 }]);
  };

  const updateLine = (index: number, field: keyof WOLine, value: string | number) => {
    const updated = [...lines];
    updated[index] = { ...updated[index], [field]: value };
    setLines(updated);
  };

  const removeLine = (index: number) => setLines(lines.filter((_, i) => i !== index));

  const handleSubmit = async () => {
    const payload = {
      customerId,
      customerName,
      customerPhone: customerPhone || null,
      customerEmail: customerEmail || null,
      dueDate: dueDate || null,
      notes: notes || null,
      lines,
    };
    if (isEdit) {
      await updateWO.mutateAsync({ id, ...payload });
    } else {
      await createWO.mutateAsync(payload);
    }
    navigate('/work-orders');
  };

  const isPending = createWO.isPending || updateWO.isPending;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <button onClick={() => navigate('/work-orders')} className="btn-ghost !px-0 mb-4 text-slate-500 hover:text-slate-700">
          <ArrowLeft className="h-4 w-4" /> Back to work orders
        </button>
        <h1 className="page-title">{isEdit ? 'Edit Work Order' : 'New Work Order'}</h1>
      </div>

      {/* Header */}
      <div className="card p-6 space-y-5">
        <h3 className="section-label">Order Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Customer</label>
            <select value={customerId} onChange={(e) => handleCustomerChange(e.target.value)} className="input-field">
              <option value="">Select customer...</option>
              {customers?.items?.map((c: any) => <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Due Date</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="input-field" />
          </div>
        </div>
        {customerId && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Phone</label>
              <input type="text" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="input-field" placeholder="Optional" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
              <input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} className="input-field" placeholder="Optional" />
            </div>
          </div>
        )}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Notes</label>
          <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional" className="input-field" />
        </div>
      </div>

      {/* Line Items */}
      <div className="card">
        <div className="border-b border-slate-100 px-5 py-3 flex items-center justify-between">
          <h3 className="section-label">Line Items</h3>
          <button onClick={addLine} className="btn-secondary text-xs"><Plus className="h-3.5 w-3.5" /> Add line</button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <ClipboardList className="h-8 w-8 text-slate-300 mb-3" />
            <p className="text-sm font-medium text-slate-500">No items yet</p>
            <p className="mt-1 text-xs text-slate-400">Add line items describing the work to be done</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="table-header">Description</th>
                  <th className="table-header text-center w-24">Qty</th>
                  <th className="table-header text-right w-32">Unit Price</th>
                  <th className="table-header text-right w-28">Line Total</th>
                  <th className="table-header w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {lines.map((line, i) => (
                  <tr key={i}>
                    <td className="table-cell">
                      <input
                        type="text"
                        value={line.description}
                        onChange={(e) => updateLine(i, 'description', e.target.value)}
                        placeholder="e.g., Embroider company logo on left chest"
                        className="w-full rounded border border-slate-200 px-3 py-1.5 text-sm focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/20"
                      />
                    </td>
                    <td className="table-cell text-center">
                      <input type="number" min={1} value={line.quantity} onChange={(e) => updateLine(i, 'quantity', parseInt(e.target.value) || 1)} className="w-20 rounded border border-slate-200 px-2 py-1 text-center text-sm tabular-nums focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/20" />
                    </td>
                    <td className="table-cell text-right">
                      <div className="relative inline-block">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-slate-400">$</span>
                        <input type="number" step="0.01" min={0} value={line.unitPrice} onChange={(e) => updateLine(i, 'unitPrice', parseFloat(e.target.value) || 0)} className="w-24 rounded border border-slate-200 pl-5 pr-2 py-1 text-right text-sm tabular-nums focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400/20" />
                      </div>
                    </td>
                    <td className="table-cell text-right font-semibold tabular-nums text-slate-900">${(line.quantity * line.unitPrice).toFixed(2)}</td>
                    <td className="table-cell"><button onClick={() => removeLine(i)} className="text-slate-300 hover:text-red-500"><Trash2 className="h-4 w-4" /></button></td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-slate-200">
                  <td colSpan={3} className="px-4 py-3 text-right text-sm font-medium text-slate-500">Total</td>
                  <td className="px-4 py-3 text-right text-base font-bold tabular-nums text-slate-900">${totalAmount.toFixed(2)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <button onClick={() => navigate('/work-orders')} className="btn-secondary">Cancel</button>
        <button onClick={handleSubmit} disabled={!customerId || lines.length === 0 || lines.some(l => !l.description) || isPending} className="btn-primary">
          {isPending ? 'Saving...' : isEdit ? 'Update Work Order' : 'Create Work Order (Draft)'}
        </button>
      </div>
    </div>
  );
}
