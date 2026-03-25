import { Link } from 'react-router-dom';
import { useSales } from '@/hooks/use-sales';

export function SalesPage() {
  const { data, isLoading } = useSales();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Sales</h2>
      {isLoading ? <p className="text-sm text-gray-500">Loading...</p> : (
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Transaction #</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Date</th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">Items</th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">Total</th>
                <th className="px-4 py-3 text-center text-xs font-medium uppercase text-gray-500">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {data?.items.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-mono text-gray-900">{sale.transactionNumber}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{new Date(sale.transactionDate).toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-sm text-gray-600">{sale.lineItems.length}</td>
                  <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">${sale.totalAmount.toFixed(2)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${sale.status === 'completed' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                      {sale.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link to={`/sales/${sale.id}`} className="text-sm text-blue-600 hover:text-blue-800">View</Link>
                  </td>
                </tr>
              ))}
              {data?.items.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500">No sales yet. Ring up transactions from the POS.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
