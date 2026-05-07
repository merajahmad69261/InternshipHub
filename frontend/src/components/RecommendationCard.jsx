import { useState } from "react";
import api from "../api/client";

export default function RecommendationCard({ item, onTracked, appliedIds = [], savedIds = [] }) {
  const internship = item.internship || item;
  const explanation = item.explanation;
  const missingSkills = item.missing_skills || [];

  const alreadyApplied = appliedIds.includes(internship._id);
  const alreadySaved = savedIds.includes(internship._id);

  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(alreadyApplied);
  const [saved, setSaved] = useState(alreadySaved);
  const [error, setError] = useState(null);

  const track = async (eventType) => {
    try {
      await api.post("/users/activity", {
        internship_id: internship._id,
        event_type: eventType,
      });
      onTracked?.();
    } catch (err) {
      console.error(err);
    }
  };

  const handleApply = async () => {
    if (applied || applying) return;
    setApplying(true);
    setError(null);
    try {
      await api.post("/applications", { internship_id: internship._id });
      await track("apply");
      setApplied(true);
    } catch (err) {
      if (err.response?.data?.message === "Already applied") {
        setApplied(true);
      } else {
        setError("Apply nahi ho saka. Dobara try karo.");
      }
    } finally {
      setApplying(false);
    }
  };

  const handleSave = async () => {
    await track("save");
    setSaved(true);
  };

  return (
    <article className="glass-panel rounded-[2rem] p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="chip">{internship.role_category}</div>
          <h3 className="mt-4 font-display text-2xl font-bold text-white">{internship.title}</h3>
          <p className="mt-2 text-slate-300">
            {internship.company} • {internship.location} • {internship.stipend}
          </p>
        </div>
        {typeof item.score === "number" && (
          <div className="rounded-2xl bg-sky-400/10 px-4 py-3 text-right">
            <p className="text-xs uppercase tracking-[0.2em] text-sky-200">Match Score</p>
            <p className="font-display text-3xl font-bold text-white">{Math.round(item.score * 100)}%</p>
          </div>
        )}
      </div>

      <p className="mt-5 text-sm leading-7 text-slate-300">{internship.description}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {internship.skills_required.map((skill) => (
          <span key={skill} className="rounded-full bg-white/5 px-3 py-1 text-sm text-fog">
            {skill}
          </span>
        ))}
      </div>

      {explanation && (
        <div className="mt-5 rounded-2xl border border-mint/20 bg-mint/10 p-4 text-sm text-mint">
          {explanation}
        </div>
      )}

      {missingSkills.length > 0 && (
        <div className="mt-5">
          <p className="text-sm font-semibold text-white">Skill gap analyzer</p>
          <p className="mt-2 text-sm text-slate-300">
            Missing skills: {missingSkills.join(", ")}
          </p>
        </div>
      )}

      {error && (
        <p className="mt-3 rounded-xl bg-red-500/10 px-4 py-2 text-sm text-red-400">
          {error}
        </p>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => track("click")}
          className="rounded-full bg-sky-400 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
        >
          View
        </button>

        <button
          type="button"
          onClick={handleSave}
          disabled={saved}
          className={`rounded-full border px-5 py-2 text-sm font-semibold transition ${
            saved
              ? "border-green-500/40 bg-green-500/20 text-green-300 cursor-not-allowed"
              : "border-white/10 text-white hover:bg-white/5"
          }`}
        >
          {saved ? "✓ Saved" : "Save"}
        </button>

        <button
          type="button"
          onClick={handleApply}
          disabled={applied || applying}
          className={`rounded-full border px-5 py-2 text-sm font-semibold transition ${
            applied
              ? "border-green-500/40 bg-green-500/20 text-green-300 cursor-not-allowed"
              : applying
              ? "border-white/10 text-slate-400 cursor-not-allowed"
              : "border-accent/40 bg-accent/15 text-accent hover:bg-accent/25"
          }`}
        >
          {applied ? "✓ Applied" : applying ? "Applying..." : "Apply"}
        </button>
      </div>
    </article>
  );
}