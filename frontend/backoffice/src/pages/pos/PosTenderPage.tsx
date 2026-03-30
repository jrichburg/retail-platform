import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Banknote, CreditCard, Delete } from 'lucide-react';

export function PosTenderPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { total = 0 } = (location.state as any) || {};
  const [amount, setAmount] = useState(total.toFixed(2));
  const [mode, setMode] = useState<'cash' | 'card'>('cash');

  const amountNum = parseFloat(amount) || 0;
  const change = amountNum - total;

  const quickAmounts = [
    Math.ceil(total),
    Math.ceil(total / 5) * 5,
    Math.ceil(total / 10) * 10,
    Math.ceil(total / 20) * 20,
  ].filter((v, i, a) => a.indexOf(v) === i && v >= total).slice(0, 4);

  const handleKeypad = (key: string) => {
    if (key === 'clear') { setAmount(''); return; }
    if (key === 'backspace') { setAmount(amount.slice(0, -1)); return; }
    if (key === '.' && amount.includes('.')) return;
    setAmount(amount + key);
  };

  const handleComplete = () => {
    navigate('/pos/receipt', {
      state: {
        total,
        tenderedAmount: mode === 'card' ? total : amountNum,
        change: mode === 'card' ? 0 : Math.max(0, change),
        tenderType: mode,
        transactionNumber: `MAIN-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`,
      },
    });
  };

  return (
    <div className="flex h-screen flex-col bg-gray-100">
      {/* Header */}
      <div className="flex h-14 items-center bg-slate-900 px-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="h-5 w-5" /> <span className="text-sm">Back to sale</span>
        </button>
      </div>

      <div className="flex flex-1">
        {/* Left: Amount + Keypad */}
        <div className="flex flex-1 flex-col items-center justify-center p-8">
          <p className="text-sm font-medium text-gray-500 mb-2">Amount Due</p>
          <p className="text-5xl font-bold tabular-nums text-gray-900 mb-8">${total.toFixed(2)}</p>

          {/* Tender type toggle */}
          <div className="flex gap-2 mb-6">
            <button onClick={() => setMode('cash')} className={`flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all ${mode === 'cash' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
              <Banknote className="h-5 w-5" /> Cash
            </button>
            <button onClick={() => setMode('card')} className={`flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all ${mode === 'card' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
              <CreditCard className="h-5 w-5" /> Card
            </button>
          </div>

          {mode === 'cash' ? (
            <>
              {/* Cash amount input */}
              <div className="w-72 mb-4">
                <div className="rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-right text-3xl font-bold tabular-nums text-gray-900 focus-within:border-emerald-400">
                  ${amount || '0.00'}
                </div>
              </div>

              {/* Quick amounts */}
              <div className="flex gap-2 mb-4">
                {quickAmounts.map(qa => (
                  <button key={qa} onClick={() => setAmount(qa.toFixed(2))} className="rounded-xl bg-white border border-gray-200 px-4 py-2 text-sm font-bold tabular-nums text-gray-700 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-colors">
                    ${qa.toFixed(2)}
                  </button>
                ))}
              </div>

              {/* Keypad */}
              <div className="grid grid-cols-3 gap-2 w-72">
                {['1','2','3','4','5','6','7','8','9','.','0','backspace'].map(key => (
                  <button key={key} onClick={() => handleKeypad(key)} className="h-14 rounded-xl bg-white border border-gray-200 text-lg font-bold text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors flex items-center justify-center">
                    {key === 'backspace' ? <Delete className="h-5 w-5" /> : key}
                  </button>
                ))}
              </div>

              {change >= 0 && amountNum > 0 && amountNum >= total && (
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-500">Change</p>
                  <p className="text-2xl font-bold tabular-nums text-emerald-600">${change.toFixed(2)}</p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50">
                <CreditCard className="h-10 w-10 text-blue-500" />
              </div>
              <p className="text-sm text-gray-500">Tap, insert, or swipe card</p>
              <p className="text-xs text-gray-400 mt-1">Amount: ${total.toFixed(2)}</p>
            </div>
          )}
        </div>

        {/* Right: Complete button */}
        <div className="flex w-64 flex-col justify-end border-l border-gray-200 bg-white p-6">
          <button
            onClick={handleComplete}
            disabled={mode === 'cash' && amountNum < total}
            className={`w-full rounded-xl py-5 text-lg font-bold text-white transition-colors ${
              mode === 'card' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-200 disabled:text-gray-400'
            }`}
          >
            {mode === 'card' ? 'Process Card' : 'Complete Sale'}
          </button>
        </div>
      </div>
    </div>
  );
}
