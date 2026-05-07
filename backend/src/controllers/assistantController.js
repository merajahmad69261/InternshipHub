import { Internship } from "../models/Internship.js";
import { User } from "../models/User.js";
import { careerAdvice, mockInterviewQuestions, resumeImprovementTips } from "../services/assistantService.js";
import { buildRecommendations } from "../utils/recommendation.js";

export async function getCareerAdvice(request, response, next) {
  try {
    const [internships, allUsers] = await Promise.all([Internship.find(), User.find()]);
    const recommendations = buildRecommendations(request.user, internships, allUsers);
    response.json(careerAdvice(request.user.profile, recommendations));
  } catch (error) {
    next(error);
  }
}

export function getResumeTips(request, response) {
  response.json({ tips: resumeImprovementTips(request.user.profile) });
}

export function getInterviewQuestions(request, response) {
  const role = request.user.profile.preferred_role || "Data Science";
  response.json({
    role,
    questions: mockInterviewQuestions(role),
  });
}
