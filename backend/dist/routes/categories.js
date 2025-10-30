"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoriesRouter = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
exports.categoriesRouter = (0, express_1.Router)();
const categorySchema = zod_1.z.object({ name: zod_1.z.string().min(1).max(64) });
exports.categoriesRouter.get("/", async (_req, res, next) => {
    try {
        const items = await prisma.category.findMany({ orderBy: { name: "asc" } });
        res.json(items);
    }
    catch (e) {
        next(e);
    }
});
exports.categoriesRouter.post("/", async (req, res, next) => {
    try {
        const body = categorySchema.parse(req.body);
        const created = await prisma.category.create({ data: { name: body.name } });
        res.status(201).json(created);
    }
    catch (e) {
        if (e instanceof zod_1.z.ZodError)
            return res.status(400).json({ message: "Validation error", details: e.flatten() });
        next(e);
    }
});
exports.categoriesRouter.put("/:id", async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const body = categorySchema.parse(req.body);
        const updated = await prisma.category.update({ where: { id }, data: { name: body.name } });
        res.json(updated);
    }
    catch (e) {
        if (e instanceof zod_1.z.ZodError)
            return res.status(400).json({ message: "Validation error", details: e.flatten() });
        next(e);
    }
});
exports.categoriesRouter.delete("/:id", async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        await prisma.category.delete({ where: { id } });
        res.status(204).send();
    }
    catch (e) {
        next(e);
    }
});
