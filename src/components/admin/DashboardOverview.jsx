import { useState, useEffect } from "react";
import { Send, Power, AlertTriangle, Users, ClipboardCheck, CheckCircle, BookOpen } from "lucide-react";
import api from "../../services/api";

const COLORS = ["#4f46e5", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"];

function DonutChart({ data, size = 180 }) {
  const cx = size / 2, cy = size / 2, r = size * 0.35, sw = size * 0.12;
  const total = data.reduce((s, d) => s + d.count, 0) || 1;
  let angle = -90;
  const slices = data.map((d) => {
    const pct = d.count / total;
    const a = pct * 360;
    const start = angle;
    angle += a;
    return { ...d, pct, start, end: angle, color: COLORS[data.indexOf(d) % COLORS.length] };
  });
  const polarToCartesian = (cx, cy, r, deg) => ({ x: cx + r * Math.cos((deg * Math.PI) / 180), y: cy + r * Math.sin((deg * Math.PI) / 180) });
  const describeArc = (s, e) => {
    if (e - s >= 359.99) return `M${cx - r},${cy}A${r},${r} 0 1,1 ${cx + r - 0.01},${cy}A${r},${r} 0 1,1 ${cx - r},${cy}`;
    const startP = polarToCartesian(cx, cy, r, e);
    const endP = polarToCartesian(cx, cy, r, s);
    const large = e - s > 180 ? 1 : 0;
    return `M${cx},${cy}L${startP.x},${startP.y}A${r},${r} 0 ${large},0 ${endP.x},${endP.y}Z`;
  };
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {slices.map((s, i) => (<path key={i} d={describeArc(s.start, s.end)} fill={s.color} opacity="0.85" stroke="white" strokeWidth="1.5" />))}
      <circle cx={cx} cy={cy} r={r - sw} fill="white" />
      <text x={cx} y={cy - 6} textAnchor="middle" className="fill-slate-700 text-xs font-bold" fontSize="14">{total}</text>
      <text x={cx} y={cy + 10} textAnchor="middle" className="fill-slate-400" fontSize="10">Total</text>
    </svg>
  );
}

function BarChart({ data, labelKey, valueKey, height = 200 }) {
  const max = Math.max(...data.map((d) => d[valueKey]), 1);
  const w = Math.max(30, Math.min(60, 400 / data.length));
  const pad = 30;
  const chartW = data.length * (w + 8) + pad;
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${Math.max(chartW, 400)} ${height}`} preserveAspectRatio="xMidYMid meet">
      <line x1={pad} y1={height - 30} x2={chartW} y2={height - 30} stroke="#e2e8f0" />
      {data.map((d, i) => {
        const barH = (d[valueKey] / max) * (height - 60);
        const x = pad + i * (w + 8);
        const y = height - 30 - barH;
        return (
          <g key={i}>
            <rect x={x} y={y} width={w} height={barH} rx="4" fill={COLORS[i % COLORS.length]} opacity="0.8">
              <title>{d[labelKey]}: {d[valueKey]}</title>
            </rect>
            <text x={x + w / 2} y={height - 14} textAnchor="middle" className="fill-slate-400" fontSize="9">{d[labelKey].length > 8 ? d[labelKey].slice(0, 7) + "\u2026" : d[labelKey]}</text>
            <text x={x + w / 2} y={y - 6} textAnchor="middle" className="fill-slate-500" fontSize="10" fontWeight="600">{d[valueKey]}</text>
          </g>
        );
      })}
    </svg>
  );
}

const activityIcons = {
  LOGIN: "M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1",
  CREATE: "M12 4v16m8-8H4",
  UPDATE: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
  DELETE: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
  BROADCAST: "M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z",
};

export default function DashboardOverview({ broadcast, setBroadcast, onSend, controls, onToggle, onShutdown }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = () => {
    api.get("/api/admin/overview")
      .then((res) => { setData(res.data); setError(""); })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); const id = setInterval(fetchData, 30000); return () => clearInterval(id); }, []);

  if (loading) return <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="animate-pulse card p-6 h-32" />)}</div>;
  if (error || !data) return <div className="text-red-500 text-sm">Failed to load dashboard data</div>;

  const d = data;
  const statusMap = {
    PENDING: { label: "Pending", color: "#f59e0b" },
    FOR_ENROLLMENT: { label: "For Enrollment", color: "#4f46e5" },
    ENROLLED: { label: "Enrolled", color: "#10b981" },
    REJECTED: { label: "Rejected", color: "#ef4444" },
    IRREGULAR: { label: "Flagged", color: "#8b5cf6" },
    IRREGULAR_ENROLLED: { label: "Flagged Enrolled", color: "#14b8a6" },
  };

  const nonPending = d.statusDistribution.filter((s) => s.status !== "PENDING");
  const statusChartData = (nonPending.length > 0 ? nonPending : d.statusDistribution).map((s) => ({ ...s, label: statusMap[s.status]?.label || s.status }));

  const quickCards = [
    { label: "Pending Approvals", value: d.pendingUsersCount, icon: Users, color: "text-amber-600 bg-amber-50", action: () => document.querySelector('[data-tab="users"]')?.click() },
    { label: "For Enrollment", value: d.forEnrollmentCount, icon: ClipboardCheck, color: "text-primary-600 bg-primary-50" },
    { label: "Enrolled", value: d.enrolledCount, icon: CheckCircle, color: "text-emerald-600 bg-emerald-50" },
    { label: "Evaluators", value: d.evaluatorCount, icon: BookOpen, color: "text-indigo-600 bg-indigo-50" },
  ];

  const formatTime = (t) => {
    const d = new Date(t);
    const now = new Date();
    const diff = now - d;
    if (diff < 60000) return "just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return d.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {quickCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} onClick={card.action} className={`card p-4 flex items-center gap-4 ${card.action ? "cursor-pointer card-hover" : ""}`}>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${card.color}`}>
                <Icon size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">{card.label}</p>
                <h3 className="text-2xl font-bold text-slate-900">{card.value}</h3>
              </div>
            </div>
          );
        })}
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Students per Program</h4>
            <span className="text-xs text-slate-400">{d.studentsPerCourse.length} programs</span>
          </div>
          {d.studentsPerCourse.length > 0 ? <BarChart data={d.studentsPerCourse} labelKey="course" valueKey="count" /> : <p className="text-slate-400 text-sm py-8 text-center">No course data</p>}
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Status Breakdown</h4>
            <span className="text-xs text-slate-400">{d.statusDistribution.length} statuses</span>
          </div>
          <div className="flex flex-col items-center">
            <DonutChart data={statusChartData} />
            <div className="mt-4 w-full space-y-1.5">
              {statusChartData.map((s, i) => (
                <div key={s.status} className="flex items-center justify-between text-xs px-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-slate-500">{s.label}</span>
                  </div>
                  <span className="font-semibold text-slate-700">{s.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Monthly Requests (12mo)</h4>
            <span className="text-xs text-slate-400">{d.monthlyRequests.length} months</span>
          </div>
          {d.monthlyRequests.length > 0 ? <BarChart data={d.monthlyRequests} labelKey="month" valueKey="count" /> : <p className="text-slate-400 text-sm py-8 text-center">No request data yet</p>}
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Quick Controls</h4>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1.5 block">Broadcast Message</label>
              <div className="flex gap-2">
                <input value={broadcast} onChange={(e) => setBroadcast(e.target.value)} placeholder="Type a message\u2026" className="input-field flex-1" />
                <button onClick={onSend} disabled={!broadcast.trim()} className="btn btn-primary btn-sm flex items-center gap-1">
                  <Send size={14} /> Send
                </button>
              </div>
            </div>
            <div className="border-t border-slate-100 pt-3">
              {controls.map((ctl) => (
                <div key={ctl.label} className="flex items-center justify-between py-2">
                  <span className="text-sm text-slate-600">{ctl.label}</span>
                  <button onClick={() => onToggle(ctl.key, ctl.state)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${ctl.state === "Enabled" ? "bg-emerald-400" : "bg-slate-300"}`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${ctl.state === "Enabled" ? "translate-x-6" : "translate-x-1"}`} />
                  </button>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-100 pt-3">
              <button onClick={onShutdown} className="w-full rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 transition flex items-center justify-center gap-2">
                <Power size={14} />
                Emergency Shutdown
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Recent Activity</h4>
          <span className="text-xs text-slate-400">live</span>
        </div>
        {d.recentActivity.length > 0 ? (
          <div className="space-y-0">
            {d.recentActivity.map((act, i) => {
              const iconPath = activityIcons[act.action] || activityIcons.UPDATE;
              return (
                <div key={i} className="flex items-start gap-3 py-3 border-b border-slate-50 last:border-0">
                  <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                    act.action === "LOGIN" ? "bg-blue-100 text-blue-600" :
                    act.action === "CREATE" ? "bg-emerald-100 text-emerald-600" :
                    act.action === "DELETE" ? "bg-red-100 text-red-600" :
                    "bg-slate-100 text-slate-500"
                  }`}>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={iconPath} /></svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700">
                      <span className="font-medium">{act.user}</span>
                      <span className="text-slate-400"> {act.action.toLowerCase()} </span>
                      {act.table && <span className="text-slate-500">in <span className="font-mono text-xs">{act.table}</span></span>}
                    </p>
                  </div>
                  <span className="text-xs text-slate-400 whitespace-nowrap">{formatTime(act.time)}</span>
                </div>
              );
            })}
          </div>
        ) : <p className="text-slate-400 text-sm py-6 text-center">No recent activity</p>}
      </div>
    </div>
  );
}
