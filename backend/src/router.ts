import { Router } from "express";
import { transactionsRouter } from "./routes/transactions";
import { categoriesRouter } from "./routes/categories";
import { statsRouter } from "./routes/stats";

export const apiRouter = Router();

apiRouter.use("/transactions", transactionsRouter);
apiRouter.use("/categories", categoriesRouter);
apiRouter.use("/stats", statsRouter);
