import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { BalanceCards } from "@/components/BalanceCards";
import { TransactionDialog } from "@/components/TransactionDialog";
import { TransactionList } from "@/components/TransactionList";
import { FilterControls } from "@/components/FilterControls";
import { MonthlyChart } from "@/components/MonthlyChart";
import { ExportButton } from "@/components/ExportButton";
import { useTransactions } from "@/hooks/useTransactions";
import { Transaction } from "@/types/transaction";
import { isAfter, isBefore, startOfDay } from "date-fns";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

const Index = () => {
  const { transactions, addTransaction, updateTransaction, deleteTransaction, loading, error } = useTransactions();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (categoryFilter !== "all" && t.category !== categoryFilter) return false;
      
      if (startDate) {
        const transactionDate = startOfDay(new Date(t.date));
        const filterStartDate = startOfDay(new Date(startDate));
        if (isBefore(transactionDate, filterStartDate)) return false;
      }
      
      if (endDate) {
        const transactionDate = startOfDay(new Date(t.date));
        const filterEndDate = startOfDay(new Date(endDate));
        if (isAfter(transactionDate, filterEndDate)) return false;
      }
      
      return true;
    });
  }, [transactions, categoryFilter, startDate, endDate]);

  const { totalBalance, totalIncome, totalExpenses } = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalIncome: income,
      totalExpenses: expenses,
      totalBalance: income - expenses,
    };
  }, [transactions]);

  const handleAddTransaction = async (transaction: Omit<Transaction, "id" | "createdAt">) => {
    try {
      if (editingTransaction) {
        await updateTransaction(editingTransaction.id, transaction);
        toast.success("Transaction updated successfully");
      } else {
        await addTransaction(transaction);
        toast.success("Transaction added successfully");
      }
      setEditingTransaction(null);
    } catch (err: any) {
      const message = err?.message || "Failed to save transaction";
      toast.error(message);
      throw err;
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTransaction(id);
      toast.success("Transaction deleted");
    } catch (err: any) {
      const message = err?.message || "Failed to delete transaction";
      toast.error(message);
    }
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setEditingTransaction(null);
    }
  };

  const clearFilters = () => {
    setCategoryFilter("all");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold">Expense Tracker</h1>
            <div className="flex gap-2">
              <ExportButton transactions={transactions} />
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Transaction
              </Button>
            </div>
          </div>
          <p className="text-muted-foreground">Track your income and expenses efficiently</p>
        </header>

        <div className="space-y-6">
          <BalanceCards
            totalBalance={totalBalance}
            totalIncome={totalIncome}
            totalExpenses={totalExpenses}
            loading={loading}
          />

          <MonthlyChart transactions={transactions} loading={loading} />

          <div className="space-y-4">
            <FilterControls
              categoryFilter={categoryFilter}
              onCategoryFilterChange={setCategoryFilter}
              startDate={startDate}
              onStartDateChange={setStartDate}
              endDate={endDate}
              onEndDateChange={setEndDate}
              onClearFilters={clearFilters}
            />

            <div>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xl font-semibold">Transactions</h2>
                {loading ? (
                  <Skeleton className="h-5 w-16" />
                ) : (
                  <span className="text-sm text-muted-foreground">
                    ({filteredTransactions.length})
                  </span>
                )}
              </div>
              {error && (
                <p className="text-destructive text-sm mb-2">{error}</p>
              )}
              {loading ? (
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Card key={idx} className="p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <Skeleton className="h-10 w-10 rounded-lg" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-48" />
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-5 w-16" />
                          <div className="flex gap-1">
                            <Skeleton className="h-8 w-8 rounded-md" />
                            <Skeleton className="h-8 w-8 rounded-md" />
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <TransactionList
                  transactions={filteredTransactions}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              )}
            </div>
          </div>
        </div>

        <TransactionDialog
          open={dialogOpen}
          onOpenChange={handleDialogClose}
          onSubmit={handleAddTransaction}
          editTransaction={editingTransaction}
        />
      </div>
    </div>
  );
};

export default Index;
