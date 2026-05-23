import { useState, useEffect, useRef, useCallback } from "react";
import api from "../../services/api";

const COLORS = {
  LOGIN:        "\u001b[32m",
  LOGIN_FAILED: "\u001b[31m",
  REGISTER:     "\u001b[36m",
  LOGOUT:       "\u001b[90m",
  CREATE:       "\u001b[32m",
  UPDATE:       "\u001b[33m",
  DELETE:       "\u001b[31m",
  APPROVE:      "\u001b[32m",
  REJECT:       "\u001b[31m",
  BROADCAST:    "\u001b[35m",
  SHUTDOWN:     "\u001b[31;1m",
  RESET:        "\u001b[0m",
};

function actionClass(action) {
  if (!action) return "text-slate-300";
  const a = action.toUpperCase();
  if (["CREATE", "REGISTER", "LOGIN", "APPROVE", "PRE_ENROLL"].some((k) => a.includes(k) || a === k)) return "text-emerald-400";
  if (["UPDATE", "CHANGE_PASSWORD", "UPDATE_PROFILE", "FORGOT_PASSWORD", "RESET_PASSWORD"].some((k) => a.includes(k) || a === k)) return "text-amber-400";
  if (["DELETE", "LOGIN_FAILED", "REJECT", "SHUTDOWN"].some((k) => a.includes(k) || a === k)) return "text-red-400";
  if (["LOGOUT"].includes(a)) return "text-slate-500";
  if (["BROADCAST"].includes(a)) return "text-fuchsia-400";
  return "text-slate-300";
}

function formatTime(d) {
  try { return new Date(d).toLocaleTimeString("en-US", { hour12: false }); }
  catch { return d; }
}

function formatDate(d) {
  try { return new Date(d).toLocaleString(); }
  catch { return d; }
}

function truncate(s, n = 32) {
  if (!s) return "";
  return s.length > n ? s.slice(0, n) + "\u2026" : s;
}

const LIVE_INTERVAL = 5000;
const PAGE_SIZE = 10;

export default function AuditLogViewer() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [live, setLive] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [page, setPage] = useState(1);
  const [filterText, setFilterText] = useState("");
  const scrollRef = useRef(null);
  const pollRef = useRef(null);
  const sinceRef = useRef(null);

  const loadInitial = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/audit-logs?limit=200&_t=${Date.now()}`);
      const raw = Array.isArray(res) ? res : res?.data?.logs ?? [];
      const list = Array.isArray(raw) ? raw : [];
      setLogs(list);
      if (list.length > 0) sinceRef.current = list[0].created_at;
    } catch {} finally { setLoading(false); }
  }, []);

  const poll = useCallback(async () => {
    try {
      const res = await api.get(`/api/audit-logs?limit=20&_t=${Date.now()}`);
      const raw = Array.isArray(res) ? res : res?.data?.logs ?? [];
      const list = Array.isArray(raw) ? raw : [];
      if (list.length === 0) return;
      const latest = list[0].created_at;
      if (latest === sinceRef.current) return;
      sinceRef.current = latest;
      setLogs((prev) => {
        const existingIds = new Set(prev.map((l) => l.id));
        const merged = [...list.filter((l) => !existingIds.has(l.id)), ...prev];
        return merged.slice(0, 500);
      });
    } catch {}
  }, []);

  useEffect(() => { loadInitial(); }, [loadInitial]);

  useEffect(() => {
    if (!live) { clearInterval(pollRef.current); return; }
    pollRef.current = setInterval(poll, LIVE_INTERVAL);
    return () => clearInterval(pollRef.current);
  }, [live, poll]);

  useEffect(() => { setPage(1); }, [filterText]);

  const filtered = logs.filter((l) => {
    if (!filterText) return true;
    const q = filterText.toLowerCase();
    return [l.action, l.table_name, l.user_name, l.ip_address, l.record_id].some((v) => v?.toLowerCase().includes(q));
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const terminalLine = (log) => {
    const ts = formatTime(log.created_at);
    const user = truncate(log.user_name || "system", 18);
    const action = log.action || "?";
    const table = log.table_name ? ` \u2192 ${log.table_name}` : "";
    return `${ts} ${user.padEnd(20)} ${action}${table}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-slate-800">Audit Trail</span>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{filtered.length} entries</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLive((l) => !l)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
              live ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${live ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
            {live ? "LIVE" : "PAUSED"}
          </button>
          <button onClick={loadInitial} className="text-[11px] font-mono text-slate-400 hover:text-slate-600 px-2 py-1 rounded hover:bg-slate-100 transition">
            &#x21bb;
          </button>
        </div>
      </div>

      <div className="mb-3 flex items-center gap-2">
        <span className="text-xs font-mono text-slate-400">{">"}</span>
        <input
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          placeholder="grep logs..."
          className="flex-1 bg-transparent border-0 outline-none text-sm font-mono text-slate-700 placeholder-slate-300"
        />
      </div>

      <div
        ref={scrollRef}
        className="bg-[#0d1117] rounded-xl border border-slate-700 overflow-hidden shadow-2xl"
      >
        <div className="flex items-center gap-1.5 px-4 h-9 bg-[#161b22] border-b border-slate-700">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="ml-2 text-[10px] font-mono text-slate-500">audit-trail — tail -f</span>
        </div>

        <div className="overflow-x-auto" style={{ maxHeight: "calc(100vh - 280px)" }}>
          <table className="w-full text-xs font-mono">
            <tbody>
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-4 py-2.5">
                      <span className="text-slate-600">{">"}</span>{" "}
                      <span className="text-slate-700 animate-pulse">_</span>
                    </td>
                  </tr>
                ))
              ) : paginated.length === 0 ? (
                <tr>
                  <td className="px-4 py-12 text-center text-slate-600">
                    {filterText ? "No matching entries." : "No audit logs yet."}
                  </td>
                </tr>
              ) : (
                paginated.map((log) => {
                  const isExpanded = expanded === log.id;
                  const cls = actionClass(log.action);
                  return (
                    <>
                      <tr
                        key={log.id}
                        className={`cursor-pointer transition ${
                          isExpanded ? "bg-slate-800/40" : "hover:bg-slate-800/20"
                        }`}
                        onClick={() => setExpanded(isExpanded ? null : log.id)}
                      >
                        <td className="px-4 py-2.5 whitespace-nowrap">
                          <span className="text-emerald-500 select-none">{">"}</span>{" "}
                          <span className="text-slate-500">{formatTime(log.created_at)}</span>{" "}
                          <span className="text-slate-400">{truncate(log.user_name || "system", 20).padEnd(21)}</span>{" "}
                          <span className={cls}>{log.action}</span>
                          {log.table_name && (
                            <span className="text-slate-600"> &rarr; {log.table_name}</span>
                          )}
                          {log.ip_address && (
                            <span className="text-slate-600 ml-2">[{log.ip_address}]</span>
                          )}
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr key={`${log.id}-d`}>
                          <td className="px-4 pb-3 pt-0">
                            <div className="ml-4 pl-4 border-l-2 border-slate-700 space-y-2 text-[11px]">
                              <div className="flex gap-6 text-slate-500">
                                <span>Time: <span className="text-slate-300">{formatDate(log.created_at)}</span></span>
                                <span>User: <span className="text-slate-300">{log.user_name || "system"}</span></span>
                                {log.record_id && <span>Record: <span className="text-slate-300">{log.record_id}</span></span>}
                                {log.ip_address && <span>IP: <span className="text-slate-300">{log.ip_address}</span></span>}
                              </div>
                              {log.old_data && (
                                <div>
                                  <div className="text-red-400 mb-0.5"># old_data</div>
                                  <pre className="text-slate-400 bg-slate-900 rounded p-2 overflow-x-auto max-h-32 border border-slate-700">
                                    {typeof log.old_data === "string" ? log.old_data : JSON.stringify(log.old_data, null, 2)}
                                  </pre>
                                </div>
                              )}
                              {log.new_data && (
                                <div>
                                  <div className="text-emerald-400 mb-0.5"># new_data</div>
                                  <pre className="text-slate-400 bg-slate-900 rounded p-2 overflow-x-auto max-h-32 border border-slate-700">
                                    {typeof log.new_data === "string" ? log.new_data : JSON.stringify(log.new_data, null, 2)}
                                  </pre>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-4 h-8 bg-[#161b22] border-t border-slate-700 text-[10px] font-mono text-slate-500">
          <span>Page {page}/{totalPages}</span>
          <div className="flex items-center gap-2">
            <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="disabled:opacity-30 hover:text-slate-300 transition">&lt; prev</button>
            <button disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="disabled:opacity-30 hover:text-slate-300 transition">next &gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
}
