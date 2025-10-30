"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const router_1 = require("./router");
const app = (0, express_1.default)();
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
const rawOrigins = process.env.CORS_ORIGIN;
const allowedOrigins = rawOrigins
    ? rawOrigins.split(",").map((origin) => origin.trim()).filter(Boolean)
    : ["*"];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin) {
            return callback(null, true);
        }
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        // Allow any origin when explicitly configured to "*"
        if (allowedOrigins.includes("*")) {
            return callback(null, true);
        }
        return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
}));
app.use(express_1.default.json());
app.get("/health", (_req, res) => {
    res.json({ ok: true });
});
app.use("/api", router_1.apiRouter);
app.use((req, res) => {
    res.status(404).json({ message: "Not Found" });
});
app.use((err, _req, res, _next) => {
    const status = err?.status || 500;
    res.status(status).json({ message: err?.message || "Internal Server Error" });
});
app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
