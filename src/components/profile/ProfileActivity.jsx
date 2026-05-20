import { ClipboardCheck, Clock, Activity } from "lucide-react";

export default function ProfileActivity({ user }) {
  const role = user?.role || "evaluator";

  const stats = role === "admin"
    ? [
        { icon: ClipboardCheck, label: "Pending Reviews", value: "—", color: "text-amber-600 bg-amber-50" },
        { icon: Activity, label: "Active Evaluators", value: "—", color: "text-blue-600 bg-blue-50" },
        { icon: Clock, label: "System Uptime", value: "—", color: "text-emerald-600 bg-emerald-50" },
      ]
    : [
        { icon: ClipboardCheck, label: "Evaluations This Term", value: "—", color: "text-primary-600 bg-primary-50" },
        { icon: Activity, label: "Students Reviewed", value: "—", color: "text-blue-600 bg-blue-50" },
        { icon: Clock, label: "Last Activity", value: "—", color: "text-slate-600 bg-slate-100" },
      ];

  return (
    <section className="card p-6 md:p-8">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-900">Activity Overview</h2>
        <p className="mt-1 text-sm text-slate-500">Your recent activity and statistics</p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {stats.map((stat, i) => (
          <div key={i} className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50/70 p-4">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}>
              <stat.icon size={18} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{stat.label}</p>
              <p className="mt-0.5 text-sm font-semibold text-slate-700">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
