// src/server.ts
import Fastify from "fastify";
import loggerPlugin from "@plugins/logger";
import rootRoutes from "@routes/root";
import transactionRoutes from "@routes/transactions";
import categoryRoutes from "@routes/categories";

const app = Fastify({ logger: true });

// Register plugins and routes
app.register(loggerPlugin);
app.register(rootRoutes);
app.register(transactionRoutes, { prefix: "/transactions" });
app.register(categoryRoutes, { prefix: "/categories" });

const start = async () => {
  try {
    await app.listen({ port: 31000, host: "0.0.0.0" });
    console.log("🚀 Server running!");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
