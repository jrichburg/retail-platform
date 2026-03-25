import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '../../src/stores/auth-store';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();

  const handleLogin = async () => {
    setLoading(true);
    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#f9fafb' }}>
      <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 4 }}>Retail POS</Text>
      <Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 32 }}>Sign in to start your session</Text>

      <Text style={{ fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 4 }}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={{ borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 12, marginBottom: 16, backgroundColor: 'white' }}
      />

      <Text style={{ fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 4 }}>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 12, marginBottom: 24, backgroundColor: 'white' }}
      />

      <TouchableOpacity
        onPress={handleLogin}
        disabled={loading}
        style={{ backgroundColor: '#111827', borderRadius: 8, padding: 14, alignItems: 'center', opacity: loading ? 0.5 : 1 }}
      >
        <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>{loading ? 'Signing in...' : 'Sign In'}</Text>
      </TouchableOpacity>
    </View>
  );
}
