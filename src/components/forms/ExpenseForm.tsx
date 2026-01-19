'use client';

import React, { useState } from 'react';
import { Plus, Receipt, Trash2 } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { useBudget } from '@/context/BudgetContext';
import { EXPENSE_CATEGORIES, ExpenseCategory } from '@/types/budget';

export function ExpenseForm() {
  const { state, addExpense, removeExpense } = useBudget();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('food');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !amount) return;

    addExpense({
      name: name.trim(),
      amount: parseFloat(amount),
      category,
    });

    setName('');
    setAmount('');
    setCategory('food');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getCategoryColor = (cat: ExpenseCategory) => {
    return EXPENSE_CATEGORIES.find((c) => c.value === cat)?.color || '#64748b';
  };

  return (
    <GlassCard className="p-6" glowColor="#ef444420">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-red-500/20">
          <Receipt className="w-5 h-5 text-red-400" />
        </div>
        <h3 className="text-lg font-semibold text-white">Expenses</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Expense name"
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
            options={EXPENSE_CATEGORIES.map((c) => ({ value: c.value, label: c.label }))}
            value={category}
            onChange={(val) => setCategory(val as ExpenseCategory)}
          />
        </div>
        <Button
          type="submit"
          variant="danger"
          icon={<Plus className="w-4 h-4" />}
          className="w-full md:w-auto"
        >
          Add Expense
        </Button>
      </form>

      {state.expenses.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">
            Added Expenses
          </p>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
            {state.expenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: getCategoryColor(expense.category) }}
                  />
                  <div>
                    <p className="text-white font-medium">{expense.name}</p>
                    <p className="text-xs text-gray-500">
                      {EXPENSE_CATEGORIES.find((c) => c.value === expense.category)?.label}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-red-400 font-semibold">
                    -{formatCurrency(expense.amount)}
                  </span>
                  <button
                    onClick={() => removeExpense(expense.id)}
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
