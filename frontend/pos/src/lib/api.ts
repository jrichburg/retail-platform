import axios from 'axios';
import { supabase } from './supabase';
import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }

  const tenantNodeId = await SecureStore.getItemAsync('tenantNodeId');
  if (tenantNodeId) {
    config.headers['X-Tenant-Node-Id'] = tenantNodeId;
  }

  return config;
});

export default api;
