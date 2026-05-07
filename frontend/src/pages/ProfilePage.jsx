import { Briefcase, FileText, GraduationCap, MapPin, Sparkles, Target, UserRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { splitCsv } from "../utils/formatters";

function parseProjects(projects = []) {
  return projects.map((item) => {
    const [name = "", link = ""] = item.split("|");
    return { name: name.trim(), link: link.trim() };
  });
}

function serializeProjects(projects = []) {
  return projects
    .map((item) => `${item.name.trim()}|${item.link.trim()}`)
    .filter((item) => item !== "|");
}

function DetailCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-white/5 p-2 text-sky-200">
          <Icon size={16} />
        </div>
        <p className="text-sm text-slate-400">{label}</p>
      </div>
      <p className="mt-4 text-base font-semibold text-white">{value}</p>
    </div>
  );
}

function ListSection({ title, items, emptyText }) {
  return (
    <section className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
      <h2 className="font-display text-xl font-semibold text-white">{title}</h2>
      {items.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-3">
          {items.map((item) => (
            <span key={item} className="rounded-full border border-white/10 bg-slate-900/60 px-4 py-2 text-sm text-fog">
              {item}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm text-slate-400">{emptyText}</p>
      )}
    </section>
  );
}

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({
    full_name: "",
    skills: "",
    interests: "",
    experience_level: "Beginner",
    preferred_role: "AI/ML",
    location_preference: "Remote",
    education: "",
  });
  const [projects, setProjects] = useState([{ name: "", link: "" }]);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    setForm({
      full_name: user.profile.full_name || "",
      skills: (user.profile.skills || []).join(", "),
      interests: (user.profile.interests || []).join(", "),
      experience_level: user.profile.experience_level || "Beginner",
      preferred_role: user.profile.preferred_role || "AI/ML",
      location_preference: user.profile.location_preference || "Remote",
      education: (user.profile.education || []).join(", "),
    });
    const parsedProjects = parseProjects(user.profile.projects || []);
    setProjects(parsedProjects.length > 0 ? parsedProjects : [{ name: "", link: "" }]);
  }, [user]);

  const initials = useMemo(() => {
    if (!user?.profile?.full_name) return "ST";
    return user.profile.full_name
      .split(" ")
      .map((item) => item[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }, [user]);

  if (!user) {
    return <div className="glass-panel rounded-[2rem] p-6">Loading profile...</div>;
  }

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const updateProject = (index, field, value) => {
    setProjects((current) =>
      current.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item))
    );
  };

  const addProject = () => {
    setProjects((current) => [...current, { name: "", link: "" }]);
  };

  const removeProject = (index) => {
    setProjects((current) => {
      const next = current.filter((_, itemIndex) => itemIndex !== index);
      return next.length > 0 ? next : [{ name: "", link: "" }];
    });
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    setMessage("");
    setSaving(true);
    try {
      await api.put("/users/me", {
        full_name: form.full_name,
        skills: splitCsv(form.skills),
        interests: splitCsv(form.interests),
        experience_level: form.experience_level,
        preferred_role: form.preferred_role,
        location_preference: form.location_preference,
        education: splitCsv(form.education),
        projects: serializeProjects(projects),
      });
      await refreshUser();
      setMessage("Profile updated successfully.");
    } catch (error) {
      setMessage("Could not update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="glass-panel rounded-[2.5rem] p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-sky-400 text-2xl font-bold text-slate-950">
              {initials}
            </div>
            <div>
              <p className="chip">Student Profile</p>
              <h1 className="mt-4 font-display text-4xl font-bold text-white">{user.profile.full_name}</h1>
              <p className="mt-2 text-sm text-slate-300">{user.email}</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Saved</p>
              <p className="mt-2 text-2xl font-semibold text-white">{user.saved_internships.length}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Applied</p>
              <p className="mt-2 text-2xl font-semibold text-white">{user.applied_internships.length}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Clicks</p>
              <p className="mt-2 text-2xl font-semibold text-white">{user.clicks.length}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DetailCard icon={UserRound} label="Experience Level" value={user.profile.experience_level} />
        <DetailCard icon={Target} label="Preferred Role" value={user.profile.preferred_role} />
        <DetailCard icon={MapPin} label="Location Preference" value={user.profile.location_preference} />
        <DetailCard icon={Sparkles} label="Resume Status" value={user.profile.extracted_resume_text ? "Parsed and synced" : "Not uploaded"} />
      </section>

      <section className="glass-panel rounded-[2.5rem] p-8">
        <div className="max-w-3xl">
          <p className="chip">Edit Profile</p>
          <h2 className="mt-5 font-display text-3xl font-bold text-white">Update your details</h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Keep your profile current so the recommendation engine can rank internships more accurately.
          </p>
        </div>

        <form onSubmit={saveProfile} className="mt-8 space-y-6">
          <div className="grid gap-5 md:grid-cols-2">
            <input className="input-field" name="full_name" value={form.full_name} onChange={updateField} placeholder="Full name" />
            <input className="input-field" name="skills" value={form.skills} onChange={updateField} placeholder="Skills (comma separated)" />
            <input className="input-field" name="interests" value={form.interests} onChange={updateField} placeholder="Interests (comma separated)" />
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
            <select className="input-field" name="location_preference" value={form.location_preference} onChange={updateField}>
              <option>Remote</option>
              <option>Hybrid</option>
              <option>On-site</option>
            </select>
          </div>

          <input className="input-field" name="education" value={form.education} onChange={updateField} placeholder="Education entries (comma separated)" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-xl font-semibold text-white">Projects</h3>
                <p className="mt-1 text-sm text-slate-400">Add only project name and project link.</p>
              </div>
              <button
                type="button"
                onClick={addProject}
                className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/5"
              >
                Add project
              </button>
            </div>

            <div className="space-y-4">
              {projects.map((project, index) => (
                <div key={`${index}-${project.name}-${project.link}`} className="grid gap-4 rounded-[1.5rem] border border-white/10 bg-white/5 p-4 lg:grid-cols-[1fr_1fr_auto]">
                  <input
                    className="input-field"
                    value={project.name}
                    onChange={(event) => updateProject(index, "name", event.target.value)}
                    placeholder="Project name"
                  />
                  <input
                    className="input-field"
                    value={project.link}
                    onChange={(event) => updateProject(index, "link", event.target.value)}
                    placeholder="Project link"
                  />
                  <button
                    type="button"
                    onClick={() => removeProject(index)}
                    className="rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {message && <div className="rounded-2xl bg-white/5 p-4 text-sm text-sky-100">{message}</div>}

          <button
            type="submit"
            disabled={saving}
            className="rounded-2xl bg-sky-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-sky-300 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save profile"}
          </button>
        </form>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <div className="space-y-6">
          <ListSection
            title="Skills"
            items={user.profile.skills || []}
            emptyText="Add your technical skills to improve recommendation quality."
          />
          <ListSection
            title="Interests"
            items={user.profile.interests || []}
            emptyText="Add your interests so the engine can align role categories better."
          />
        </div>

        <div className="space-y-6">
          <section className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white/5 p-2 text-mint-300">
                <GraduationCap size={16} />
              </div>
              <h2 className="font-display text-xl font-semibold text-white">Education</h2>
            </div>
            {user.profile.education?.length > 0 ? (
              <div className="mt-4 space-y-3">
                {user.profile.education.map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-fog">
                    {item}
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-400">No education details added yet.</p>
            )}
          </section>

          <section className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white/5 p-2 text-accent-200">
                <Briefcase size={16} />
              </div>
              <h2 className="font-display text-xl font-semibold text-white">Projects</h2>
            </div>
            {parseProjects(user.profile.projects || []).filter((item) => item.name).length > 0 ? (
              <div className="mt-4 space-y-3">
                {parseProjects(user.profile.projects || [])
                  .filter((item) => item.name)
                  .map((item) => (
                    <div key={`${item.name}-${item.link}`} className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-4">
                      <p className="text-sm font-semibold text-white">{item.name}</p>
                      {item.link ? (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 block text-sm text-sky-200 underline-offset-4 hover:underline"
                        >
                          {item.link}
                        </a>
                      ) : (
                        <p className="mt-2 text-sm text-slate-400">No link added</p>
                      )}
                    </div>
                  ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-400">No project details added yet.</p>
            )}
          </section>

          <section className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white/5 p-2 text-sky-200">
                <FileText size={16} />
              </div>
              <h2 className="font-display text-xl font-semibold text-white">Resume Summary</h2>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              {user.profile.extracted_resume_text
                ? `${user.profile.extracted_resume_text.slice(0, 260)}${user.profile.extracted_resume_text.length > 260 ? "..." : ""}`
                : "Upload a resume to generate extracted profile content and improve matching accuracy."}
            </p>
          </section>
        </div>
      </section>
    </div>
  );
}
