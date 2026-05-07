import { Router } from "express";
import {
  createInternship,
  deleteInternship,
  deleteUser,
  getAllInternshipsAdmin,
  getAllReports,
  getAllUsers,
  getAnalytics,
  setInternshipStatus,
  submitReport,
  toggleFeatured,
  updateInternship,
  updateReportStatus,
  updateUserRole,
  updateUserStatus,
} from "../controllers/adminController.js";
import { getAllApplications, updateApplicationStatus } from "../controllers/applicationController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { requireAdmin } from "../middlewares/adminMiddleware.js";

export const adminRouter = Router();

// Analytics
adminRouter.get("/analytics", requireAuth, requireAdmin, getAnalytics);

// Users
adminRouter.get("/users", requireAuth, requireAdmin, getAllUsers);
adminRouter.delete("/users/:id", requireAuth, requireAdmin, deleteUser);
adminRouter.patch("/users/:id/role", requireAuth, requireAdmin, updateUserRole);
adminRouter.patch("/users/:id/status", requireAuth, requireAdmin, updateUserStatus);

// Internships
adminRouter.get("/internships", requireAuth, requireAdmin, getAllInternshipsAdmin);
adminRouter.post("/internships", requireAuth, requireAdmin, createInternship);
adminRouter.put("/internships/:id", requireAuth, requireAdmin, updateInternship);
adminRouter.delete("/internships/:id", requireAuth, requireAdmin, deleteInternship);
adminRouter.patch("/internships/:id/status", requireAuth, requireAdmin, setInternshipStatus);
adminRouter.patch("/internships/:id/featured", requireAuth, requireAdmin, toggleFeatured);

// Reports
adminRouter.get("/reports", requireAuth, requireAdmin, getAllReports);
adminRouter.patch("/reports/:id/status", requireAuth, requireAdmin, updateReportStatus);
adminRouter.post("/reports", requireAuth, submitReport);

// Applications
adminRouter.get("/applications", requireAuth, requireAdmin, getAllApplications);
adminRouter.patch("/applications/:id/status", requireAuth, requireAdmin, updateApplicationStatus);