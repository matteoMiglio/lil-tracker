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
      active: { type: "boolean" },
    },
  },
} as const;

const updateSchema = {
  ...paramsSchema,
  body: {
    type: "object",
    properties: {
      name: { type: "string", minLength: 1 },
      active: { type: "boolean" },
    },
  },
} as const;

export default async function seasonRoutes(fastify: FastifyInstance) {
  fastify.addHook("onRequest", fastify.authenticate);

  fastify.get("/", async () => {
    return prisma.season.findMany({
      where: {
        deletedAt: null,
      },
    });
  });

  fastify.post("/", { schema: createSchema }, async (request, reply) => {
    const { name, active } = request.body as {
      name: string;
      active?: boolean;
    };

    try {
      if (active) {
        await prisma.$transaction([
          prisma.season.updateMany({
            where: { deletedAt: null },
            data: { active: false },
          }),
          prisma.season.create({ data: { name, active: true } }),
        ]);

        const created = await prisma.season.findFirst({
          where: { name, active: true, deletedAt: null },
          orderBy: { createdAt: "desc" },
        });

        return reply.status(201).send(created);
      }

      const season = await prisma.season.create({ data: { name } });
      return reply.status(201).send(season);
    } catch {
      return reply
        .status(500)
        .send({ message: "Failed to create season" });
    }
  });

  fastify.get("/:id", { schema: paramsSchema }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const season = await prisma.season.findFirst({
      where: { id, deletedAt: null },
    });

    if (!season) {
      return reply.status(404).send({ message: "Season not found" });
    }

    return season;
  });

  fastify.put("/:id", { schema: updateSchema }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const { name, active } = request.body as {
      name?: string;
      active?: boolean;
    };

    try {
      if (active) {
        await prisma.$transaction([
          prisma.season.updateMany({
            where: { deletedAt: null },
            data: { active: false },
          }),
          prisma.season.update({
            where: { id },
            data: { name, active: true },
          }),
        ]);

        const updated = await prisma.season.findUnique({ where: { id } });
        return updated;
      }

      const season = await prisma.season.update({
        where: { id },
        data: { name, active },
      });
      return season;
    } catch {
      return reply.status(404).send({ message: "Season not found" });
    }
  });

  fastify.delete("/:id", { schema: paramsSchema }, async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      await prisma.season.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
      return reply.status(204).send();
    } catch {
      return reply.status(404).send({ message: "Season not found" });
    }
  });
}
