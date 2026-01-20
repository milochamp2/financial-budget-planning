export interface IncomeSource {
  id: string;
  name: string;
  amount: number;
  currency: CurrencyCode; // Currency the amount was entered in
  category: 'salary' | 'freelance' | 'investment' | 'other';
  month: string; // "2025-01" format
  date: string; // "2025-01-15" format (full date)
}

export interface Expense {
  id: string;
  name: string;
  amount: number;
  currency: CurrencyCode; // Currency the amount was entered in
  category: ExpenseCategory;
  month: string; // "2025-01" format
  date: string; // "2025-01-15" format (full date)
}

export interface DailySummary {
  date: string;
  income: number;
  expenses: number;
  savings: number;
}

export type ExpenseCategory =
  | 'housing'
  | 'transportation'
  | 'food'
  | 'utilities'
  | 'healthcare'
  | 'entertainment'
  | 'shopping'
  | 'education'
  | 'savings'
  | 'debt'
  | 'other';

export interface BudgetSummary {
  totalIncome: number;
  totalExpenses: number;
  totalSavings: number;
  savingsRate: number;
  expensesByCategory: Record<ExpenseCategory, number>;
}

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'AUD' | 'CHF' | 'CNY' | 'INR' | 'PHP' | 'NGN' | 'BRL' | 'MXN' | 'KRW' | 'SGD';

export interface Currency {
  code: CurrencyCode;
  symbol: string;
  name: string;
}

export interface BudgetState {
  incomes: IncomeSource[];
  expenses: Expense[];
  savingsGoal: number;
  currency: CurrencyCode; // Display currency
  selectedMonth: string; // "2025-01" format
  exchangeRates: Record<CurrencyCode, number>; // Exchange rates relative to USD
  lastRatesUpdate: string | null; // ISO date string of last update
}

// Exchange rates relative to USD (fallback values)
export const DEFAULT_EXCHANGE_RATES: Record<CurrencyCode, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.50,
  CAD: 1.36,
  AUD: 1.53,
  CHF: 0.88,
  CNY: 7.24,
  INR: 83.12,
  PHP: 55.80,
  NGN: 1550.00,
  BRL: 4.97,
  MXN: 17.15,
  KRW: 1320.00,
  SGD: 1.34,
};

// Helper function to get current month string
export function getCurrentMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

// Helper function to format month for display (e.g., "January 2025")
export function formatMonthDisplay(monthStr: string): string {
  const [year, month] = monthStr.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

// Helper function to get previous month
export function getPreviousMonth(monthStr: string): string {
  const [year, month] = monthStr.split('-').map(Number);
  const date = new Date(year, month - 2); // month - 1 for 0-indexed, another -1 for previous
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

// Helper function to get next month
export function getNextMonth(monthStr: string): string {
  const [year, month] = monthStr.split('-').map(Number);
  const date = new Date(year, month); // month - 1 + 1 = month for next
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

// Helper function to get current date string
export function getCurrentDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Helper function to get month from date
export function getMonthFromDate(dateStr: string): string {
  return dateStr.substring(0, 7); // "2025-01-15" -> "2025-01"
}

// Helper function to get days in a month
export function getDaysInMonth(monthStr: string): number {
  const [year, month] = monthStr.split('-').map(Number);
  return new Date(year, month, 0).getDate();
}

// Helper function to get first day of week for a month (0 = Sunday)
export function getFirstDayOfMonth(monthStr: string): number {
  const [year, month] = monthStr.split('-').map(Number);
  return new Date(year, month - 1, 1).getDay();
}

export const EXPENSE_CATEGORIES: { value: ExpenseCategory; label: string; color: string }[] = [
  { value: 'housing', label: 'Housing', color: '#8b5cf6' },
  { value: 'transportation', label: 'Transportation', color: '#06b6d4' },
  { value: 'food', label: 'Food & Dining', color: '#f59e0b' },
  { value: 'utilities', label: 'Utilities', color: '#10b981' },
  { value: 'healthcare', label: 'Healthcare', color: '#ef4444' },
  { value: 'entertainment', label: 'Entertainment', color: '#ec4899' },
  { value: 'shopping', label: 'Shopping', color: '#6366f1' },
  { value: 'education', label: 'Education', color: '#14b8a6' },
  { value: 'savings', label: 'Savings', color: '#22c55e' },
  { value: 'debt', label: 'Debt Payments', color: '#f97316' },
  { value: 'other', label: 'Other', color: '#64748b' },
];

export const INCOME_CATEGORIES: { value: IncomeSource['category']; label: string }[] = [
  { value: 'salary', label: 'Salary' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'investment', label: 'Investment' },
  { value: 'other', label: 'Other' },
];

export const CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'PHP', symbol: '₱', name: 'Philippine Peso' },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  { code: 'MXN', symbol: 'MX$', name: 'Mexican Peso' },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
];
