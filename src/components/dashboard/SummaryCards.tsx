'use client';

import React from 'react';
import { TrendingUp, TrendingDown, PiggyBank, Percent, Wallet } from 'lucide-react';
import { StatCard } from '../ui/StatCard';
import { useBudget } from '@/context/BudgetContext';

export function SummaryCards() {
  const { summary, remainingBalance, formatCurrency } = useBudget();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <StatCard
        title="Total Income"
        value={formatCurrency(summary.totalIncome)}
        subtitle="Monthly earnings"
        icon={TrendingUp}
        glowColor="#22c55e30"
        iconColor="#22c55e"
      />
      <StatCard
        title="Total Expenses"
        value={formatCurrency(summary.totalExpenses)}
        subtitle="Monthly spending"
        icon={TrendingDown}
        glowColor="#ef444430"
        iconColor="#ef4444"
      />
      <StatCard
        title="Remaining Balance"
        value={formatCurrency(remainingBalance)}
        subtitle={remainingBalance >= 0 ? 'Available funds' : 'Over budget!'}
        icon={Wallet}
        glowColor={remainingBalance >= 0 ? '#22c55e30' : '#ef444430'}
        iconColor={remainingBalance >= 0 ? '#22c55e' : '#ef4444'}
      />
      <StatCard
        title="Net Savings"
        value={formatCurrency(summary.totalSavings)}
        subtitle={summary.totalSavings >= 0 ? 'You\'re saving!' : 'Over budget'}
        icon={PiggyBank}
        glowColor="#8b5cf630"
        iconColor="#8b5cf6"
      />
      <StatCard
        title="Savings Rate"
        value={`${summary.savingsRate.toFixed(1)}%`}
        subtitle="Of total income"
        icon={Percent}
        glowColor="#06b6d430"
        iconColor="#06b6d4"
      />
    </div>
  );
}
