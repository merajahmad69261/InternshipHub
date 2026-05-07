export default function Footer() {
  return (
    <footer className="glass-panel rounded-[1.5rem] px-5 py-4">
      <div className="flex flex-col gap-4 border-t border-white/10 pt-1 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-medium text-white">InternPilot</p>
          <p className="mt-1 text-sm text-slate-400">AI-powered internship recommendation platform.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
          <span>Overview</span>
          <span>Recommendations</span>
          <span>Privacy</span>
          <span>Support</span>
        </div>

        <div className="text-sm text-slate-500">
          © 2026 InternPilot. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
