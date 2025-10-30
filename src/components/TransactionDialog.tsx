import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Transaction, TransactionType, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/types/transaction";
import { format } from "date-fns";

interface TransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (transaction: Omit<Transaction, "id" | "createdAt">) => void;
  editTransaction?: Transaction | null;
}

export function TransactionDialog({ open, onOpenChange, onSubmit, editTransaction }: TransactionDialogProps) {
  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));

  useEffect(() => {
    if (editTransaction) {
      setType(editTransaction.type);
      setAmount(editTransaction.amount.toString());
      setCategory(editTransaction.category);
      setDescription(editTransaction.description);
      setDate(editTransaction.date);
    } else {
      setType("expense");
      setAmount("");
      setCategory("");
      setDescription("");
      setDate(format(new Date(), "yyyy-MM-dd"));
    }
  }, [editTransaction, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category) return;

    onSubmit({
      type,
      amount: parseFloat(amount),
      category: category as any,
      description,
      date,
    });

    onOpenChange(false);
  };

  const categories = type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editTransaction ? "Edit Transaction" : "Add Transaction"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {!editTransaction && (
              <Tabs value={type} onValueChange={(v) => setType(v as TransactionType)}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="expense">Expense</TabsTrigger>
                  <TabsTrigger value="income">Income</TabsTrigger>
                </TabsList>
              </Tabs>
            )}

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Optional description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editTransaction ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
