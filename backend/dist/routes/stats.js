"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statsRouter = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.statsRouter = (0, express_1.Router)();
exports.statsRouter.get("/summary", async (_req, res, next) => {
    try {
        const [incomeAgg, expenseAgg] = await Promise.all([
            prisma.transaction.aggregate({ _sum: { amount: true }, where: { type: "INCOME" } }),
            prisma.transaction.aggregate({ _sum: { amount: true }, where: { type: "EXPENSE" } }),
        ]);
        const income = incomeAgg._sum.amount?.toString() ?? "0";
        const expense = expenseAgg._sum.amount?.toString() ?? "0";
        const balance = (Number(income) - Number(expense)).toFixed(2);
        res.json({ income, expense, balance });
    }
    catch (e) {
        next(e);
    }
});
exports.statsRouter.get("/monthly", async (_req, res, next) => {
    try {
        // Last 12 months based on transaction date
        const items = await prisma.$queryRawUnsafe(`
      SELECT strftime('%Y-%m', date) AS ym,
             SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END) AS income,
             SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END) AS expense
      FROM Transaction
      GROUP BY ym
      ORDER BY ym DESC
      LIMIT 12;
    `);
        const data = items
            .map((r) => ({ month: r.ym, income: r.income?.toString?.() ?? "0", expense: r.expense?.toString?.() ?? "0" }))
            .reverse();
        res.json(data);
    }
    catch (e) {
        next(e);
    }
});
