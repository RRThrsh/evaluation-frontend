import { Edit3 } from "lucide-react";

const roleStyles = {
  superadmin: { badge: "bg-rose-50 text-rose-700 border-rose-200", glow: "from-rose-600 to-pink-500" },
  admin: { badge: "bg-indigo-50 text-indigo-700 border-indigo-200", glow: "from-indigo-600 to-violet-500" },
  evaluator: { badge: "bg-primary-50 text-primary-700 border-primary-200", glow: "from-primary-600 to-indigo-500" },
};

export default function ProfileHero({ user, editing, onEdit }) {
  const roleStyle = roleStyles[user?.role] || roleStyles.evaluator;

  return (
    <section className="card p-6 md:p-8">
      <div className={`absolute inset-0 bg-gradient-to-br opacity-[0.04] ${roleStyle.glow} rounded-xl pointer-events-none`} />
      <div className="relative flex flex-col gap-6 md:flex-row md:items-center">
        <div className={`flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${roleStyle.glow} text-3xl font-black text-white shadow-lg`}>
          {user?.full_name?.charAt(0)?.toUpperCase() || "U"}
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{user?.full_name || "User"}</h1>
            <span className={`rounded-full border px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider ${roleStyle.badge}`}>{user?.role || "evaluator"}</span>
          </div>
          <p className="mt-1 text-sm text-slate-500">{user?.email}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2">
              <p className="text-[9px] uppercase tracking-widest text-slate-400">Member Since</p>
              <p className="mt-0.5 text-sm font-semibold text-slate-700">{user?.created_at ? new Date(user.created_at).toLocaleDateString() : "\u2014"}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2">
              <p className="text-[9px] uppercase tracking-widest text-slate-400">Account Status</p>
              <div className="mt-0.5 flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Active
              </div>
            </div>
          </div>
        </div>
        {!editing && (
          <button onClick={onEdit} className="btn btn-primary btn-md self-start">
            <Edit3 size={14} />
            Edit Profile
          </button>
        )}
      </div>
    </section>
  );
}
