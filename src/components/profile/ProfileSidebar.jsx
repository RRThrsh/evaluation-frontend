import { useState } from "react";
import SvgIcon from "../common/SvgIcon";
import ChangePasswordModal from "./ChangePasswordModal";

export default function ProfileSidebar({ user }) {
  const [showChangePassword, setShowChangePassword] = useState(false);

  return (
    <aside className="space-y-6">
      <div className="rounded-[28px] border border-white/50 bg-white/80 p-6 shadow-lg shadow-slate-200/50 backdrop-blur-xl">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
            <SvgIcon path="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Security</h3>
            <p className="mt-1 text-sm leading-relaxed text-slate-500">Manage your password and account security settings.</p>
          </div>
        </div>
        <button onClick={() => setShowChangePassword(true)}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
          <SvgIcon path="M15 7a2 2 0 012 2" />
          Change Password
        </button>
      </div>

      {showChangePassword && <ChangePasswordModal onClose={() => setShowChangePassword(false)} />}

      <div className="rounded-[28px] border border-white/50 bg-white/80 p-6 shadow-lg shadow-slate-200/50 backdrop-blur-xl">
        <h3 className="text-lg font-bold text-slate-900">Account Overview</h3>
        <div className="mt-5 space-y-4">
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
    <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-3">
      <span className="text-sm text-slate-500">{label}</span>
      <div className={`flex items-center gap-2 text-sm font-semibold ${active ? "text-emerald-600" : "text-slate-700"}`}>
        {active && <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />}
        {value}
      </div>
    </div>
  );
}
