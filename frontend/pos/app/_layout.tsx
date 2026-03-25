import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '../src/stores/auth-store';
import { syncCatalog, syncPendingTransactions } from '../src/lib/sync';

const queryClient = new QueryClient();

export default function RootLayout() {
  const { isAuthenticated, loadUser } = useAuthStore();

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      syncCatalog();
      syncPendingTransactions();
      // Periodic sync every 60 seconds
      const interval = setInterval(() => {
        syncPendingTransactions();
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="tender" options={{ presentation: 'modal', headerShown: true, headerTitle: 'Tender' }} />
        <Stack.Screen name="receipt" options={{ presentation: 'modal', headerShown: true, headerTitle: 'Receipt' }} />
      </Stack>
      <StatusBar style="auto" />
    </QueryClientProvider>
  );
}
