import { Internship } from "../models/Internship.js";
import { Report } from "../models/Report.js";
import { User } from "../models/User.js";
import { serializeUser } from "../utils/serializers.js";

// ── Users ──────────────────────────────────────────────────────────────────

export async function getAllUsers(_req, res, next) {
  try {
    const users = await User.find().lean();
    res.json(users.map(serializeUser));
  } catch (e) { next(e); }
}

export async function deleteUser(req, res, next) {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (e) { next(e); }
}

export async function updateUserRole(req, res, next) {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id, { role }, { new: true }
    );
    res.json(serializeUser(user));
  } catch (e) { next(e); }
}

export async function updateUserStatus(req, res, next) {
  try {
    const { status } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id, { status }, { new: true }
    );
    res.json(serializeUser(user));
  } catch (e) { next(e); }
}

// ── Internships ────────────────────────────────────────────────────────────

export async function getAllInternshipsAdmin(_req, res, next) {
  try {
    const internships = await Internship.find().lean();
    res.json(internships);
  } catch (e) { next(e); }
}

export async function createInternship(req, res, next) {
  try {
    const internship = await Internship.create({
      ...req.body,
      status: "approved",
    });
    res.status(201).json(internship);
  } catch (e) { next(e); }
}

export async function updateInternship(req, res, next) {
  try {
    const internship = await Internship.findByIdAndUpdate(
      req.params.id, req.body, { new: true }
    );
    res.json(internship);
  } catch (e) { next(e); }
}

export async function deleteInternship(req, res, next) {
  try {
    await Internship.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (e) { next(e); }
}

export async function setInternshipStatus(req, res, next) {
  try {
    const { status } = req.body;
    const internship = await Internship.findByIdAndUpdate(
      req.params.id, { status }, { new: true }
    );
    res.json(internship);
  } catch (e) { next(e); }
}

export async function toggleFeatured(req, res, next) {
  try {
    const internship = await Internship.findById(req.params.id);
    internship.featured = !internship.featured;
    await internship.save();
    res.json(internship);
  } catch (e) { next(e); }
}

// ── Reports ────────────────────────────────────────────────────────────────

export async function getAllReports(_req, res, next) {
  try {
    const reports = await Report.find().sort({ createdAt: -1 }).lean();
    res.json(reports);
  } catch (e) { next(e); }
}

export async function updateReportStatus(req, res, next) {
  try {
    const { status } = req.body;
    const report = await Report.findByIdAndUpdate(
      req.params.id, { status }, { new: true }
    );
    res.json(report);
  } catch (e) { next(e); }
}

export async function submitReport(req, res, next) {
  try {
    const { internship_id, reason, description } = req.body;
    const report = await Report.create({
      internship_id,
      reported_by: String(req.user._id),
      reason,
      description,
    });
    res.status(201).json(report);
  } catch (e) { next(e); }
}

// ── Analytics ──────────────────────────────────────────────────────────────

export async function getAnalytics(_req, res, next) {
  try {
    const [totalUsers, totalInternships, pendingReports, users] = await Promise.all([
      User.countDocuments(),
      Internship.countDocuments(),
      Report.countDocuments({ status: "pending" }),
      User.find().lean(),
    ]);

    const totalApplications = users.reduce(
      (sum, u) => sum + (u.applied_internships?.length || 0), 0
    );
    const totalSaves = users.reduce(
      (sum, u) => sum + (u.saved_internships?.length || 0), 0
    );
    const suspendedUsers = users.filter(
      (u) => u.status === "suspended"
    ).length;

    const skillCounts = {};
    users.forEach((u) => {
      (u.profile?.skills || []).forEach((s) => {
        skillCounts[s] = (skillCounts[s] || 0) + 1;
      });
    });
    const topSkills = Object.entries(skillCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([skill, count]) => ({ skill, count }));

    res.json({
      totalUsers,
      totalInternships,
      totalApplications,
      totalSaves,
      suspendedUsers,
      pendingReports,
      topSkills,
    });
  } catch (e) { next(e); }
}