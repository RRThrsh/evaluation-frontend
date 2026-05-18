import SvgIcon from "../common/SvgIcon";

const roleStyles = {
  admin: { badge: "bg-purple-500/10 text-purple-700 border-purple-200", glow: "from-purple-600 to-fuchsia-500" },
  moderator: { badge: "bg-blue-500/10 text-blue-700 border-blue-200", glow: "from-blue-600 to-cyan-500" },
  staff: { badge: "bg-emerald-500/10 text-emerald-700 border-emerald-200", glow: "from-emerald-600 to-green-500" },
  user: { badge: "bg-slate-100 text-slate-600 border-slate-200", glow: "from-slate-700 to-slate-500" },
};

export default function ProfileHero({ user, editing, onEdit }) {
  const roleStyle = roleStyles[user?.role] || roleStyles.user;

  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/50 bg-white/80 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-xl md:p-8">
      <div className={`absolute inset-0 bg-gradient-to-br opacity-[0.06] ${roleStyle.glow}`} />
      <div className="relative flex flex-col gap-6 md:flex-row md:items-center">
        <div className={`flex h-24 w-24 items-center justify-center rounded-[28px] bg-gradient-to-br ${roleStyle.glow} text-4xl font-black text-white shadow-xl`}>
          {user?.full_name?.charAt(0)?.toUpperCase() || "U"}
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-black tracking-tight text-slate-900">{user?.full_name || "User"}</h1>
            <span className={`rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] ${roleStyle.badge}`}>{user?.role || "user"}</span>
          </div>
          <p className="mt-2 text-slate-500">{user?.email}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <p className="text-[10px] uppercase tracking-widest text-slate-400">Member Since</p>
              <p className="mt-1 text-sm font-semibold text-slate-700">{user?.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <p className="text-[10px] uppercase tracking-widest text-slate-400">Account Status</p>
              <div className="mt-1 flex items-center gap-2 text-sm font-semibold text-emerald-600">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Active
              </div>
            </div>
          </div>
        </div>
        {!editing && (
          <button onClick={onEdit}
            className="group inline-flex items-center gap-2 self-start rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:scale-[1.02] hover:bg-slate-800 active:scale-[0.98]">
            <SvgIcon path="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5" />
            Edit Profile
          </button>
        )}
      </div>
    </section>
  );
}
