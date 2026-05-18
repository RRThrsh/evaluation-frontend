import { useEffect, useState } from "react";
import api from "../../services/api";
import Pagination from "../common/Pagination";

const ROLES = ["admin", "moderator", "staff", "user"];
const PAGE_SIZE = 15;

function SvgIcon({ path, className = "w-5 h-5" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  );
}

export default function UserManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [toast, setToast] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [page, setPage] = useState(1);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = async (opts = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (opts.search || search) params.set("search", opts.search || search);
      if (opts.role || roleFilter) params.set("role", opts.role || roleFilter);
      if (opts.status || statusFilter) params.set("status", opts.status || statusFilter);
      const qs = params.toString();
      const res = await api.get(`/api/admin/users${qs ? `?${qs}` : ""}`);
      setUsers(res.data ?? []);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    load({ search, role: roleFilter, status: statusFilter });
  };

  const changeRole = async (userId, newRole) => {
    try {
      await api.patch(`/api/admin/users/${userId}/role`, { role: newRole });
      showToast("Role updated");
      load({ search, role: roleFilter, status: statusFilter });
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const toggleActive = async (userId) => {
    try {
      const res = await api.patch(`/api/admin/users/${userId}/toggle-active`);
      showToast(res.message || "Toggled");
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, active: res.data.active } : u));
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const resetPassword = async (userId, name) => {
    setConfirmAction(null);
    try {
      const res = await api.post(`/api/admin/users/${userId}/reset-password`);
      showToast(res.message || "Password reset");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const statusBadge = (status) => {
    const map = { approved: "bg-emerald-100 text-emerald-700", pending: "bg-amber-100 text-amber-700", rejected: "bg-red-100 text-red-700", suspended: "bg-slate-100 text-slate-600" };
    return <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${map[status] || "bg-slate-100 text-slate-600"}`}>{status}</span>;
  };

  const totalPages = Math.max(1, Math.ceil(users.length / PAGE_SIZE));
  const paginatedUsers = users.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [search, roleFilter, statusFilter]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">User Management</h2>
          <p className="text-sm text-slate-500 mt-1">Manage all users, roles, and account status</p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="flex-1 min-w-[200px] bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
        />
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30">
          <option value="">All Roles</option>
          {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30">
          <option value="">All Status</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
          <option value="suspended">Suspended</option>
        </select>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
          <SvgIcon path="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" className="w-4 h-4" />
          Search
        </button>
      </form>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Active</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Created</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-5 py-3"><div className="h-4 bg-slate-100 rounded w-3/4" /></td>
                    ))}
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-sm text-slate-400">No users found</td>
                </tr>
              ) : (
                paginatedUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-5 py-3 font-medium text-slate-800">{u.full_name}</td>
                    <td className="px-5 py-3 text-slate-500">{u.email}</td>
                    <td className="px-5 py-3">
                      <select
                        value={u.role}
                        onChange={(e) => changeRole(u.id, e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                      >
                        {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </td>
                    <td className="px-5 py-3">{statusBadge(u.status)}</td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => toggleActive(u.id)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${u.active !== false ? "bg-emerald-400" : "bg-slate-300"}`}
                      >
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition ${u.active !== false ? "translate-x-4.5 ml-0.5" : "translate-x-0.5 ml-0.5"}`} />
                      </button>
                    </td>
                    <td className="px-5 py-3 text-xs text-slate-400">{new Date(u.created_at).toLocaleDateString()}</td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => setConfirmAction({ user: u, type: "reset" })}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium transition"
                      >
                        Reset Password
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

      {confirmAction && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={() => setConfirmAction(null)}>
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Reset Password</h3>
            <p className="text-sm text-slate-500 mb-1">Reset password for <strong>{confirmAction.user.full_name}</strong>?</p>
            <p className="text-xs text-amber-600 mb-5">Password will be set to <code className="bg-amber-50 px-1.5 py-0.5 rounded text-xs font-mono">changeme123</code></p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmAction(null)} className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition">Cancel</button>
              <button onClick={() => resetPassword(confirmAction.user.id, confirmAction.user.full_name)} className="px-4 py-2 text-sm font-semibold text-white bg-amber-500 rounded-lg hover:bg-amber-600 transition">Reset</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-6 right-6 flex items-center gap-2.5 px-5 py-3 rounded-xl shadow-lg text-sm font-medium text-white transition-all ${toast.type === "error" ? "bg-red-500" : "bg-emerald-500"}`}>
          <SvgIcon path={toast.type === "error" ? "M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" : "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"} className="w-4 h-4" />
          {toast.message}
        </div>
      )}
    </div>
  );
}
