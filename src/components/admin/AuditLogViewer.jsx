import { useState, useEffect, useRef, useCallback } from "react";
import { Search, RefreshCw, Pause, Play, ChevronDown, ChevronRight, Activity } from "lucide-react";
import api from "../../services/api";
import { toPHDate, toPHTime } from "../../utils/date";

const POLL_MS = 5000;

function fmt(d) {
  try {
    const dt = new Date(d);
    return {
      date: toPHDate(dt),
      time: toPHTime(dt),
    };
  } catch { return { date: "", time: d || "" }; }
}

const ACTION_STYLES = {
  green:  { bg: "#0d2818", border: "#14532d", text: "#4ade80", keys: ["CREATE","REGISTER","LOGIN","APPROVE","PRE_ENROLL","GRANT_PERMISSION","ENROLL"] },
  yellow: { bg: "#2a1f00", border: "#713f12", text: "#fbbf24", keys: ["UPDATE","CHANGE_PASSWORD","UPDATE_PROFILE","FORGOT_PASSWORD","RESET_PASSWORD","TOGGLE_ACTIVE","UPDATE_ROLE","UPDATE_STATUS"] },
  red:    { bg: "#2a0a0a", border: "#7f1d1d", text: "#f87171", keys: ["DELETE","LOGIN_FAILED","REJECT","SHUTDOWN","REVOKE_PERMISSION","CANCEL_PRE_ENROLL","DEACTIVATE"] },
  purple: { bg: "#1a0a2e", border: "#4c1d95", text: "#c084fc", keys: ["BROADCAST","SUBMIT_EVALUATION","BULK_ENROLL","BULK_IMPORT","IMPORT_ENROLLMENTS","ENROLL_SEMESTER"] },
  slate:  { bg: "#0f172a", border: "#1e293b", text: "#64748b", keys: ["LOGOUT","CLEAR_SESSIONS"] },
};

function getActionStyle(action) {
  if (!action) return { bg: "#0f172a", border: "#1e293b", text: "#64748b" };
  const a = action.toUpperCase();
  for (const style of Object.values(ACTION_STYLES)) {
    if (style.keys.some((k) => a.includes(k))) return style;
  }
  return { bg: "#0f172a", border: "#1e293b", text: "#94a3b8" };
}

function ActionBadge({ action }) {
  const style = getActionStyle(action);
  return (
    <span style={{
      background: style.bg, border: `1px solid ${style.border}`, color: style.text,
      padding: "1px 7px", borderRadius: 4, fontSize: 10, fontWeight: 700,
      letterSpacing: "0.05em", whiteSpace: "nowrap", flexShrink: 0,
    }}>
      {action || "—"}
    </span>
  );
}

function LogRow({ log, index }) {
  const [expanded, setExpanded] = useState(false);
  const { date, time } = fmt(log.created_at);

  const hasDetails = log.old_data || log.new_data;
  const parseJson = (v) => {
    if (!v) return null;
    try { return typeof v === "string" ? JSON.parse(v) : v; } catch { return null; }
  };
  const newData = parseJson(log.new_data);
  const oldData = parseJson(log.old_data);
  const hasNewData = newData && Object.keys(newData).length > 0;
  const hasOldData = oldData && Object.keys(oldData).length > 0;

  return (
    <>
      <div
        onClick={() => hasDetails && setExpanded((e) => !e)}
        style={{
          display: "grid",
          gridTemplateColumns: "18px 90px 160px 160px 1fr 80px",
          gap: "0 12px",
          alignItems: "center",
          padding: "5px 16px",
          borderBottom: "1px solid #0d1117",
          cursor: hasDetails ? "pointer" : "default",
          background: expanded ? "#0d1520" : index % 2 === 0 ? "transparent" : "#0b0f18",
          transition: "background 0.1s",
        }}
        onMouseEnter={(e) => { if (!expanded) e.currentTarget.style.background = "#0d1520"; }}
        onMouseLeave={(e) => { if (!expanded) e.currentTarget.style.background = index % 2 === 0 ? "transparent" : "#0b0f18"; }}
      >
        {/* expand icon */}
        <span style={{ color: "#2d3748", fontSize: 10 }}>
          {hasDetails ? (expanded ? <ChevronDown size={11} /> : <ChevronRight size={11} />) : null}
        </span>

        {/* timestamp */}
        <span style={{ fontSize: 10, color: "#374151", whiteSpace: "nowrap" }}>
          <span style={{ color: "#4b5563" }}>{date}</span>{" "}
          <span style={{ color: "#6b7280" }}>{time}</span>
        </span>

        {/* user */}
        <span style={{ fontSize: 11, color: "#9ca3af", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          <span style={{ color: "#6b7280" }}>@</span>{log.user_name || "system"}
        </span>

        {/* action */}
        <div><ActionBadge action={log.action} /></div>

        {/* table + record */}
        <span style={{ fontSize: 11, color: "#4b5563", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {log.table_name && <span style={{ color: "#6b7280" }}>{log.table_name}</span>}
          {log.record_id && <span style={{ color: "#374151" }}> #{log.record_id.slice(0, 8)}</span>}
        </span>

        {/* ip */}
        <span style={{ fontSize: 10, color: "#374151", textAlign: "right", whiteSpace: "nowrap" }}>
          {log.ip_address || ""}
        </span>
      </div>

      {/* expanded detail */}
      {expanded && hasDetails && (
        <div style={{ background: "#080c12", borderBottom: "1px solid #0d1117", padding: "10px 16px 10px 46px" }}>
          <div style={{ display: "grid", gridTemplateColumns: hasOldData && hasNewData ? "1fr 1fr" : "1fr", gap: 12 }}>
            {hasOldData && (
              <div>
                <p style={{ fontSize: 10, color: "#f87171", marginBottom: 4, fontWeight: 700, letterSpacing: "0.08em" }}>BEFORE</p>
                <pre style={{ fontSize: 10, color: "#6b7280", margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-all", lineHeight: 1.6 }}>
                  {JSON.stringify(oldData, null, 2)}
                </pre>
              </div>
            )}
            {hasNewData && (
              <div>
                <p style={{ fontSize: 10, color: "#4ade80", marginBottom: 4, fontWeight: 700, letterSpacing: "0.08em" }}>AFTER</p>
                <pre style={{ fontSize: 10, color: "#9ca3af", margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-all", lineHeight: 1.6 }}>
                  {JSON.stringify(newData, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default function AuditLogViewer() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  const [filter, setFilter] = useState("");
  const [follow, setFollow] = useState(true);
  const bottomRef = useRef(null);
  const pollRef  = useRef(null);

  const load = useCallback(async () => {
    try {
      const res = await api.get(`/api/audit-logs?limit=500&_t=${Date.now()}`);
      const raw = Array.isArray(res) ? res : res?.data?.logs ?? [];
      setLogs(Array.isArray(raw) ? raw : []);
    } catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (paused) { clearInterval(pollRef.current); return; }
    pollRef.current = setInterval(load, POLL_MS);
    return () => clearInterval(pollRef.current);
  }, [paused, load]);

  useEffect(() => {
    if (follow && bottomRef.current) bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [logs, follow]);

  const filtered = logs.filter((l) => {
    if (!filter) return true;
    const q = filter.toLowerCase();
    return [l.action, l.table_name, l.user_name, l.ip_address, l.record_id].some((v) => v?.toLowerCase().includes(q));
  });

  const mono = "'Fira Code','Cascadia Code','JetBrains Mono',monospace";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-6 space-y-3">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-emerald-400" />
          <span className="text-sm font-semibold text-slate-700">Audit Trail</span>
          <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{filtered.length} entries</span>
        </div>
        <div className="flex items-center gap-2">
          {/* live indicator */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className={`w-1.5 h-1.5 rounded-full ${paused ? "bg-red-400" : "bg-emerald-400 animate-pulse"}`} />
            <span className={paused ? "text-red-400" : "text-emerald-500"}>{paused ? "Paused" : "Live"}</span>
          </div>
        </div>
      </div>

      <div style={{ background: "#0a0e14", border: "1px solid #1a1f2e", borderRadius: 12, overflow: "hidden", fontFamily: mono, boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>

        {/* toolbar */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "#0d1117", borderBottom: "1px solid #1a1f2e" }}>
          {/* traffic lights */}
          <div style={{ display: "flex", gap: 5, marginRight: 4 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f56", display: "inline-block" }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ffbd2e", display: "inline-block" }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#27c93f", display: "inline-block" }} />
          </div>

          <span style={{ fontSize: 11, color: "#374151", marginRight: 8 }}>audit-trail</span>

          {/* search */}
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 6, background: "#0a0e14", border: "1px solid #1a1f2e", borderRadius: 6, padding: "3px 10px" }}>
            <Search size={11} color="#374151" />
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="filter logs..."
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#9ca3af", fontFamily: mono, fontSize: 11 }}
            />
            {filter && (
              <button onClick={() => setFilter("")} style={{ color: "#4b5563", background: "none", border: "none", cursor: "pointer", fontSize: 11, padding: 0 }}>✕</button>
            )}
          </div>

          {/* controls */}
          <button
            onClick={() => setPaused((p) => !p)}
            style={{ display: "flex", alignItems: "center", gap: 4, background: paused ? "#2a0a0a" : "#0d2818", border: `1px solid ${paused ? "#7f1d1d" : "#14532d"}`, borderRadius: 6, color: paused ? "#f87171" : "#4ade80", padding: "3px 10px", fontSize: 10, cursor: "pointer", fontFamily: mono }}
          >
            {paused ? <Play size={10} /> : <Pause size={10} />}
            {paused ? "Resume" : "Pause"}
          </button>

          <button
            onClick={() => { setFollow((f) => !f); if (!follow) setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50); }}
            style={{ background: follow ? "#0d2818" : "transparent", border: `1px solid ${follow ? "#14532d" : "#1a1f2e"}`, borderRadius: 6, color: follow ? "#4ade80" : "#4b5563", padding: "3px 10px", fontSize: 10, cursor: "pointer", fontFamily: mono }}
          >
            {follow ? "↓ Follow" : "Free"}
          </button>

          <button
            onClick={load}
            style={{ display: "flex", alignItems: "center", gap: 4, background: "transparent", border: "1px solid #1a1f2e", borderRadius: 6, color: "#4b5563", padding: "3px 10px", fontSize: 10, cursor: "pointer", fontFamily: mono }}
          >
            <RefreshCw size={10} />
            Reload
          </button>
        </div>

        {/* column headers */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "18px 90px 160px 160px 1fr 80px",
          gap: "0 12px",
          padding: "5px 16px",
          background: "#0d1117",
          borderBottom: "1px solid #1a1f2e",
          fontSize: 9,
          color: "#374151",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}>
          <span />
          <span>Timestamp</span>
          <span>User</span>
          <span>Action</span>
          <span>Target</span>
          <span style={{ textAlign: "right" }}>IP</span>
        </div>

        {/* log rows */}
        <div style={{ overflow: "auto", maxHeight: "calc(100vh - 300px)" }}>
          {loading ? (
            <div style={{ padding: "24px 16px", color: "#374151", fontSize: 12, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: "#4ade80" }}>$</span>
              <span style={{ color: "#4b5563" }}>loading audit logs...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: "24px 16px", color: "#374151", fontSize: 12, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: "#4ade80" }}>$</span>
              <span style={{ color: "#4b5563" }}>{filter ? `no matches for "${filter}"` : "no audit logs found"}</span>
            </div>
          ) : (
            [...filtered].reverse().map((log, i) => <LogRow key={log.id ?? i} log={log} index={i} />)
          )}
          <div ref={bottomRef} />
        </div>

        {/* status bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "5px 16px", background: "#0d1117", borderTop: "1px solid #1a1f2e", fontSize: 10, color: "#374151" }}>
          <span style={{ color: "#4ade80" }}>●</span>
          <span>{filtered.length} / {logs.length} entries</span>
          <span style={{ marginLeft: "auto", color: "#1e293b" }}>polling every {POLL_MS / 1000}s</span>
          {/* legend */}
          <div style={{ display: "flex", gap: 10 }}>
            {[["#4ade80","create/login"],["#fbbf24","update"],["#f87171","delete/reject"],["#c084fc","bulk/eval"],["#64748b","logout"]].map(([c, l]) => (
              <span key={l} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: c, display: "inline-block" }} />
                <span style={{ color: "#374151" }}>{l}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
