import { createHttpError } from "../utils/httpError.js";

export function requireAdmin(request, _response, next) {
  if (!request.user) {
    return next(createHttpError(401, "Not authenticated"));
  }
  if (request.user.role !== "admin") {
    return next(createHttpError(403, "Admin access required"));
  }
  if (request.user.status === "suspended") {
    return next(createHttpError(403, "Account suspended"));
  }
  next();
}