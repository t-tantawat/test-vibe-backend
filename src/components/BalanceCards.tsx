import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface BalanceCardsProps {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  loading?: boolean;
}

export function BalanceCards({ totalBalance, totalIncome, totalExpenses, loading = false }: BalanceCardsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="border-border transition-all hover:shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-8 w-32" />
          ) : (
            <div className="text-2xl font-bold">{formatCurrency(totalBalance)}</div>
          )}
          <p className="text-xs text-muted-foreground mt-1">Current balance</p>
        </CardContent>
      </Card>

      <Card className="border-border transition-all hover:shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          <TrendingUp className="h-4 w-4 text-success" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-8 w-28" />
          ) : (
            <div className="text-2xl font-bold text-success">{formatCurrency(totalIncome)}</div>
          )}
          <p className="text-xs text-muted-foreground mt-1">All time income</p>
        </CardContent>
      </Card>

      <Card className="border-border transition-all hover:shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <TrendingDown className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-8 w-28" />
          ) : (
            <div className="text-2xl font-bold text-destructive">{formatCurrency(totalExpenses)}</div>
          )}
          <p className="text-xs text-muted-foreground mt-1">All time expenses</p>
        </CardContent>
      </Card>
    </div>
  );
}
