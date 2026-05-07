import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export async function getPasswordHash(password) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword);
}

export function createAccessToken(subject) {
  const expiresInSeconds = env.accessTokenExpireMinutes * 60;
  return jwt.sign({ sub: subject }, env.jwtSecretKey, {
    algorithm: env.jwtAlgorithm,
    expiresIn: expiresInSeconds,
  });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, env.jwtSecretKey, {
    algorithms: [env.jwtAlgorithm],
  });
}
