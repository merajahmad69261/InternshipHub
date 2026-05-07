import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { assistantRouter } from "./routes/assistantRoutes.js";
import { authRouter } from "./routes/authRoutes.js";
import { internshipRouter } from "./routes/internshipRoutes.js";
import { resumeRouter } from "./routes/resumeRoutes.js";
import { usersRouter } from "./routes/usersRoutes.js";
import { adminRouter } from "./routes/adminRoutes.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";
import { applicationRouter } from "./routes/applicationRoutes.js";
import { notificationRouter } from "./routes/notificationRoutes.js";

export function createApp() {
  const app = express();

  app.use(cors({
    origin: env.corsOrigins,
    credentials: true,
  }));
  app.use(express.json({ limit: "5mb" }));

  app.get("/health", (_request, response) => {
    response.json({ status: "ok" });
  });

  app.use("/api/auth", authRouter);
  app.use("/api/users", usersRouter);
  app.use("/api/resume", resumeRouter);
  app.use("/api/internships", internshipRouter);
  app.use("/api/assistant", assistantRouter);
  app.use("/api/admin", adminRouter);
  app.use("/api/applications", applicationRouter);
  app.use("/api/notifications", notificationRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
