'use client';

import React from 'react';
import { Coins } from 'lucide-react';
import { useBudget } from '@/context/BudgetContext';
import { CURRENCIES, CurrencyCode } from '@/types/budget';

export function CurrencySelector() {
  const { state, setCurrency } = useBudget();

  return (
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
    </div>
  );
}
