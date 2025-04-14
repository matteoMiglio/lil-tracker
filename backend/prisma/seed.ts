import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const seed = async () => {
  // Get the password from the environment variable
  const password = process.env.DEFAULT_ADMIN_PASSWORD;

  if (!password) {
    console.error("Environment variable DEFAULT_ADMIN_PASSWORD is not set");
    process.exit(1);
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a default user
  await prisma.user.create({
    data: {
      username: "admin",
      password: hashedPassword,
    },
  });

  console.log("Database seeded successfully!");
};

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
