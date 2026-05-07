import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    internship_id: { type: String, required: true },
    reported_by: { type: String, required: true },
    reason: {
      type: String,
      enum: ["fake_internship", "scam_company", "spam_posting", "other"],
      required: true,
    },
    description: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "reviewed", "dismissed"],
      default: "pending",
    },
  },
  { versionKey: false, timestamps: true }
);

export const Report = mongoose.model("Report", reportSchema);