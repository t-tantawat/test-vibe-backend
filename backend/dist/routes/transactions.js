"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionsRouter = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
exports.transactionsRouter = (0, express_1.Router)();
const baseTransactionSchema = zod_1.z.object({
    date: zod_1.z.coerce.date(),
    amount: zod_1.z.string().regex(/^\d+(\.\d{1,2})?$/),
    type: zod_1.z.enum(["INCOME", "EXPENSE"]),
    note: zod_1.z.string().optional(),
    categoryId: zod_1.z.number().int().optional().nullable(),
    categoryName: zod_1.z
        .string()
        .trim()
        .min(1)
        .max(64)
        .optional(),
});
const createTransactionSchema = baseTransactionSchema;
const updateTransactionSchema = baseTransactionSchema.partial();
exports.transactionsRouter.get("/", async (req, res, next) => {
    try {
        const { type, categoryId, startDate, endDate, search } = req.query;
        const filters = {};
        if (type && (type === "INCOME" || type === "EXPENSE")) {
            filters.type = type;
        }
        if (categoryId) {
            filters.categoryId = Number(categoryId);
        }
        if (startDate || endDate) {
            filters.date = {};
            if (startDate)
                filters.date.gte = new Date(String(startDate));
            if (endDate)
                filters.date.lte = new Date(String(endDate));
        }
        const where = {
            ...filters,
            ...(search
                ? {
                    OR: [
                        { note: { contains: String(search), mode: "insensitive" } },
                        { category: { name: { contains: String(search), mode: "insensitive" } } },
                    ],
                }
                : {}),
        };
        const items = await prisma.transaction.findMany({
            where,
            orderBy: { date: "desc" },
            include: { category: true },
        });
        res.json(items.map((t) => ({
            ...t,
            amount: t.amount.toString(),
        })));
    }
    catch (e) {
        next(e);
    }
});
exports.transactionsRouter.get("/:id", async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const t = await prisma.transaction.findUnique({ where: { id }, include: { category: true } });
        if (!t)
            return res.status(404).json({ message: "Not found" });
        res.json({ ...t, amount: t.amount.toString() });
    }
    catch (e) {
        next(e);
    }
});
exports.transactionsRouter.post("/", async (req, res, next) => {
    try {
        const body = createTransactionSchema.parse(req.body);
        let categoryId = body.categoryId ?? null;
        if (!categoryId && body.categoryName) {
            const category = await prisma.category.upsert({
                where: { name: body.categoryName },
                update: {},
                create: { name: body.categoryName },
            });
            categoryId = category.id;
        }
        const created = await prisma.transaction.create({
            data: {
                date: body.date,
                amount: body.amount,
                type: body.type,
                note: body.note,
                categoryId,
            },
            include: { category: true },
        });
        res.status(201).json({ ...created, amount: created.amount.toString() });
    }
    catch (e) {
        if (e instanceof zod_1.z.ZodError)
            return res.status(400).json({ message: "Validation error", details: e.flatten() });
        next(e);
    }
});
exports.transactionsRouter.put("/:id", async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const body = updateTransactionSchema.parse(req.body);
        let categoryId = undefined;
        if (body.categoryId !== undefined) {
            categoryId = body.categoryId ?? null;
        }
        else if (body.categoryName) {
            const category = await prisma.category.upsert({
                where: { name: body.categoryName },
                update: {},
                create: { name: body.categoryName },
            });
            categoryId = category.id;
        }
        const updated = await prisma.transaction.update({
            where: { id },
            data: {
                ...(body.date ? { date: body.date } : {}),
                ...(body.amount ? { amount: body.amount } : {}),
                ...(body.type ? { type: body.type } : {}),
                ...(body.note !== undefined ? { note: body.note } : {}),
                ...(categoryId !== undefined ? { categoryId } : {}),
            },
            include: { category: true },
        });
        res.json({ ...updated, amount: updated.amount.toString() });
    }
    catch (e) {
        if (e instanceof zod_1.z.ZodError)
            return res.status(400).json({ message: "Validation error", details: e.flatten() });
        next(e);
    }
});
exports.transactionsRouter.delete("/:id", async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        await prisma.transaction.delete({ where: { id } });
        res.status(204).send();
    }
    catch (e) {
        next(e);
    }
});
