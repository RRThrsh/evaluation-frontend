import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ModeratorHeader({ pendingCount }) {
  const { logout } = useAuth();
  return (
    <nav className="bg-white border-b border-zinc-200 px-6 py-3 flex justify-between items-center">
      <span className="font-bold text-zinc-700">MODERATOR CONTROL CENTER</span>
      <div className="flex items-center gap-4">
        <span className="text-sm text-zinc-500">Pending: {pendingCount}</span>
        <Link to="/profile" className="text-sm text-zinc-400 hover:text-blue-600 transition flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-blue-50">Profile</Link>
        <button onClick={logout} className="text-sm text-zinc-400 hover:text-red-500 transition flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-red-50">Logout</button>
      </div>
    </nav>
  );
}
