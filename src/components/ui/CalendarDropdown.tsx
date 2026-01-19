'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';
import { useBudget } from '@/context/BudgetContext';
import {
  formatMonthDisplay,
  getPreviousMonth,
  getNextMonth,
  getCurrentMonth,
  getCurrentDate,
  getDaysInMonth,
  getFirstDayOfMonth,
} from '@/types/budget';

export function CalendarDropdown() {
  const { state, setSelectedMonth, getDailySummariesForMonth, formatCurrency } = useBudget();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const dailySummaries = getDailySummariesForMonth(state.selectedMonth);
  const daysInMonth = getDaysInMonth(state.selectedMonth);
  const firstDayOfWeek = getFirstDayOfMonth(state.selectedMonth);
  const today = getCurrentDate();
  const currentMonth = getCurrentMonth();

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedDate(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePreviousMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedMonth(getPreviousMonth(state.selectedMonth));
    setSelectedDate(null);
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedMonth(getNextMonth(state.selectedMonth));
    setSelectedDate(null);
  };

  const handleDayClick = (day: number) => {
    const [year, month] = state.selectedMonth.split('-');
    const dateStr = `${year}-${month}-${String(day).padStart(2, '0')}`;
    setSelectedDate(selectedDate === dateStr ? null : dateStr);
  };

  const getDateString = (day: number): string => {
    const [year, month] = state.selectedMonth.split('-');
    return `${year}-${month}-${String(day).padStart(2, '0')}`;
  };

  const getDayData = (day: number) => {
    const dateStr = getDateString(day);
    return dailySummaries[dateStr] || { income: 0, expenses: 0, savings: 0 };
  };

  const hasDayData = (day: number): boolean => {
    const data = getDayData(day);
    return data.income > 0 || data.expenses > 0;
  };

  const isToday = (day: number): boolean => {
    return getDateString(day) === today;
  };

  const selectedDayData = selectedDate ? dailySummaries[selectedDate] : null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
      >
        <Calendar className="w-5 h-5 text-violet-400" />
        <span className="text-white font-medium">
          {formatMonthDisplay(state.selectedMonth)}
        </span>
        <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-50 w-[340px] bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header with month navigation */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <button
              onClick={handlePreviousMonth}
              className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-white font-semibold">
              {formatMonthDisplay(state.selectedMonth)}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Today button */}
          {state.selectedMonth !== currentMonth && (
            <div className="px-4 pt-3">
              <button
                onClick={() => {
                  setSelectedMonth(currentMonth);
                  setSelectedDate(null);
                }}
                className="text-xs text-violet-400 hover:text-violet-300 font-medium"
              >
                Go to today
              </button>
            </div>
          )}

          {/* Calendar Grid */}
          <div className="p-4">
            {/* Week days header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map((day) => (
                <div key={day} className="text-center text-xs text-gray-500 font-medium py-1">
                  {day}
                </div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells for days before the first day of the month */}
              {Array.from({ length: firstDayOfWeek }).map((_, index) => (
                <div key={`empty-${index}`} className="aspect-square" />
              ))}

              {/* Day cells */}
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1;
                const dateStr = getDateString(day);
                const hasData = hasDayData(day);
                const isTodayDate = isToday(day);
                const isSelected = selectedDate === dateStr;
                const dayData = getDayData(day);

                return (
                  <button
                    key={day}
                    onClick={() => handleDayClick(day)}
                    className={`
                      aspect-square rounded-lg flex flex-col items-center justify-center
                      text-sm transition-all relative
                      ${isSelected
                        ? 'bg-violet-600 text-white'
                        : isTodayDate
                          ? 'bg-violet-500/20 text-violet-300 border border-violet-500/50'
                          : hasData
                            ? 'bg-white/5 text-white hover:bg-white/10'
                            : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'
                      }
                    `}
                  >
                    <span className="font-medium">{day}</span>
                    {hasData && (
                      <div className="flex gap-0.5 mt-0.5">
                        {dayData.income > 0 && (
                          <div className="w-1 h-1 rounded-full bg-emerald-400" />
                        )}
                        {dayData.expenses > 0 && (
                          <div className="w-1 h-1 rounded-full bg-red-400" />
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected day details */}
          {selectedDate && (
            <div className="border-t border-white/10 p-4 bg-white/5">
              <p className="text-sm text-gray-400 mb-3">
                {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>

              {selectedDayData ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm text-gray-300">Income</span>
                    </div>
                    <span className="text-sm font-medium text-emerald-400">
                      {formatCurrency(selectedDayData.income)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="w-4 h-4 text-red-400" />
                      <span className="text-sm text-gray-300">Expenses</span>
                    </div>
                    <span className="text-sm font-medium text-red-400">
                      {formatCurrency(selectedDayData.expenses)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <PiggyBank className="w-4 h-4 text-violet-400" />
                      <span className="text-sm text-gray-300">Net</span>
                    </div>
                    <span className={`text-sm font-medium ${selectedDayData.savings >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {formatCurrency(selectedDayData.savings)}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No transactions on this day</p>
              )}
            </div>
          )}

          {/* Legend */}
          <div className="px-4 pb-4 flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Income</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <span>Expense</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
