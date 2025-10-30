# Tasks: Complete Frontend + Backend (ORM + SQLite)

This document outlines a step-by-step plan to add a backend powered by an ORM and SQLite, and to integrate it with the existing Vite + React + TypeScript frontend. No tests are included by design.

## Tech Choices
- Backend: Node.js + Express (TypeScript)
- ORM: Prisma
- Database: SQLite (file-based)
- Validation: zod (runtime validation in routes)
- Frontend: Existing Vite + React + TypeScript app (Tailwind + shadcn/ui)

## High-Level Goals
1. Introduce a new `backend/` service with Express.
2. Model data in Prisma (SQLite): `Transaction`, `Category`.
3. CRUD + derived endpoints (totals, monthly breakdown).
4. Wire frontend to use backend API instead of localStorage, while preserving UX.
5. Keep everything runnable locally via npm scripts.

---

## 1) Scaffold Backend Service
- Create directory `backend/`.
- Initialize Node project and TS config.
- Install dependencies and scripts.

Commands (to run inside `backend/`):
```bash
npm init -y
npm i express cors zod @prisma/client
npm i -D typescript ts-node-dev @types/express @types/cors prisma
npx tsc --init --rootDir src --outDir dist --esModuleInterop --resolveJsonModule --module commonjs --target es2020
```

Add npm scripts in `backend/package.json`:
```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:seed": "ts-node src/seed.ts"
  }
}
```

## 2) Initialize Prisma + SQLite
- In `backend/`, run:
```bash
npx prisma init --datasource-provider sqlite
```
- Update `.env`:
```env
DATABASE_URL="file:./dev.db"
```
- Define schema in `backend/prisma/schema.prisma`:
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Category {
  id          Int           @id @default(autoincrement())
  name        String        @unique
  transactions Transaction[]
}

model Transaction {
  id          Int      @id @default(autoincrement())
  createdAt   DateTime @default(now())
  date        DateTime
  amount      Decimal  @db.Decimal(10,2)
  type        TransactionType
  note        String?
  categoryId  Int?
  category    Category? @relation(fields: [categoryId], references: [id])
}

enum TransactionType {
  INCOME
  EXPENSE
}
```
- Run migrations and generate client:
```bash
npm run prisma:migrate --name init
npm run prisma:generate
```

## 3) Seed Data (optional but helpful)
- Create `backend/src/seed.ts` to insert a few categories and sample transactions.
- Run `npm run prisma:seed`.

## 4) Express App Skeleton
- Create `backend/src/server.ts` with:
  - CORS enabled
  - JSON body parsing
  - Health route `GET /health`
  - Mount `/api` router
- Create `backend/src/router.ts` to organize routes.

## 5) Validation Schemas
- Create `backend/src/validation/transaction.ts` using zod:
  - `createTransactionSchema`
  - `updateTransactionSchema`
  - Common type guard for `TransactionType` and `date` parsing.
- Create `backend/src/validation/category.ts` for category CRUD where needed.

## 6) Transactions Endpoints
Implement under `/api/transactions`:
- `GET /` list with optional query filters: `type`, `categoryId`, `startDate`, `endDate`, `search`.
- `GET /:id` get by id.
- `POST /` create (validate with zod; coerce date; decimal handling).
- `PUT /:id` update.
- `DELETE /:id` delete.

Notes:
- Use Prisma decimal as string in responses to avoid float issues.
- Normalize dates to ISO strings.

## 7) Categories Endpoints
Implement under `/api/categories`:
- `GET /` list
- `POST /` create
- `PUT /:id` rename
- `DELETE /:id` delete (optional: disallow when referenced or cascade to null)

## 8) Derived/Analytics Endpoints
Implement under `/api/stats`:
- `GET /summary` → totals for balance, income, expense
- `GET /monthly` → income vs expense aggregated by month (last 12 months)

## 9) Error Handling & Middlewares
- Add centralized error middleware returning `{ message, details? }`.
- Convert zod errors to `400` with field messages.
- 404 handler for unknown routes.

## 10) Configuration
- `.env` for `PORT` (default 4000) and `DATABASE_URL`.
- Respect `PORT` in `server.ts`.
- Add `CORS_ORIGIN` to allow Vite dev origin (e.g., `http://localhost:5173`).

## 11) Run Backend
```bash
cd backend
npm run dev
```
- Verify `GET /health` and basic routes in browser or curl.

---

## 12) Frontend: API Client Layer
- Create `src/lib/api.ts`:
  - `API_BASE_URL` via `import.meta.env.VITE_API_URL` fallback to `http://localhost:4000`.
  - Helpers: `get`, `post`, `put`, `del` with JSON and error handling.
- Create `src/types/api.ts` for DTOs mirroring backend responses (amount as string).

## 13) Frontend: Integrate Transactions
- Update `src/hooks/useTransactions.ts` to support server mode:
  - Add a feature flag `VITE_USE_BACKEND` to switch from localStorage to API.
  - Implement CRUD via API when backend enabled.
  - Keep previous local state shape; normalize API payloads.
- Ensure optimistic UI where reasonable (e.g., create/delete), with toasts on success/failure.

## 14) Update Components to Use Hook
- `TransactionList`: fetch on mount, paginate/filter client-side initially; pass filters to API later if needed.
- `TransactionDialog`: submit to `create/update` endpoints, close on success, refresh list.
- `FilterControls`: pass filter params to hook; optionally push filters to URL search params.
- `ExportButton`: export CSV by requesting list from API (or keep current CSV generation over fetched data).
- `BalanceCards`: call `/api/stats/summary` for totals.
- `MonthlyChart`: call `/api/stats/monthly` for chart data; memoize transformation.

## 15) Loading & Error States
- Add loading spinners/skeletons using shadcn/ui components.
- On errors, show toasts via existing `use-toast`.

## 16) Data Migration (one-time)
- On first load with backend enabled, if localStorage has transactions and server is empty:
  - Offer a dialog to import local data to server.
  - POST in batches; then clear localStorage or mark migrated.

## 17) Env & Scripts
- Add `.env` in project root:
  - `VITE_API_URL=http://localhost:4000`
  - `VITE_USE_BACKEND=true`
- In root `package.json`, add convenience scripts:
  - "dev:all": concurrently run `backend` and `vite` (optional if you prefer separate terminals).

## 18) Build & Preview
- Backend: `npm run build` in `backend/`, then `npm start`.
- Frontend: `npm run build` then `npm run preview`.

## 19) Deployment (Optional Notes)
- SQLite file lives at `backend/prisma/dev.db`. Persist it or provide a migration path.
- For simple hosting, deploy backend on a small VM or Render/Fly; serve frontend statics via any static host.
- Configure CORS and environment variables accordingly.

## 20) Out of Scope
- No tests (unit/e2e) per request.
- No authentication/authorization.
- No background jobs or webhooks.

---

## Acceptance Checklist (manual)
- Backend starts and serves health + CRUD + stats endpoints.
- Prisma migrations run and database persists data locally.
- Frontend loads, shows server-backed transactions and derived totals.
- Create, edit, delete flows work; filters and CSV export function.
- Loading and error states are visible and helpful.
