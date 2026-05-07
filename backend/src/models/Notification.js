import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["application_update", "interview_scheduled", "selected", "rejected"],
      required: true,
    },
    read: { type: Boolean, default: false },
    link: { type: String, default: "/my-applications" },
  },
  { versionKey: false, timestamps: true }
);

export const Notification = mongoose.model("Notification", notificationSchema);