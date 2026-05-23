import {
  ClipboardCheck,
  Clock,
  Activity,
  Sparkles,
} from "lucide-react";

export default function ProfileActivity({ user }) {
  const role = user?.role || "evaluator";

  const stats =
    role === "admin"
      ? [
          {
            icon: ClipboardCheck,
            label: "Pending Reviews",
            value: "—",
            color:
              "from-amber-500 to-orange-500",
            bg:
              "bg-amber-50",
          },
          {
            icon: Activity,
            label: "Active Evaluators",
            value: "—",
            color:
              "from-blue-500 to-cyan-500",
            bg:
              "bg-blue-50",
          },
          {
            icon: Clock,
            label: "System Uptime",
            value: "—",
            color:
              "from-emerald-500 to-green-500",
            bg:
              "bg-emerald-50",
          },
        ]
      : [
          {
            icon: ClipboardCheck,
            label: "Evaluations This Term",
            value: "—",
            color:
              "from-violet-500 to-indigo-500",
            bg:
              "bg-violet-50",
          },
          {
            icon: Activity,
            label: "Students Reviewed",
            value: "—",
            color:
              "from-blue-500 to-cyan-500",
            bg:
              "bg-blue-50",
          },
          {
            icon: Clock,
            label: "Last Activity",
            value: "—",
            color:
              "from-slate-500 to-slate-700",
            bg:
              "bg-slate-100",
          },
        ];

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Activity Overview
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Your recent activity and statistics.
          </p>
        </div>

        <div className="hidden sm:flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-lg">
          <Sparkles size={18} />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl"
          >
            {/* Background Glow */}
            <div
              className={`absolute right-0 top-0 h-24 w-24 rounded-full bg-gradient-to-br ${stat.color} opacity-10 blur-2xl transition-opacity duration-300 group-hover:opacity-20`}
            />

            <div className="relative z-10 flex items-start justify-between">
              {/* Left */}
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  {stat.label}
                </p>

                <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                  {stat.value}
                </h3>
              </div>

              {/* Icon */}
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}
              >
                <stat.icon size={24} />
              </div>
            </div>

            {/* Bottom Accent */}
            <div className="mt-6 h-1 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full w-2/3 rounded-full bg-gradient-to-r ${stat.color}`}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}