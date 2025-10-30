import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const categories = ["Salary", "Food", "Transport", "Utilities", "Entertainment" ];
  for (const name of categories) {
    await prisma.category.upsert({ where: { name }, update: {}, create: { name } });
  }

  const now = new Date();

  // Insert a couple of demo transactions if none exist
  const count = await prisma.transaction.count();
  if (count === 0) {
    const food = await prisma.category.findUnique({ where: { name: "Food" } });
    await prisma.transaction.createMany({
      data: [
        { date: now, amount: "2500.00", type: "INCOME", note: "Monthly salary", categoryId: null },
        { date: now, amount: "25.50", type: "EXPENSE", note: "Lunch", categoryId: food?.id ?? null },
      ],
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
