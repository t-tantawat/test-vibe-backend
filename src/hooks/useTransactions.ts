import { useState, useEffect, useCallback } from "react";
import { Transaction } from "@/types/transaction";
import { api } from "@/lib/api";
import { mapApiTransactionToFrontend, mapFrontendToCreateApi, mapFrontendToUpdateApi } from "@/types/api";

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.transactions.list();
        if (!cancelled) setTransactions(data.map(mapApiTransactionToFrontend));
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const addTransaction = useCallback(async (transaction: Omit<Transaction, "id" | "createdAt">) => {
    try {
      const payload = mapFrontendToCreateApi(transaction as any);
      const created = await api.transactions.create(payload);
      setTransactions((prev) => [mapApiTransactionToFrontend(created), ...prev]);
      setError(null);
    } catch (e: any) {
      const message = e?.message || "Failed to add transaction";
      setError(message);
      throw e;
    }
  }, []);

  const updateTransaction = useCallback(async (id: string, updates: Partial<Transaction>) => {
    try {
      const payload = mapFrontendToUpdateApi(updates);
      const updated = await api.transactions.update(Number(id), payload);
      setTransactions((prev) => prev.map((t) => (t.id === id ? mapApiTransactionToFrontend(updated) : t)));
      setError(null);
    } catch (e: any) {
      const message = e?.message || "Failed to update transaction";
      setError(message);
      throw e;
    }
  }, []);

  const deleteTransaction = useCallback(async (id: string) => {
    try {
      await api.transactions.delete(Number(id));
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      setError(null);
    } catch (e: any) {
      const message = e?.message || "Failed to delete transaction";
      setError(message);
      throw e;
    }
  }, []);

  return {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    loading,
    error,
  };
}
