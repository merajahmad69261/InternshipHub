import { User } from "../models/User.js";
import { createHttpError } from "../utils/httpError.js";
import { createAccessToken, getPasswordHash, verifyPassword } from "../utils/security.js";

export async function signup(request, response, next) {
  try {
    const { email, password, profile } = request.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw createHttpError(400, "Email already registered");
    }

    const user = await User.create({
      email,
      hashed_password: await getPasswordHash(password),
      profile,
      saved_internships: [],
      applied_internships: [],
      clicks: [],
      activities: [],
    });

    response.json({
      access_token: createAccessToken(String(user._id)),
      token_type: "bearer",
    });
  } catch (error) {
    next(error);
  }
}

export async function login(request, response, next) {
  try {
    const { email, password } = request.body;
    const user = await User.findOne({ email });
    if (!user || !(await verifyPassword(password, user.hashed_password))) {
      throw createHttpError(401, "Invalid credentials");
    }

    response.json({
      access_token: createAccessToken(String(user._id)),
      token_type: "bearer",
    });
  } catch (error) {
    next(error);
  }
}
