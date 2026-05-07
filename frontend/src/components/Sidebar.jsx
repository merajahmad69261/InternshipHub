import { BriefcaseBusiness, LayoutDashboard, LogOut, Search, Upload, UserRound } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/profile", label: "Profile", icon: UserRound },
  { to: "/resume", label: "Resume Upload", icon: Upload },
  { to: "/search", label: "AI Search", icon: Search },
  { to: "/my-applications", label: "My Applications", icon: BriefcaseBusiness },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="glass-panel flex w-full max-w-xs flex-col rounded-[2rem] p-6 lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:self-start">
      <Link to="/" className="mb-8 flex items-center gap-3">
        <div className="rounded-2xl bg-accent px-3 py-2 text-ink">
          <BriefcaseBusiness size={22} />
        </div>
        <div>
          <p className="font-display text-xl font-bold">InternPilot AI</p>
          <p className="text-xs text-slate-300">Recommendation engine</p>
        </div>
      </Link>

      <div className="mb-8 rounded-3xl bg-gradient-to-br from-sky-400/20 to-accent/10 p-4">
        <p className="text-sm text-slate-300">Signed in as</p>
        <p className="mt-2 font-display text-lg font-semibold">{user?.profile?.full_name || "Student"}</p>
        <p className="text-sm text-sky-100">{user?.profile?.preferred_role || "AI/ML"}</p>
      </div>

      <nav className="space-y-2">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition ${
                isActive ? "bg-white/10 text-white" : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        onClick={logout}
        className="mt-auto flex items-center gap-3 rounded-2xl border border-white/10 px-4 py-3 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
      >
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
}
