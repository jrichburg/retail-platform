import axios from 'axios';
import { supabase } from './supabase';

const api = axios.create({
  baseURL: '/api/v1',
});

api.interceptors.request.use(async (config) => {
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
