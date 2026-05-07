import { serializeUser } from "../utils/serializers.js";

export async function getMe(request, response) {
  response.json(serializeUser(request.user));
}

export async function updateMe(request, response, next) {
  try {
    request.user.profile = {
      ...request.user.profile.toObject(),
      ...request.body,
    };
    await request.user.save();
    response.json(serializeUser(request.user));
  } catch (error) {
    next(error);
  }
}

export async function trackActivity(request, response, next) {
  try {
    const { internship_id, event_type } = request.body;
    request.user.activities.push({
      internship_id,
      event_type,
      timestamp: new Date().toISOString(),
    });

    if (event_type === "click" && !request.user.clicks.includes(internship_id)) {
      request.user.clicks.push(internship_id);
    }
    if (event_type === "save" && !request.user.saved_internships.includes(internship_id)) {
      request.user.saved_internships.push(internship_id);
    }
    if (event_type === "apply" && !request.user.applied_internships.includes(internship_id)) {
      request.user.applied_internships.push(internship_id);
    }

    await request.user.save();
    response.json(serializeUser(request.user));
  } catch (error) {
    next(error);
  }
}
