'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { GlassCard } from '../ui/GlassCard';
import { useBudget } from '@/context/BudgetContext';
import { EXPENSE_CATEGORIES } from '@/types/budget';

export function BudgetBarChart() {
  const { summary, formatCurrency, state } = useBudget();

  const data = EXPENSE_CATEGORIES.filter(
    (cat) => summary.expensesByCategory[cat.value] > 0
  )
    .map((cat) => ({
      name: cat.label.split(' ')[0],
      fullName: cat.label,
      amount: summary.expensesByCategory[cat.value],
      color: cat.color,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 6);

  const formatAxisCurrency = (value: number) => {
    if (value >= 1000) {
      return `${value / 1000}k`;
    }
    return `${value}`;
  };

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { fullName: string; amount: number; color: string } }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-900/95 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-2 shadow-xl">
          <p className="text-white font-medium">{data.fullName}</p>
          <p style={{ color: data.color }}>{formatCurrency(data.amount)}</p>
        </div>
      );
    }
    return null;
  };

  if (data.length === 0) {
    return (
      <GlassCard className="p-6 h-full" glowColor="#06b6d420">
        <h3 className="text-lg font-semibold text-white mb-4">Top Expenses</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          Add expenses to see the chart
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6 h-full" glowColor="#06b6d420">
      <h3 className="text-lg font-semibold text-white mb-4">Top Expenses</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20 }}>
            <XAxis
              type="number"
              tickFormatter={formatAxisCurrency}
              stroke="#4b5563"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#4b5563"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              width={70}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
            <Bar dataKey="amount" radius={[0, 6, 6, 0]} barSize={24}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  style={{
                    filter: `drop-shadow(0 0 8px ${entry.color}60)`,
                  }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}
