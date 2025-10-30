import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();
export const categoriesRouter = Router();

const categorySchema = z.object({ name: z.string().min(1).max(64) });

categoriesRouter.get("/", async (_req, res, next) => {
  try {
    const items = await prisma.category.findMany({ orderBy: { name: "asc" } });
    res.json(items);
  } catch (e) {
    next(e);
  }
});

categoriesRouter.post("/", async (req, res, next) => {
  try {
    const body = categorySchema.parse(req.body);
    const created = await prisma.category.create({ data: { name: body.name } });
    res.status(201).json(created);
  } catch (e) {
    if (e instanceof z.ZodError) return res.status(400).json({ message: "Validation error", details: e.flatten() });
    next(e);
  }
});

categoriesRouter.put("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const body = categorySchema.parse(req.body);
    const updated = await prisma.category.update({ where: { id }, data: { name: body.name } });
    res.json(updated);
  } catch (e) {
    if (e instanceof z.ZodError) return res.status(400).json({ message: "Validation error", details: e.flatten() });
    next(e);
  }
});

categoriesRouter.delete("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    await prisma.category.delete({ where: { id } });
    res.status(204).send();
  } catch (e) {
    next(e);
  }
});
