import { useState, useEffect } from "react";
import api from "../../services/api";
import SvgIcon from "../common/SvgIcon";

const COLORS = ["#3b82f6", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"];

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

  const polarToCartesian = (cx, cy, r, deg) => ({
    x: cx + r * Math.cos((deg * Math.PI) / 180),
    y: cy + r * Math.sin((deg * Math.PI) / 180),
  });

  const describeArc = (s, e) => {
    if (e - s >= 359.99) return `M${cx - r},${cy}A${r},${r} 0 1,1 ${cx + r - 0.01},${cy}A${r},${r} 0 1,1 ${cx - r},${cy}`;
    const startP = polarToCartesian(cx, cy, r, e);
    const endP = polarToCartesian(cx, cy, r, s);
    const large = e - s > 180 ? 1 : 0;
    return `M${cx},${cy}L${startP.x},${startP.y}A${r},${r} 0 ${large},0 ${endP.x},${endP.y}Z`;
  };

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {slices.map((s, i) => (
        <path key={i} d={describeArc(s.start, s.end)} fill={s.color} opacity="0.85" stroke="white" strokeWidth="1.5" />
      ))}
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
            <text x={x + w / 2} y={height - 14} textAnchor="middle" className="fill-slate-400" fontSize="9">
              {d[labelKey].length > 8 ? d[labelKey].slice(0, 7) + "…" : d[labelKey]}
            </text>
            <text x={x + w / 2} y={y - 6} textAnchor="middle" className="fill-slate-500" fontSize="10" fontWeight="600">
              {d[valueKey]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function DashboardOverview({ broadcast, setBroadcast, onSend, controls, onToggle, onShutdown }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const POLL_INTERVAL = 30000;

  const fetchData = () => {
    api.get("/api/admin/overview")
      .then((res) => { setData(res.data); setError(""); })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, POLL_INTERVAL);
    return () => clearInterval(id);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="animate-pulse rounded-2xl bg-white/80 p-6 shadow-sm h-32" />
        ))}
      </div>
    );
  }

  if (error || !data) {
    return <div className="text-red-500 text-sm">Failed to load dashboard data</div>;
  }

  const d = data;
  const statusMap = {
    PENDING: { label: "Pending", color: "#f59e0b" },
    FOR_ENROLLMENT: { label: "For Enrollment", color: "#3b82f6" },
    ENROLLED: { label: "Enrolled", color: "#10b981" },
    REJECTED: { label: "Rejected", color: "#ef4444" },
    IRREGULAR: { label: "Irregular", color: "#8b5cf6" },
    IRREGULAR_ENROLLED: { label: "Irreg Enrolled", color: "#14b8a6" },
  };

  const nonPending = d.statusDistribution.filter((s) => s.status !== "PENDING");
  const statusChartData = (nonPending.length > 0 ? nonPending : d.statusDistribution)
    .map((s) => ({ ...s, label: statusMap[s.status]?.label || s.status }));

  const quickCards = [
    {
      label: "Pending Users",
      value: d.pendingUsersCount,
      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
      accent: "from-amber-500 to-orange-400",
      action: () => document.querySelector('[data-tab="users"]')?.click(),
    },
    {
      label: "For Enrollment",
      value: d.forEnrollmentCount,
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      accent: "from-blue-500 to-cyan-400",
    },
    {
      label: "Enrolled",
      value: d.enrolledCount,
      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
      accent: "from-emerald-500 to-green-400",
    },
    {
      label: "Moderators",
      value: d.moderatorCount,
      icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
      accent: "from-violet-500 to-purple-400",
    },
  ];

  const activityIcons = {
    LOGIN: "M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1",
    CREATE: "M12 4v16m8-8H4",
    UPDATE: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
    DELETE: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
    BROADCAST: "M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z",
  };

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
        {quickCards.map((card) => (
          <div
            key={card.label}
            onClick={card.action}
            className={`group relative overflow-hidden rounded-3xl border border-white/70 bg-white/90 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${card.action ? "cursor-pointer" : ""}`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br opacity-[0.04] ${card.accent}`} />
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">{card.label}</p>
                <h3 className="mt-3 text-3xl font-black text-slate-900">{card.value}</h3>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg ${card.accent}`}>
                <SvgIcon path={card.icon} className="w-5 h-5" />
              </div>
            </div>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 rounded-3xl border border-white/70 bg-white/90 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Students per Course</h4>
            <span className="text-[11px] text-slate-400">{d.studentsPerCourse.length} courses</span>
          </div>
          {d.studentsPerCourse.length > 0 ? (
            <BarChart data={d.studentsPerCourse} labelKey="course" valueKey="count" />
          ) : (
            <p className="text-slate-400 text-sm py-8 text-center">No course data</p>
          )}
        </div>

        <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Status Breakdown</h4>
            <span className="text-[11px] text-slate-400">{d.statusDistribution.length} statuses</span>
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
        <div className="xl:col-span-2 rounded-3xl border border-white/70 bg-white/90 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Monthly Requests (12mo)</h4>
            <span className="text-[11px] text-slate-400">{d.monthlyRequests.length} months</span>
          </div>
          {d.monthlyRequests.length > 0 ? (
            <BarChart data={d.monthlyRequests} labelKey="month" valueKey="count" />
          ) : (
            <p className="text-slate-400 text-sm py-8 text-center">No request data yet</p>
          )}
        </div>

        <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Quick Actions</h4>
            <span className="text-[11px] text-slate-400">controls</span>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1.5 block">Broadcast Message</label>
              <div className="flex gap-2">
                <input
                  value={broadcast}
                  onChange={(e) => setBroadcast(e.target.value)}
                  placeholder="Type a message…"
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                <button
                  onClick={onSend}
                  disabled={!broadcast.trim()}
                  className="rounded-xl bg-blue-600 px-3 py-2 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-40 transition"
                >
                  Send
                </button>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3">
              {controls.map((ctl) => (
                <div key={ctl.label} className="flex items-center justify-between py-2">
                  <span className="text-sm text-slate-600">{ctl.label}</span>
                  <button
                    onClick={() => onToggle(ctl.label, ctl.state)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${ctl.state === "Enabled" ? "bg-emerald-400" : "bg-slate-300"}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${ctl.state === "Enabled" ? "translate-x-6" : "translate-x-1"}`} />
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-3">
              <button
                onClick={onShutdown}
                className="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-100 transition"
              >
                <div className="flex items-center justify-center gap-2">
                  <SvgIcon path="M13 10V3L4 14h7v7l9-11h-7z" className="w-4 h-4" />
                  Emergency Shutdown
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Recent Activity</h4>
          <span className="text-[11px] text-slate-400">live</span>
        </div>
        {d.recentActivity.length > 0 ? (
          <div className="space-y-0">
            {d.recentActivity.map((act, i) => {
              const iconPath = activityIcons[act.action] || activityIcons.UPDATE;
              return (
                <div key={i} className="flex items-start gap-4 py-3 border-b border-slate-50 last:border-0">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                    act.action === "LOGIN" ? "bg-blue-100 text-blue-600" :
                    act.action === "CREATE" ? "bg-emerald-100 text-emerald-600" :
                    act.action === "DELETE" ? "bg-red-100 text-red-600" :
                    "bg-slate-100 text-slate-500"
                  }`}>
                    <SvgIcon path={iconPath} className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700">
                      <span className="font-medium">{act.user}</span>
                      <span className="text-slate-400"> {act.action.toLowerCase()} </span>
                      {act.table && <span className="text-slate-500">in <span className="font-mono text-xs">{act.table}</span></span>}
                    </p>
                  </div>
                  <span className="text-[11px] text-slate-400 whitespace-nowrap">{formatTime(act.time)}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-slate-400 text-sm py-6 text-center">No recent activity</p>
        )}
      </div>
    </div>
  );
}
