'use client';

import React, { useState } from 'react';
import { Plus, DollarSign, Trash2 } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { useBudget } from '@/context/BudgetContext';
import { INCOME_CATEGORIES, IncomeSource } from '@/types/budget';

export function IncomeForm() {
  const { state, addIncome, removeIncome, formatCurrency } = useBudget();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<IncomeSource['category']>('salary');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !amount) return;

    addIncome({
      name: name.trim(),
      amount: parseFloat(amount),
      category,
    });

    setName('');
    setAmount('');
    setCategory('salary');
  };

  return (
    <GlassCard className="p-6" glowColor="#22c55e20">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-emerald-500/20">
          <DollarSign className="w-5 h-5 text-emerald-400" />
        </div>
        <h3 className="text-lg font-semibold text-white">Income Sources</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Income name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            step="0.01"
          />
          <Select
            options={INCOME_CATEGORIES.map((c) => ({ value: c.value, label: c.label }))}
            value={category}
            onChange={(val) => setCategory(val as IncomeSource['category'])}
          />
        </div>
        <Button type="submit" icon={<Plus className="w-4 h-4" />} className="w-full md:w-auto">
          Add Income
        </Button>
      </form>

      {state.incomes.filter((i) => i.month === state.selectedMonth).length > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">
            Added Income
          </p>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
            {state.incomes.filter((i) => i.month === state.selectedMonth).map((income) => (
              <div
                key={income.id}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <div>
                    <p className="text-white font-medium">{income.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{income.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-emerald-400 font-semibold">
                    {formatCurrency(income.amount)}
                  </span>
                  <button
                    onClick={() => removeIncome(income.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </GlassCard>
  );
}
