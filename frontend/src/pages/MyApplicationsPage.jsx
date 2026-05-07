import { useEffect, useState } from "react";
import api from "../api/client";
import Layout from "../components/Layout";

const statusColor = {
  applied: "border-blue-500/30 bg-blue-500/20 text-blue-300",
  under_review: "border-yellow-500/30 bg-yellow-500/20 text-yellow-300",
  interview_scheduled: "border-purple-500/30 bg-purple-500/20 text-purple-300",
  selected: "border-green-500/30 bg-green-500/20 text-green-300",
  rejected: "border-red-500/30 bg-red-500/20 text-red-300",
};

const statusLabel = {
  applied: "✅ Applied",
  under_review: "🔍 Under Review",
  interview_scheduled: "📅 Interview Scheduled",
  selected: "🎉 Selected!",
  rejected: "❌ Rejected",
};



export default function MyApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/applications/my")
      .then((r) => setApplications(r.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        <section className="glass-panel rounded-[2.5rem] p-8">
          <p className="chip">My Applications</p>
          <h1 className="mt-5 font-display text-4xl font-bold text-white">
            your application
          </h1>
          <p className="mt-4 text-slate-300">
           Here you can track the status of all your applications.
          </p>
        </section>

        {loading ? (
          <div className="glass-panel rounded-[2rem] p-8 text-center text-slate-400">
            Loading...
          </div>
        ) : applications.length === 0 ? (
          <div className="glass-panel rounded-[2rem] p-12 text-center">
            <p className="text-5xl mb-4">📋</p>
            <p className="text-xl font-semibold text-white mb-2">
              There are no applications yet.

            </p>
            <p className="text-slate-400">
              Go to the dashboard and apply for internships!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((a) => (
              <div
                key={a._id}
                className="glass-panel rounded-[2rem] p-6"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    {/* Internship details */}
                    <p className="chip">{a.internship_id?.role_category || "Internship"}</p>
                    <h3 className="mt-3 font-display text-2xl font-bold text-white">
                      {a.internship_id?.title}
                    </h3>
                    <p className="mt-1 text-slate-300">
                      {a.internship_id?.company} • {a.internship_id?.location} • {a.internship_id?.stipend}
                    </p>

                    {/* Status badge */}
                    <span className={`mt-4 inline-block rounded-full border px-4 py-1.5 text-sm font-semibold ${statusColor[a.status]}`}>
                      {statusLabel[a.status]}
                    </span>

                    {/* Status message */}
                    <p className="mt-3 text-sm text-slate-400">
                      {statusMessage[a.status]}
                    </p>

                    {/* Interview date */}
                    {a.interview_date && (
                      <div className="mt-4 rounded-2xl border border-purple-500/20 bg-purple-500/10 p-4">
                        <p className="text-sm font-semibold text-purple-300">
                          📅 Interview Date & Time
                        </p>
                        <p className="mt-1 text-white font-bold">
                          {new Date(a.interview_date).toLocaleString("en-IN", {
                            dateStyle: "full",
                            timeStyle: "short",
                          })}
                        </p>
                      </div>
                    )}

                    {/* Feedback */}
                    {a.feedback && (
                      <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                        <p className="text-sm font-semibold text-white">
                          💬 Admin Feedback
                        </p>
                        <p className="mt-1 text-sm text-slate-300">
                          {a.feedback}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Applied date */}
                  <div className="text-right shrink-0">
                    <p className="text-xs text-slate-500">Applied on</p>
                    <p className="text-sm text-slate-300 font-medium">
                      {new Date(a.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}