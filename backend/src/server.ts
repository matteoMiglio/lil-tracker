// src/server.ts
import Fastify from "fastify";
import loggerPlugin from "@plugins/logger";
import authPlugin from "@plugins/auth";
import rootRoutes from "@routes/root";
import transactionRoutes from "@routes/transactions";
import categoryRoutes from "@routes/categories";
import seasonRoutes from "@routes/seasons";
import authRoutes from "@routes/auth";

const app = Fastify({ logger: true });

// Register plugins
app.register(loggerPlugin);
app.register(authPlugin);

// Register routes
app.register(rootRoutes);
app.register(authRoutes);
app.register(transactionRoutes, { prefix: "/transactions" });
app.register(categoryRoutes, { prefix: "/categories" });
app.register(seasonRoutes, { prefix: "/seasons" });

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
