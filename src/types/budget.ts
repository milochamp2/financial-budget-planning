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

export interface BudgetState {
  incomes: IncomeSource[];
  expenses: Expense[];
  savingsGoal: number;
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
