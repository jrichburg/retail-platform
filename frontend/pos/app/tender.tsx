import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useTransactionStore } from '../src/stores/transaction-store';

export default function TenderScreen() {
  const { total, completeSale } = useTransactionStore();
  const [tenderedAmount, setTenderedAmount] = useState(total.toFixed(2));
  const [processing, setProcessing] = useState(false);

  const amountNum = parseFloat(tenderedAmount) || 0;
  const change = amountNum - total;

  const handleCashTender = async () => {
    if (amountNum < total) return;
    setProcessing(true);
    try {
      const sale = await completeSale('cash', amountNum);
      router.replace({ pathname: '/receipt', params: { saleId: sale.id, transactionNumber: sale.transactionNumber, total: total.toFixed(2), change: change.toFixed(2), status: sale.status } });
    } catch (error) {
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 24, backgroundColor: '#f9fafb' }}>
      <View style={{ alignItems: 'center', marginBottom: 32 }}>
        <Text style={{ color: '#6b7280', fontSize: 16 }}>Amount Due</Text>
        <Text style={{ fontSize: 40, fontWeight: 'bold' }}>${total.toFixed(2)}</Text>
      </View>

      <Text style={{ fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 4 }}>Amount Tendered</Text>
      <TextInput
        value={tenderedAmount}
        onChangeText={setTenderedAmount}
        keyboardType="decimal-pad"
        style={{ borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 16, fontSize: 24, textAlign: 'center', backgroundColor: 'white', marginBottom: 16 }}
      />

      {change >= 0 && amountNum > 0 && (
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <Text style={{ color: '#6b7280' }}>Change Due</Text>
          <Text style={{ fontSize: 24, fontWeight: '600', color: '#059669' }}>${change.toFixed(2)}</Text>
        </View>
      )}

      <TouchableOpacity
        onPress={handleCashTender}
        disabled={amountNum < total || processing}
        style={{ backgroundColor: amountNum >= total && !processing ? '#059669' : '#d1d5db', borderRadius: 8, padding: 16, alignItems: 'center' }}
      >
        <Text style={{ color: 'white', fontWeight: '700', fontSize: 18 }}>{processing ? 'Processing...' : 'Complete Cash Sale'}</Text>
      </TouchableOpacity>
    </View>
  );
}
