import { View, Text, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

export default function ReceiptScreen() {
  const { transactionNumber, total, change, status } = useLocalSearchParams<{
    saleId: string; transactionNumber: string; total: string; change: string; status: string;
  }>();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#f9fafb' }}>
      <Text style={{ fontSize: 48, marginBottom: 16 }}>✓</Text>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 4 }}>Sale Complete</Text>
      <Text style={{ color: '#6b7280', marginBottom: 24 }}>{transactionNumber}</Text>

      {status === 'pending' && (
        <View style={{ backgroundColor: '#fef3c7', padding: 12, borderRadius: 8, marginBottom: 16 }}>
          <Text style={{ color: '#92400e', textAlign: 'center' }}>Offline — will sync when connected</Text>
        </View>
      )}

      <View style={{ backgroundColor: 'white', borderRadius: 8, padding: 24, width: '100%', marginBottom: 24 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text style={{ color: '#6b7280' }}>Total</Text>
          <Text style={{ fontWeight: '600' }}>${total}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ color: '#6b7280' }}>Change</Text>
          <Text style={{ fontWeight: '600' }}>${change}</Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => router.replace('/(tabs)')}
        style={{ backgroundColor: '#111827', borderRadius: 8, padding: 16, width: '100%', alignItems: 'center' }}
      >
        <Text style={{ color: 'white', fontWeight: '700', fontSize: 16 }}>New Transaction</Text>
      </TouchableOpacity>
    </View>
  );
}
