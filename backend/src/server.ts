// src/server.ts
import Fastify from "fastify";
import loggerPlugin from "@plugins/logger";
import rootRoutes from "@routes/root";
import transactionRoutes from "@routes/transactions";

const app = Fastify({ logger: true });

// Register plugins and routes
app.register(loggerPlugin);
app.register(rootRoutes);
app.register(transactionRoutes);

const start = async () => {
  try {
    await app.listen({ port: 31000 });
    console.log("🚀 Server running at http://localhost:31000");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
