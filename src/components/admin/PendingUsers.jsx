import { Check, X } from "lucide-react";

export default function PendingUsers({ users, loading, onApprove, onReject }) {
  return (
    <div className="card p-6">
      <h3 className="text-lg font-bold text-slate-900 mb-4">Pending User Approvals</h3>
      {loading ? (
        <div className="text-sm text-slate-400 py-8 text-center">Loading...</div>
      ) : users.length === 0 ? (
        <div className="text-sm text-slate-400 py-8 text-center">No pending users</div>
      ) : (
        <div className="space-y-2">
          {users.map((u) => (
            <div key={u.id} className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/50 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-slate-800">{u.full_name}</p>
                <p className="text-xs text-slate-400">{u.email} &middot; {u.role}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => onApprove(u.id)} className="btn btn-sm flex items-center gap-1 text-emerald-600 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 rounded-lg font-semibold">
                  <Check size={14} /> Approve
                </button>
                <button onClick={() => onReject(u.id)} className="btn btn-sm flex items-center gap-1 text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 rounded-lg font-semibold">
                  <X size={14} /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
