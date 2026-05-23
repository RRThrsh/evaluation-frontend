import { useState } from "react";
import {
  Shield,
  Lock,
  Sparkles,
  CheckCircle2,
  UserCheck,
} from "lucide-react";

import ChangePasswordModal from "./ChangePasswordModal";

export default function ProfileSidebar({ user }) {
  const [showChangePassword, setShowChangePassword] =
    useState(false);

  return (
    <aside className="space-y-6">
      {/* Security Card */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        {/* Background Glow */}
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative">
          <div className="mb-5 flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-lg">
              <Shield size={20} />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Security
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Manage your password and account protection.
              </p>
            </div>
          </div>

          <button
            onClick={() =>
              setShowChangePassword(true)
            }
            className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-xl active:translate-y-0"
          >
            <Lock
              size={16}
              className="transition-transform duration-200 group-hover:rotate-12"
            />

            Change Password
          </button>
        </div>
      </div>

      {/* Modal */}
      {showChangePassword && (
        <ChangePasswordModal
          onClose={() =>
            setShowChangePassword(false)
          }
        />
      )}

      {/* Account Overview */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Account Overview
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Quick summary of your profile.
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md">
            <Sparkles size={16} />
          </div>
        </div>

        <div className="space-y-3">
          <QuickStat
            label="Role"
            value={
              user?.role || "Evaluator"
            }
          />

          <QuickStat
            label="Status"
            value="Active"
            active
          />

          <QuickStat
            label="Profile"
            value="Complete"
            icon={UserCheck}
          />
        </div>
      </div>
    </aside>
  );
}

function QuickStat({
  label,
  value,
  active = false,
  icon: Icon,
}) {
  return (
    <div className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3 transition-all duration-300 hover:border-slate-300 hover:bg-white hover:shadow-sm">
      <div className="flex items-center gap-2 text-slate-500">
        {Icon && (
          <Icon
            size={14}
            className="text-slate-400"
          />
        )}

        <span className="text-sm font-medium">
          {label}
        </span>
      </div>

      <div
        className={`flex items-center gap-2 text-sm font-semibold transition-colors ${
          active
            ? "text-emerald-600"
            : "text-slate-700"
        }`}
      >
        {active && (
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
        )}

        {value}
      </div>
    </div>
  );
}