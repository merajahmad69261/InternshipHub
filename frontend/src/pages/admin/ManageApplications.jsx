import { useEffect, useState } from "react";
import api from "../../api/client";
import AdminLayout from "./AdminLayout";

const statusColor = {
  applied: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  under_review: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  interview_scheduled: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  selected: "bg-green-500/20 text-green-300 border-green-500/30",
  rejected: "bg-red-500/20 text-red-300 border-red-500/30",
};

const statusLabel = {
  applied: "Applied",
  under_review: "Under Review",
  interview_scheduled: "Interview Scheduled",
  selected: "Selected ✓",
  rejected: "Rejected",
};

export default function ManageApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [updating, setUpdating] = useState(null);
  const [interviewDate, setInterviewDate] = useState("");
  const [feedback, setFeedback] = useState("");

  const load = () => {
    api.get("/admin/applications")
      .then((r) => setApplications(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    setUpdating(id);
    try {
      await api.patch(`/applications/${id}/status`, {
        status,
        ...(interviewDate && { interview_date: interviewDate }),
        ...(feedback && { feedback }),
      });
      setInterviewDate("");
      setFeedback("");
      load();
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(null);
    }
  };

  const filtered = filter === "all"
    ? applications
    : applications.filter((a) => a.status === filter);

  return (
    <AdminLayout>
      <h1 className="mb-2 text-3xl font-bold text-white">Applications</h1>
      <p className="mb-6 text-slate-400">
        Total: {applications.length} · Pending:{" "}
        <span className="text-yellow-400 font-semibold">
          {applications.filter((a) => a.status === "applied").length}
        </span>
      </p>

      {/* Filter buttons */}
      <div className="mb-6 flex gap-2 flex-wrap">
        {["all", "applied", "under_review", "interview_scheduled", "selected", "rejected"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-xl px-4 py-2 text-sm font-medium capitalize transition ${
              filter === f
                ? "bg-sky-500 text-white"
                : "border border-white/10 text-slate-400 hover:bg-white/5"
            }`}
          >
            {f.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
          <p className="text-4xl mb-3">📋</p>
          <p className="text-slate-400">Koi applications nahi hain!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((a) => (
            <div key={a._id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  {/* Student info */}
                  <p className="font-semibold text-white">
                    {a.user_id?.profile?.full_name || "Unknown"}
                  </p>
                  <p className="text-sm text-slate-400">{a.user_id?.email}</p>

                  {/* Internship info */}
                  <p className="mt-2 text-sm text-sky-300 font-medium">
                    {a.internship_id?.title}
                  </p>
                  <p className="text-xs text-slate-500">
                    {a.internship_id?.company} · {a.internship_id?.location}
                  </p>

                  {/* Status badge */}
                  <span className={`mt-3 inline-block rounded-full border px-3 py-1 text-xs font-semibold ${statusColor[a.status]}`}>
                    {statusLabel[a.status]}
                  </span>

                  {/* Interview date */}
                  {a.interview_date && (
                    <p className="mt-2 text-xs text-purple-300">
                      📅 Interview: {new Date(a.interview_date).toLocaleDateString("en-IN")}
                    </p>
                  )}

                  {/* Feedback */}
                  {a.feedback && (
                    <p className="mt-2 text-xs text-slate-400">
                      💬 {a.feedback}
                    </p>
                  )}

                  {/* Applied date */}
                  <p className="mt-2 text-xs text-slate-600">
                    Applied: {new Date(a.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 min-w-[200px]">
                  {/* Interview date input */}
                  {a.status !== "selected" && a.status !== "rejected" && (
                    <input
                      type="datetime-local"
                      value={interviewDate}
                      onChange={(e) => setInterviewDate(e.target.value)}
                      className="rounded-lg border border-white/10 bg-slate-800 px-3 py-1.5 text-xs text-white outline-none"
                    />
                  )}

                  {/* Feedback input */}
                  {a.status !== "selected" && a.status !== "rejected" && (
                    <input
                      type="text"
                      placeholder="Feedback (optional)"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      className="rounded-lg border border-white/10 bg-slate-800 px-3 py-1.5 text-xs text-white outline-none placeholder-slate-500"
                    />
                  )}

                  {/* Status buttons */}
                  <div className="flex flex-wrap gap-2">
                    {a.status === "applied" && (
                      <button
                        onClick={() => updateStatus(a._id, "under_review")}
                        disabled={updating === a._id}
                        className="rounded-lg border border-yellow-500/30 px-3 py-1 text-xs text-yellow-400 hover:bg-yellow-500/10"
                      >
                        Under Review
                      </button>
                    )}
                    {a.status === "under_review" && (
                      <button
                        onClick={() => updateStatus(a._id, "interview_scheduled")}
                        disabled={updating === a._id}
                        className="rounded-lg border border-purple-500/30 px-3 py-1 text-xs text-purple-400 hover:bg-purple-500/10"
                      >
                        Schedule Interview
                      </button>
                    )}
                    {(a.status === "under_review" || a.status === "interview_scheduled") && (
                      <button
                        onClick={() => updateStatus(a._id, "selected")}
                        disabled={updating === a._id}
                        className="rounded-lg border border-green-500/30 px-3 py-1 text-xs text-green-400 hover:bg-green-500/10"
                      >
                        Select ✓
                      </button>
                    )}
                    {a.status !== "rejected" && a.status !== "selected" && (
                      <button
                        onClick={() => updateStatus(a._id, "rejected")}
                        disabled={updating === a._id}
                        className="rounded-lg border border-red-500/30 px-3 py-1 text-xs text-red-400 hover:bg-red-500/10"
                      >
                        Reject
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}