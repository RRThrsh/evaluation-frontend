import { useEffect, useState } from "react";
import api from "../../services/api";
import Pagination from "../common/Pagination";

const PAGE_SIZE = 15;

function SvgIcon({ path, className = "w-5 h-5" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  );
}

export default function AuditLogViewer() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [page, setPage] = useState(1);
  const [filterAction, setFilterAction] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");

  const loadLogs = async (filters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.action) params.set("action", filters.action);
      if (filters.dateFrom) params.set("date_from", filters.dateFrom);
      if (filters.dateTo) params.set("date_to", filters.dateTo);
      const qs = params.toString();
      const data = await api.get(`/api/audit-logs${qs ? `?${qs}` : ""}`);
      setLogs(Array.isArray(data) ? data : data?.data ?? []);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { loadLogs(); }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    setPage(1);
    loadLogs({ action: filterAction, dateFrom: filterDateFrom, dateTo: filterDateTo });
  };

  const handleClear = () => {
    setFilterAction("");
    setFilterDateFrom("");
    setFilterDateTo("");
    setPage(1);
    loadLogs();
  };

  const actionColor = (action) => {
    if (action?.toLowerCase().startsWith("create")) return "text-emerald-600 bg-emerald-50";
    if (action?.toLowerCase().startsWith("update")) return "text-blue-600 bg-blue-50";
    if (action?.toLowerCase().startsWith("delete")) return "text-red-600 bg-red-50";
    return "text-slate-600 bg-slate-100";
  };

  const formatDate = (d) => {
    try { return new Date(d).toLocaleString(); } catch { return d; }
  };

  const truncateId = (id) => id ? (String(id).length > 8 ? String(id).slice(0, 8) + "…" : id) : "—";

  const totalPages = Math.max(1, Math.ceil(logs.length / PAGE_SIZE));
  const paginatedLogs = logs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Audit Logs</h2>
          <p className="text-sm text-slate-500 mt-1">Track all system actions and changes</p>
        </div>
        <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg font-medium">{logs.length} entries</span>
      </div>

      <form onSubmit={handleFilter} className="flex flex-wrap gap-3 items-end mb-5">
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">Action</label>
          <select value={filterAction} onChange={(e) => setFilterAction(e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20">
            <option value="">All</option>
            <option value="CREATE">Create</option>
            <option value="UPDATE">Update</option>
            <option value="DELETE">Delete</option>
            <option value="LOGIN">Login</option>
            <option value="LOGOUT">Logout</option>
            <option value="BROADCAST">Broadcast</option>
            <option value="SHUTDOWN">Shutdown</option>
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">From</label>
          <input type="date" value={filterDateFrom} onChange={(e) => setFilterDateFrom(e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">To</label>
          <input type="date" value={filterDateTo} onChange={(e) => setFilterDateTo(e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <button type="submit"
          className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700 transition">Filter</button>
        <button type="button" onClick={handleClear}
          className="px-4 py-2 text-xs font-medium text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200 transition">Clear</button>
      </form>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Time</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Table</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Record</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-5 py-3"><div className="h-4 bg-slate-100 rounded w-3/4" /></td>
                    ))}
                  </tr>
                ))
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-sm text-slate-400">No audit logs yet</td>
                </tr>
              ) : (
                paginatedLogs.map((log) => (
                  <>
                    <tr
                      key={log.id}
                      className="hover:bg-slate-50/50 transition cursor-pointer"
                      onClick={() => setExpanded(expanded === log.id ? null : log.id)}
                    >
                      <td className="px-5 py-3 text-xs text-slate-400 font-mono">{formatDate(log.created_at)}</td>
                      <td className="px-5 py-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${actionColor(log.action)}`}>{log.action}</span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-xs font-mono text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">{log.table_name || "—"}</span>
                      </td>
                      <td className="px-5 py-3 text-xs text-slate-500 font-mono">{truncateId(log.record_id)}</td>
                      <td className="px-5 py-3 text-xs text-slate-500">{log.user_id || "—"}</td>
                      <td className="px-5 py-3 text-right text-xs text-slate-400 font-mono">{log.ip_address || "—"}</td>
                    </tr>
                    {expanded === log.id && (log.old_data || log.new_data) && (
                      <tr key={`${log.id}-detail`} className="bg-slate-50/70">
                        <td colSpan={6} className="px-5 py-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {log.old_data && (
                              <div>
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-red-500 mb-1.5">Old Data</p>
                                <pre className="text-xs text-slate-600 bg-white border border-slate-200 rounded-lg p-3 overflow-x-auto max-h-40">{typeof log.old_data === "string" ? log.old_data : JSON.stringify(log.old_data, null, 2)}</pre>
                              </div>
                            )}
                            {log.new_data && (
                              <div>
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-500 mb-1.5">New Data</p>
                                <pre className="text-xs text-slate-600 bg-white border border-slate-200 rounded-lg p-3 overflow-x-auto max-h-40">{typeof log.new_data === "string" ? log.new_data : JSON.stringify(log.new_data, null, 2)}</pre>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
