import dotenv from "dotenv";

dotenv.config();

function required(name, fallback = "") {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  port: Number(process.env.PORT || 8000),
  mongodbUrl: required("MONGODB_URL"),
  databaseName: required("DATABASE_NAME"),
  jwtSecretKey: required("JWT_SECRET_KEY"),
  jwtAlgorithm: process.env.JWT_ALGORITHM || "HS256",
  accessTokenExpireMinutes: Number(process.env.ACCESS_TOKEN_EXPIRE_MINUTES || 1440),
  corsOrigins: (process.env.CORS_ORIGINS || "http://localhost:5173")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean),
};
