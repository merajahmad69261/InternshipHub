import { Link, useLocation } from "react-router-dom";

const links = [
  { to: "/admin", label: "🏠 Dashboard" },
  { to: "/admin/users", label: "👥 Users" },
  { to: "/admin/internships", label: "💼 Internships" },
  { to: "/admin/applications", label: "📋 Applications" },
  { to: "/admin/reports", label: "🚩 Reports" },
];

export default function AdminLayout({ children }) {
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <aside className="w-60 shrink-0 border-r border-white/10 p-6">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-sky-400">
          InternshipHub
        </p>
        <p className="mb-6 text-xs text-slate-500">Admin Panel</p>

        <nav className="space-y-1">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`block rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                pathname === to
                  ? "bg-sky-500 text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="mt-8 border-t border-white/10 pt-6">
          <Link
            to="/dashboard"
            className="block rounded-xl px-4 py-2.5 text-sm text-slate-500 hover:text-white transition"
          >
            ← Back to Student View
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  );
}