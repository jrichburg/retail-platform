import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { demoProducts, demoCustomers } from '@/lib/demo-data';
import { Search, X, ShoppingBag, Minus, Plus, Trash2, ArrowLeft, User, ChevronDown } from 'lucide-react';

interface LineItem {
  productId: string;
  variantId: string | null;
  name: string;
  sku: string;
  variantDesc: string | null;
  upc: string | null;
  price: number;
  quantity: number;
}

const TAX_RATE = 0.08;

export function PosTransactionPage() {
  const navigate = useNavigate();
  const [lines, setLines] = useState<LineItem[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const scanRef = useRef<HTMLInputElement>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<{ id: string; firstName: string; lastName: string } | null>(null);
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);
  const [customerQuery, setCustomerQuery] = useState('');

  const filteredCustomers = customerQuery
    ? demoCustomers.items.filter(c =>
        c.firstName.toLowerCase().includes(customerQuery.toLowerCase()) ||
        c.lastName.toLowerCase().includes(customerQuery.toLowerCase()) ||
        c.email?.toLowerCase().includes(customerQuery.toLowerCase()) ||
        c.phone?.includes(customerQuery)
      )
    : demoCustomers.items;

  const subtotal = lines.reduce((s, l) => s + l.price * l.quantity, 0);
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = subtotal + tax;

  const addItem = useCallback((product: any, variant?: any) => {
    const variantDesc = variant ? [variant.dimension1Value, variant.dimension2Value].filter(Boolean).join(' / ') : null;
    const key = `${product.id}-${variant?.id || 'default'}`;

    setLines(prev => {
      const existing = prev.findIndex(l => `${l.productId}-${l.variantId || 'default'}` === key);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { ...updated[existing], quantity: updated[existing].quantity + 1 };
        return updated;
      }
      return [...prev, {
        productId: product.id,
        variantId: variant?.id || null,
        name: product.name,
        sku: product.sku,
        variantDesc,
        upc: variant?.upc || null,
        price: product.retailPrice,
        quantity: 1,
      }];
    });
  }, []);

  const handleScan = useCallback(() => {
    if (!searchValue.trim()) return;
    const term = searchValue.trim().toLowerCase();

    // Try UPC first
    for (const p of demoProducts.items) {
      const variant = p.variants?.find(v => v.upc === term);
      if (variant) {
        addItem(p, variant);
        setSearchValue('');
        scanRef.current?.focus();
        return;
      }
    }

    // Try SKU
    const bysku = demoProducts.items.find(p => p.sku.toLowerCase() === term);
    if (bysku) {
      addItem(bysku);
      setSearchValue('');
      scanRef.current?.focus();
      return;
    }

    // Show search panel
    setShowSearch(true);
  }, [searchValue, addItem]);

  const updateQty = (index: number, delta: number) => {
    setLines(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], quantity: Math.max(0, updated[index].quantity + delta) };
      return updated.filter(l => l.quantity > 0);
    });
  };

  const removeLine = (index: number) => setLines(prev => prev.filter((_, i) => i !== index));

  const searchResults = showSearch && searchValue
    ? demoProducts.items.filter(p =>
        p.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchValue.toLowerCase())
      )
    : [];

  return (
    <div className="flex h-screen">
      {/* Left: Line Items */}
      <div className="flex flex-1 flex-col">
        {/* POS Header */}
        <div className="flex h-14 items-center justify-between bg-slate-900 px-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400">
              <span className="text-sm font-bold text-slate-900">R</span>
            </div>
            <span className="text-sm font-semibold text-white">POS Terminal</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setShowCustomerSearch(!showCustomerSearch)}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  selectedCustomer
                    ? 'bg-amber-400/20 text-amber-300 hover:bg-amber-400/30'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                <User className="h-3.5 w-3.5" />
                {selectedCustomer ? `${selectedCustomer.firstName} ${selectedCustomer.lastName}` : 'Customer'}
                <ChevronDown className="h-3 w-3" />
              </button>
              {showCustomerSearch && (
                <div className="absolute right-0 top-full mt-2 w-72 rounded-xl border border-gray-200 bg-white shadow-xl z-50">
                  <div className="p-2">
                    <input
                      type="text"
                      value={customerQuery}
                      onChange={(e) => setCustomerQuery(e.target.value)}
                      placeholder="Search customers..."
                      autoFocus
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {selectedCustomer && (
                      <button
                        onClick={() => { setSelectedCustomer(null); setShowCustomerSearch(false); setCustomerQuery(''); }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <X className="h-3 w-3" /> Remove customer
                      </button>
                    )}
                    {filteredCustomers.map(c => (
                      <button
                        key={c.id}
                        onClick={() => { setSelectedCustomer({ id: c.id, firstName: c.firstName, lastName: c.lastName }); setShowCustomerSearch(false); setCustomerQuery(''); }}
                        className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                          <span className="text-[10px] font-bold">{c.firstName[0]}{c.lastName[0]}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{c.firstName} {c.lastName}</p>
                          <p className="text-xs text-gray-400">{c.email || c.phone || 'No contact'}</p>
                        </div>
                      </button>
                    ))}
                    {filteredCustomers.length === 0 && (
                      <p className="px-3 py-4 text-center text-xs text-gray-400">No customers found</p>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Main Street Store</span>
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
            </div>
          </div>
        </div>

        {/* Scan Bar */}
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              ref={scanRef}
              type="text"
              value={searchValue}
              onChange={(e) => { setSearchValue(e.target.value); setShowSearch(e.target.value.length > 0); }}
              onKeyDown={(e) => { if (e.key === 'Enter') handleScan(); if (e.key === 'Escape') { setShowSearch(false); setSearchValue(''); } }}
              placeholder="Scan barcode or search product..."
              autoFocus
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-12 pr-4 text-base focus:border-amber-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/20"
            />
            {searchValue && (
              <button onClick={() => { setSearchValue(''); setShowSearch(false); scanRef.current?.focus(); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Search Results Dropdown */}
          {showSearch && searchResults.length > 0 && (
            <div className="mt-2 max-h-64 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg">
              {searchResults.map(product => (
                <div key={product.id} className="border-b border-gray-50 p-3 last:border-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-gray-900">{product.name}</span>
                    <span className="text-sm font-bold text-gray-900">${product.retailPrice.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{product.sku} · {product.supplierName} · {product.color}</p>
                  {product.variants && product.variants.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {product.variants.map(v => (
                        <button key={v.id} onClick={() => { addItem(product, v); setShowSearch(false); setSearchValue(''); scanRef.current?.focus(); }}
                          className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-amber-100 hover:text-amber-800 transition-colors">
                          {[v.dimension1Value, v.dimension2Value].filter(Boolean).join(' / ')}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <button onClick={() => { addItem(product); setShowSearch(false); setSearchValue(''); scanRef.current?.focus(); }}
                      className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-amber-100 hover:text-amber-800 transition-colors">
                      Add to sale
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Line Items */}
        <div className="flex-1 overflow-y-auto bg-white">
          {lines.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="h-16 w-16 text-gray-200 mb-4" />
              <p className="text-lg font-medium text-gray-400">No items</p>
              <p className="text-sm text-gray-300 mt-1">Scan a barcode or search to begin</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {lines.map((line, i) => (
                <div key={`${line.productId}-${line.variantId}`} className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{line.name}</p>
                    <p className="text-xs text-gray-500">
                      {line.sku}
                      {line.variantDesc && <span className="ml-1 text-gray-400">· {line.variantDesc}</span>}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <div className="flex items-center gap-1">
                      <button onClick={() => updateQty(i, -1)} className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 active:bg-gray-300 transition-colors">
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-bold tabular-nums">{line.quantity}</span>
                      <button onClick={() => updateQty(i, 1)} className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 active:bg-gray-300 transition-colors">
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <span className="w-20 text-right text-sm font-bold tabular-nums text-gray-900">${(line.price * line.quantity).toFixed(2)}</span>
                    <button onClick={() => removeLine(i)} className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-300 hover:bg-red-50 hover:text-red-500 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right: Totals Panel */}
      <div className="flex w-80 flex-col border-l border-gray-200 bg-white">
        <div className="flex-1 flex flex-col justify-end p-6">
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="tabular-nums text-gray-700">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Tax ({(TAX_RATE * 100).toFixed(0)}%)</span>
              <span className="tabular-nums text-gray-700">${tax.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-2xl font-bold tabular-nums text-gray-900">${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => lines.length > 0 && navigate('/pos/tender', { state: { lines, subtotal, tax, total } })}
              disabled={lines.length === 0}
              className="w-full rounded-xl bg-emerald-600 py-4 text-lg font-bold text-white hover:bg-emerald-700 active:bg-emerald-800 disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
            >
              Pay ${total.toFixed(2)}
            </button>
            {lines.length > 0 && (
              <button onClick={() => setLines([])} className="w-full rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors">
                Clear sale
              </button>
            )}
          </div>
        </div>

        {/* Items count */}
        <div className="border-t border-gray-200 px-6 py-3 text-center">
          <span className="text-xs text-gray-400">{lines.length} item{lines.length !== 1 ? 's' : ''} · {lines.reduce((s, l) => s + l.quantity, 0)} unit{lines.reduce((s, l) => s + l.quantity, 0) !== 1 ? 's' : ''}</span>
        </div>
      </div>
    </div>
  );
}
