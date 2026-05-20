import { useState } from "react";
import { Shield, Lock } from "lucide-react";
import ChangePasswordModal from "./ChangePasswordModal";

export default function ProfileSidebar({ user }) {
  const [showChangePassword, setShowChangePassword] = useState(false);

  return (
    <aside className="space-y-4">
      <div className="card p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="rounded-lg bg-primary-50 p-2.5 text-primary-600">
            <Shield size={18} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Security</h3>
            <p className="text-sm text-slate-500">Manage your password and security settings.</p>
          </div>
        </div>
        <button onClick={() => setShowChangePassword(true)} className="btn btn-primary btn-md w-full">
          <Lock size={14} />
          Change Password
        </button>
      </div>

      {showChangePassword && <ChangePasswordModal onClose={() => setShowChangePassword(false)} />}

      <div className="card p-5">
        <h3 className="text-base font-bold text-slate-900 mb-4">Account Overview</h3>
        <div className="space-y-3">
          <QuickStat label="Role" value={user?.role || "Evaluator"} />
          <QuickStat label="Status" value="Active" active />
          <QuickStat label="Profile" value="Complete" />
        </div>
      </div>
    </aside>
  );
}

function QuickStat({ label, value, active = false }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/70 px-3.5 py-2.5">
      <span className="text-sm text-slate-500">{label}</span>
      <div className={`flex items-center gap-1.5 text-sm font-semibold ${active ? "text-emerald-600" : "text-slate-700"}`}>
        {active && <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />}
        {value}
      </div>
    </div>
  );
}
