import mongoose from "mongoose";

const internshipSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    skills_required: { type: [String], default: [] },
    location: { type: String, required: true },
    stipend: { type: String, required: true },
    description: { type: String, required: true },
    role_category: { type: String, required: true },
    interests: { type: [String], default: [] },
    popularity: { type: Number, default: 0.5 },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true }
);

export const Internship = mongoose.model("Internship", internshipSchema);