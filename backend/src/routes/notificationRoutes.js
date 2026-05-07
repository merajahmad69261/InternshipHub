import { Router } from "express";
import {
  getMyNotifications,
  getUnreadCount,
  markAllAsRead,
  markAsRead,
} from "../controllers/notificationController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

export const notificationRouter = Router();

// Saari notifications
notificationRouter.get("/", requireAuth, getMyNotifications);

// Unread count
notificationRouter.get("/unread-count", requireAuth, getUnreadCount);

// Ek read karo
notificationRouter.patch("/:id/read", requireAuth, markAsRead);

// Saari read karo
notificationRouter.patch("/read-all", requireAuth, markAllAsRead);