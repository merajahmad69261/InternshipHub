import { Router } from "express";
import multer from "multer";
import { uploadResume } from "../controllers/resumeController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

const upload = multer({ storage: multer.memoryStorage() });

export const resumeRouter = Router();

resumeRouter.post("/upload", requireAuth, upload.single("file"), uploadResume);
