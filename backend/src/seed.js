import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Internship } from "./models/Internship.js";
import { User } from "./models/User.js";
import { getPasswordHash } from "./utils/security.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function seedDatabase() {
  const internshipCount = await Internship.countDocuments();
  if (!internshipCount) {
    const datasetPath = path.resolve(__dirname, "../data/internships.json");
    const contents = await fs.readFile(datasetPath, "utf-8");
    const internships = JSON.parse(contents);
    await Internship.insertMany(internships);
  }

  const userCount = await User.countDocuments();
  if (!userCount) {
    const mockUsers = [
      {
        email: "ai.student@example.com",
        hashed_password: await getPasswordHash("Password@123"),
        profile: {
          full_name: "Aarav Mehta",
          skills: ["Python", "Machine Learning", "NLP"],
          interests: ["artificial intelligence", "research"],
          experience_level: "Intermediate",
          preferred_role: "AI/ML",
          location_preference: "Remote",
          education: ["B.Tech Computer Science"],
          projects: ["Resume parser|https://github.com/demo/resume-parser", "Movie recommender|https://github.com/demo/movie-recommender"],
        },
      },
      {
        email: "web.student@example.com",
        hashed_password: await getPasswordHash("Password@123"),
        profile: {
          full_name: "Neha Kapoor",
          skills: ["React", "JavaScript", "MongoDB"],
          interests: ["frontend", "web apps"],
          experience_level: "Intermediate",
          preferred_role: "Web Development",
          location_preference: "Hybrid",
          education: ["B.Sc Information Technology"],
          projects: ["Portfolio site|https://github.com/demo/portfolio", "Task manager|https://github.com/demo/task-manager"],
        },
      },
    ];

    const createdUsers = await User.insertMany(
      mockUsers.map((user) => ({
        ...user,
        saved_internships: [],
        applied_internships: [],
        clicks: [],
        activities: [],
      }))
    );

    const internships = await Internship.find().limit(8);
    if (internships.length >= 7) {
      createdUsers[0].saved_internships = [String(internships[0]._id)];
      createdUsers[0].applied_internships = [String(internships[3]._id)];
      createdUsers[0].clicks = [String(internships[0]._id), String(internships[6]._id)];

      createdUsers[1].saved_internships = [String(internships[1]._id)];
      createdUsers[1].applied_internships = [String(internships[5]._id)];
      createdUsers[1].clicks = [String(internships[1]._id), String(internships[4]._id)];

      await Promise.all(createdUsers.map((user) => user.save()));
    }
  }
}
