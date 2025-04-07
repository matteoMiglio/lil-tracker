// src/plugins/logger.ts
import { FastifyInstance } from "fastify";

export default async function loggerPlugin(fastify: FastifyInstance) {
  fastify.addHook("onRequest", async (request, reply) => {
    console.log(`[${request.method}] ${request.url}`);
  });
}
