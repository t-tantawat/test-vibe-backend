import { useState, useEffect, useCallback } from "react";
import { Transaction } from "@/types/transaction";

const STORAGE_KEY = "expense-tracker-transactions";

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Failed to load transactions:", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    } catch (error) {
      console.error("Failed to save transactions:", error);
    }
  }, [transactions]);

  const addTransaction = useCallback((transaction: Omit<Transaction, "id" | "createdAt">) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  }, []);

  const updateTransaction = useCallback((id: string, updates: Partial<Transaction>) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearAllTransactions = useCallback(() => {
    setTransactions([]);
  }, []);

  return {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    clearAllTransactions,
  };
}
