import { useEffect, useState } from "react";
import api from "../../api/client";
import AdminLayout from "./AdminLayout";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/analytics")
      .then((r) => setStats(r.data))
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { label: "Total Users", value: stats.totalUsers, icon: "👥", color: "border-blue-500/30 bg-blue-500/10" },
    { label: "Total Internships", value: stats.totalInternships, icon: "💼", color: "border-green-500/30 bg-green-500/10" },
    { label: "Total Applications", value: stats.totalApplications, icon: "📝", color: "border-purple-500/30 bg-purple-500/10" },
    { label: "Total Saves", value: stats.totalSaves, icon: "🔖", color: "border-yellow-500/30 bg-yellow-500/10" },
    { label: "Suspended Users", value: stats.suspendedUsers, icon: "🚫", color: "border-red-500/30 bg-red-500/10" },
    { label: "Pending Reports", value: stats.pendingReports, icon: "🚩", color: stats.pendingReports > 0 ? "border-red-500/40 bg-red-500/20" : "border-white/10 bg-white/5" },
  ] : [];

  return (
    <AdminLayout>
      <h1 className="mb-2 text-3xl font-bold text-white">Dashboard</h1>
      <p className="mb-8 text-slate-400">Welcome back, Admin 👋</p>

      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {statCards.map(({ label, value, icon, color }) => (
              <div key={label} className={`rounded-2xl border p-6 ${color}`}>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-400">{label}</p>
                  <span className="text-2xl">{icon}</span>
                </div>
                <p className="mt-3 text-4xl font-bold text-white">{value}</p>
              </div>
            ))}
          </div>

          {/* Top Skills */}
          {stats?.topSkills?.length > 0 && (
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="mb-6 text-xl font-semibold text-white">
                🔥 Top Skills Across Users
              </h2>
              <div className="space-y-4">
                {stats.topSkills.map(({ skill, count }) => (
                  <div key={skill} className="flex items-center gap-4">
                    <span className="w-36 text-sm text-slate-300">{skill}</span>
                    <div className="flex-1 h-2 rounded-full bg-white/10">
                      <div
                        className="h-2 rounded-full bg-sky-400 transition-all"
                        style={{
                          width: `${(count / stats.topSkills[0].count) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="w-8 text-right text-sm text-slate-400">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
}