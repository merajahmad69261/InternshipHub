import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const loadUnreadCount = async () => {
    try {
      const r = await api.get("/notifications/unread-count");
      setUnreadCount(r.data.count);
    } catch (e) { console.error(e); }
  };

  const loadNotifications = async () => {
    try {
      const r = await api.get("/notifications");
      setNotifications(r.data);
    } catch (e) { console.error(e); }
  };

  // Har 30 second mein unread count check karo
  useEffect(() => {
    loadUnreadCount();
    const interval = setInterval(loadUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  // Bahar click karne pe band ho
  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleOpen = async () => {
    setOpen(!open);
    if (!open) {
      await loadNotifications();
      // Saari read mark karo
      await api.patch("/notifications/read-all");
      setUnreadCount(0);
    }
  };

  const handleNotificationClick = async (notification) => {
    setOpen(false);
    navigate(notification.link || "/my-applications");
  };

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (mins > 0) return `${mins}m ago`;
    return "Just now";
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={handleOpen}
        className="relative rounded-full border border-white/10 p-2 text-slate-300 transition hover:bg-white/5 hover:text-white"
      >
        {/* Bell icon */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>

        {/* Unread count badge */}
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-12 z-50 w-80 rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <p className="font-semibold text-white">Notifications</p>
            {notifications.length > 0 && (
              <button
                onClick={() => api.patch("/notifications/read-all").then(() => setUnreadCount(0))}
                className="text-xs text-slate-400 hover:text-white"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-3xl mb-2">🔔</p>
                <p className="text-sm text-slate-400">Koi notification nahi hai</p>
              </div>
            ) : (
              notifications.map((n) => (
                <button
                  key={n._id}
                  onClick={() => handleNotificationClick(n)}
                  className={`w-full border-b border-white/5 px-4 py-3 text-left transition hover:bg-white/5 ${
                    !n.read ? "bg-sky-500/10" : ""
                  }`}
                >
                  <p className={`text-sm font-medium ${!n.read ? "text-white" : "text-slate-300"}`}>
                    {n.title}
                  </p>
                  <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                    {n.message}
                  </p>
                  <p className="mt-1 text-xs text-slate-600">
                    {timeAgo(n.createdAt)}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}