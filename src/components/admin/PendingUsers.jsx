import SvgIcon from "../common/SvgIcon";

export default function PendingUsers({ users, loading, onApprove, onReject }) {
  return (
    <div className="rounded-3xl border border-white/70 bg-white/90 shadow-sm p-6">
      <h3 className="text-lg font-bold text-slate-900 mb-4">Pending User Approvals</h3>
      {loading ? (
        <div className="text-sm text-slate-400 py-8 text-center">Loading...</div>
      ) : users.length === 0 ? (
        <div className="text-sm text-slate-400 py-8 text-center">No pending users</div>
      ) : (
        <div className="space-y-3">
          {users.map((u) => (
            <div key={u.id} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/50 px-5 py-4">
              <div>
                <p className="text-sm font-medium text-slate-800">{u.full_name}</p>
                <p className="text-xs text-slate-400">{u.email} &middot; {u.role}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => onApprove(u.id)} className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-600 transition">Approve</button>
                <button onClick={() => onReject(u.id)} className="rounded-xl border border-red-200 px-4 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 transition">Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
