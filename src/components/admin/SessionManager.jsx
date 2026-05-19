import { useEffect, useState } from "react";
import api from "../../services/api";
import ConfirmModal from "../common/ConfirmModal";

function SvgIcon({ path, className = "w-5 h-5" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  );
}

export default function SessionManager() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmUser, setConfirmUser] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.get("/api/admin/sessions");
      setSessions(data.data ?? []);
    } catch (err) { showToast(err.message, "error"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const forceLogout = async () => {
    if (!confirmUser) return;
    try {
      await api.delete(`/api/admin/sessions/${confirmUser}`);
      showToast(`Logged out ${confirmUser}`);
      setConfirmUser(null);
      await load();
    } catch (err) { showToast(err.message, "error"); }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Active Sessions</h2>
          <p className="text-sm text-slate-500 mt-1">View and manage active user sessions</p>
        </div>
        <button onClick={load} className="text-xs px-3 py-1.5 bg-slate-100 rounded-xl hover:bg-slate-200 transition font-medium">Refresh</button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase">User</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase">Role</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase">Since</th>
              <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <td key={j} className="px-5 py-3"><div className="h-4 bg-slate-100 rounded w-3/4" /></td>
                  ))}
                </tr>
              ))
            ) : sessions.length === 0 ? (
              <tr><td colSpan={4} className="px-5 py-12 text-center text-sm text-slate-400">No active sessions</td></tr>
            ) : sessions.map((s) => (
              <tr key={s.user_id} className="hover:bg-slate-50/50">
                <td className="px-5 py-3">
                  <div>
                    <p className="font-medium text-slate-800">{s.full_name}</p>
                    <p className="text-xs text-slate-400">{s.email}</p>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-slate-100 text-slate-600 capitalize">{s.role}</span>
                </td>
                <td className="px-5 py-3 text-xs text-slate-400">{new Date(s.created_at).toLocaleString()}</td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => setConfirmUser(s.user_id)}
                    className="text-xs px-3 py-1.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 font-medium transition">
                    Force Logout
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {confirmUser && (
        <ConfirmModal
          title="Force Logout"
          message="Force this user to log out? Their session will be cleared."
          confirmLabel="Logout"
          confirmColor="bg-red-600 hover:bg-red-700"
          onConfirm={forceLogout}
          onCancel={() => setConfirmUser(null)}
        />
      )}

      {toast && (
        <div className={`fixed bottom-6 right-6 px-5 py-3 rounded-xl shadow-lg text-sm font-medium text-white ${toast.type === "error" ? "bg-red-500" : "bg-emerald-500"}`}>{toast.msg}</div>
      )}
    </div>
  );
}
