import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import NotificationBell from "../common/NotificationBell";
import { GraduationCap, User, LogOut } from "lucide-react";

export default function EvaluatorHeader() {
  const { user, logout } = useAuth();
  return (
    <nav className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center text-white">
          <GraduationCap size={14} />
        </div>
        <span className="font-bold text-slate-700 text-sm">Evaluation Hub</span>
      </div>
      <div className="flex items-center gap-1 sm:gap-2">
        <NotificationBell />
        <Link to="/profile" className="text-sm text-slate-400 hover:text-primary-600 transition flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-primary-50">
          <User size={14} />
          <span className="hidden sm:inline">Profile</span>
        </Link>
        <button onClick={logout} className="text-sm text-slate-400 hover:text-red-500 transition flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-red-50">
          <LogOut size={14} />
          <span className="hidden sm:inline">Logout</span>
        </button>
        {user && <span className="text-xs text-slate-400 ml-1 hidden sm:inline">{user.full_name}</span>}
      </div>
    </nav>
  );
}
