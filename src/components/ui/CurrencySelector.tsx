'use client';

import React from 'react';
import { Coins, RefreshCw } from 'lucide-react';
import { useBudget } from '@/context/BudgetContext';
import { CURRENCIES, CurrencyCode } from '@/types/budget';

export function CurrencySelector() {
  const { state, setCurrency, refreshExchangeRates } = useBudget();

  // Get current exchange rate relative to USD
  const currentRate = state.exchangeRates[state.currency];
  const lastUpdate = state.lastRatesUpdate
    ? new Date(state.lastRatesUpdate).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Never';

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <Coins className="w-4 h-4 text-gray-400" />
        <select
          value={state.currency}
          onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
          className="
            px-3 py-1.5 rounded-lg
            bg-white/5 border border-white/10
            text-white text-sm
            focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20
            transition-all duration-200
            appearance-none cursor-pointer
          "
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 8px center',
            backgroundSize: '16px',
            paddingRight: '32px',
          }}
        >
          {CURRENCIES.map((currency) => (
            <option key={currency.code} value={currency.code} className="bg-gray-900">
              {currency.symbol} {currency.code} - {currency.name}
            </option>
          ))}
        </select>
        <button
          onClick={() => refreshExchangeRates()}
          className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          title="Refresh exchange rates"
        >
          <RefreshCw className="w-3.5 h-3.5 text-gray-400" />
        </button>
      </div>
      {state.currency !== 'USD' && (
        <p className="text-xs text-gray-500 ml-6">
          1 USD = {currentRate.toFixed(2)} {state.currency} • Updated: {lastUpdate}
        </p>
      )}
    </div>
  );
}
