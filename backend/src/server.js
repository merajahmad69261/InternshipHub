import { createApp } from "./app.js";
import { connectDatabase, disconnectDatabase } from "./config/database.js";
import { env } from "./config/env.js";
import { seedDatabase } from "./seed.js";


const app = createApp();

async function startServer() {
  await connectDatabase();
  await seedDatabase();

  const server = app.listen(env.port, () => {
    console.log(`Backend listening on http://localhost:${env.port}`);
  });

  const shutdown = async () => {
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

startServer().catch((error) => {
  console.error("Failed to start backend", error);
  process.exit(1);
});
