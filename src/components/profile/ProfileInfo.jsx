import { AlertCircle, Copy } from "lucide-react";

export default function ProfileInfo({ user, editing, saving, editError, form, setForm, onSave, onCancel }) {
  return (
    <section className="card p-6 md:p-8">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-900">Account Information</h2>
        <p className="mt-1 text-sm text-slate-500">Manage your profile details</p>
      </div>

      {editError && (
        <div className="mb-5 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          {editError}
        </div>
      )}

      {editing ? (
        <form onSubmit={onSave} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-500">Full Name</label>
            <input type="text" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-500">Email Address</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="submit" disabled={saving} className="btn btn-primary btn-md">
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button type="button" onClick={onCancel} className="btn btn-secondary btn-md">Cancel</button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InfoCard label="Full Name" value={user?.full_name || "\u2014"} />
          <InfoCard label="Email" value={user?.email || "\u2014"} />
          <InfoCard label="Role" value={user?.role || "\u2014"} />
          <div className="rounded-lg border border-slate-100 bg-slate-50/70 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">User ID</p>
            <button onClick={() => { navigator.clipboard.writeText(user?.id); }} className="mt-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-primary-600 transition">
              <span className="font-mono">{user?.id ? `${user.id.slice(0, 8)}...` : "\u2014"}</span>
              <Copy size={12} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50/70 p-4">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-700">{value}</p>
    </div>
  );
}
