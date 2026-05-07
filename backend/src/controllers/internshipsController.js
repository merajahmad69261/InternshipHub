import { Internship } from "../models/Internship.js";
import { User } from "../models/User.js";
import { buildRecommendations } from "../utils/recommendation.js";
import { interpretSearchQuery } from "../utils/search.js";
import { serializeInternship } from "../utils/serializers.js";

export async function listInternships(_request, response, next) {
  try {
    const internships = await Internship.find().lean();
    response.json(internships.map(serializeInternship));
  } catch (error) {
    next(error);
  }
}

export async function trendingInternships(_request, response, next) {
  try {
    const internships = await Internship.find().sort({ popularity: -1 }).limit(6).lean();
    response.json(internships.map(serializeInternship));
  } catch (error) {
    next(error);
  }
}

export async function recommendations(request, response, next) {
  try {
    const [internships, allUsers] = await Promise.all([Internship.find(), User.find()]);
    const results = buildRecommendations(request.user, internships, allUsers).map((item) => ({
      ...item,
      internship: serializeInternship(item.internship),
    }));
    response.json(results);
  } catch (error) {
    next(error);
  }
}

export async function searchInternships(request, response, next) {
  try {
    const query = String(request.query.q || "");
    const intent = interpretSearchQuery(query);
    const internships = await Internship.find().lean();

    const filtered = internships.filter((internship) => {
      const haystack = [
        ...(internship.skills_required || []),
        ...(internship.interests || []),
        internship.title,
        internship.description,
      ]
        .join(" ")
        .toLowerCase();

      const roleOk = !intent.role || internship.role_category.toLowerCase() === intent.role.toLowerCase();
      const locationOk = !intent.location || internship.location.toLowerCase().includes(intent.location.toLowerCase());
      const skillsOk = !intent.skills.length || intent.skills.some((skill) => haystack.includes(skill));
      const keywordOk = intent.keywords.some((keyword) => haystack.includes(keyword.toLowerCase()));

      return roleOk && locationOk && (skillsOk || keywordOk);
    });

    let ordered = filtered;
    if (request.user) {
      const allUsers = await User.find();
      const recommendationLookup = new Map(
        buildRecommendations(request.user, internships, allUsers).map((item) => [String(item.internship._id), item.score])
      );
      ordered = [...filtered].sort(
        (a, b) => (recommendationLookup.get(String(b._id)) || b.popularity) - (recommendationLookup.get(String(a._id)) || a.popularity)
      );
    } else {
      ordered = [...filtered].sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    }

    response.json({
      intent,
      results: ordered.slice(0, 12).map(serializeInternship),
    });
  } catch (error) {
    next(error);
  }
}
