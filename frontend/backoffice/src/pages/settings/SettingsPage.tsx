import { useState, useEffect } from 'react';
import { useSettings, useUpdateSetting, getSettingValue } from '@/hooks/use-settings';
import type { StoreProfile, TaxConfig, ReceiptConfig, PosDefaults } from '@/hooks/use-settings';
import { useTenantStore } from '@/stores/tenant-store';
import { Settings, Store, Receipt, Calculator, Monitor, Check, Building2 } from 'lucide-react';

const tabs = [
  { key: 'store_profile', label: 'Store Profile', icon: Store },
  { key: 'tax_config', label: 'Tax', icon: Calculator },
  { key: 'receipt_config', label: 'Receipt', icon: Receipt },
  { key: 'pos_defaults', label: 'POS', icon: Monitor },
];

const defaultStoreProfile: StoreProfile = { name: '', address: '', city: '', state: '', zip: '', phone: '', email: '', website: '' };
const defaultTaxConfig: TaxConfig = { defaultTaxRate: 0, taxInclusivePricing: false };
const defaultReceiptConfig: ReceiptConfig = { headerText: '', footerText: '', showStoreAddress: true, showStorePhone: true };
const defaultPosDefaults: PosDefaults = { defaultTenderType: 'cash', autoPrintReceipt: true, requireCustomerForSale: false };

export function SettingsPage() {
  const root = useTenantStore((s) => s.root());
  const stores = useTenantStore((s) => s.stores());
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Default to root on first render
  useEffect(() => {
    if (!selectedNodeId && root) setSelectedNodeId(root.id);
  }, [root, selectedNodeId]);

  const isRoot = selectedNodeId === root?.id;
  const selectedName = isRoot ? 'All Stores' : stores.find(s => s.id === selectedNodeId)?.name || '';

  const { data: settings, isLoading } = useSettings(selectedNodeId);
  const updateSetting = useUpdateSetting();
  const [activeTab, setActiveTab] = useState('store_profile');
  const [saved, setSaved] = useState(false);

  const [storeProfile, setStoreProfile] = useState<StoreProfile>(defaultStoreProfile);
  const [taxConfig, setTaxConfig] = useState<TaxConfig>(defaultTaxConfig);
  const [receiptConfig, setReceiptConfig] = useState<ReceiptConfig>(defaultReceiptConfig);
  const [posDefaults, setPosDefaults] = useState<PosDefaults>(defaultPosDefaults);

  useEffect(() => {
    if (settings) {
      setStoreProfile(getSettingValue(settings, 'store_profile', defaultStoreProfile));
      setTaxConfig(getSettingValue(settings, 'tax_config', defaultTaxConfig));
      setReceiptConfig(getSettingValue(settings, 'receipt_config', defaultReceiptConfig));
      setPosDefaults(getSettingValue(settings, 'pos_defaults', defaultPosDefaults));
    }
  }, [settings]);

  const handleSave = async () => {
    if (!selectedNodeId) return;
    const valueMap: Record<string, unknown> = {
      store_profile: storeProfile,
      tax_config: taxConfig,
      receipt_config: receiptConfig,
      pos_defaults: posDefaults,
    };
    await updateSetting.mutateAsync({ tenantNodeId: selectedNodeId, key: activeTab, value: JSON.stringify(valueMap[activeTab]) });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (isLoading) return <div className="flex items-center justify-center py-20"><div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-amber-500" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">Manage store configuration and preferences</p>
      </div>

      {/* Scope Selector */}
      <div className="flex items-center gap-2">
        <Building2 className="h-4 w-4 text-slate-400" />
        <span className="text-sm font-medium text-slate-500">Editing settings for:</span>
        <div className="flex gap-1 rounded-lg border border-slate-200 bg-white p-0.5">
          {root && (
            <button
              onClick={() => setSelectedNodeId(root.id)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                isRoot ? 'bg-amber-100 text-amber-800' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              All Stores
            </button>
          )}
          {stores.map(store => (
            <button
              key={store.id}
              onClick={() => setSelectedNodeId(store.id)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                selectedNodeId === store.id ? 'bg-amber-100 text-amber-800' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {store.name}
            </button>
          ))}
        </div>
      </div>

      {isRoot && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
          Editing defaults for all stores. Individual stores can override these settings.
        </div>
      )}

      <div className="flex gap-6">
        {/* Tab List */}
        <div className="w-52 shrink-0 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-amber-50 text-amber-800'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <tab.icon className={`h-4 w-4 ${activeTab === tab.key ? 'text-amber-600' : 'text-slate-400'}`} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="card p-6">
            {activeTab === 'store_profile' && (
              <StoreProfileSection value={storeProfile} onChange={setStoreProfile} />
            )}
            {activeTab === 'tax_config' && (
              <TaxConfigSection value={taxConfig} onChange={setTaxConfig} />
            )}
            {activeTab === 'receipt_config' && (
              <ReceiptConfigSection value={receiptConfig} onChange={setReceiptConfig} />
            )}
            {activeTab === 'pos_defaults' && (
              <PosDefaultsSection value={posDefaults} onChange={setPosDefaults} />
            )}

            <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
              {saved && (
                <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                  <Check className="h-4 w-4" /> Saved
                </span>
              )}
              <button onClick={handleSave} disabled={updateSetting.isPending} className="btn-primary">
                {updateSetting.isPending ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StoreProfileSection({ value, onChange }: { value: StoreProfile; onChange: (v: StoreProfile) => void }) {
  const update = (field: keyof StoreProfile, val: string) => onChange({ ...value, [field]: val });
  return (
    <div className="space-y-5">
      <h3 className="section-label">Store Profile</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Store Name</label>
          <input type="text" value={value.name} onChange={(e) => update('name', e.target.value)} className="input-field" />
        </div>
        <div className="col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Address</label>
          <input type="text" value={value.address} onChange={(e) => update('address', e.target.value)} className="input-field" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">City</label>
          <input type="text" value={value.city} onChange={(e) => update('city', e.target.value)} className="input-field" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">State</label>
            <input type="text" value={value.state} onChange={(e) => update('state', e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">ZIP</label>
            <input type="text" value={value.zip} onChange={(e) => update('zip', e.target.value)} className="input-field" />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Phone</label>
          <input type="text" value={value.phone} onChange={(e) => update('phone', e.target.value)} className="input-field" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
          <input type="email" value={value.email} onChange={(e) => update('email', e.target.value)} className="input-field" />
        </div>
        <div className="col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Website</label>
          <input type="text" value={value.website} onChange={(e) => update('website', e.target.value)} className="input-field" />
        </div>
      </div>
    </div>
  );
}

function TaxConfigSection({ value, onChange }: { value: TaxConfig; onChange: (v: TaxConfig) => void }) {
  return (
    <div className="space-y-5">
      <h3 className="section-label">Tax Configuration</h3>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">Default Tax Rate (%)</label>
        <div className="relative w-40">
          <input
            type="number" step="0.01" min={0} max={100}
            value={value.defaultTaxRate}
            onChange={(e) => onChange({ ...value, defaultTaxRate: parseFloat(e.target.value) || 0 })}
            className="input-field !pr-8"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">%</span>
        </div>
      </div>
      <ToggleField
        label="Tax-Inclusive Pricing"
        description="Display prices with tax included"
        checked={value.taxInclusivePricing}
        onChange={(checked) => onChange({ ...value, taxInclusivePricing: checked })}
      />
    </div>
  );
}

function ReceiptConfigSection({ value, onChange }: { value: ReceiptConfig; onChange: (v: ReceiptConfig) => void }) {
  return (
    <div className="space-y-5">
      <h3 className="section-label">Receipt Settings</h3>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">Header Text</label>
        <textarea
          value={value.headerText}
          onChange={(e) => onChange({ ...value, headerText: e.target.value })}
          rows={2}
          className="input-field resize-none"
          placeholder="Printed at the top of receipts"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">Footer Text</label>
        <textarea
          value={value.footerText}
          onChange={(e) => onChange({ ...value, footerText: e.target.value })}
          rows={2}
          className="input-field resize-none"
          placeholder="Printed at the bottom of receipts"
        />
      </div>
      <ToggleField
        label="Show Store Address"
        description="Print store address on receipts"
        checked={value.showStoreAddress}
        onChange={(checked) => onChange({ ...value, showStoreAddress: checked })}
      />
      <ToggleField
        label="Show Store Phone"
        description="Print store phone number on receipts"
        checked={value.showStorePhone}
        onChange={(checked) => onChange({ ...value, showStorePhone: checked })}
      />
    </div>
  );
}

function PosDefaultsSection({ value, onChange }: { value: PosDefaults; onChange: (v: PosDefaults) => void }) {
  return (
    <div className="space-y-5">
      <h3 className="section-label">POS Defaults</h3>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">Default Tender Type</label>
        <select
          value={value.defaultTenderType}
          onChange={(e) => onChange({ ...value, defaultTenderType: e.target.value })}
          className="input-field w-48"
        >
          <option value="cash">Cash</option>
          <option value="card">Card</option>
        </select>
      </div>
      <ToggleField
        label="Auto-Print Receipt"
        description="Automatically print receipt after each sale"
        checked={value.autoPrintReceipt}
        onChange={(checked) => onChange({ ...value, autoPrintReceipt: checked })}
      />
      <ToggleField
        label="Require Customer for Sale"
        description="Require a customer to be selected before completing a sale"
        checked={value.requireCustomerForSale}
        onChange={(checked) => onChange({ ...value, requireCustomerForSale: checked })}
      />
    </div>
  );
}

function ToggleField({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3">
      <div>
        <p className="text-sm font-medium text-slate-900">{label}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition-colors ${checked ? 'bg-amber-500' : 'bg-slate-200'}`}
      >
        <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${checked ? 'translate-x-5' : ''}`} />
      </button>
    </div>
  );
}
