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
    required: ["amount", "date", "time", "kind"],
    properties: {
      amount: { type: "number", exclusiveMinimum: 0 },
      date: { type: "string" },
      time: { type: "string" },
      description: { type: ["string", "null"] },
      kind: { type: "string", enum: ["income", "expense"] },
      categoryId: { type: ["string", "null"] },
      seasonId: { type: ["string", "null"] },
    },
  },
} as const;

const updateSchema = {
  ...paramsSchema,
  body: {
    type: "object",
    properties: {
      amount: { type: "number", exclusiveMinimum: 0 },
      date: { type: "string" },
      time: { type: "string" },
      description: { type: ["string", "null"] },
      kind: { type: "string", enum: ["income", "expense"] },
      categoryId: { type: ["string", "null"] },
      seasonId: { type: ["string", "null"] },
    },
  },
} as const;

export default async function transactionRoutes(fastify: FastifyInstance) {
  fastify.addHook("onRequest", fastify.authenticate);

  fastify.get("/", async (request) => {
    const { seasonId } = request.query as { seasonId?: string };

    return prisma.transaction.findMany({
      include: { category: true, season: true },
      where: {
        deletedAt: null,
        ...(seasonId ? { seasonId } : {}),
      },
    });
  });

  fastify.get("/:id", { schema: paramsSchema }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const transaction = await prisma.transaction.findFirst({
      where: { id, deletedAt: null },
      include: { category: true, season: true },
    });

    if (!transaction) {
      return reply.status(404).send({ message: "Transaction not found" });
    }

    return transaction;
  });

  fastify.post("/", { schema: createSchema }, async (request, reply) => {
    const { amount, date, time, description, kind, categoryId, seasonId } =
      request.body as {
        amount: number;
        date: string;
        time: string;
        description: string | null;
        kind: "income" | "expense";
        categoryId: string | null;
        seasonId: string | null;
      };

    try {
      const newTransaction = await prisma.transaction.create({
        data: {
          amount,
          date,
          time,
          kind,
          description: description ?? null,
          categoryId: categoryId ?? null,
          seasonId: seasonId ?? null,
        },
        include: {
          category: true,
          season: true,
        },
      });

      return reply.status(201).send(newTransaction);
    } catch {
      return reply
        .status(500)
        .send({ message: "Failed to create transaction" });
    }
  });

  fastify.put("/:id", { schema: updateSchema }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const { amount, date, time, description, kind, categoryId, seasonId } =
      request.body as {
        amount?: number;
        date?: string;
        time?: string;
        description?: string | null;
        kind?: "income" | "expense";
        categoryId?: string | null;
        seasonId?: string | null;
      };

    try {
      const transaction = await prisma.transaction.update({
        where: { id },
        data: {
          amount,
          date,
          time,
          description,
          kind,
          categoryId,
          seasonId,
        },
        include: {
          category: true,
          season: true,
        },
      });

      return transaction;
    } catch {
      return reply.status(404).send({ message: "Transaction not found" });
    }
  });

  fastify.delete("/:id", { schema: paramsSchema }, async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      await prisma.transaction.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
      return reply.status(204).send();
    } catch {
      return reply.status(404).send({ message: "Transaction not found" });
    }
  });
}
