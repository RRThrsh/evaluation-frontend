import SvgIcon from "../common/SvgIcon";

const STAT_META = [
  { key: "users", label: "Total Users", accent: "from-blue-500 to-cyan-400", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" },
  { key: "staffOnline", label: "Staff Online", accent: "from-indigo-500 to-violet-400", icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
  { key: "pendingRequests", label: "Pending Requests", accent: "from-amber-500 to-orange-400", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
  { key: "systemLoad", label: "System Load", accent: "from-emerald-500 to-green-400", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
];

export default function StatsCards({ stats }) {
  const items = stats ? STAT_META.map((s) => ({ ...s, value: stats[s.key] ?? "—" })) : [];
  return (
    <section className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {items.map((stat) => (
        <div key={stat.key} className="group relative overflow-hidden rounded-3xl border border-white/70 bg-white/90 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
          <div className={`absolute inset-0 bg-gradient-to-br opacity-[0.04] ${stat.accent}`} />
          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>
              <h3 className="mt-3 text-3xl font-black text-slate-900">{stat.value}</h3>
            </div>
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg ${stat.accent}`}>
              <SvgIcon path={stat.icon} className="w-5 h-5" />
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
