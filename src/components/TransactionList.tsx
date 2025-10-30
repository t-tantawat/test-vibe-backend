import { Transaction } from "@/types/transaction";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { format } from "date-fns";

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export function TransactionList({ transactions, onEdit, onDelete }: TransactionListProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (transactions.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No transactions yet. Add your first transaction to get started!</p>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {transactions.map((transaction) => (
        <Card key={transaction.id} className="p-4 transition-all hover:shadow-md">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className={`p-2 rounded-lg ${
                transaction.type === "income" ? "bg-success/10" : "bg-destructive/10"
              }`}>
                {transaction.type === "income" ? (
                  <TrendingUp className="h-4 w-4 text-success" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-destructive" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium">{transaction.category}</p>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(transaction.date), "MMM dd, yyyy")}
                  </span>
                </div>
                {transaction.description && (
                  <p className="text-sm text-muted-foreground truncate">{transaction.description}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <p className={`font-semibold text-lg whitespace-nowrap ${
                transaction.type === "income" ? "text-success" : "text-destructive"
              }`}>
                {transaction.type === "income" ? "+" : "-"}
                {formatCurrency(transaction.amount)}
              </p>
              
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(transaction)}
                  aria-label="Edit transaction"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(transaction.id)}
                  aria-label="Delete transaction"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
