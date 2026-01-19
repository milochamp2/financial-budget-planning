'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { GlassCard } from '../ui/GlassCard';
import { useBudget } from '@/context/BudgetContext';
import { EXPENSE_CATEGORIES } from '@/types/budget';

export function ExpensePieChart() {
  const { summary } = useBudget();

  const data = EXPENSE_CATEGORIES.filter(
    (cat) => summary.expensesByCategory[cat.value] > 0
  ).map((cat) => ({
    name: cat.label,
    value: summary.expensesByCategory[cat.value],
    color: cat.color,
  }));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: { color: string } }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-gray-900/95 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-2 shadow-xl">
          <p className="text-white font-medium">{data.name}</p>
          <p className="text-gray-400">{formatCurrency(data.value)}</p>
          <p className="text-gray-500 text-sm">
            {((data.value / summary.totalExpenses) * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  if (data.length === 0) {
    return (
      <GlassCard className="p-6 h-full" glowColor="#8b5cf620">
        <h3 className="text-lg font-semibold text-white mb-4">Expense Breakdown</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          Add expenses to see the breakdown
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6 h-full" glowColor="#8b5cf620">
      <h3 className="text-lg font-semibold text-white mb-4">Expense Breakdown</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke="transparent"
                  style={{
                    filter: `drop-shadow(0 0 8px ${entry.color}40)`,
                  }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {data.slice(0, 6).map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-gray-400 truncate">{item.name}</span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
