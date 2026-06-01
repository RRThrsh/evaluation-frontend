import { useState, useEffect } from "react";
import { Users, GraduationCap, Monitor, Clock, UserCheck, ClipboardCheck, ClipboardList, BookOpen, BookText, BarChart3 } from "lucide-react";
import api from "../../services/api";
import { toPHDate } from "../../utils/date";

const COLORS = ["#4f46e5", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"];

function BarChart({ data, labelKey, valueKey, height = 180 }) {
  const max = Math.max(...data.map((d) => d[valueKey]), 1);
  const w = Math.max(24, Math.min(50, 350 / data.length));
  const pad = 28;
  const chartW = data.length * (w + 6) + pad;
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${Math.max(chartW, 350)} ${height}`} preserveAspectRatio="xMidYMid meet">
      <line x1={pad} y1={height - 26} x2={chartW} y2={height - 26} stroke="#e2e8f0" />
      {data.map((d, i) => {
        const barH = (d[valueKey] / max) * (height - 52);
        const x = pad + i * (w + 6);
        const y = height - 26 - barH;
        return (
          <g key={i}>
            <rect x={x} y={y} width={w} height={barH} rx="3" fill={COLORS[i % COLORS.length]} opacity="0.8">
              <title>{d[labelKey]}: {d[valueKey]}</title>
            </rect>
            <text x={x + w / 2} y={height - 10} textAnchor="middle" className="fill-slate-400" fontSize="8">{d[labelKey].length > 7 ? d[labelKey].slice(0, 6) + "\u2026" : d[labelKey]}</text>
            <text x={x + w / 2} y={y - 4} textAnchor="middle" className="fill-slate-500" fontSize="9" fontWeight="600">{d[valueKey]}</text>
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
};

const formatTime = (t) => {
  const d = new Date(t);
  const now = new Date();
  const diff = now - d;
  if (diff < 60000) return "just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return toPHDate(d);
};

export default function DashboardOverview({ onNavigate }) {
  const [stats, setStats] = useState(null);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    Promise.all([
      api.get("/api/admin/stats"),
      api.get(`/api/admin/overview?_t=${Date.now()}`),
    ])
      .then(([s, o]) => { setStats(s.data); setOverview(o.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); const id = setInterval(fetchData, 30000); return () => clearInterval(id); }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="animate-pulse card p-5 h-24" />)}
        </div>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="animate-pulse card p-5 h-24" />)}
        </div>
      </div>
    );
  }

  const s = stats || {};
  const d = overview || {};

  const topCards = [
    { key: "users", label: "Total Users", value: s.users ?? "\u2014", icon: Users, color: "text-indigo-600 bg-indigo-50" },
    { key: "students", label: "Students", value: s.students ?? d.studentCount ?? "\u2014", icon: GraduationCap, color: "text-emerald-600 bg-emerald-50" },
    { key: "subjects", label: "Subjects", value: s.subjects ?? "\u2014", icon: BookText, color: "text-violet-600 bg-violet-50" },
    { key: "online", label: "Online Now", value: s.online ?? "\u2014", icon: Monitor, color: "text-sky-600 bg-sky-50" },
    { key: "pending", label: "Pending Requests", value: s.pendingRequests ?? "\u2014", icon: Clock, color: "text-amber-600 bg-amber-50" },
  ];

  const middleCards = [
    { key: "users", label: "Pending Approvals", value: d.pendingUsersCount ?? 0, icon: UserCheck, color: "text-amber-600 bg-amber-50" },
    { key: "undecided", label: "Undecided", value: d.pendingEvalCount ?? 0, icon: ClipboardCheck, color: "text-primary-600 bg-primary-50" },
    { key: "pre-enrolled", label: "Pre-Enrolled", value: d.forEnrollmentCount ?? 0, icon: ClipboardList, color: "text-blue-600 bg-blue-50" },
    { key: "enrolled", label: "Enrolled", value: d.enrolledCount ?? 0, icon: BookOpen, color: "text-emerald-600 bg-emerald-50" },
  ];

  return (
    <div className="space-y-6">

      {/* ROW 1: System Stats */}
      <section className="grid grid-cols-2 xl:grid-cols-5 gap-4">
        {topCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.key} className="card p-4 flex items-center gap-4">
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

      {/* ROW 2: Quick Actions */}
      <section className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {middleCards.map((card) => {
          const Icon = card.icon;
          return (
            <div className="card p-4 flex items-center gap-4">
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

      {/* ROW 3: Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Students per Program</h4>
            <span className="text-[10px] text-slate-400">{d.studentsPerCourse?.length ?? 0} programs</span>
          </div>
          {d.studentsPerCourse?.length > 0
            ? <BarChart data={d.studentsPerCourse} labelKey="course" valueKey="count" />
            : <p className="text-slate-400 text-xs py-6 text-center">No course data</p>}
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Status Overview</h4>
            <BarChart3 size={14} className="text-slate-400" />
          </div>
          <div className="space-y-2">
            {(d.statusDistribution ?? []).map((s, i) => {
              const total = d.statusDistribution.reduce((a, b) => a + b.count, 0) || 1;
              const pct = Math.round((s.count / total) * 100);
              return (
                <div key={s.status} className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-xs text-slate-500 flex-1">{s.status}</span>
                  <span className="text-xs font-semibold text-slate-700">{s.count}</span>
                  <span className="text-[10px] text-slate-400 w-8 text-right">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ROW 4: Monthly Requests & Recent Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Monthly Requests (12mo)</h4>
            <span className="text-[10px] text-slate-400">{d.monthlyRequests?.length ?? 0} months</span>
          </div>
          {d.monthlyRequests?.length > 0
            ? <BarChart data={d.monthlyRequests} labelKey="month" valueKey="count" />
            : <p className="text-slate-400 text-xs py-6 text-center">No request data</p>}
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Recent Activity</h4>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          {d.recentActivity?.length > 0 ? (
            <div className="space-y-0">
              {d.recentActivity.slice(0, 6).map((act, i) => {
                const iconPath = activityIcons[act.action] || activityIcons.UPDATE;
                return (
                  <div key={i} className="flex items-start gap-2.5 py-2 border-b border-slate-50 last:border-0">
                    <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${
                      act.action === "LOGIN" ? "bg-blue-100 text-blue-600" :
                      act.action === "CREATE" ? "bg-emerald-100 text-emerald-600" :
                      act.action === "DELETE" ? "bg-red-100 text-red-600" :
                      "bg-slate-100 text-slate-500"
                    }`}>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={iconPath} /></svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-700">
                        <span className="font-medium">{act.user}</span>
                        <span className="text-slate-400"> {act.action.toLowerCase()}</span>
                        {act.table && <span className="text-slate-500"> in <span className="font-mono text-[10px]">{act.table}</span></span>}
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">{formatTime(act.time)}</span>
                  </div>
                );
              })}
            </div>
          ) : <p className="text-slate-400 text-xs py-6 text-center">No recent activity</p>}
          {d.recentActivity?.length > 6 && (
            <div className="text-center pt-2">
              <span className="text-[10px] text-slate-400">+{d.recentActivity.length - 6} more</span>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
