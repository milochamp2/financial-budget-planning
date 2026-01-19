'use client';

import React from 'react';
import { Sparkles, RotateCcw } from 'lucide-react';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { SavingsGoal } from '@/components/dashboard/SavingsGoal';
import { BudgetOverview } from '@/components/dashboard/BudgetOverview';
import { ExpensePieChart } from '@/components/charts/ExpensePieChart';
import { BudgetBarChart } from '@/components/charts/BudgetBarChart';
import { IncomeVsExpenseChart } from '@/components/charts/IncomeVsExpenseChart';
import { IncomeForm } from '@/components/forms/IncomeForm';
import { ExpenseForm } from '@/components/forms/ExpenseForm';
import { Button } from '@/components/ui/Button';
import { CurrencySelector } from '@/components/ui/CurrencySelector';
import { CalendarDropdown } from '@/components/ui/CalendarDropdown';
import { useBudget } from '@/context/BudgetContext';

export default function Home() {
  const { clearAll, state } = useBudget();
  const hasData = state.incomes.length > 0 || state.expenses.length > 0;

  return (
    <main className="relative min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 shadow-lg shadow-violet-500/30">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  BudgetFlow
                </h1>
                <p className="text-sm text-gray-400">Smart financial planning</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CurrencySelector />
              {hasData && (
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<RotateCcw className="w-4 h-4" />}
                  onClick={() => {
                    if (confirm('Are you sure you want to clear all data?')) {
                      clearAll();
                    }
                  }}
                >
                  Reset
                </Button>
              )}
            </div>
          </div>
        </header>

        {/* Calendar Dropdown */}
        <section className="mb-6">
          <CalendarDropdown />
        </section>

        {/* Summary Cards */}
        <section className="mb-8">
          <SummaryCards />
        </section>

        {/* Input Forms */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <IncomeForm />
          <ExpenseForm />
        </section>

        {/* Charts Row */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <ExpensePieChart />
          <BudgetBarChart />
          <IncomeVsExpenseChart />
        </section>

        {/* Bottom Row */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <SavingsGoal />
          <BudgetOverview />
        </section>

        {/* Footer */}
        <footer className="text-center py-6 border-t border-white/5">
          <p className="text-sm text-gray-500">
            Your data is stored locally in your browser
          </p>
        </footer>
      </div>
    </main>
  );
}
