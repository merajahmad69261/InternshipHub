import { useEffect, useState } from "react";
import api from "../../api/client";
import AdminLayout from "./AdminLayout";

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const load = () => {
    api.get("/admin/reports")
      .then((r) => setReports(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const resolve = async (id, status) => {
    await api.patch(`/admin/reports/${id}/status`, { status });
    load();
  };

  const filtered = filter === "all"
    ? reports
    : reports.filter((r) => r.status === filter);

  const reasonLabel = {
    fake_internship: "🚫 Fake Internship",
    scam_company: "⚠️ Scam Company",
    spam_posting: "📢 Spam Posting",
    other: "❓ Other",
  };

  const statusColor = {
    pending: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    reviewed: "bg-green-500/20 text-green-300 border-green-500/30",
    dismissed: "bg-slate-500/20 text-slate-400 border-slate-500/30",
  };

  return (
    <AdminLayout>
      <h1 className="mb-2 text-3xl font-bold text-white">
        Reports & Moderation
      </h1>
      <p className="mb-6 text-slate-400">
        Total: {reports.length} · Pending:{" "}
        <span className="text-yellow-400 font-semibold">
          {reports.filter((r) => r.status === "pending").length}
        </span>
      </p>

      {/* Filter Buttons */}
      <div className="mb-6 flex gap-2">
        {["all", "pending", "reviewed", "dismissed"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-xl px-4 py-2 text-sm font-medium capitalize transition ${
              filter === f
                ? "bg-sky-500 text-white"
                : "border border-white/10 text-slate-400 hover:bg-white/5"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
          <p className="text-4xl mb-3">✅</p>
          <p className="text-slate-400">Koi reports nahi hain!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <div
              key={r._id}
              className="rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="font-semibold text-white">
                    {reasonLabel[r.reason] || r.reason}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Internship ID: {r.internship_id}
                  </p>
                  {r.description && (
                    <p className="mt-2 text-sm text-slate-300">
                      "{r.description}"
                    </p>
                  )}
                  <div className="mt-3 flex items-center gap-3">
                    <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${statusColor[r.status]}`}>
                      {r.status}
                    </span>
                    <span className="text-xs text-slate-500">
                      {new Date(r.createdAt).toLocaleDateString("en-IN")}
                    </span>
                  </div>
                </div>

                {r.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => resolve(r._id, "reviewed")}
                      className="rounded-lg border border-green-500/30 px-3 py-1.5 text-xs text-green-400 hover:bg-green-500/10"
                    >
                      ✅ Mark Reviewed
                    </button>
                    <button
                      onClick={() => resolve(r._id, "dismissed")}
                      className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-400 hover:bg-white/10"
                    >
                      Dismiss
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}