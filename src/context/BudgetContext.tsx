'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  BudgetState,
  BudgetSummary,
  IncomeSource,
  Expense,
  ExpenseCategory,
  CurrencyCode,
  EXPENSE_CATEGORIES,
  CURRENCIES,
} from '@/types/budget';

interface BudgetContextType {
  state: BudgetState;
  summary: BudgetSummary;
  addIncome: (income: Omit<IncomeSource, 'id'>) => void;
  updateIncome: (id: string, income: Partial<IncomeSource>) => void;
  removeIncome: (id: string) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  removeExpense: (id: string) => void;
  setSavingsGoal: (goal: number) => void;
  setCurrency: (currency: CurrencyCode) => void;
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
};

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

function calculateSummary(state: BudgetState): BudgetSummary {
  const totalIncome = state.incomes.reduce((sum, income) => sum + income.amount, 0);
  const totalExpenses = state.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalSavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (totalSavings / totalIncome) * 100 : 0;

  const expensesByCategory = EXPENSE_CATEGORIES.reduce((acc, cat) => {
    acc[cat.value] = state.expenses
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
        setState(JSON.parse(saved));
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

  const addIncome = useCallback((income: Omit<IncomeSource, 'id'>) => {
    setState((prev) => ({
      ...prev,
      incomes: [...prev.incomes, { ...income, id: generateId() }],
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

  const addExpense = useCallback((expense: Omit<Expense, 'id'>) => {
    setState((prev) => ({
      ...prev,
      expenses: [...prev.expenses, { ...expense, id: generateId() }],
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
    setState(initialState);
  }, []);

  const summary = calculateSummary(state);

  return (
    <BudgetContext.Provider
      value={{
        state,
        summary,
        addIncome,
        updateIncome,
        removeIncome,
        addExpense,
        updateExpense,
        removeExpense,
        setSavingsGoal,
        setCurrency,
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
