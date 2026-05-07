import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDatabase() {
  await mongoose.connect(env.mongodbUrl, {
    dbName: env.databaseName,
  });
}

export async function disconnectDatabase() {
  await mongoose.disconnect();
}
