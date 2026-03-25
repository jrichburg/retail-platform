import { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import api from '../../src/lib/api';

interface SaleSummary {
  id: string;
  transactionNumber: string;
  transactionDate: string;
  totalAmount: number;
  status: string;
}

export default function HistoryScreen() {
  const [sales, setSales] = useState<SaleSummary[]>([]);

  useEffect(() => {
    api.get('/sales', { params: { pageSize: 50 } })
      .then(({ data }) => setSales(data.items))
      .catch(() => {});
  }, []);

  return (
    <FlatList
      data={sales}
      keyExtractor={(item) => item.id}
      style={{ flex: 1, backgroundColor: '#f9fafb' }}
      ListEmptyComponent={
        <View style={{ padding: 40, alignItems: 'center' }}>
          <Text style={{ color: '#9ca3af' }}>No transactions yet</Text>
        </View>
      }
      renderItem={({ item }) => (
        <View style={{ padding: 16, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontWeight: '600', fontFamily: 'monospace' }}>{item.transactionNumber}</Text>
            <Text style={{ fontWeight: '600' }}>${item.totalAmount.toFixed(2)}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
            <Text style={{ color: '#6b7280', fontSize: 12 }}>{new Date(item.transactionDate).toLocaleString()}</Text>
            <Text style={{ color: item.status === 'completed' ? '#059669' : '#dc2626', fontSize: 12, fontWeight: '500' }}>{item.status}</Text>
          </View>
        </View>
      )}
    />
  );
}
