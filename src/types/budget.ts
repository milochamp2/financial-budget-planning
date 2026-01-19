export interface IncomeSource {
  id: string;
  name: string;
  amount: number;
  category: 'salary' | 'freelance' | 'investment' | 'other';
}

export interface Expense {
  id: string;
  name: string;
  amount: number;
  category: ExpenseCategory;
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
  currency: CurrencyCode;
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
