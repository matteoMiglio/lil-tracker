import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface Transaction {
  id: string;
  amount: number | null;
  date: string | null;
  time: string | null;
  description: string | null;
  categoryId?: string;
  category?: {
    id: string;
    name: string;
  };
  kind: "income" | "expense";
}

export default async function transactionRoutes(fastify: FastifyInstance) {
  // 1. GET /transactions - List all transactions
  fastify.get("/", async () => {
    return prisma.transaction.findMany({
      include: { category: true },
    });
  });

  // 2. GET /transactions/:id - Get a specific transaction by ID
  fastify.get("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const transaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      return reply.status(404).send({ message: "Transaction not found" });
    }

    return transaction;
  });

  // 3. POST /transactions - Create a new transaction
  fastify.post("/", async (request, reply) => {
    const { amount, date, time, description, kind, categoryId } =
      request.body as Transaction;

    const parsedAmount =
      typeof amount === "string" ? parseFloat(amount) : amount;

    if (typeof parsedAmount !== "number" || isNaN(parsedAmount)) {
      return reply.status(400).send({ message: "Invalid amount" });
    }

    if (parsedAmount <= 0) {
      return reply
        .status(400)
        .send({ message: "Amount must be greater than 0" });
    }

    if (typeof date !== "string") {
      return reply.status(400).send({ message: "Invalid date" });
    }
    if (typeof time !== "string") {
      return reply.status(400).send({ message: "Invalid time" });
    }
    if (kind !== "income" && kind !== "expense") {
      return reply.status(400).send({ message: "Invalid kind" });
    }

    const newTransaction = await prisma.transaction.create({
      data: {
        amount: parsedAmount,
        date,
        time,
        kind,
        description: description ?? null,
        categoryId: categoryId ?? null,
      },
      include: {
        category: true,
      },
    });

    return reply.status(201).send(newTransaction);
  });

  // 4. PUT /transactions/:id - Update an existing transaction
  fastify.put("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const { amount, date, time, description, kind } =
      request.body as Transaction;

    const transaction = await prisma.transaction.update({
      where: { id },
      data: {
        amount,
        date,
        time,
        description,
        kind,
      },
    });

    return transaction;
  });

  // 5. DELETE /transactions/:id - Delete a transaction by ID
  fastify.delete("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      await prisma.transaction.delete({
        where: { id },
      });
      return reply.status(204).send(); // No content response for successful delete
    } catch (error) {
      return reply.status(404).send({ message: "Transaction not found" });
    }
  });
}
