import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Pencil,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { sanitizeObject } from "../../utils/sanitize";

import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileHero from "../../components/profile/ProfileHero";
import ProfileInfo from "../../components/profile/ProfileInfo";
import ProfileFAQ from "../../components/profile/ProfileFAQ";
import ProfileSidebar from "../../components/profile/ProfileSidebar";
import ProfileActivity from "../../components/profile/ProfileActivity";

export default function Profile() {
  const { user, updateProfile } = useAuth();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editError, setEditError] = useState("");

  const [form, setForm] = useState({
    full_name: "",
    email: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        full_name: user?.full_name || "",
        email: user?.email || "",
      });
    }
  }, [user]);

  const startEditing = () => {
    setEditing(true);
    setEditError("");
  };

  const cancelEditing = () => {
    setEditing(false);
    setEditError("");

    setForm({
      full_name: user?.full_name || "",
      email: user?.email || "",
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!form.full_name.trim() || !form.email.trim()) {
      setEditError("All fields are required");
      return;
    }

    setSaving(true);
    setEditError("");

    try {
      await updateProfile(
        sanitizeObject({
          full_name: form.full_name.trim(),
          email: form.email.trim(),
        })
      );

      setEditing(false);
      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 3000);
    } catch (err) {
      setEditError(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-surface text-text">
      {/* Header */}
      <ProfileHeader />

      {/* Success Toast */}
      <div
        className={`fixed right-5 top-5 z-50 transition-all duration-500 ${
          saved
            ? "translate-y-0 opacity-100"
            : "-translate-y-4 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-4 rounded-2xl border border-emerald-200 bg-white/90 px-5 py-4 shadow-2xl backdrop-blur-xl">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
            <CheckCircle2 size={22} />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800">
              Profile Updated
            </p>

            <p className="text-xs text-slate-500">
              Your changes have been saved successfully.
            </p>
          </div>
        </div>
      </div>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
        {/* Hero Card */}
        <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
          {/* Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-fuchsia-500/5 to-cyan-500/10" />

          <div className="relative z-10">
            <ProfileHero
              user={user}
              editing={editing}
              onEdit={startEditing}
            />
          </div>

          {/* Floating Decorations */}
          <div className="absolute right-6 top-6 hidden lg:block">
            <div className="flex items-center gap-2 rounded-full border border-white/40 bg-white/60 px-4 py-2 backdrop-blur-md">
              <Sparkles className="text-indigo-500" size={16} />
              <span className="text-xs font-medium text-slate-700">
                Premium Profile
              </span>
            </div>
          </div>
        </section>

        {/* Dashboard Grid */}
        <div className="mt-8 grid grid-cols-1 gap-8 xl:grid-cols-[1fr_360px]">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Profile Info Card */}
            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Personal Information
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Manage your personal details and account information.
                  </p>
                </div>

                {!editing && (
                  <button
                    onClick={startEditing}
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                  >
                    <Pencil size={16} />
                    Edit Profile
                  </button>
                )}
              </div>

              {/* Error */}
              {editError && (
                <div className="mx-6 mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {editError}
                </div>
              )}

              {/* Content */}
              <div className="p-6">
                <ProfileInfo
                  user={user}
                  editing={editing}
                  saving={saving}
                  editError={editError}
                  form={form}
                  setForm={setForm}
                  onSave={handleSave}
                  onCancel={cancelEditing}
                />
              </div>
            </section>

            {/* Activity */}
            <section className="rounded-3xl border border-slate-200 bg-white shadow-lg">
              <div className="border-b border-slate-100 px-6 py-5">
                <h2 className="text-lg font-semibold text-slate-900">
                  Recent Activity
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  View your latest account activity and updates.
                </p>
              </div>

              <div className="p-6">
                <ProfileActivity user={user} />
              </div>
            </section>

            {/* FAQ */}
            <section className="rounded-3xl border border-slate-200 bg-white shadow-lg">
              <div className="border-b border-slate-100 px-6 py-5">
                <h2 className="text-lg font-semibold text-slate-900">
                  Help & FAQ
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Answers to common questions about your profile.
                </p>
              </div>

              <div className="p-6">
                <ProfileFAQ />
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            {/* Security Card */}
            <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white shadow-2xl">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-white/10 p-3">
                  <ShieldCheck size={24} />
                </div>

                <div>
                  <h3 className="text-lg font-semibold">
                    Account Security
                  </h3>

                  <p className="mt-2 text-sm text-slate-300">
                    Your account is protected with secure authentication and
                    encrypted sessions.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3">
                <span className="text-sm text-slate-300">
                  Security Status
                </span>

                <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-semibold text-emerald-300">
                  Protected
                </span>
              </div>
            </div>

            {/* Sidebar Component */}
            <div className="rounded-3xl border border-slate-200 bg-white shadow-lg">
              <div className="border-b border-slate-100 px-6 py-5">
                <h2 className="text-lg font-semibold text-slate-900">
                  Quick Overview
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Your profile summary and shortcuts.
                </p>
              </div>

              <div className="p-6">
                <ProfileSidebar user={user} />
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}