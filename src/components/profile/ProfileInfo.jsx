import SvgIcon from "../common/SvgIcon";

export default function ProfileInfo({ user, editing, saving, editError, form, setForm, onSave, onCancel }) {
  return (
    <section className="rounded-[28px] border border-white/50 bg-white/80 p-6 shadow-lg shadow-slate-200/50 backdrop-blur-xl md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Account Information</h2>
          <p className="mt-1 text-sm text-slate-500">Manage your profile details</p>
        </div>
      </div>

      {editError && (
        <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          <SvgIcon path="M12 9v2m0 4h.01" />
          {editError}
        </div>
      )}

      {editing ? (
        <form onSubmit={onSave} className="space-y-5">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-400">Full Name</label>
            <input type="text" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10" />
          </div>
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-400">Email Address</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10" />
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            <button type="submit" disabled={saving}
              className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] disabled:opacity-50">
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button type="button" onClick={onCancel}
              className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50">Cancel</button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <InfoCard label="Full Name" value={user?.full_name || "—"} />
          <InfoCard label="Email" value={user?.email || "—"} />
          <InfoCard label="Role" value={user?.role || "—"} />
          <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">User ID</p>
            <button onClick={() => { navigator.clipboard.writeText(user?.id); }}
              className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-blue-600">
              <span className="font-mono">{user?.id ? `${user.id.slice(0, 8)}...` : "—"}</span>
              <SvgIcon path="M8 16H6a2 2 0 01-2-2V6" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <p className="mt-2 text-sm font-semibold text-slate-700">{value}</p>
    </div>
  );
}
