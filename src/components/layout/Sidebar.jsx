import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, ClipboardCheck, LogOut, User, GraduationCap, ChevronRight, Palette } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, setTheme, themes } = useTheme();
  const [themeOpen, setThemeOpen] = React.useState(false);
  const themeRef = React.useRef(null);

  React.useEffect(() => {
    const handler = (e) => {
      if (themeRef.current && !themeRef.current.contains(e.target)) setThemeOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { label: "Review Board", path: "/evaluator", icon: LayoutDashboard },
  ];

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 bg-white border-r border-slate-200 z-30">
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-slate-200">
        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white">
          <GraduationCap size={16} />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900 leading-tight">Academic Evaluation</p>
          <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Review Portal</p>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.path)
                  ? "bg-primary-50 text-primary-700"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-200 space-y-1">
        <button
          onClick={() => navigate("/profile")}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors"
        >
          <User size={18} />
          <span className="flex-1 text-left truncate">{user?.full_name || "Profile"}</span>
          <ChevronRight size={14} className="text-slate-300" />
        </button>
        <div className="flex items-center gap-1">
          <div className="relative" ref={themeRef}>
            <button
              onClick={() => setThemeOpen((p) => !p)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
              title="Change theme"
            >
              <Palette size={15} />
              <span className="text-xs capitalize">{theme}</span>
            </button>
            {themeOpen && (
              <div className="absolute bottom-full left-0 mb-2 min-w-[120px] bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
                {themes.map((t) => (
                  <button
                    key={t}
                    onClick={() => { setTheme(t); setThemeOpen(false); }}
                    className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-left transition hover:bg-slate-50 ${
                      theme === t ? "font-semibold text-slate-900 bg-slate-50" : "text-slate-600"
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      t === "default" ? "bg-indigo-500" :
                      t === "dark" ? "bg-slate-800" :
                      t === "neutral" ? "bg-slate-400" :
                      "bg-gray-300"
                    } ring-1 ring-slate-300/50 shrink-0`} />
                    <span className="capitalize">{t}</span>
                    {theme === t && <span className="ml-auto text-primary-500 text-[10px]">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors ml-auto"
          >
            <LogOut size={15} />
            <span className="text-xs">Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
