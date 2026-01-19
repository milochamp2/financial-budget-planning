'use client';

import React from 'react';
import { Wallet } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { useBudget } from '@/context/BudgetContext';
import { EXPENSE_CATEGORIES } from '@/types/budget';

export function BudgetOverview() {
  const { summary, formatCurrency } = useBudget();

  const categoriesWithExpenses = EXPENSE_CATEGORIES.filter(
    (cat) => summary.expensesByCategory[cat.value] > 0
  ).sort((a, b) => summary.expensesByCategory[b.value] - summary.expensesByCategory[a.value]);

  return (
    <GlassCard className="p-6" glowColor="#6366f120">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-indigo-500/20">
          <Wallet className="w-5 h-5 text-indigo-400" />
        </div>
        <h3 className="text-lg font-semibold text-white">Budget Allocation</h3>
      </div>

      {categoriesWithExpenses.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Add expenses to see budget allocation
        </div>
      ) : (
        <div className="space-y-4">
          {categoriesWithExpenses.map((category) => {
            const amount = summary.expensesByCategory[category.value];
            const percentage = summary.totalExpenses > 0
              ? (amount / summary.totalExpenses) * 100
              : 0;
            const incomePercentage = summary.totalIncome > 0
              ? (amount / summary.totalIncome) * 100
              : 0;

            return (
              <div key={category.value} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm text-white">{category.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-400">{percentage.toFixed(1)}%</span>
                    <span className="text-sm font-medium text-white">{formatCurrency(amount)}</span>
                  </div>
                </div>
                <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: category.color,
                      boxShadow: `0 0 10px ${category.color}`,
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500">{incomePercentage.toFixed(1)}% of income</p>
              </div>
            );
          })}
        </div>
      )}

      {summary.totalExpenses > 0 && (
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Total Allocated</span>
            <span className="text-xl font-bold text-white">{formatCurrency(summary.totalExpenses)}</span>
          </div>
          {summary.totalIncome > 0 && (
            <div className="mt-2 flex justify-between items-center">
              <span className="text-gray-400">Remaining</span>
              <span className={`text-lg font-semibold ${summary.totalSavings >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {formatCurrency(summary.totalSavings)}
              </span>
            </div>
          )}
        </div>
      )}
    </GlassCard>
  );
}
