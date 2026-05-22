import { useState, useEffect, useCallback } from "react";
import { Search, ChevronLeft, ChevronRight, Download } from "lucide-react";
import api from "../../services/api";
import Pagination from "../common/Pagination";

const PAGE_SIZE = 15;

export default function ImportLogs() {
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  const fetch = useCallback(async (pg) => {
    setLoading(true);
    try {
      const res = await api.get("/api/admin/enrollments/import-logs", { params: { page: pg, limit: PAGE_SIZE } });
      setLogs(res.data.logs);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
    } catch {} finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(1); setPage(1); }, [fetch]);

  const goToPage = (p) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
    setExpanded(null);
    fetch(p);
  };

  const exportLogs = () => {
    const data = logs.map(l => ({
      user: l.user_name || "System",
      rows_imported: l.result ? JSON.parse(l.result).imported : 0,
      total_rows: l.result ? JSON.parse(l.result).total : 0,
      errors: l.result ? (JSON.parse(l.result).errors || []).length : 0,
      ip: l.ip_address || "",
      created_at: new Date(l.created_at).toLocaleString(),
    }));
    import("xlsx").then(({ default: XLSX }) => {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Import Logs");
      XLSX.writeFile(wb, "import-logs.xlsx");
    });
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 space-y-6 pb-6">
      <div className="card overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between gap-4">
          <h3 className="font-semibold text-sm text-slate-700 shrink-0">
            Import Logs {!loading && <span className="text-slate-400 font-normal">({total})</span>}
          </h3>
          <button onClick={exportLogs} className="btn btn-secondary btn-sm flex items-center gap-1.5">
            <Download size={14} /> Export
          </button>
          {loading && <span className="inline-block w-4 h-4 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">User</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wide">Rows</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wide">Imported</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wide">Errors</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">IP</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wide"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {logs.map((l) => {
                const result = l.result ? JSON.parse(l.result) : null;
                const isError = result?.error;
                return (
                  <tr key={l.id} className="hover:bg-slate-50/40">
                    <td className="px-6 py-3 text-slate-800 font-medium">{l.user_name || "System"}</td>
                    <td className="px-6 py-3 text-right text-slate-600">{result?.total ?? "—"}</td>
                    <td className="px-6 py-3 text-right">
                      <span className={`text-xs font-semibold ${isError ? "text-red-500" : "text-emerald-500"}`}>
                        {result?.imported ?? "—"}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <span className={`text-xs font-semibold ${(result?.errors?.length || 0) > 0 ? "text-red-500" : "text-slate-400"}`}>
                        {result?.errors?.length ?? 0}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-slate-500 font-mono text-xs">{l.ip_address || "—"}</td>
                    <td className="px-6 py-3 text-slate-500 whitespace-nowrap">{new Date(l.created_at).toLocaleString()}</td>
                    <td className="px-6 py-3 text-right">
                      <button onClick={() => setExpanded(expanded === l.id ? null : l.id)} className="text-xs text-primary-600 font-medium hover:underline">
                        {expanded === l.id ? "Hide" : "Details"}
                      </button>
                    </td>
                  </tr>
                );
              })}
              {!loading && logs.length === 0 && (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-400 text-sm">No import logs yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {logs.map((l) => expanded === l.id && (
          <div key={l.id} className="border-t border-slate-100 bg-slate-50/30 px-6 py-4 space-y-3">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Payload</p>
              <pre className="text-xs text-slate-700 bg-white rounded-lg border border-slate-200 p-3 max-h-40 overflow-auto">{JSON.stringify(JSON.parse(l.payload), null, 2)}</pre>
            </div>
            {l.result && (
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Result</p>
                <pre className="text-xs text-slate-700 bg-white rounded-lg border border-slate-200 p-3 max-h-40 overflow-auto">{JSON.stringify(JSON.parse(l.result), null, 2)}</pre>
              </div>
            )}
          </div>
        ))}
        {totalPages > 1 && (
          <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">Page {page} of {totalPages}</span>
            <div className="flex items-center gap-1">
              <button onClick={() => goToPage(page - 1)} disabled={page <= 1} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-500 disabled:text-slate-300 disabled:cursor-not-allowed"><ChevronLeft size={16} /></button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1).map((p, idx, arr) => (
                <span key={p} className="flex items-center">
                  {idx > 0 && arr[idx - 1] !== p - 1 && <span className="px-1 text-slate-300 text-xs">...</span>}
                  <button onClick={() => goToPage(p)} className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${p === page ? "bg-primary-600 text-white" : "hover:bg-slate-100 text-slate-600"}`}>{p}</button>
                </span>
              ))}
              <button onClick={() => goToPage(page + 1)} disabled={page >= totalPages} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-500 disabled:text-slate-300 disabled:cursor-not-allowed"><ChevronRight size={16} /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}