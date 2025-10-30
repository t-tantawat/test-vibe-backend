import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const statsRouter = Router();

statsRouter.get("/summary", async (_req, res, next) => {
  try {
    const [incomeAgg, expenseAgg] = await Promise.all([
      prisma.transaction.aggregate({ _sum: { amount: true }, where: { type: "INCOME" } }),
      prisma.transaction.aggregate({ _sum: { amount: true }, where: { type: "EXPENSE" } }),
    ]);
    const income = incomeAgg._sum.amount?.toString() ?? "0";
    const expense = expenseAgg._sum.amount?.toString() ?? "0";
    const balance = (Number(income) - Number(expense)).toFixed(2);
    res.json({ income, expense, balance });
  } catch (e) {
    next(e);
  }
});

statsRouter.get("/monthly", async (_req, res, next) => {
  try {
    // Last 12 months based on transaction date
    const items = await prisma.$queryRawUnsafe<any[]>(`
      SELECT strftime('%Y-%m', date) AS ym,
             SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END) AS income,
             SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END) AS expense
      FROM Transaction
      GROUP BY ym
      ORDER BY ym DESC
      LIMIT 12;
    `);
    const data = items
      .map((r) => ({ month: r.ym as string, income: r.income?.toString?.() ?? "0", expense: r.expense?.toString?.() ?? "0" }))
      .reverse();
    res.json(data);
  } catch (e) {
    next(e);
  }
});
