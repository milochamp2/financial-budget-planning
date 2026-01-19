'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { GlassCard } from '../ui/GlassCard';
import { useBudget } from '@/context/BudgetContext';

export function IncomeVsExpenseChart() {
  const { summary } = useBudget();

  const data = [
    {
      name: 'Income',
      value: summary.totalIncome,
      fill: '#22c55e',
    },
    {
      name: 'Expenses',
      value: summary.totalExpenses,
      fill: '#ef4444',
    },
    {
      name: 'Savings',
      value: Math.max(0, summary.totalSavings),
      fill: '#8b5cf6',
    },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const maxValue = Math.max(summary.totalIncome, summary.totalExpenses, 1);

  const comparisonData = [
    { name: '', income: 0, expenses: 0 },
    { name: 'Current', income: summary.totalIncome, expenses: summary.totalExpenses },
    { name: '', income: 0, expenses: 0 },
  ];

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
    if (active && payload && payload.length && label === 'Current') {
      return (
        <div className="bg-gray-900/95 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-3 shadow-xl">
          {payload.map((entry) => (
            <div key={entry.name} className="flex items-center gap-2 mb-1">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-400">{entry.name}:</span>
              <span className="text-white font-medium">{formatCurrency(entry.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (summary.totalIncome === 0 && summary.totalExpenses === 0) {
    return (
      <GlassCard className="p-6 h-full" glowColor="#22c55e20">
        <h3 className="text-lg font-semibold text-white mb-4">Income vs Expenses</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          Add income and expenses to see comparison
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6 h-full" glowColor="#22c55e20">
      <h3 className="text-lg font-semibold text-white mb-4">Income vs Expenses</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={comparisonData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#4b5563"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              domain={[0, maxValue * 1.1]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="income"
              stroke="#22c55e"
              strokeWidth={2}
              fill="url(#incomeGradient)"
              name="Income"
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke="#ef4444"
              strokeWidth={2}
              fill="url(#expenseGradient)"
              name="Expenses"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-sm text-gray-400">Income</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-sm text-gray-400">Expenses</span>
        </div>
      </div>
    </GlassCard>
  );
}
