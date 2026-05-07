import { Link } from "react-router-dom";
import { FileText, ScanSearch, Brain, ArrowLeft } from "lucide-react";

export default function ResumeExtractionPage() {
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

        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="inline-flex rounded-full bg-cyan-400/20 px-4 py-1 text-sm font-medium text-cyan-200">
              AI Resume Parsing
            </p>

            <h1 className="mt-6 text-5xl font-bold leading-tight lg:text-6xl">
              Resume Skill Extraction
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-300">
              Upload resumes and automatically extract technical skills,
              education details, certifications, and experience using NLP and AI.
            </p>

            <div className="mt-10 space-y-5">
              {[
                "Automatic skill identification",
                "Education & experience parsing",
                "AI-powered keyword analysis",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="h-3 w-3 rounded-full bg-cyan-300" />
                  <p className="text-slate-200">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-white/10 bg-white/5 p-8 backdrop-blur">
            <div className="rounded-3xl border border-dashed border-cyan-400/40 bg-slate-900/60 p-10 text-center">
              <FileText className="mx-auto h-20 w-20 text-cyan-300" />

              <h2 className="mt-6 text-2xl font-semibold">
                Upload Resume
              </h2>

              <p className="mt-3 text-slate-400">
                PDF, DOCX, or TXT files supported.</p>

              <button className="mt-8 rounded-2xl bg-cyan-300 px-6 py-3 font-semibold text-slate-950 transition hover:scale-105">
                Choose File
              </button>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {[
                {
                  icon: <ScanSearch className="h-6 w-6 text-cyan-300" />,
                  label: "Scanning",
                },
                {
                  icon: <Brain className="h-6 w-6 text-cyan-300" />,
                  label: "AI Analysis",
                },
                {
                  icon: <FileText className="h-6 w-6 text-cyan-300" />,
                  label: "Skill Report",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 text-center"
                >
                  <div className="mb-3 flex justify-center">
                    {item.icon}
                  </div>

                  <p className="text-sm text-slate-300">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}