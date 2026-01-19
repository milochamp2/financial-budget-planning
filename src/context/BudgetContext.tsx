'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  BudgetState,
  BudgetSummary,
  DailySummary,
  IncomeSource,
  Expense,
  ExpenseCategory,
  CurrencyCode,
  EXPENSE_CATEGORIES,
  CURRENCIES,
  getCurrentMonth,
  getCurrentDate,
  getMonthFromDate,
} from '@/types/budget';

interface BudgetContextType {
  state: BudgetState;
  summary: BudgetSummary;
  getDailySummary: (date: string) => DailySummary;
  getDailySummariesForMonth: (month: string) => Record<string, DailySummary>;
  addIncome: (income: Omit<IncomeSource, 'id' | 'month' | 'date'> & { date?: string }) => void;
  updateIncome: (id: string, income: Partial<IncomeSource>) => void;
  removeIncome: (id: string) => void;
  addExpense: (expense: Omit<Expense, 'id' | 'month' | 'date'> & { date?: string }) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  removeExpense: (id: string) => void;
  setSavingsGoal: (goal: number) => void;
  setCurrency: (currency: CurrencyCode) => void;
  setSelectedMonth: (month: string) => void;
  formatCurrency: (value: number) => string;
  clearAll: () => void;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

const STORAGE_KEY = 'budget-planner-data';

const initialState: BudgetState = {
  incomes: [],
  expenses: [],
  savingsGoal: 20,
  currency: 'USD',
  selectedMonth: getCurrentMonth(),
};

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

function calculateSummary(state: BudgetState): BudgetSummary {
  // Filter incomes and expenses by selected month
  const monthIncomes = state.incomes.filter((i) => i.month === state.selectedMonth);
  const monthExpenses = state.expenses.filter((e) => e.month === state.selectedMonth);

  const totalIncome = monthIncomes.reduce((sum, income) => sum + income.amount, 0);
  const totalExpenses = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalSavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (totalSavings / totalIncome) * 100 : 0;

  const expensesByCategory = EXPENSE_CATEGORIES.reduce((acc, cat) => {
    acc[cat.value] = monthExpenses
      .filter((e) => e.category === cat.value)
      .reduce((sum, e) => sum + e.amount, 0);
    return acc;
  }, {} as Record<ExpenseCategory, number>);

  return {
    totalIncome,
    totalExpenses,
    totalSavings,
    savingsRate,
    expensesByCategory,
  };
}

export function BudgetProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<BudgetState>(initialState);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Migration: add selectedMonth if not present
        if (!parsed.selectedMonth) {
          parsed.selectedMonth = getCurrentMonth();
        }
        // Migration: add month and date to existing incomes/expenses if not present
        const currentDate = getCurrentDate();
        const currentMonth = getCurrentMonth();
        if (parsed.incomes) {
          parsed.incomes = parsed.incomes.map((i: IncomeSource) => ({
            ...i,
            month: i.month || currentMonth,
            date: i.date || currentDate,
          }));
        }
        if (parsed.expenses) {
          parsed.expenses = parsed.expenses.map((e: Expense) => ({
            ...e,
            month: e.month || currentMonth,
            date: e.date || currentDate,
          }));
        }
        setState(parsed);
      } catch (e) {
        console.error('Failed to parse saved budget data:', e);
      }
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isHydrated]);

  const getDailySummary = useCallback((date: string): DailySummary => {
    const dayIncomes = state.incomes.filter((i) => i.date === date);
    const dayExpenses = state.expenses.filter((e) => e.date === date);

    const income = dayIncomes.reduce((sum, i) => sum + i.amount, 0);
    const expenses = dayExpenses.reduce((sum, e) => sum + e.amount, 0);

    return {
      date,
      income,
      expenses,
      savings: income - expenses,
    };
  }, [state.incomes, state.expenses]);

  const getDailySummariesForMonth = useCallback((month: string): Record<string, DailySummary> => {
    const summaries: Record<string, DailySummary> = {};

    // Get all incomes and expenses for the month
    const monthIncomes = state.incomes.filter((i) => i.month === month);
    const monthExpenses = state.expenses.filter((e) => e.month === month);

    // Group by date
    const incomesByDate: Record<string, number> = {};
    const expensesByDate: Record<string, number> = {};

    monthIncomes.forEach((i) => {
      incomesByDate[i.date] = (incomesByDate[i.date] || 0) + i.amount;
    });

    monthExpenses.forEach((e) => {
      expensesByDate[e.date] = (expensesByDate[e.date] || 0) + e.amount;
    });

    // Combine all dates
    const allDates = new Set([...Object.keys(incomesByDate), ...Object.keys(expensesByDate)]);

    allDates.forEach((date) => {
      const income = incomesByDate[date] || 0;
      const expenses = expensesByDate[date] || 0;
      summaries[date] = {
        date,
        income,
        expenses,
        savings: income - expenses,
      };
    });

    return summaries;
  }, [state.incomes, state.expenses]);

  const addIncome = useCallback((income: Omit<IncomeSource, 'id' | 'month' | 'date'> & { date?: string }) => {
    const date = income.date || getCurrentDate();
    const month = getMonthFromDate(date);
    setState((prev) => ({
      ...prev,
      incomes: [...prev.incomes, { ...income, id: generateId(), month, date }],
    }));
  }, []);

  const updateIncome = useCallback((id: string, income: Partial<IncomeSource>) => {
    setState((prev) => ({
      ...prev,
      incomes: prev.incomes.map((i) => (i.id === id ? { ...i, ...income } : i)),
    }));
  }, []);

  const removeIncome = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      incomes: prev.incomes.filter((i) => i.id !== id),
    }));
  }, []);

  const addExpense = useCallback((expense: Omit<Expense, 'id' | 'month' | 'date'> & { date?: string }) => {
    const date = expense.date || getCurrentDate();
    const month = getMonthFromDate(date);
    setState((prev) => ({
      ...prev,
      expenses: [...prev.expenses, { ...expense, id: generateId(), month, date }],
    }));
  }, []);

  const updateExpense = useCallback((id: string, expense: Partial<Expense>) => {
    setState((prev) => ({
      ...prev,
      expenses: prev.expenses.map((e) => (e.id === id ? { ...e, ...expense } : e)),
    }));
  }, []);

  const removeExpense = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      expenses: prev.expenses.filter((e) => e.id !== id),
    }));
  }, []);

  const setSavingsGoal = useCallback((goal: number) => {
    setState((prev) => ({ ...prev, savingsGoal: goal }));
  }, []);

  const setCurrency = useCallback((currency: CurrencyCode) => {
    setState((prev) => ({ ...prev, currency }));
  }, []);

  const setSelectedMonth = useCallback((month: string) => {
    setState((prev) => ({ ...prev, selectedMonth: month }));
  }, []);

  const formatCurrency = useCallback((value: number) => {
    const currency = CURRENCIES.find((c) => c.code === state.currency) || CURRENCIES[0];

    // Special formatting for currencies without decimals (like JPY, KRW)
    const noDecimalCurrencies = ['JPY', 'KRW'];
    const minimumFractionDigits = noDecimalCurrencies.includes(currency.code) ? 0 : 0;
    const maximumFractionDigits = noDecimalCurrencies.includes(currency.code) ? 0 : 2;

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(value);
  }, [state.currency]);

  const clearAll = useCallback(() => {
    setState({ ...initialState, selectedMonth: getCurrentMonth() });
  }, []);

  const summary = calculateSummary(state);

  return (
    <BudgetContext.Provider
      value={{
        state,
        summary,
        getDailySummary,
        getDailySummariesForMonth,
        addIncome,
        updateIncome,
        removeIncome,
        addExpense,
        updateExpense,
        removeExpense,
        setSavingsGoal,
        setCurrency,
        setSelectedMonth,
        formatCurrency,
        clearAll,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
}

export function useBudget() {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
}
