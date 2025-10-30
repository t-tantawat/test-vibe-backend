# Backend (Express + Prisma + SQLite)

## Prerequisites
- Node.js 18+
- npm

## Environment
Create a `.env` file in `backend/` with:

```
PORT=4000
CORS_ORIGIN=http://localhost:5173
DATABASE_URL="file:./prisma/dev.db"
```

## Install
```bash
cd backend
npm install
```

## Database
```bash
# Initialize and apply migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# (Optional) seed data
npm run prisma:seed
```

## Run
```bash
npm run dev
# Server at http://localhost:4000
```

## API Overview
- GET `/health`
- `/api/transactions` CRUD with filters
- `/api/categories` CRUD
- `/api/stats/summary` income, expense, balance
- `/api/stats/monthly` 12-month income vs expense
