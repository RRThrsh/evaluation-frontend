import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import NotificationBell from "../common/NotificationBell";

export default function StaffHeader() {
  const { logout } = useAuth();
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Evaluation Request</h1>
        <p className="text-slate-500 text-sm">Submit a student evaluation for moderator review</p>
      </div>
      <div className="flex items-center gap-2">
        <NotificationBell />
        <Link to="/profile" className="text-sm text-slate-400 hover:text-blue-600 transition flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-blue-50 shrink-0">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
          Profile
        </Link>
        <button onClick={logout} className="text-sm text-slate-400 hover:text-red-500 transition flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-red-50 shrink-0">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
}
