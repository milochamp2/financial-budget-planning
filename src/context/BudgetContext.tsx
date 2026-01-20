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
  DEFAULT_EXCHANGE_RATES,
  getCurrentMonth,
  getCurrentDate,
  getMonthFromDate,
} from '@/types/budget';

interface BudgetContextType {
  state: BudgetState;
  summary: BudgetSummary;
  remainingBalance: number; // Total income minus total expenses (all time for selected month)
  savingsGoalStatus: { message: string; type: 'success' | 'warning' | 'danger' };
  getDailySummary: (date: string) => DailySummary;
  getDailySummariesForMonth: (month: string) => Record<string, DailySummary>;
  addIncome: (income: Omit<IncomeSource, 'id' | 'month' | 'date' | 'currency'> & { date?: string }) => void;
  updateIncome: (id: string, income: Partial<IncomeSource>) => void;
  removeIncome: (id: string) => void;
  addExpense: (expense: Omit<Expense, 'id' | 'month' | 'date' | 'currency'> & { date?: string }) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  removeExpense: (id: string) => void;
  setSavingsGoal: (goal: number) => void;
  setCurrency: (currency: CurrencyCode) => void;
  setSelectedMonth: (month: string) => void;
  formatCurrency: (value: number) => string;
  convertCurrency: (amount: number, from: CurrencyCode, to: CurrencyCode) => number;
  refreshExchangeRates: () => Promise<void>;
  setUserName: (name: string) => void;
  clearAll: () => void;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

const STORAGE_KEY = 'budget-planner-data';

const initialState: BudgetState = {
  userName: null,
  incomes: [],
  expenses: [],
  savingsGoal: 20,
  currency: 'USD',
  selectedMonth: getCurrentMonth(),
  exchangeRates: DEFAULT_EXCHANGE_RATES,
  lastRatesUpdate: null,
};

// Free exchange rate API (no key required)
const EXCHANGE_RATE_API = 'https://api.exchangerate-api.com/v4/latest/USD';

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

function calculateSummary(state: BudgetState, convertFn: (amount: number, from: CurrencyCode, to: CurrencyCode) => number): BudgetSummary {
  // Filter incomes and expenses by selected month
  const monthIncomes = state.incomes.filter((i) => i.month === state.selectedMonth);
  const monthExpenses = state.expenses.filter((e) => e.month === state.selectedMonth);

  // Convert each entry from its stored currency to the display currency
  const totalIncome = monthIncomes.reduce((sum, income) => {
    const converted = convertFn(income.amount, income.currency, state.currency);
    return sum + converted;
  }, 0);

  const totalExpenses = monthExpenses.reduce((sum, expense) => {
    const converted = convertFn(expense.amount, expense.currency, state.currency);
    return sum + converted;
  }, 0);

  const totalSavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (totalSavings / totalIncome) * 100 : 0;

  const expensesByCategory = EXPENSE_CATEGORIES.reduce((acc, cat) => {
    acc[cat.value] = monthExpenses
      .filter((e) => e.category === cat.value)
      .reduce((sum, e) => sum + convertFn(e.amount, e.currency, state.currency), 0);
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

function getSavingsGoalStatus(savingsRate: number, savingsGoal: number): { message: string; type: 'success' | 'warning' | 'danger' } {
  const percentage = savingsGoal > 0 ? (savingsRate / savingsGoal) * 100 : 0;

  if (savingsRate >= savingsGoal) {
    const surplus = savingsRate - savingsGoal;
    if (surplus >= 10) {
      return {
        message: `Excellent! You're exceeding your goal by ${surplus.toFixed(1)}%. Keep up the amazing work!`,
        type: 'success'
      };
    }
    return {
      message: `Great job! You've hit your ${savingsGoal}% savings target this month!`,
      type: 'success'
    };
  } else if (percentage >= 75) {
    const needed = savingsGoal - savingsRate;
    return {
      message: `Almost there! You need just ${needed.toFixed(1)}% more to reach your goal.`,
      type: 'warning'
    };
  } else if (percentage >= 50) {
    return {
      message: `You're halfway to your goal. Consider reducing some expenses.`,
      type: 'warning'
    };
  } else if (savingsRate > 0) {
    return {
      message: `You're saving ${savingsRate.toFixed(1)}%, but your goal is ${savingsGoal}%. Review your spending.`,
      type: 'danger'
    };
  } else if (savingsRate < 0) {
    return {
      message: `Warning: You're spending more than you earn! You're ${Math.abs(savingsRate).toFixed(1)}% over budget.`,
      type: 'danger'
    };
  }
  return {
    message: `Start saving to work towards your ${savingsGoal}% goal.`,
    type: 'danger'
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
        // Migration: add exchangeRates if not present
        if (!parsed.exchangeRates) {
          parsed.exchangeRates = DEFAULT_EXCHANGE_RATES;
        }
        // Migration: remove old baseCurrency field if present
        if (parsed.baseCurrency) {
          delete parsed.baseCurrency;
        }
        // Migration: add month, date, and currency to existing incomes/expenses if not present
        const currentDate = getCurrentDate();
        const currentMonth = getCurrentMonth();
        const currentCurrency = parsed.currency || 'USD';
        if (parsed.incomes) {
          parsed.incomes = parsed.incomes.map((i: IncomeSource) => ({
            ...i,
            month: i.month || currentMonth,
            date: i.date || currentDate,
            currency: i.currency || currentCurrency, // Use current display currency as default for old entries
          }));
        }
        if (parsed.expenses) {
          parsed.expenses = parsed.expenses.map((e: Expense) => ({
            ...e,
            month: e.month || currentMonth,
            date: e.date || currentDate,
            currency: e.currency || currentCurrency, // Use current display currency as default for old entries
          }));
        }
        setState(parsed);
      } catch (e) {
        console.error('Failed to parse saved budget data:', e);
      }
    }
    setIsHydrated(true);
  }, []);

  // Fetch exchange rates on mount and when needed
  const refreshExchangeRates = useCallback(async () => {
    try {
      const response = await fetch(EXCHANGE_RATE_API);
      if (!response.ok) throw new Error('Failed to fetch rates');
      const data = await response.json();

      const rates: Record<CurrencyCode, number> = { ...DEFAULT_EXCHANGE_RATES };
      const supportedCurrencies: CurrencyCode[] = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'PHP', 'NGN', 'BRL', 'MXN', 'KRW', 'SGD'];

      supportedCurrencies.forEach((code) => {
        if (data.rates[code]) {
          rates[code] = data.rates[code];
        }
      });

      setState((prev) => ({
        ...prev,
        exchangeRates: rates,
        lastRatesUpdate: new Date().toISOString(),
      }));
    } catch (error) {
      console.error('Failed to fetch exchange rates:', error);
      // Keep using existing or default rates
    }
  }, []);

  // Fetch rates on initial load if stale (older than 1 hour)
  useEffect(() => {
    if (isHydrated) {
      const lastUpdate = state.lastRatesUpdate ? new Date(state.lastRatesUpdate) : null;
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

      if (!lastUpdate || lastUpdate < oneHourAgo) {
        refreshExchangeRates();
      }
    }
  }, [isHydrated, refreshExchangeRates, state.lastRatesUpdate]);

  // Convert currency function
  const convertCurrency = useCallback((amount: number, from: CurrencyCode, to: CurrencyCode): number => {
    if (from === to) return amount;

    const rates = state.exchangeRates;
    // Convert from source to USD, then from USD to target
    const amountInUSD = amount / rates[from];
    const amountInTarget = amountInUSD * rates[to];

    return amountInTarget;
  }, [state.exchangeRates]);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isHydrated]);

  const getDailySummary = useCallback((date: string): DailySummary => {
    const dayIncomes = state.incomes.filter((i) => i.date === date);
    const dayExpenses = state.expenses.filter((e) => e.date === date);

    const income = dayIncomes.reduce((sum, i) => sum + convertCurrency(i.amount, i.currency, state.currency), 0);
    const expenses = dayExpenses.reduce((sum, e) => sum + convertCurrency(e.amount, e.currency, state.currency), 0);

    return {
      date,
      income,
      expenses,
      savings: income - expenses,
    };
  }, [state.incomes, state.expenses, state.currency, convertCurrency]);

  const getDailySummariesForMonth = useCallback((month: string): Record<string, DailySummary> => {
    const summaries: Record<string, DailySummary> = {};

    // Get all incomes and expenses for the month
    const monthIncomes = state.incomes.filter((i) => i.month === month);
    const monthExpenses = state.expenses.filter((e) => e.month === month);

    // Group by date with currency conversion (from entry currency to display currency)
    const incomesByDate: Record<string, number> = {};
    const expensesByDate: Record<string, number> = {};

    monthIncomes.forEach((i) => {
      const converted = convertCurrency(i.amount, i.currency, state.currency);
      incomesByDate[i.date] = (incomesByDate[i.date] || 0) + converted;
    });

    monthExpenses.forEach((e) => {
      const converted = convertCurrency(e.amount, e.currency, state.currency);
      expensesByDate[e.date] = (expensesByDate[e.date] || 0) + converted;
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
  }, [state.incomes, state.expenses, state.currency, convertCurrency]);

  const addIncome = useCallback((income: Omit<IncomeSource, 'id' | 'month' | 'date' | 'currency'> & { date?: string }) => {
    const date = income.date || getCurrentDate();
    const month = getMonthFromDate(date);
    setState((prev) => ({
      ...prev,
      incomes: [...prev.incomes, { ...income, id: generateId(), month, date, currency: prev.currency }],
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

  const addExpense = useCallback((expense: Omit<Expense, 'id' | 'month' | 'date' | 'currency'> & { date?: string }) => {
    const date = expense.date || getCurrentDate();
    const month = getMonthFromDate(date);
    setState((prev) => ({
      ...prev,
      expenses: [...prev.expenses, { ...expense, id: generateId(), month, date, currency: prev.currency }],
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

  const setUserName = useCallback((name: string) => {
    setState((prev) => ({ ...prev, userName: name }));
  }, []);

  const clearAll = useCallback(() => {
    setState({ ...initialState, selectedMonth: getCurrentMonth() });
  }, []);

  const summary = calculateSummary(state, convertCurrency);

  // Calculate remaining balance (income - expenses for selected month)
  const remainingBalance = summary.totalSavings;

  // Get savings goal status message
  const savingsGoalStatus = getSavingsGoalStatus(summary.savingsRate, state.savingsGoal);

  return (
    <BudgetContext.Provider
      value={{
        state,
        summary,
        remainingBalance,
        savingsGoalStatus,
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
        convertCurrency,
        refreshExchangeRates,
        setUserName,
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
