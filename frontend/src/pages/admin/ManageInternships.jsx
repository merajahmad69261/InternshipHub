import { useEffect, useState } from "react";
import api from "../../api/client";
import AdminLayout from "./AdminLayout";

const emptyForm = {
  title: "",
  company: "",
  location: "",
  stipend: "",
  description: "",
  role_category: "AI/ML",
  skills_required: "",
};

export default function ManageInternships() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    api.get("/admin/internships")
      .then((r) => setList(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    const payload = {
      ...form,
      skills_required: form.skills_required
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    if (editing) {
      await api.put(`/admin/internships/${editing}`, payload);
    } else {
      await api.post("/admin/internships", payload);
    }
    setForm(emptyForm);
    setEditing(null);
    setShowForm(false);
    load();
  };

  const startEdit = (i) => {
    setForm({
      ...i,
      skills_required: (i.skills_required || []).join(", "),
    });
    setEditing(i._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const setStatus = async (id, status) => {
    await api.patch(`/admin/internships/${id}/status`, { status });
    load();
  };

  const toggleFeatured = async (id) => {
    await api.patch(`/admin/internships/${id}/featured`);
    load();
  };

  const del = async (id) => {
    if (!confirm("Internship permanently delete hogi!")) return;
    await api.delete(`/admin/internships/${id}`);
    load();
  };

  const statusColor = {
    approved: "bg-green-500/20 text-green-300 border-green-500/30",
    rejected: "bg-red-500/20 text-red-300 border-red-500/30",
    pending: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  };

  return (
    <AdminLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Manage Internships</h1>
          <p className="mt-1 text-slate-400">Total: {list.length}</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setForm(emptyForm); setEditing(null); }}
          className="rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-400"
        >
          {showForm ? "✕ Cancel" : "+ Post Internship"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">
            {editing ? "✏️ Edit Internship" : "➕ Post New Internship"}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { key: "title", placeholder: "Job Title" },
              { key: "company", placeholder: "Company Name" },
              { key: "location", placeholder: "Location" },
              { key: "stipend", placeholder: "Stipend (e.g. ₹10,000/month)" },
            ].map(({ key, placeholder }) => (
              <input
                key={key}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-sky-500"
                placeholder={placeholder}
                value={form[key]}
                onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
              />
            ))}
            <input
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-sky-500 sm:col-span-2"
              placeholder="Skills (comma separated: React, Node.js, MongoDB)"
              value={form.skills_required}
              onChange={(e) => setForm((p) => ({ ...p, skills_required: e.target.value }))}
            />
            <textarea
              rows={3}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-sky-500 sm:col-span-2"
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            />
            <select
              className="rounded-xl border border-white/10 bg-slate-800 px-4 py-2.5 text-sm text-white outline-none"
              value={form.role_category}
              onChange={(e) => setForm((p) => ({ ...p, role_category: e.target.value }))}
            >
              <option>AI/ML</option>
              <option>Web Development</option>
              <option>Data Science</option>
              <option>Mobile Development</option>
              <option>DevOps</option>
              <option>Design</option>
            </select>
          </div>
          <button
            onClick={save}
            className="mt-4 rounded-xl bg-sky-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-sky-400"
          >
            {editing ? "Update Internship" : "Post Internship"}
          </button>
        </div>
      )}

      {/* List */}
      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : (
        <div className="space-y-3">
          {list.map((i) => (
            <div
              key={i._id}
              className="rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-white">{i.title}</p>
                    {i.featured && (
                      <span className="rounded-full border border-amber-500/30 bg-amber-500/20 px-2 py-0.5 text-xs text-amber-300">
                        ⭐ Featured
                      </span>
                    )}
                    <span className={`rounded-full border px-2 py-0.5 text-xs ${statusColor[i.status || "approved"]}`}>
                      {i.status || "approved"}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-400">
                    {i.company} · {i.location} · {i.stipend}
                  </p>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setStatus(i._id, i.status === "approved" ? "rejected" : "approved")}
                    className={`rounded-lg border px-3 py-1 text-xs transition ${
                      i.status === "approved"
                        ? "border-red-500/30 text-red-400 hover:bg-red-500/10"
                        : "border-green-500/30 text-green-400 hover:bg-green-500/10"
                    }`}
                  >
                    {i.status === "approved" ? "Reject" : "Approve"}
                  </button>
                  <button
                    onClick={() => toggleFeatured(i._id)}
                    className="rounded-lg border border-amber-500/30 px-3 py-1 text-xs text-amber-400 hover:bg-amber-500/10"
                  >
                    {i.featured ? "Unfeature" : "⭐ Feature"}
                  </button>
                  <button
                    onClick={() => startEdit(i)}
                    className="rounded-lg border border-white/10 px-3 py-1 text-xs text-slate-300 hover:bg-white/10"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => del(i._id)}
                    className="rounded-lg border border-red-500/30 px-3 py-1 text-xs text-red-400 hover:bg-red-500/10"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}