import { Application } from "../models/Application.js";
import { Internship } from "../models/Internship.js";
import { User } from "../models/User.js";
import { createNotification } from "./notificationController.js";

// ── Student: Apply karna ──────────────────────────────────────────

export async function applyToInternship(req, res, next) {
  try {
    const { internship_id } = req.body;
    const user_id = req.user._id;

    const existing = await Application.findOne({ user_id, internship_id });
    if (existing) {
      return res.status(400).json({ message: "Already applied" });
    }

    const application = await Application.create({
      user_id,
      internship_id,
      status: "applied",
    });

    await User.findByIdAndUpdate(user_id, {
      $addToSet: { applied_internships: internship_id },
    });

    res.status(201).json(application);
  } catch (e) { next(e); }
}

// ── Student: Apni applications dekho ─────────────────────────────

export async function getMyApplications(req, res, next) {
  try {
    const applications = await Application.find({
      user_id: req.user._id,
    })
      .populate("internship_id", "title company location stipend role_category")
      .sort({ createdAt: -1 })
      .lean();

    res.json(applications);
  } catch (e) { next(e); }
}

// ── Admin: Saari applications dekho ──────────────────────────────

export async function getAllApplications(req, res, next) {
  try {
    const applications = await Application.find()
      .populate("user_id", "email profile")
      .populate("internship_id", "title company location")
      .sort({ createdAt: -1 })
      .lean();

    res.json(applications);
  } catch (e) { next(e); }
}

// ── Admin: Status change karo ─────────────────────────────────────

const notificationTemplates = {
  under_review: {
    title: "🔍 Application Under Review",
    message: "Teri application review ho rahi hai. Jald hi update milega!",
    type: "application_update",
  },
  interview_scheduled: {
    title: "📅 Interview Scheduled!",
    message: "Badhai ho! Tera interview schedule ho gaya hai. My Applications mein date dekho.",
    type: "interview_scheduled",
  },
  selected: {
    title: "🎉 Congratulations! Tu Select Ho Gaya!",
    message: "Bahut badhai ho! Teri application accept ho gayi hai!",
    type: "selected",
  },
  rejected: {
    title: "Application Update",
    message: "Is baar selection nahi hua. Himmat rakho aur aage try karo!",
    type: "rejected",
  },
};

export async function updateApplicationStatus(req, res, next) {
  try {
    const { status, interview_date, feedback } = req.body;

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      {
        status,
        ...(interview_date && { interview_date }),
        ...(feedback && { feedback }),
      },
      { new: true }
    )
      .populate("user_id", "email profile")
      .populate("internship_id", "title company");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Auto notification bhejo
    const template = notificationTemplates[status];
    if (template) {
      await createNotification({
        user_id: application.user_id._id,
        title: template.title,
        message: `${template.message} — ${application.internship_id.title} at ${application.internship_id.company}`,
        type: template.type,
        link: "/my-applications",
      });
    }

    res.json(application);
  } catch (e) { next(e); }
}

// ── Admin: Analytics ──────────────────────────────────────────────

export async function getApplicationStats(req, res, next) {
  try {
    const stats = await Application.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);
    res.json(stats);
  } catch (e) { next(e); }
}