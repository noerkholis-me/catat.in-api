import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  const needsCategories = [
    { name: "Groceries", icon: "🛒", color: "#10b981" },
    { name: "Rent", icon: "🏠", color: "#10b981" },
    { name: "Utilities", icon: "💡", color: "#10b981" },
    { name: "Transport", icon: "🚗", color: "#10b981" },
    { name: "Healthcare", icon: "🏥", color: "#10b981" },
    { name: "Education", icon: "📚", color: "#10b981" },
  ];

  const wantsCategories = [
    { name: "Dining Out", icon: "🍽️", color: "#f59e0b" },
    { name: "Shopping", icon: "🛍️", color: "#f59e0b" },
    { name: "Entertainment", icon: "🎮", color: "#f59e0b" },
    { name: "Hobbies", icon: "🎨", color: "#f59e0b" },
    { name: "Subscription", icon: "📱", color: "#f59e0b" },
    { name: "Travel", icon: "✈️", color: "#f59e0b" },
  ];

  const savingsCategories = [
    { name: "Emergency Fund", icon: "🆘", color: "#3b82f6" },
    { name: "Investment", icon: "📈", color: "#3b82f6" },
    { name: "Goal Savings", icon: "🎯", color: "#3b82f6" },
  ];

  for (const category of needsCategories) {
    await prisma.category.create({
      data: {
        ...category,
        type: "needs",
        isSystem: true,
        userId: null,
      },
    });
  }
  console.log("✅ Created NEEDS categories");

  for (const category of wantsCategories) {
    await prisma.category.create({
      data: {
        ...category,
        type: "wants",
        isSystem: true,
        userId: null,
      },
    });
  }
  console.log("✅ Created WANTS categories");

  for (const category of savingsCategories) {
    await prisma.category.create({
      data: {
        ...category,
        type: "savings",
        isSystem: true,
        userId: null,
      },
    });
  }
  console.log("✅ Created SAVINGS categories");

  console.log("🎉 Seed completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
