import { useEffect, useState } from "react";
import api from "../../api/client";
import AdminLayout from "./AdminLayout";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    api.get("/admin/users")
      .then((r) => setUsers(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const setRole = async (id, role) => {
    await api.patch(`/admin/users/${id}/role`, { role });
    load();
  };

  const setStatus = async (id, status) => {
    await api.patch(`/admin/users/${id}/status`, { status });
    load();
  };

  const deleteUser = async (id) => {
    if (!confirm("Kya aap sure hain? Ye user permanently delete ho jaega!")) return;
    await api.delete(`/admin/users/${id}`);
    load();
  };

  return (
    <AdminLayout>
      <h1 className="mb-2 text-3xl font-bold text-white">Manage Users</h1>
      <p className="mb-8 text-slate-400">
        Total users: {users.length}
      </p>

      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : (
        <div className="rounded-2xl border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-slate-400 text-left">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Applied</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u._id}
                  className="border-t border-white/5 hover:bg-white/5 transition"
                >
                  <td className="px-4 py-3 text-white font-medium">
                    {u.profile?.full_name || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-slate-300">{u.email}</td>
                  <td className="px-4 py-3">
                    <select
                      value={u.role || "student"}
                      onChange={(e) => setRole(u._id, e.target.value)}
                      className="rounded-lg border border-white/10 bg-slate-800 px-2 py-1 text-xs text-white outline-none"
                    >
                      <option value="student">Student</option>
                      <option value="admin">Admin</option>
                      <option value="recruiter">Recruiter</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
                      u.status === "suspended"
                        ? "bg-red-500/20 text-red-300"
                        : "bg-green-500/20 text-green-300"
                    }`}>
                      {u.status === "suspended" ? "🚫 Suspended" : "✅ Active"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400">
                    {u.applied_internships?.length || 0}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 flex-wrap">
                      {u.status === "suspended" ? (
                        <button
                          onClick={() => setStatus(u._id, "active")}
                          className="rounded-lg border border-green-500/30 px-3 py-1 text-xs text-green-400 hover:bg-green-500/10"
                        >
                          Unsuspend
                        </button>
                      ) : (
                        <button
                          onClick={() => setStatus(u._id, "suspended")}
                          className="rounded-lg border border-yellow-500/30 px-3 py-1 text-xs text-yellow-400 hover:bg-yellow-500/10"
                        >
                          Suspend
                        </button>
                      )}
                      <button
                        onClick={() => deleteUser(u._id)}
                        className="rounded-lg border border-red-500/30 px-3 py-1 text-xs text-red-400 hover:bg-red-500/10"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}