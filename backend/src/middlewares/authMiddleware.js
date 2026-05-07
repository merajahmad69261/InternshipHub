import { User } from "../models/User.js";
import { createHttpError } from "../utils/httpError.js";
import { verifyAccessToken } from "../utils/security.js";

export async function requireAuth(request, _response, next) {
  try {
    const authHeader = request.headers.authorization || "";
    const [, token] = authHeader.split(" ");
    if (!token) {
      throw createHttpError(401, "Could not validate credentials");
    }

    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub);
    if (!user) {
      throw createHttpError(401, "Could not validate credentials");
    }

    request.user = user;
    next();
  } catch (error) {
    next(createHttpError(401, "Could not validate credentials"));
  }
}
