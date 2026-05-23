import {
  AlertCircle,
  Copy,
  Mail,
  User,
  Shield,
  Check,
} from "lucide-react";

import { useState } from "react";

export default function ProfileInfo({
  user,
  editing,
  saving,
  editError,
  form,
  setForm,
  onSave,
  onCancel,
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!user?.id) return;

    await navigator.clipboard.writeText(user.id);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-100 px-6 py-5">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Account Information
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Manage your personal profile details and account information.
        </p>
      </div>

      <div className="p-6 md:p-7">
        {/* Error */}
        {editError && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            <AlertCircle
              size={18}
              className="mt-0.5 shrink-0"
            />

            <span>{editError}</span>
          </div>
        )}

        {/* Edit Form */}
        {editing ? (
          <form
            onSubmit={onSave}
            className="space-y-5"
          >
            {/* Full Name */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Full Name
              </label>

              <div className="relative">
                <User
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={form.full_name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      full_name:
                        e.target.value,
                    })
                  }
                  placeholder="Enter your full name"
                  className="h-13 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email:
                        e.target.value,
                    })
                  }
                  placeholder="Enter your email"
                  className="h-13 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-slate-900 px-5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

              <button
                type="button"
                onClick={onCancel}
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoCard
              icon={User}
              label="Full Name"
              value={
                user?.full_name || "—"
              }
            />

            <InfoCard
              icon={Mail}
              label="Email Address"
              value={
                user?.email || "—"
              }
            />

            <InfoCard
              icon={Shield}
              label="Role"
              value={
                user?.role || "—"
              }
            />

            {/* User ID */}
            <div className="group rounded-3xl border border-slate-200 bg-slate-50/70 p-5 transition-all duration-300 hover:border-slate-300 hover:bg-white hover:shadow-md">
              <div className="flex items-center gap-2 text-slate-400">
                <Copy size={15} />

                <p className="text-[11px] font-bold uppercase tracking-[0.18em]">
                  User ID
                </p>
              </div>

              <button
                onClick={handleCopy}
                className="mt-4 flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100"
              >
                <span className="font-mono">
                  {user?.id
                    ? `${user.id.slice(
                        0,
                        10
                      )}...`
                    : "—"}
                </span>

                {copied ? (
                  <Check
                    size={15}
                    className="text-emerald-500"
                  />
                ) : (
                  <Copy size={14} />
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="group rounded-3xl border border-slate-200 bg-slate-50/70 p-5 transition-all duration-300 hover:border-slate-300 hover:bg-white hover:shadow-md">
      <div className="flex items-center gap-2 text-slate-400">
        <Icon size={15} />

        <p className="text-[11px] font-bold uppercase tracking-[0.18em]">
          {label}
        </p>
      </div>

      <p className="mt-4 text-sm font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
}