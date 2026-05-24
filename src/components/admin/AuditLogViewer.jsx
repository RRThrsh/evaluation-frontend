import { useState, useEffect, useRef, useCallback } from "react";
import api from "../../services/api";

function fmt(d) {
  try { return new Date(d).toLocaleString().replace(",", ""); }
  catch { return d || ""; }
}

const POLL_MS = 5000;

export default function AuditLogViewer() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  const [filter, setFilter] = useState("");
  const [follow, setFollow] = useState(true);
  const bottomRef = useRef(null);
  const pollRef = useRef(null);

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

  function color(action) {
    if (!action) return "#a0aec0";
    const a = action.toUpperCase();
    if (["CREATE","REGISTER","LOGIN","APPROVE","PRE_ENROLL","GRANT_PERMISSION"].some(k => a.includes(k) || a === k))
      return "#4ade80";
    if (["UPDATE","CHANGE_PASSWORD","UPDATE_PROFILE","FORGOT_PASSWORD","RESET_PASSWORD","TOGGLE_ACTIVE","UPDATE_ROLE","UPDATE_STATUS"].some(k => a.includes(k) || a === k))
      return "#fbbf24";
    if (["DELETE","LOGIN_FAILED","REJECT","SHUTDOWN","REVOKE_PERMISSION","CANCEL_PRE_ENROLL","DEACTIVATE"].some(k => a.includes(k) || a === k))
      return "#f87171";
    if (["LOGOUT","LOGOUT","CLEAR_SESSIONS"].includes(a)) return "#64748b";
    if (["BROADCAST","SUBMIT_EVALUATION","BULK_ENROLL","BULK_IMPORT","IMPORT_ENROLLMENTS","ENROLL","ENROLL_SEMESTER"].some(k => a.includes(k) || a === k))
      return "#c084fc";
    return "#a0aec0";
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-6">
      <div
        style={{
          background: "#0a0e14",
          border: "1px solid #1a1f2e",
          borderRadius: 10,
          overflow: "hidden",
          fontFamily: "'Fira Code','Cascadia Code','JetBrains Mono','Meslo LG S',monospace",
          boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
        }}
      >
        {/* title bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 16px",
            background: "#141b24",
            borderBottom: "1px solid #1a1f2e",
            userSelect: "none",
          }}
        >
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f56" }} />
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ffbd2e" }} />
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#27c93f" }} />
          <span style={{ marginLeft: 12, fontSize: 11, color: "#5c6166" }}>audit-trail — tail -f</span>
          <span style={{ marginLeft: "auto", fontSize: 10, color: "#5c6166" }}>
            {filtered.length} line{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* log area */}
        <div style={{ overflow: "auto", maxHeight: "calc(100vh - 240px)", padding: "4px 0" }}>
          {loading ? (
            <div style={{ padding: "12px 16px", color: "#5c6166", fontSize: 12 }}>
              <span style={{ color: "#4ade80" }}>$</span> loading...
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: "12px 16px", color: "#5c6166", fontSize: 12 }}>
              <span style={{ color: "#4ade80" }}>$</span> {filter ? "no matches" : "empty log"}
            </div>
          ) : (
            filtered.map((log) => (
              <div key={log.id} style={{ padding: "2px 16px", fontSize: 12, lineHeight: "20px", display: "flex", gap: 6 }}>
                <span style={{ color: "#4ade80", flexShrink: 0, width: 12 }}>$</span>
                <span style={{ color: "#5c6166", flexShrink: 0 }}>{fmt(log.created_at)}</span>
                <span style={{ color: "#6b7280", flexShrink: 0 }}>{(log.user_name || "system").padEnd(20)}</span>
                <span style={{ color: color(log.action), flexShrink: 0 }}>{log.action}</span>
                {log.table_name && <span style={{ color: "#4b5563" }}>→ {log.table_name}</span>}
                {log.record_id && <span style={{ color: "#374151", fontSize: 10 }}>#{log.record_id.slice(0, 8)}</span>}
                {log.ip_address && <span style={{ color: "#374151", fontSize: 10 }}>[{log.ip_address}]</span>}
                {log.new_data && (() => {
                  try {
                    const d = typeof log.new_data === "string" ? JSON.parse(log.new_data) : log.new_data;
                    const s = JSON.stringify(d);
                    return s !== "{}" ? <span style={{ color: "#374151" }}>{s.slice(0, 60)}{s.length > 60 ? "…" : ""}</span> : null;
                  } catch { return null; }
                })()}
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>

        {/* status bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "6px 16px",
            background: "#141b24",
            borderTop: "1px solid #1a1f2e",
            fontSize: 11,
            color: "#5c6166",
          }}
        >
          <span style={{ color: "#4ade80" }}>$</span>
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="grep"
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#c0c5ce",
              fontFamily: "inherit",
              fontSize: 11,
            }}
          />
          <button
            onClick={() => setPaused((p) => !p)}
            style={{
              background: paused ? "#3b1a1a" : "#0f1f0f",
              border: `1px solid ${paused ? "#5c1a1a" : "#1a3a1a"}`,
              borderRadius: 4,
              color: paused ? "#f87171" : "#4ade80",
              padding: "2px 8px",
              fontSize: 10,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {paused ? "PAUSED" : "LIVE"}
          </button>
          <button
            onClick={() => { setFollow((f) => !f); if (!follow) setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50); }}
            style={{
              background: follow ? "#0f1f0f" : "transparent",
              border: `1px solid ${follow ? "#1a3a1a" : "#1a1f2e"}`,
              borderRadius: 4,
              color: follow ? "#4ade80" : "#5c6166",
              padding: "2px 8px",
              fontSize: 10,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {follow ? "FOLLOW" : "FREE"}
          </button>
          <button
            onClick={load}
            style={{
              background: "transparent",
              border: "1px solid #1a1f2e",
              borderRadius: 4,
              color: "#5c6166",
              padding: "2px 8px",
              fontSize: 10,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            RELOAD
          </button>
        </div>
      </div>
    </div>
  );
}
