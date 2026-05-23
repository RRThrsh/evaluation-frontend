import { useEffect, useState } from "react";
import api from "../../services/api";
import { usePermissions } from "../../context/PermissionContext";
import ConfirmModal from "../common/ConfirmModal";
import Pagination from "../common/Pagination";

const PAGE_SIZE = 15;

export default function SessionManager() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmUser, setConfirmUser] = useState(null);
  const [toast, setToast] = useState(null);
  const [page, setPage] = useState(1);
  const { can } = usePermissions();

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const load = async () => {
    setLoading(true);
    try { const data = await api.get("/api/admin/sessions"); setSessions(data.data ?? []); }
    catch (err) { showToast(err.message, "error"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const forceLogout = async () => {
    if (!confirmUser) return;
    try { await api.delete(`/api/admin/sessions/${confirmUser}`); showToast(`Logged out ${confirmUser}`); setConfirmUser(null); await load(); }
    catch (err) { showToast(err.message, "error"); }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Active Sessions</h2>
          <p className="text-sm text-slate-500 mt-1">View and manage active user sessions</p>
        </div>
        <button onClick={load} className="btn btn-ghost btn-sm">Refresh</button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="table-header border-b border-slate-200">
              <th className="text-left px-5 py-3.5">User</th>
              <th className="text-left px-5 py-3.5">Role</th>
              <th className="text-left px-5 py-3.5">Since</th>
              {can("sessions") && <th className="text-right px-5 py-3.5">Action</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {Array.from({ length: 4 }).map((_, j) => <td key={j} className="px-5 py-3"><div className="h-4 bg-slate-100 rounded w-3/4" /></td>)}
                </tr>
              ))
            ) : sessions.length === 0 ? (
              <tr><td colSpan={can("sessions") ? 4 : 3} className="px-5 py-12 text-center text-sm text-slate-400">No active sessions</td></tr>
            ) : (() => {
              const totalPages = Math.max(1, Math.ceil(sessions.length / PAGE_SIZE));
              const paginatedSessions = sessions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
              return paginatedSessions.map((s) => (
              <tr key={s.user_id} className="table-row">
                <td className="px-5 py-3">
                  <div><p className="font-medium text-slate-800">{s.full_name}</p><p className="text-xs text-slate-400">{s.email}</p></div>
                </td>
                <td className="px-5 py-3"><span className="badge badge-gray capitalize">{s.role}</span></td>
                <td className="px-5 py-3 text-xs text-slate-400">{new Date(s.created_at).toLocaleString()}</td>
                {can("sessions") && (
                <td className="px-5 py-3 text-right">
                  <button onClick={() => setConfirmUser(s.user_id)} className="btn btn-danger btn-sm">Force Logout</button>
                </td>
                )}
              </tr>
            ));
          })()}
          </tbody>
        </table>
        <Pagination currentPage={page} totalPages={Math.max(1, Math.ceil(sessions.length / PAGE_SIZE))} onPageChange={setPage} />
      </div>

      {confirmUser && <ConfirmModal title="Force Logout" message="Force this user to log out? Their session will be cleared." confirmLabel="Logout" onConfirm={forceLogout} onCancel={() => setConfirmUser(null)} />}

      {toast && <div className={`fixed bottom-6 right-6 px-5 py-3 rounded-xl shadow-lg text-sm font-medium text-white ${toast.type === "error" ? "bg-red-500" : "bg-emerald-500"}`}>{toast.msg}</div>}
    </div>
  );
}
