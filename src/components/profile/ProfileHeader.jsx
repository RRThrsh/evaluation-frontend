import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LogOut, ChevronRight } from "lucide-react";

export default function ProfileHeader() {
  const { user, logout } = useAuth();
  const dashboardLink = { admin: "/admin", evaluator: "/evaluator" };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 md:px-6">
        <div className="flex items-center gap-1.5 text-sm">
          <Link to={dashboardLink[user?.role] || "/"} className="text-slate-400 hover:text-slate-700 transition">Dashboard</Link>
          <ChevronRight size={12} className="text-slate-300" />
          <span className="font-semibold text-slate-900">Profile</span>
        </div>
        <button onClick={logout} className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-medium text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition">
          <LogOut size={14} />
          Logout
        </button>
      </div>
    </header>
  );
}
