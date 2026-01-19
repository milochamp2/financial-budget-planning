'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useBudget } from '@/context/BudgetContext';
import {
  formatMonthDisplay,
  getPreviousMonth,
  getNextMonth,
  getCurrentMonth,
} from '@/types/budget';

export function MonthSelector() {
  const { state, setSelectedMonth } = useBudget();

  const handlePreviousMonth = () => {
    setSelectedMonth(getPreviousMonth(state.selectedMonth));
  };

  const handleNextMonth = () => {
    setSelectedMonth(getNextMonth(state.selectedMonth));
  };

  const handleCurrentMonth = () => {
    setSelectedMonth(getCurrentMonth());
  };

  const isCurrentMonth = state.selectedMonth === getCurrentMonth();

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl px-2 py-1">
        <button
          onClick={handlePreviousMonth}
          className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 px-3 min-w-[160px] justify-center">
          <Calendar className="w-4 h-4 text-violet-400" />
          <span className="text-white font-medium text-sm">
            {formatMonthDisplay(state.selectedMonth)}
          </span>
        </div>

        <button
          onClick={handleNextMonth}
          className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {!isCurrentMonth && (
        <button
          onClick={handleCurrentMonth}
          className="px-3 py-1.5 text-xs font-medium text-violet-400 hover:text-violet-300 bg-violet-500/10 hover:bg-violet-500/20 rounded-lg border border-violet-500/20 transition-colors"
        >
          Today
        </button>
      )}
    </div>
  );
}
