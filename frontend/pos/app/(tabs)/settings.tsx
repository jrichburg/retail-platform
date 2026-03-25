import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '../../src/stores/auth-store';
import { syncCatalog, syncPendingTransactions } from '../../src/lib/sync';

export default function SettingsScreen() {
  const { user, logout } = useAuthStore();

  const handleSync = async () => {
    await syncCatalog();
    await syncPendingTransactions();
    Alert.alert('Sync Complete', 'Catalog and pending transactions synced.');
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#f9fafb' }}>
      <View style={{ backgroundColor: 'white', borderRadius: 8, padding: 16, marginBottom: 16 }}>
        <Text style={{ fontSize: 16, fontWeight: '600' }}>Account</Text>
        <Text style={{ color: '#6b7280', marginTop: 4 }}>{user?.email}</Text>
        <Text style={{ color: '#6b7280', marginTop: 2 }}>{user?.firstName} {user?.lastName}</Text>
      </View>

      <TouchableOpacity onPress={handleSync} style={{ backgroundColor: 'white', borderRadius: 8, padding: 16, marginBottom: 8, alignItems: 'center' }}>
        <Text style={{ color: '#111827', fontWeight: '600' }}>Sync Now</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogout} style={{ backgroundColor: 'white', borderRadius: 8, padding: 16, alignItems: 'center' }}>
        <Text style={{ color: '#dc2626', fontWeight: '600' }}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}
