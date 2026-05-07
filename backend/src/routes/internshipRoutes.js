import { Router } from "express";
import {
  listInternships,
  recommendations,
  searchInternships,
  trendingInternships,
} from "../controllers/internshipsController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

export const internshipRouter = Router();

internshipRouter.get("/", listInternships);
internshipRouter.get("/trending", trendingInternships);
internshipRouter.get("/recommendations", requireAuth, recommendations);
internshipRouter.get("/search", requireAuth, searchInternships);
