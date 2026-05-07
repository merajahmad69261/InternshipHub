import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    internship_id: { type: mongoose.Schema.Types.ObjectId, ref: "Internship", required: true },
    status: {
      type: String,
      enum: ["applied", "under_review", "interview_scheduled", "selected", "rejected"],
      default: "applied",
    },
    interview_date: { type: Date, default: null },
    feedback: { type: String, default: "" },
  },
  { versionKey: false, timestamps: true }
);

export const Application = mongoose.model("Application", applicationSchema);