import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    internship_id: { type: String, required: true },
    event_type: { type: String, required: true },
    timestamp: { type: String, required: true },
  },
  { _id: false }
);

const userProfileSchema = new mongoose.Schema(
  {
    full_name: { type: String, required: true },
    skills: { type: [String], default: [] },
    interests: { type: [String], default: [] },
    experience_level: { type: String, default: "Beginner" },
    preferred_role: { type: String, default: "AI/ML" },
    location_preference: { type: String, default: "Remote" },
    education: { type: [String], default: [] },
    projects: { type: [String], default: [] },
    extracted_resume_text: { type: String, default: null },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
   role: {
  type: String,
  enum: ["student", "admin", "recruiter"],
  default: "student",
},
status: {
  type: String,
  enum: ["active", "suspended"],
  default: "active",
}, hashed_password: { type: String, required: true },
    profile: { type: userProfileSchema, required: true },
    saved_internships: { type: [String], default: [] },
    applied_internships: { type: [String], default: [] },
    clicks: { type: [String], default: [] },
    activities: { type: [activitySchema], default: [] },
  },
  { versionKey: false, timestamps: true }
);

export const User = mongoose.model("User", userSchema);
