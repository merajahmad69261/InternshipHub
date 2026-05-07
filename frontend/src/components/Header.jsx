// import { Bell, Search } from "lucide-react";
// import { Link, useLocation } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// const pageMeta = {
//   "/": {
//     title: "Dashboard",
//     subtitle: "Track recommendations, saved internships, and recent activity.",
//   },
//   "/profile": {
//     title: "Profile",
//     subtitle: "Manage your details, interests, and career preferences.",
//   },
//   "/resume": {
//     title: "Resume Upload",
//     subtitle: "Upload your resume and extract structured profile data.",
//   },
//   "/search": {
//     title: "AI Search",
//     subtitle: "Search internships with natural language and ranked results.",
//   },
// };

// export default function Header() {
//   const location = useLocation();
//   const { user } = useAuth();
//   const meta = pageMeta[location.pathname] || pageMeta["/"];
//   const initials = user?.profile?.full_name
//     ? user.profile.full_name
//         .split(" ")
//         .map((item) => item[0])
//         .slice(0, 2)
//         .join("")
//         .toUpperCase()
//     : "ST";

//   return (
//     <header className="glass-panel rounded-[1.5rem] px-5 py-4">
//       <div className="flex flex-col gap-5">
//         <div className="flex flex-col gap-4 border-b border-white/10 pb-4 lg:flex-row lg:items-center lg:justify-between">
//           <div className="flex items-center gap-6">
//             <Link to="/" className="font-display text-xl font-semibold text-white">
//               InternPilot
//             </Link>
//             <nav className="hidden items-center gap-5 text-sm text-slate-300 md:flex">
//               <Link to="/" className={location.pathname === "/" ? "text-white" : "hover:text-white"}>
//                 Dashboard
//               </Link>
//               <Link to="/search" className={location.pathname === "/search" ? "text-white" : "hover:text-white"}>
//                 Search
//               </Link>
//               <Link to="/profile" className={location.pathname === "/profile" ? "text-white" : "hover:text-white"}>
//                 Profile
//               </Link>
//               <Link to="/resume" className={location.pathname === "/resume" ? "text-white" : "hover:text-white"}>
//                 Resume
//               </Link>
//             </nav>
//           </div>

//           <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
//             <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
//               <Search size={16} className="text-slate-400" />
//               <span className="hidden sm:inline">Internship recommendations</span>
//               <span className="sm:hidden">Search</span>
//             </div>
//             <button
//               type="button"
//               className="flex items-center justify-center rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:text-white"
//             >
//               <Bell size={16} />
//             </button>
//             <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
//               <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-400 text-sm font-semibold text-slate-950">
//                 {initials}
//               </div>
//               <div>
//                 <p className="text-sm font-medium text-white">{user?.profile?.full_name || "Student"}</p>
//                 <p className="text-xs text-slate-400">{user?.profile?.preferred_role || "AI/ML"}</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div>
//           <h1 className="font-display text-2xl font-semibold text-white">{meta.title}</h1>
//           <p className="mt-1 text-sm text-slate-400">{meta.subtitle}</p>
//         </div>
//       </div>
//     </header>
//   );
// }
import { Search } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import NotificationBell from "./NotificationBell";

const pageMeta = {
  "/": {
    title: "Dashboard",
    subtitle: "Track recommendations, saved internships, and recent activity.",
  },
  "/profile": {
    title: "Profile",
    subtitle: "Manage your details, interests, and career preferences.",
  },
  "/resume": {
    title: "Resume Upload",
    subtitle: "Upload your resume and extract structured profile data.",
  },
  "/search": {
    title: "AI Search",
    subtitle: "Search internships with natural language and ranked results.",
  },
};

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [query, setQuery] = useState("");

  const meta = pageMeta[location.pathname] || pageMeta["/"];

  const initials = user?.profile?.full_name
    ? user.profile.full_name
        .split(" ")
        .map((item) => item[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "ST";

  const handleSearch = () => {
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <header className="glass-panel rounded-[1.5rem] px-5 py-4">
      <div className="flex flex-col gap-5">

        <div className="flex flex-col gap-4 border-b border-white/10 pb-4 lg:flex-row lg:items-center lg:justify-between">

          {/* LEFT */}
          <div className="flex items-center gap-6">
            <Link to="/" className="font-display text-xl font-semibold text-white">
              InternPilot
            </Link>

            <nav className="hidden items-center gap-5 text-sm text-slate-300 md:flex">
              <Link to="/" className={location.pathname === "/" ? "text-white" : "hover:text-white"}>
                Dashboard
              </Link>
              <Link to="/search" className={location.pathname === "/search" ? "text-white" : "hover:text-white"}>
                Search
              </Link>
              <Link to="/profile" className={location.pathname === "/profile" ? "text-white" : "hover:text-white"}>
                Profile
              </Link>
              <Link to="/resume" className={location.pathname === "/resume" ? "text-white" : "hover:text-white"}>
                Resume
              </Link>
            </nav>
          </div>

          {/* RIGHT */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

            {/* Search Bar */}
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 w-full sm:w-auto">
              <Search size={16} className="text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search internships..."
                className="bg-transparent outline-none text-white w-full"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
              />
              <button onClick={handleSearch} className="text-purple-300 text-sm">
                Go
              </button>
            </div>

            {/* Notification Bell */}
            <NotificationBell />

            {/* Profile */}
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-400 text-sm font-semibold text-slate-950">
                {initials}
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  {user?.profile?.full_name || "Student"}
                </p>
                <p className="text-xs text-slate-400">
                  {user?.profile?.preferred_role || "AI/ML"}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* PAGE TITLE */}
        <div>
          <h1 className="font-display text-2xl font-semibold text-white">
            {meta.title}
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            {meta.subtitle}
          </p>
        </div>

      </div>
    </header>
  );
}