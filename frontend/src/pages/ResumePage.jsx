import { useState } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function ResumePage() {
  const { refreshUser } = useAuth();
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [message, setMessage] = useState("");

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await api.post("/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setParsedData(data.data);
      setMessage(data.message);
      await refreshUser();
    } catch (error) {
      setMessage("Resume upload failed.");
    }
  };

  return (
    <div className="space-y-6">
      <section className="glass-panel rounded-[2.5rem] p-8">
        <p className="chip">Resume Parsing</p>
        <h1 className="mt-5 font-display text-4xl font-bold text-white">Upload a PDF resume</h1>
        <p className="mt-4 max-w-2xl text-slate-300">
          The parser extracts skills, education, and projects, then merges them into your student profile.
        </p>

        <form onSubmit={handleUpload} className="mt-8 flex flex-col gap-4 md:flex-row">
          <input
            type="file"
            accept=".pdf"
            onChange={(event) => setFile(event.target.files?.[0] || null)}
            className="input-field file:mr-4 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:font-semibold file:text-slate-950"
          />
          <button type="submit" className="rounded-2xl bg-accent px-6 py-3 font-semibold text-slate-950 transition hover:bg-orange-300">
            Parse resume
          </button>
        </form>

        {message && <div className="mt-5 rounded-2xl bg-white/5 p-4 text-sm text-sky-100">{message}</div>}
      </section>

      {parsedData && (
        <section className="grid gap-4 md:grid-cols-3">
          <div className="glass-panel rounded-[2rem] p-6">
            <h2 className="font-display text-2xl font-semibold text-white">Skills</h2>
            <p className="mt-4 text-slate-300">{parsedData.skills.join(", ") || "No skills detected"}</p>
          </div>
          <div className="glass-panel rounded-[2rem] p-6">
            <h2 className="font-display text-2xl font-semibold text-white">Education</h2>
            <p className="mt-4 text-slate-300">{parsedData.education.join(", ") || "No education data detected"}</p>
          </div>
          <div className="glass-panel rounded-[2rem] p-6">
            <h2 className="font-display text-2xl font-semibold text-white">Projects</h2>
            <p className="mt-4 text-slate-300">{parsedData.projects.join(", ") || "No projects detected"}</p>
          </div>
        </section>
      )}
    </div>
  );
}
