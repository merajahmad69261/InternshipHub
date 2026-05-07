import { Router } from "express";
import { getMe, trackActivity, updateMe } from "../controllers/usersController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

export const usersRouter = Router();

usersRouter.get("/me", requireAuth, getMe);
usersRouter.put("/me", requireAuth, updateMe);
usersRouter.post("/activity", requireAuth, trackActivity);
