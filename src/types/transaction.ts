export type TransactionType = "income" | "expense";

export type Category =
  | "Food"
  | "Travel"
  | "Bills"
  | "Shopping"
  | "Entertainment"
  | "Healthcare"
  | "Education"
  | "Salary"
  | "Freelance"
  | "Investment"
  | "Other";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: Category;
  description: string;
  date: string;
  createdAt: string;
}

export const EXPENSE_CATEGORIES: Category[] = [
  "Food",
  "Travel",
  "Bills",
  "Shopping",
  "Entertainment",
  "Healthcare",
  "Education",
  "Other",
];

export const INCOME_CATEGORIES: Category[] = [
  "Salary",
  "Freelance",
  "Investment",
  "Other",
];
