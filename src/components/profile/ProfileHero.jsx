import { toPHDate } from "../../utils/date";
import {
  Edit3,
  Mail,
  CalendarDays,
  ShieldCheck,
} from "lucide-react";

const roleStyles = {
  superadmin: {
    badge:
      "bg-rose-50 text-rose-700 border-rose-200",
    glow:
      "from-rose-600 via-pink-500 to-fuchsia-500",
  },

  admin: {
    badge:
      "bg-indigo-50 text-indigo-700 border-indigo-200",
    glow:
      "from-indigo-600 via-violet-500 to-purple-500",
  },

  evaluator: {
    badge:
      "bg-cyan-50 text-cyan-700 border-cyan-200",
    glow:
      "from-cyan-600 via-blue-500 to-indigo-500",
  },
};

export default function ProfileHero({
  user,
  editing,
  onEdit,
}) {
  const roleStyle =
    roleStyles[user?.role] ||
    roleStyles.evaluator;

  return (
    <section className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
      {/* Background Glow */}
      <div
        className={`absolute inset-0 bg-gradient-to-br opacity-[0.06] ${roleStyle.glow}`}
      />

      {/* Decorative Blur */}
      <div
        className={`absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br blur-3xl opacity-20 ${roleStyle.glow}`}
      />

      <div className="relative z-10 p-6 md:p-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          {/* Left Side */}
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            {/* Avatar */}
            <div className="relative">
              <div
                className={`flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br ${roleStyle.glow} text-4xl font-black text-white shadow-2xl`}
              >
                {user?.full_name
                  ?.charAt(0)
                  ?.toUpperCase() || "U"}
              </div>

              {/* Online Indicator */}
              <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-4 border-white bg-emerald-500">
                <div className="h-2.5 w-2.5 rounded-full bg-white" />
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1">
              {/* Name + Role */}
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                  {user?.full_name || "User"}
                </h1>

                <span
                  className={`rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] ${roleStyle.badge}`}
                >
                  {user?.role || "Evaluator"}
                </span>
              </div>

              {/* Email */}
              <div className="mt-3 flex items-center gap-2 text-slate-500">
                <Mail size={16} />

                <p className="text-sm font-medium">
                  {user?.email}
                </p>
              </div>

              {/* Stats */}
              <div className="mt-6 flex flex-wrap gap-4">
                {/* Member Since */}
                <div className="min-w-[170px] rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-slate-400">
                    <CalendarDays size={14} />

                    <p className="text-[10px] font-bold uppercase tracking-[0.18em]">
                      Member Since
                    </p>
                  </div>

                  <p className="mt-2 text-sm font-semibold text-slate-700">
                    {user?.created_at
                      ? toPHDate(user.created_at)
                      : "—"}
                  </p>
                </div>

                {/* Status */}
                <div className="min-w-[170px] rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-slate-400">
                    <ShieldCheck size={14} />

                    <p className="text-[10px] font-bold uppercase tracking-[0.18em]">
                      Account Status
                    </p>
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />

                    <span className="text-sm font-semibold text-emerald-600">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Button */}
          {!editing && (
            <button
              onClick={onEdit}
              className="group inline-flex h-12 items-center justify-center gap-2 self-start rounded-2xl bg-slate-900 px-5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-xl active:translate-y-0"
            >
              <Edit3
                size={16}
                className="transition-transform duration-200 group-hover:rotate-6"
              />

              Edit Profile
            </button>
          )}
        </div>
      </div>
    </section>
  );
}