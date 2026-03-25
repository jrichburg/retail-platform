import { useState, useCallback } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { useTransactionStore } from '../../src/stores/transaction-store';
import { getDatabase } from '../../src/lib/database';

export default function TransactionScreen() {
  const [searchText, setSearchText] = useState('');
  const { lineItems, subtotal, taxAmount, total, addItem, removeItem, updateQuantity } = useTransactionStore();

  const handleLookup = useCallback(async () => {
    if (!searchText.trim()) return;
    try {
      const db = await getDatabase();
      const product = await db.getFirstAsync<{
        id: string; sku: string; upc: string; name: string; retail_price: number; category_name: string;
      }>(
        'SELECT * FROM products WHERE sku = ? OR upc = ? LIMIT 1',
        [searchText.trim(), searchText.trim()]
      );

      if (product) {
        addItem(product);
        setSearchText('');
      } else {
        Alert.alert('Not Found', `No product found for "${searchText}"`);
      }
    } catch (error) {
      console.error('Lookup error:', error);
    }
  }, [searchText, addItem]);

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      {/* Search bar */}
      <View style={{ padding: 12, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' }}>
        <TextInput
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleLookup}
          placeholder="Scan or type SKU/UPC..."
          returnKeyType="search"
          autoFocus
          style={{ borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: '#f9fafb' }}
        />
      </View>

      {/* Line items */}
      <FlatList
        data={lineItems}
        keyExtractor={(_, i) => i.toString()}
        style={{ flex: 1 }}
        ListEmptyComponent={
          <View style={{ padding: 40, alignItems: 'center' }}>
            <Text style={{ color: '#9ca3af', fontSize: 16 }}>Scan an item to begin</Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <View style={{ flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '600' }}>{item.name}</Text>
              <Text style={{ fontSize: 12, color: '#6b7280' }}>{item.sku} — ${item.unitPrice.toFixed(2)}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <TouchableOpacity onPress={() => updateQuantity(index, item.quantity - 1)} style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: '600' }}>-</Text>
              </TouchableOpacity>
              <Text style={{ fontSize: 16, fontWeight: '600', minWidth: 24, textAlign: 'center' }}>{item.quantity}</Text>
              <TouchableOpacity onPress={() => updateQuantity(index, item.quantity + 1)} style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: '600' }}>+</Text>
              </TouchableOpacity>
              <Text style={{ fontSize: 14, fontWeight: '600', minWidth: 60, textAlign: 'right' }}>${item.lineTotal.toFixed(2)}</Text>
            </View>
          </View>
        )}
      />

      {/* Totals + Tender button */}
      <View style={{ padding: 16, backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#e5e7eb' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
          <Text style={{ color: '#6b7280' }}>Subtotal</Text>
          <Text>${subtotal.toFixed(2)}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text style={{ color: '#6b7280' }}>Tax</Text>
          <Text>${taxAmount.toFixed(2)}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Total</Text>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>${total.toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push('/tender')}
          disabled={lineItems.length === 0}
          style={{ backgroundColor: lineItems.length > 0 ? '#111827' : '#d1d5db', borderRadius: 8, padding: 16, alignItems: 'center' }}
        >
          <Text style={{ color: 'white', fontWeight: '700', fontSize: 18 }}>Tender</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
