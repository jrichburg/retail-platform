import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { isDemo } from '@/lib/api';

export interface TenantSettingItem {
  id: string;
  tenantNodeId: string;
  settingsKey: string;
  settingsValue: string;
  isLocked: boolean;
}

export interface StoreProfile {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  website: string;
}

export interface TaxConfig {
  defaultTaxRate: number;
  taxInclusivePricing: boolean;
}

export interface ReceiptConfig {
  headerText: string;
  footerText: string;
  showStoreAddress: boolean;
  showStorePhone: boolean;
}

export interface PosDefaults {
  defaultTenderType: string;
  autoPrintReceipt: boolean;
  requireCustomerForSale: boolean;
}

const rootId = '00000000-0000-0000-0000-000000000010';
const store1Id = '00000000-0000-0000-0000-000000000011';
const store2Id = '00000000-0000-0000-0000-000000000012';

const demoSettingsMap: Record<string, TenantSettingItem[]> = {
  [rootId]: [
    {
      id: 'set-root-1', tenantNodeId: rootId, settingsKey: 'store_profile', isLocked: false,
      settingsValue: JSON.stringify({
        name: 'Demo Retailer', address: '', city: 'Springfield', state: 'IL', zip: '62701',
        phone: '(555) 000-0000', email: 'info@demoretailer.com', website: 'www.demoretailer.com',
      }),
    },
    {
      id: 'set-root-2', tenantNodeId: rootId, settingsKey: 'tax_config', isLocked: true,
      settingsValue: JSON.stringify({ defaultTaxRate: 8.25, taxInclusivePricing: false }),
    },
    {
      id: 'set-root-3', tenantNodeId: rootId, settingsKey: 'receipt_config', isLocked: false,
      settingsValue: JSON.stringify({
        headerText: 'Thank you for shopping with us!',
        footerText: 'Returns accepted within 30 days with receipt.',
        showStoreAddress: true, showStorePhone: true,
      }),
    },
    {
      id: 'set-root-4', tenantNodeId: rootId, settingsKey: 'pos_defaults', isLocked: false,
      settingsValue: JSON.stringify({ defaultTenderType: 'cash', autoPrintReceipt: true, requireCustomerForSale: false }),
    },
  ],
  [store1Id]: [
    {
      id: 'set-s1-1', tenantNodeId: store1Id, settingsKey: 'store_profile', isLocked: false,
      settingsValue: JSON.stringify({
        name: 'Main Street Store', address: '123 Main Street', city: 'Springfield', state: 'IL', zip: '62701',
        phone: '(555) 123-4567', email: 'mainstreet@demoretailer.com', website: 'www.demoretailer.com',
      }),
    },
    {
      id: 'set-s1-2', tenantNodeId: store1Id, settingsKey: 'tax_config', isLocked: false,
      settingsValue: JSON.stringify({ defaultTaxRate: 8.25, taxInclusivePricing: false }),
    },
    {
      id: 'set-s1-3', tenantNodeId: store1Id, settingsKey: 'receipt_config', isLocked: false,
      settingsValue: JSON.stringify({
        headerText: 'Thanks for visiting Main Street Store!',
        footerText: 'Returns accepted within 30 days with receipt.',
        showStoreAddress: true, showStorePhone: true,
      }),
    },
    {
      id: 'set-s1-4', tenantNodeId: store1Id, settingsKey: 'pos_defaults', isLocked: false,
      settingsValue: JSON.stringify({ defaultTenderType: 'cash', autoPrintReceipt: true, requireCustomerForSale: false }),
    },
  ],
  [store2Id]: [
    {
      id: 'set-s2-1', tenantNodeId: store2Id, settingsKey: 'store_profile', isLocked: false,
      settingsValue: JSON.stringify({
        name: 'Mall Location', address: '456 Mall Boulevard, Suite 120', city: 'Springfield', state: 'IL', zip: '62702',
        phone: '(555) 987-6543', email: 'mall@demoretailer.com', website: 'www.demoretailer.com',
      }),
    },
    {
      id: 'set-s2-2', tenantNodeId: store2Id, settingsKey: 'tax_config', isLocked: false,
      settingsValue: JSON.stringify({ defaultTaxRate: 9.00, taxInclusivePricing: false }),
    },
    {
      id: 'set-s2-3', tenantNodeId: store2Id, settingsKey: 'receipt_config', isLocked: false,
      settingsValue: JSON.stringify({
        headerText: 'Thanks for visiting us at the Mall!',
        footerText: 'Returns accepted within 30 days with receipt.',
        showStoreAddress: true, showStorePhone: true,
      }),
    },
    {
      id: 'set-s2-4', tenantNodeId: store2Id, settingsKey: 'pos_defaults', isLocked: false,
      settingsValue: JSON.stringify({ defaultTenderType: 'card', autoPrintReceipt: true, requireCustomerForSale: false }),
    },
  ],
};

export function useSettings(tenantNodeId: string | null) {
  return useQuery({
    queryKey: ['settings', tenantNodeId],
    queryFn: async () => {
      if (isDemo) return demoSettingsMap[tenantNodeId!] || [];
      const { data } = await api.get('/tenants/settings', { params: { tenantNodeId } });
      return data as TenantSettingItem[];
    },
    enabled: !!tenantNodeId,
  });
}

export function useUpdateSetting() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ tenantNodeId, key, value }: { tenantNodeId: string; key: string; value: string }) => {
      if (isDemo) return {};
      await api.put('/tenants/settings', {
        tenantNodeId,
        settingsKey: key,
        settingsValue: value,
      });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['settings'] }),
  });
}

export function getSettingValue<T>(settings: TenantSettingItem[] | undefined, key: string, defaultValue: T): T {
  const setting = settings?.find((s) => s.settingsKey === key);
  if (!setting) return defaultValue;
  try {
    return JSON.parse(setting.settingsValue) as T;
  } catch {
    return defaultValue;
  }
}
