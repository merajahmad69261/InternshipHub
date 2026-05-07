import { Router } from "express";
import {
  applyToInternship,
  getAllApplications,
  getApplicationStats,
  getMyApplications,
  updateApplicationStatus,
} from "../controllers/applicationController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { requireAdmin } from "../middlewares/adminMiddleware.js";

export const applicationRouter = Router();

// ── Student routes ─────────────────────────────────────────────
// Apply karo
applicationRouter.post("/", requireAuth, applyToInternship);

// Apni applications dekho
applicationRouter.get("/my", requireAuth, getMyApplications);

// ── Admin routes ───────────────────────────────────────────────
// Saari applications dekho
applicationRouter.get("/all", requireAuth, requireAdmin, getAllApplications);

// Stats dekho
applicationRouter.get("/stats", requireAuth, requireAdmin, getApplicationStats);

// Status change karo
applicationRouter.patch("/:id/status", requireAuth, requireAdmin, updateApplicationStatus);