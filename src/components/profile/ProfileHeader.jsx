import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import SvgIcon from "../common/SvgIcon";

export default function ProfileHeader() {
  const { user, logout } = useAuth();
  const dashboardLink = { admin: "/admin", evaluator: "/evaluator" };

  return (
    <header className="sticky top-0 z-40 border-b border-white/30 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 md:px-6">
        <div className="flex items-center gap-2 text-sm">
          <Link to={dashboardLink[user?.role] || "/"} className="text-slate-400 transition hover:text-slate-700">Dashboard</Link>
          <span className="text-slate-300">/</span>
          <span className="font-semibold text-slate-900">Profile</span>
        </div>
        <button onClick={logout}
          className="group flex items-center gap-2 rounded-2xl border border-red-100 bg-white px-4 py-2 text-sm font-medium text-slate-500 shadow-sm transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600">
          <SvgIcon path="M17 16l4-4m0 0l-4-4m4 4H7" />
          Logout
        </button>
      </div>
    </header>
  );
}
