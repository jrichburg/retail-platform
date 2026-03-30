import axios from 'axios';
import { supabase } from './supabase';

export const isDemo = import.meta.env.VITE_DEMO_MODE === 'true' ||
  !import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.VITE_SUPABASE_URL === 'https://your-project.supabase.co';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
});

api.interceptors.request.use(async (config) => {
  if (isDemo) return config;

  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }

  const tenantNodeId = localStorage.getItem('tenantNodeId');
  if (tenantNodeId) {
    config.headers['X-Tenant-Node-Id'] = tenantNodeId;
  }

  return config;
});

export default api;
