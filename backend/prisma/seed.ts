import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const seed = async () => {
  const password = process.env.DEFAULT_ADMIN_PASSWORD;

  if (!password) {
    console.error("Environment variable DEFAULT_ADMIN_PASSWORD is not set");
    process.exit(1);
  }

  const existingUser = await prisma.user.findUnique({
    where: { username: "admin" },
  });

  if (existingUser) {
    console.log("Admin user already exists. Skipping creation.");
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      username: "admin",
      password: hashedPassword,
    },
  });

  console.log("Admin user created successfully!");
};

seed()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
