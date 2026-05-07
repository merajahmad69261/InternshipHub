import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { splitCsv } from "../utils/formatters";

const emptyProfile = {
  full_name: "",
  skills: "",
  interests: "",
  experience_level: "Beginner",
  preferred_role: "AI/ML",
  location_preference: "Remote",
};

export default function AuthPage() {
  const { user, login, signup } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ email: "", password: "", ...emptyProfile });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (mode === "login") {
        await login(form.email, form.password);
      } else {
        await signup({
          email: form.email,
          password: form.password,
          profile: {
            full_name: form.full_name,
            skills: splitCsv(form.skills),
            interests: splitCsv(form.interests),
            experience_level: form.experience_level,
            preferred_role: form.preferred_role,
            location_preference: form.location_preference,
          },
        });
      }
    } catch (submitError) {
      setError(submitError.response?.data?.detail || "Request failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl items-center px-4 py-8">
      <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="glass-panel rounded-[2.5rem] p-8 lg:p-12">
          <p className="chip">AI Internship Matching</p>
          <h1 className="mt-6 font-display text-4xl font-bold leading-tight text-white lg:text-6xl">
            Find internship roles that actually fit your profile.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
            Upload your resume, build your student profile, track your activity, and get hybrid recommendations
            explained in plain language.
          </p>
         <div className="mt-8 grid gap-4 md:grid-cols-3">
  {[
    {
      title: "Hybrid ranking engine",
      path: "/hybrid-ranking",
    },
    {
      title: "Resume skill extraction",
      path: "/resume-extraction",
    },
    {
      title: "Skill gap suggestions",
      path: "/skill-gap",
    },
  ].map((item) => (
    <Link
      key={item.title}
      to={item.path}
      className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-fog transition hover:bg-white/10 hover:scale-105"
    >
      {item.title}
    </Link>
  ))}
</div>
        </section>

        <section className="glass-panel rounded-[2.5rem] p-8">
          <div className="mb-6 flex gap-3">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${mode === "login" ? "bg-white text-slate-950" : "bg-white/5 text-slate-300"}`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${mode === "signup" ? "bg-white text-slate-950" : "bg-white/5 text-slate-300"}`}
            >
              Signup
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input className="input-field" name="email" placeholder="Email" value={form.email} onChange={updateField} />
            <input
              className="input-field"
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={updateField}
            />

            {mode === "signup" && (
              <>
                <input
                  className="input-field"
                  name="full_name"
                  placeholder="Full name"
                  value={form.full_name}
                  onChange={updateField}
                />
                <input
                  className="input-field"
                  name="skills"
                  placeholder="Skills (comma separated)"
                  value={form.skills}
                  onChange={updateField}
                />
                <input
                  className="input-field"
                  name="interests"
                  placeholder="Interests (comma separated)"
                  value={form.interests}
                  onChange={updateField}
                />
                <div className="grid gap-4 md:grid-cols-3">
                  <select className="input-field" name="experience_level" value={form.experience_level} onChange={updateField}>
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                  <select className="input-field" name="preferred_role" value={form.preferred_role} onChange={updateField}>
                    <option>AI/ML</option>
                    <option>Web Development</option>
                    <option>Data Science</option>
                  </select>
                  <select
                    className="input-field"
                    name="location_preference"
                    value={form.location_preference}
                    onChange={updateField}
                  >
                    <option>Remote</option>
                    <option>Hybrid</option>
                    <option>On-site</option>
                  </select>
                </div>
              </>
            )}

            {error && <div className="rounded-2xl bg-red-500/15 p-3 text-sm text-red-200">{error}</div>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-2xl bg-accent px-5 py-3 font-semibold text-slate-950 transition hover:bg-orange-300 disabled:opacity-60"
            >
              {submitting ? "Please wait..." : mode === "login" ? "Login" : "Create account"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
