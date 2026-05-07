import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Target, TrendingUp, CheckCircle2 } from "lucide-react";

export default function SkillGapPage() {
  const navigate = useNavigate(); // ✅ FIXED (inside component)

  const missingSkills = [
    "Machine Learning",
    "React.js",
    "Data Visualization",
    "SQL",
  ];

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-slate-300 transition hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        <div className="rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-purple-500/10 to-slate-900 p-10 shadow-2xl">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="inline-flex rounded-full bg-purple-400/20 px-4 py-1 text-sm font-medium text-purple-200">
                Personalized Learning Suggestions
              </p>

              <h1 className="mt-6 text-5xl font-bold leading-tight lg:text-6xl">
                Skill Gap Suggestions
              </h1>

              <p className="mt-6 text-lg leading-8 text-slate-300">
                Discover the skills you need to improve based on internship
                requirements and your current profile.
              </p>

              <div className="mt-10 space-y-5">
                {missingSkills.map((skill) => (
                  <div
                    key={skill}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-5"
                  >
                    <div className="flex items-center gap-4">
                      <Target className="h-5 w-5 text-purple-300" />
                      <span>{skill}</span>
                    </div>

                    {/* ✅ UPDATED BUTTON */}
                    <button
                      onClick={() =>
                        navigate(`/learn/${encodeURIComponent(skill)}`)
                      }
                      className="rounded-xl bg-purple-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:scale-105"
                    >
                      Learn
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
                <TrendingUp className="h-14 w-14 text-purple-300" />
                <h2 className="mt-6 text-2xl font-semibold">
                  Growth Tracking
                </h2>
                <p className="mt-4 leading-7 text-slate-300">
                  Track your learning progress and monitor how your profile improves over time.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
                <CheckCircle2 className="h-14 w-14 text-purple-300" />
                <h2 className="mt-6 text-2xl font-semibold">
                  Career Readiness
                </h2>
                <p className="mt-4 leading-7 text-slate-300">
                  Improve internship eligibility by completing recommended skills.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}