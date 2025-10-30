import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Transaction } from "@/types/transaction";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns";

interface MonthlyChartProps {
  transactions: Transaction[];
}

export function MonthlyChart({ transactions }: MonthlyChartProps) {
  const chartData = useMemo(() => {
    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);
    const days = eachDayOfInterval({ start, end });

    return days.map((day) => {
      const dayTransactions = transactions.filter((t) =>
        isSameDay(new Date(t.date), day)
      );

      const income = dayTransactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

      const expenses = dayTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        date: format(day, "MMM dd"),
        income,
        expenses,
      };
    });
  }, [transactions]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              className="text-muted-foreground"
            />
            <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
              formatter={(value: number) =>
                new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(value)
              }
            />
            <Legend />
            <Bar dataKey="income" fill="hsl(var(--success))" name="Income" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" fill="hsl(var(--destructive))" name="Expenses" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
