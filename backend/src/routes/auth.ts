import bcrypt from "bcryptjs";
import type { FastifyInstance } from "fastify";
import prisma from "@lib/prisma";

const loginSchema = {
  body: {
    type: "object",
    required: ["username", "password"],
    properties: {
      username: { type: "string" },
      password: { type: "string" },
    },
  },
} as const;

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post("/login", { schema: loginSchema }, async (request, reply) => {
    const { username, password } = request.body as {
      username: string;
      password: string;
    };

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return reply.status(401).send({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return reply.status(401).send({ message: "Invalid credentials" });
    }

    const token = fastify.jwt.sign(
      { id: user.id, username: user.username },
      { expiresIn: "7d" },
    );

    return reply.status(200).send({ token });
  });
}
