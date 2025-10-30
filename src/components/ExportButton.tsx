import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Transaction } from "@/types/transaction";
import { format } from "date-fns";
import { toast } from "sonner";

interface ExportButtonProps {
  transactions: Transaction[];
}

export function ExportButton({ transactions }: ExportButtonProps) {
  const exportToCSV = () => {
    if (transactions.length === 0) {
      toast.error("No transactions to export");
      return;
    }

    const headers = ["Date", "Type", "Category", "Description", "Amount"];
    const rows = transactions.map((t) => [
      format(new Date(t.date), "yyyy-MM-dd"),
      t.type,
      t.category,
      t.description,
      t.amount.toString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${cell}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `transactions-${format(new Date(), "yyyy-MM-dd")}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Transactions exported successfully");
  };

  return (
    <Button onClick={exportToCSV} variant="outline" size="sm">
      <Download className="h-4 w-4 mr-2" />
      Export CSV
    </Button>
  );
}
