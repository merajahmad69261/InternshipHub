import { Notification } from "../models/Notification.js";

// User ki saari notifications
export async function getMyNotifications(req, res, next) {
  try {
    const notifications = await Notification.find({
      user_id: req.user._id,
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    res.json(notifications);
  } catch (e) { next(e); }
}

// Unread count
export async function getUnreadCount(req, res, next) {
  try {
    const count = await Notification.countDocuments({
      user_id: req.user._id,
      read: false,
    });
    res.json({ count });
  } catch (e) { next(e); }
}

// Ek notification read mark karo
export async function markAsRead(req, res, next) {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ message: "Marked as read" });
  } catch (e) { next(e); }
}

// Saari notifications read mark karo
export async function markAllAsRead(req, res, next) {
  try {
    await Notification.updateMany(
      { user_id: req.user._id, read: false },
      { read: true }
    );
    res.json({ message: "All marked as read" });
  } catch (e) { next(e); }
}

// Notification banana — internal use ke liye
export async function createNotification({ user_id, title, message, type, link }) {
  try {
    await Notification.create({ user_id, title, message, type, link });
  } catch (e) {
    console.error("Notification create error:", e);
  }
}