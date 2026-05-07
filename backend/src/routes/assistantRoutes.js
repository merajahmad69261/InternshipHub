import { Router } from "express";
import {
  getCareerAdvice,
  getInterviewQuestions,
  getResumeTips,
} from "../controllers/assistantController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

export const assistantRouter = Router();

assistantRouter.get("/career-advice", requireAuth, getCareerAdvice);
assistantRouter.get("/resume-tips", requireAuth, getResumeTips);
assistantRouter.get("/interview-questions", requireAuth, getInterviewQuestions);
