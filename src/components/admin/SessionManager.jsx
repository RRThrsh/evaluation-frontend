import { useEffect, useRef, useState } from "react";
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
  const [pendingDelete, setPendingDelete] = useState(null);
  const timerRef = useRef(null);
  const { can } = usePermissions();

  useEffect(() => { return () => { if (timerRef.current) clearInterval(timerRef.current); }; }, []);

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const load = async () => {
    setLoading(true);
    try { const data = await api.get("/api/admin/sessions"); setSessions(data.data ?? []); }
    catch (err) { showToast(err.message, "error"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const scheduleLogout = (userId, name) => {
    let remaining = 3;
    setPendingDelete({ userId, name, remaining });
    timerRef.current = setInterval(() => {
      remaining--;
      if (remaining > 0) {
        setPendingDelete((prev) => prev ? { ...prev, remaining } : null);
      } else {
        clearInterval(timerRef.current);
        timerRef.current = null;
        const targetId = userId;
        const targetName = name;
        setPendingDelete(null);
        (async () => {
          try { await api.delete(`/api/admin/sessions/${targetId}`); showToast(`Logged out ${targetName}`); await load(); }
          catch (err) { showToast(err.message, "error"); }
        })();
      }
    }, 1000);
  };

  const undoDelete = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setPendingDelete(null);
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
                  <button onClick={() => setConfirmUser({ step: 1, userId: s.user_id, name: s.full_name })} className="btn btn-danger btn-sm">Force Logout</button>
                </td>
                )}
              </tr>
            ));
          })()}
          </tbody>
        </table>
        <Pagination currentPage={page} totalPages={Math.max(1, Math.ceil(sessions.length / PAGE_SIZE))} onPageChange={setPage} />
      </div>

      {confirmUser?.step === 1 && <ConfirmModal title="Force Logout" message={`Force "${confirmUser.name}" to log out? Their session will be cleared.`} confirmLabel="Continue" onConfirm={() => setConfirmUser({ ...confirmUser, step: 2 })} onCancel={() => setConfirmUser(null)} />}
      {confirmUser?.step === 2 && <ConfirmModal title="Confirm Force Logout" message={`Are you sure you want to force "${confirmUser.name}" to log out?`} extra="Their session will be cleared immediately." confirmLabel="Logout" onConfirm={() => { const { userId, name } = confirmUser; setConfirmUser(null); scheduleLogout(userId, name); }} onCancel={() => setConfirmUser(null)} />}

      {toast && <div className={`fixed bottom-6 right-6 px-5 py-3 rounded-xl shadow-lg text-sm font-medium text-white ${toast.type === "error" ? "bg-red-500" : "bg-emerald-500"}`}>{toast.msg}</div>}

      {pendingDelete && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-4 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl text-sm">
          <span>Logging out <strong>{pendingDelete.name}</strong>... <span className="text-slate-400">({pendingDelete.remaining}s)</span></span>
          <button onClick={undoDelete} className="btn bg-white text-slate-900 hover:bg-slate-200 btn-sm font-semibold px-3">Undo</button>
        </div>
      )}
    </div>
  );
}
