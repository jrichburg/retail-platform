import { useParams, Link } from 'react-router-dom';
import { useSale } from '@/hooks/use-sales';

export function SaleDetailPage() {
  const { id } = useParams();
  const { data: sale, isLoading } = useSale(id || '');

  if (isLoading) return <p className="text-sm text-gray-500">Loading...</p>;
  if (!sale) return <p className="text-sm text-red-600">Sale not found.</p>;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Transaction {sale.transactionNumber}</h2>
        <Link to="/sales" className="text-sm text-blue-600 hover:text-blue-800">Back to sales</Link>
      </div>
      <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Date</span>
          <span>{new Date(sale.transactionDate).toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Status</span>
          <span className={`font-medium ${sale.status === 'completed' ? 'text-green-600' : 'text-red-600'}`}>{sale.status}</span>
        </div>

        <hr />
        <h3 className="text-sm font-medium text-gray-900">Items</h3>
        {sale.lineItems.map((item, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span>{item.productName} <span className="text-gray-400">x{item.quantity}</span></span>
            <span>${item.lineTotal.toFixed(2)}</span>
          </div>
        ))}

        <hr />
        <div className="space-y-1">
          <div className="flex justify-between text-sm"><span className="text-gray-500">Subtotal</span><span>${sale.subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between text-sm"><span className="text-gray-500">Tax ({(sale.taxRate * 100).toFixed(1)}%)</span><span>${sale.taxAmount.toFixed(2)}</span></div>
          <div className="flex justify-between text-sm font-medium"><span>Total</span><span>${sale.totalAmount.toFixed(2)}</span></div>
        </div>

        <hr />
        <h3 className="text-sm font-medium text-gray-900">Tenders</h3>
        {sale.tenders.map((tender, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className="capitalize">{tender.tenderType}</span>
            <span>${tender.amount.toFixed(2)}</span>
          </div>
        ))}
        {sale.changeAmount > 0 && (
          <div className="flex justify-between text-sm text-gray-500"><span>Change</span><span>${sale.changeAmount.toFixed(2)}</span></div>
        )}
      </div>
    </div>
  );
}
