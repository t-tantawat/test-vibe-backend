import { Transaction as FrontendTransaction, TransactionType as FrontendType, Category as FrontendCategory } from "@/types/transaction";

export type ApiTransactionType = "INCOME" | "EXPENSE";

export interface ApiCategory {
  id: number;
  name: string;
}

export interface ApiTransaction {
  id: number;
  createdAt: string;
  date: string;
  amount: string; // decimal string
  type: ApiTransactionType;
  note?: string | null;
  categoryId?: number | null;
  category?: ApiCategory | null;
}

export interface ApiSummary {
  income: string;
  expense: string;
  balance: string;
}

export interface ApiMonthlyPoint {
  month: string; // YYYY-MM
  income: string;
  expense: string;
}

function toFrontendType(t: ApiTransactionType): FrontendType {
  return t === "INCOME" ? "income" : "expense";
}

function toFrontendCategory(name?: string | null): FrontendCategory {
  // Fallback to "Other" when unknown
  const n = (name || "Other") as FrontendCategory;
  return n;
}

export function mapApiTransactionToFrontend(t: ApiTransaction): FrontendTransaction {
  return {
    id: String(t.id),
    createdAt: t.createdAt,
    date: t.date,
    amount: Number(t.amount),
    type: toFrontendType(t.type),
    category: toFrontendCategory(t.category?.name),
    description: t.note || "",
  };
}

export function mapFrontendToCreateApi(input: Omit<FrontendTransaction, "id" | "createdAt">) {
  return {
    date: input.date,
    amount: input.amount.toFixed(2),
    type: input.type === "income" ? "INCOME" : "EXPENSE",
    note: input.description || undefined,
    categoryName: input.category,
  } satisfies Record<string, unknown>;
}

export function mapFrontendToUpdateApi(input: Partial<FrontendTransaction>) {
  const payload: Record<string, unknown> = {};
  if (input.date) payload.date = input.date;
  if (typeof input.amount === "number") payload.amount = input.amount.toFixed(2);
  if (input.type) payload.type = input.type === "income" ? "INCOME" : "EXPENSE";
  if (input.description !== undefined) payload.note = input.description;
  if (input.category) payload.categoryName = input.category;
  return payload;
}
