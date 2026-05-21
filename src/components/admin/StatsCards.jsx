import { Users, Monitor, Clock, BarChart3 } from "lucide-react";

const STAT_META = [
  { key: "users", label: "Total Users", icon: Users, color: "text-primary-600 bg-primary-50" },
  { key: "staffOnline", label: "Staff Online", icon: Monitor, color: "text-indigo-600 bg-indigo-50" },
  { key: "pendingRequests", label: "Pending Requests", icon: Clock, color: "text-amber-600 bg-amber-50" },
  { key: "systemLoad", label: "System Load", icon: BarChart3, color: "text-emerald-600 bg-emerald-50" },
];

export default function StatsCards({ stats }) {
  const items = stats ? STAT_META.map((s) => ({ ...s, value: stats[s.key] ?? "\u2014" })) : [];
  return (
    <section className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {items.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.key} className="card p-4 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${stat.color}`}>
              <Icon size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
            </div>
          </div>
        );
      })}
    </section>
  );
}
