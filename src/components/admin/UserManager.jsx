import { useEffect, useState } from "react";
import { Search, RotateCcw } from "lucide-react";
import api from "../../services/api";
import { usePermissions } from "../../context/PermissionContext";
import Pagination from "../common/Pagination";
import { toPHDate } from "../../utils/date";

const ROLES = ["admin", "evaluator"];
const PAGE_SIZE = 15;

export default function UserManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [toast, setToast] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [page, setPage] = useState(1);
  const { can } = usePermissions();

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

  const handleSearch = (e) => { e.preventDefault(); load({ search, role: roleFilter, status: statusFilter }); };

  const changeRole = async (userId, newRole) => {
    try { await api.patch(`/api/admin/users/${userId}/role`, { role: newRole }); showToast("Role updated"); load({ search, role: roleFilter, status: statusFilter }); } catch (err) { showToast(err.message, "error"); }
  };

  const toggleActive = async (userId) => {
    try { const res = await api.patch(`/api/admin/users/${userId}/toggle-active`); showToast(res.message || "Toggled"); setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, active: res.data.active } : u)); } catch (err) { showToast(err.message, "error"); }
  };

  const resetPassword = async (userId) => {
    setConfirmAction(null);
    try { const res = await api.post(`/api/admin/users/${userId}/reset-password`); showToast(res.message || "Password reset"); } catch (err) { showToast(err.message, "error"); }
  };

  const statusBadge = (status) => {
    const map = { approved: "badge badge-green", pending: "badge badge-yellow", rejected: "badge badge-red", suspended: "badge badge-gray" };
    return <span className={map[status] || "badge badge-gray"}>{status}</span>;
  };

  const totalPages = Math.max(1, Math.ceil(users.length / PAGE_SIZE));
  const paginatedUsers = users.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [search, roleFilter, statusFilter]);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">User Management</h2>
        <p className="text-sm text-slate-500 mt-1">Manage all users, roles, and account status</p>
      </div>

      <form onSubmit={handleSearch} className="flex flex-wrap gap-3 mb-6">
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email..." className="input-field flex-1 min-w-[200px]" />
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="input-field w-auto">
          <option value="">All Roles</option>
          {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field w-auto">
          <option value="">All Status</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
          <option value="suspended">Suspended</option>
        </select>
        <button type="submit" className="btn btn-primary btn-md flex items-center gap-1.5">
          <Search size={15} />
          Search
        </button>
      </form>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="table-header">
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Active</th>
                <th>Created</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 7 }).map((_, j) => <td key={j} className="px-5 py-3"><div className="h-4 bg-slate-100 rounded w-3/4" /></td>)}
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-sm text-slate-400">No users found</td></tr>
              ) : (
                paginatedUsers.map((u) => (
                  <tr key={u.id} className="table-row">
                    <td className="table-cell font-medium text-slate-800">{u.full_name}</td>
                    <td className="table-cell text-slate-500">{u.email}</td>
                    <td className="table-cell">
                      {can("user-management.manage") ? (
                      <select value={u.role} onChange={(e) => changeRole(u.id, e.target.value)} className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/30">
                        {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                      ) : (
                      <span className="text-xs font-medium text-slate-700 capitalize">{u.role}</span>
                      )}
                    </td>
                    <td className="table-cell">{statusBadge(u.status)}</td>
                    <td className="table-cell">
                      {can("user-management.manage") ? (
                      <button onClick={() => toggleActive(u.id)} className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${u.active !== false ? "bg-emerald-400" : "bg-slate-300"}`}>
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition ${u.active !== false ? "translate-x-[18px]" : "translate-x-0.5"}`} />
                      </button>
                      ) : (
                      <span className={`text-xs font-medium ${u.active !== false ? "text-emerald-600" : "text-slate-400"}`}>{u.active !== false ? "Active" : "Inactive"}</span>
                      )}
                    </td>
                    <td className="table-cell text-xs text-slate-400">{toPHDate(u.created_at)}</td>
                    <td className="table-cell text-right">
                      {can("user-management.manage") && (
                      <button onClick={() => setConfirmAction({ user: u, type: "reset" })} className="btn btn-ghost btn-sm text-primary-600 hover:text-primary-700">
                        <RotateCcw size={13} />
                        Reset Password
                      </button>
                      )}
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
        <div className="modal-overlay" onClick={() => setConfirmAction(null)}>
          <div className="modal-content max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Reset Password</h3>
            <p className="text-sm text-slate-500 mb-1">Reset password for <strong>{confirmAction.user.full_name}</strong>?</p>
            <p className="text-xs text-amber-600 mb-5">Password will be set to <code className="bg-amber-50 px-1.5 py-0.5 rounded text-xs font-mono">changeme123</code></p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmAction(null)} className="btn btn-secondary btn-md">Cancel</button>
              <button onClick={() => resetPassword(confirmAction.user.id)} className="btn btn-danger btn-md">Reset</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-6 right-6 flex items-center gap-2.5 px-5 py-3 rounded-xl shadow-lg text-sm font-medium text-white transition-all ${toast.type === "error" ? "bg-red-500" : "bg-emerald-500"}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
