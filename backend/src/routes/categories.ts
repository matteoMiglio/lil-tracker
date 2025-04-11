import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function categoryRoutes(fastify: FastifyInstance) {
  // Get all categories
  fastify.get("/", async () => {
    return prisma.category.findMany();
  });

  // Create a category
  fastify.post("/", async (req) => {
    const body = req.body as { name: string };
    return prisma.category.create({ data: { name: body.name } });
  });

  // Get a single category
  fastify.get("/:id", async (req) => {
    const { id } = req.params as { id: string };
    return prisma.category.findUnique({ where: { id } });
  });

  // Delete a category
  fastify.delete("/:id", async (req) => {
    const { id } = req.params as { id: string };
    return prisma.category.delete({ where: { id } });
  });
}
