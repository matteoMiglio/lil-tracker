import type { FastifyInstance } from "fastify";
import prisma from "@lib/prisma";

const paramsSchema = {
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "string" },
    },
  },
} as const;

const createSchema = {
  body: {
    type: "object",
    required: ["name"],
    properties: {
      name: { type: "string", minLength: 1 },
    },
  },
} as const;

const updateSchema = {
  ...paramsSchema,
  body: {
    type: "object",
    properties: {
      name: { type: "string", minLength: 1 },
    },
  },
} as const;

export default async function categoryRoutes(fastify: FastifyInstance) {
  fastify.addHook("onRequest", fastify.authenticate);

  fastify.get("/", async () => {
    return prisma.category.findMany({
      where: {
        deletedAt: null,
      },
    });
  });

  fastify.post("/", { schema: createSchema }, async (request, reply) => {
    const { name } = request.body as { name: string };
    try {
      const category = await prisma.category.create({ data: { name } });
      return reply.status(201).send(category);
    } catch {
      return reply
        .status(500)
        .send({ message: "Failed to create category" });
    }
  });

  fastify.get("/:id", { schema: paramsSchema }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const category = await prisma.category.findFirst({
      where: { id, deletedAt: null },
    });

    if (!category) {
      return reply.status(404).send({ message: "Category not found" });
    }

    return category;
  });

  fastify.put("/:id", { schema: updateSchema }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const { name } = request.body as { name: string };

    try {
      const category = await prisma.category.update({
        where: { id },
        data: { name },
      });
      return category;
    } catch {
      return reply.status(404).send({ message: "Category not found" });
    }
  });

  fastify.delete("/:id", { schema: paramsSchema }, async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      await prisma.category.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
      return reply.status(204).send();
    } catch {
      return reply.status(404).send({ message: "Category not found" });
    }
  });
}
