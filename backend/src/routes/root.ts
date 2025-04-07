// src/routes/root.ts
import { FastifyInstance } from "fastify";

export default async function rootRoutes(fastify: FastifyInstance) {
  fastify.get("/", async () => {
    return { message: "Hello from Bun + Fastify 🚀" };
  });
}
