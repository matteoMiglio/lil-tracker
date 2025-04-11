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
    return await prisma.category.create({ data: { name: body.name } });
  });

  // Get a single category
  fastify.get("/:id", async (req) => {
    const { id } = req.params as { id: string };
    return await prisma.category.findUnique({ where: { id } });
  });

  // Update a category
  fastify.put("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const { name } = request.body as { id: string; name: string };

    const category = await prisma.category.update({
      where: { id },
      data: { name },
    });
    return category;
  });

  // Delete a category
  fastify.delete("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      await prisma.category.delete({
        where: { id },
      });
      return reply.status(204).send(); // No content response for successful delete
    } catch (error) {
      return reply.status(404).send({ message: "Category not found" });
    }
  });
}
