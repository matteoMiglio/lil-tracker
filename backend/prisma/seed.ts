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

  const hashedPassword = await bcrypt.hash(password, 10);

  if (existingUser) {
    const isSamePassword = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (isSamePassword) {
      console.log(
        "Admin user already exists with the correct password. Skipping update."
      );
      return;
    }

    await prisma.user.update({
      where: { username: "admin" },
      data: { password: hashedPassword },
    });

    console.log("Admin user's password was updated.");
    return;
  }

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
