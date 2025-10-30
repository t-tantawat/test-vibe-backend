import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();
export const transactionsRouter = Router();

const baseTransactionSchema = z.object({
  date: z.coerce.date(),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/),
  type: z.enum(["INCOME", "EXPENSE"]),
  note: z.string().optional(),
  categoryId: z.number().int().optional().nullable(),
  categoryName: z
    .string()
    .trim()
    .min(1)
    .max(64)
    .optional(),
});

const createTransactionSchema = baseTransactionSchema;

const updateTransactionSchema = baseTransactionSchema.partial();

transactionsRouter.get("/", async (req, res, next) => {
  try {
    const { type, categoryId, startDate, endDate, search } = req.query as Record<string, string | undefined>;
    const filters: any = {};

    if (type && (type === "INCOME" || type === "EXPENSE")) {
      filters.type = type;
    }
    if (categoryId) {
      filters.categoryId = Number(categoryId);
    }
    if (startDate || endDate) {
      filters.date = {} as any;
      if (startDate) (filters.date as any).gte = new Date(String(startDate));
      if (endDate) (filters.date as any).lte = new Date(String(endDate));
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
    res.json(
      items.map((t) => ({
        ...t,
        amount: t.amount.toString(),
      }))
    );
  } catch (e) {
    next(e);
  }
});

transactionsRouter.get("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const t = await prisma.transaction.findUnique({ where: { id }, include: { category: true } });
    if (!t) return res.status(404).json({ message: "Not found" });
    res.json({ ...t, amount: t.amount.toString() });
  } catch (e) {
    next(e);
  }
});

transactionsRouter.post("/", async (req, res, next) => {
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
  } catch (e) {
    if (e instanceof z.ZodError) return res.status(400).json({ message: "Validation error", details: e.flatten() });
    next(e);
  }
});

transactionsRouter.put("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const body = updateTransactionSchema.parse(req.body);
    let categoryId: number | null | undefined = undefined;

    if (body.categoryId !== undefined) {
      categoryId = body.categoryId ?? null;
    } else if (body.categoryName) {
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
  } catch (e) {
    if (e instanceof z.ZodError) return res.status(400).json({ message: "Validation error", details: e.flatten() });
    next(e);
  }
});

transactionsRouter.delete("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    await prisma.transaction.delete({ where: { id } });
    res.status(204).send();
  } catch (e) {
    next(e);
  }
});
