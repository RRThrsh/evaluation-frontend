import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const FAQS = [
    {
        q: "What is the Evaluation System?",
        a: "The Evaluation System allows staff to submit student evaluation requests, moderators to review them, and administrators to oversee the entire workflow.",
    },
    {
        q: "How do I submit an evaluation request?",
        a: "Staff members can submit an evaluation by entering the student number on the Staff Dashboard.",
    },
    {
        q: "What happens after I submit?",
        a: "Once submitted, the request enters a Pending state for moderator review.",
    },
    {
        q: "Can I delete my evaluation request?",
        a: "No, submitted requests cannot be deleted or withdrawn.",
    },
    {
        q: "Who can review evaluations?",
        a: "Only moderators can review evaluation requests.",
    },
    {
        q: "What roles are available?",
        a: "User, Staff, Moderator, and Admin roles are supported.",
    },
];

const SvgIcon = ({ path, className = "w-4 h-4" }) => (
    <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d={path}
        />
    </svg>
);

const roleStyles = {
    admin: {
        badge:
            "bg-purple-500/10 text-purple-700 border-purple-200",
        glow: "from-purple-600 to-fuchsia-500",
    },
    moderator: {
        badge:
            "bg-blue-500/10 text-blue-700 border-blue-200",
        glow: "from-blue-600 to-cyan-500",
    },
    staff: {
        badge:
            "bg-emerald-500/10 text-emerald-700 border-emerald-200",
        glow: "from-emerald-600 to-green-500",
    },
    user: {
        badge:
            "bg-slate-100 text-slate-600 border-slate-200",
        glow: "from-slate-700 to-slate-500",
    },
};

export default function Profile() {
    const { user, logout, updateProfile } = useAuth();

    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    const [openFaq, setOpenFaq] = useState(null);

    const [saved, setSaved] = useState(false);
    const [editError, setEditError] = useState("");

    const [form, setForm] = useState({
        full_name: "",
        email: "",
    });

    const dashboardLink = {
        admin: "/admin",
        moderator: "/moderator",
        staff: "/staff",
        user: "/users",
    };

    const startEditing = () => {
        setForm({
            full_name: user?.full_name || "",
            email: user?.email || "",
        });

        setEditing(true);
        setEditError("");
    };

    const cancelEditing = () => {
        setEditing(false);
        setEditError("");
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
            await updateProfile({
                full_name: form.full_name.trim(),
                email: form.email.trim(),
            });

            setEditing(false);

            setSaved(true);

            setTimeout(() => {
                setSaved(false);
            }, 3000);
        } catch (err) {
            setEditError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const copyId = () => {
        if (!user?.id) return;

        navigator.clipboard.writeText(user.id);

        setSaved(true);

        setTimeout(() => {
            setSaved(false);
        }, 2000);
    };

    const roleStyle =
        roleStyles[user?.role] || roleStyles.user;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-100">
            {/* BACKGROUND ORBS */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-32 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
                <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl" />
            </div>

            {/* HEADER */}
            <header className="sticky top-0 z-40 border-b border-white/30 bg-white/70 backdrop-blur-xl">
                <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 md:px-6">
                    <div className="flex items-center gap-2 text-sm">
                        <Link
                            to={
                                dashboardLink[user?.role] || "/"
                            }
                            className="text-slate-400 transition hover:text-slate-700"
                        >
                            Dashboard
                        </Link>

                        <span className="text-slate-300">
                            /
                        </span>

                        <span className="font-semibold text-slate-900">
                            Profile
                        </span>
                    </div>

                    <button
                        onClick={logout}
                        className="group flex items-center gap-2 rounded-2xl border border-red-100 bg-white px-4 py-2 text-sm font-medium text-slate-500 shadow-sm transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    >
                        <SvgIcon path="M17 16l4-4m0 0l-4-4m4 4H7" />

                        Logout
                    </button>
                </div>
            </header>

            {/* TOAST */}
            {saved && (
                <div className="fixed top-20 right-5 z-50 animate-in slide-in-from-top-3 duration-300">
                    <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-white px-5 py-4 shadow-2xl">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                            <SvgIcon path="M5 13l4 4L19 7" />
                        </div>

                        <div>
                            <p className="text-sm font-semibold text-slate-800">
                                Success
                            </p>

                            <p className="text-xs text-slate-500">
                                Profile updated successfully
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <main className="relative mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-10">
                {/* HERO PROFILE */}
                <section className="relative overflow-hidden rounded-[32px] border border-white/50 bg-white/80 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-xl md:p-8">
                    <div
                        className={`absolute inset-0 bg-gradient-to-br opacity-[0.06] ${roleStyle.glow}`}
                    />

                    <div className="relative flex flex-col gap-6 md:flex-row md:items-center">
                        {/* AVATAR */}
                        <div
                            className={`flex h-24 w-24 items-center justify-center rounded-[28px] bg-gradient-to-br ${roleStyle.glow} text-4xl font-black text-white shadow-xl`}
                        >
                            {user?.full_name
                                ?.charAt(0)
                                ?.toUpperCase() || "U"}
                        </div>

                        {/* INFO */}
                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-3xl font-black tracking-tight text-slate-900">
                                    {user?.full_name || "User"}
                                </h1>

                                <span
                                    className={`rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] ${roleStyle.badge}`}
                                >
                                    {user?.role || "user"}
                                </span>
                            </div>

                            <p className="mt-2 text-slate-500">
                                {user?.email}
                            </p>

                            <div className="mt-5 flex flex-wrap gap-3">
                                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                                    <p className="text-[10px] uppercase tracking-widest text-slate-400">
                                        Member Since
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-slate-700">
                                        {user?.created_at
                                            ? new Date(
                                                  user.created_at
                                              ).toLocaleDateString()
                                            : "—"}
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                                    <p className="text-[10px] uppercase tracking-widest text-slate-400">
                                        Account Status
                                    </p>

                                    <div className="mt-1 flex items-center gap-2 text-sm font-semibold text-emerald-600">
                                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                        Active
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ACTION */}
                        {!editing && (
                            <button
                                onClick={startEditing}
                                className="group inline-flex items-center gap-2 self-start rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:scale-[1.02] hover:bg-slate-800 active:scale-[0.98]"
                            >
                                <SvgIcon path="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5" />

                                Edit Profile
                            </button>
                        )}
                    </div>
                </section>

                {/* GRID */}
                <div className="mt-8 grid grid-cols-1 gap-8 xl:grid-cols-[1fr_340px]">
                    {/* LEFT SIDE */}
                    <div className="space-y-8">
                        {/* ACCOUNT INFO */}
                        <section className="rounded-[28px] border border-white/50 bg-white/80 p-6 shadow-lg shadow-slate-200/50 backdrop-blur-xl md:p-8">
                            <div className="mb-6 flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">
                                        Account Information
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Manage your profile details
                                    </p>
                                </div>
                            </div>

                            {editError && (
                                <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                                    <SvgIcon path="M12 9v2m0 4h.01" />

                                    {editError}
                                </div>
                            )}

                            {editing ? (
                                <form
                                    onSubmit={handleSave}
                                    className="space-y-5"
                                >
                                    <div>
                                        <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-400">
                                            Full Name
                                        </label>

                                        <input
                                            type="text"
                                            value={
                                                form.full_name
                                            }
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    full_name:
                                                        e
                                                            .target
                                                            .value,
                                                })
                                            }
                                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-400">
                                            Email Address
                                        </label>

                                        <input
                                            type="email"
                                            value={form.email}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    email: e
                                                        .target
                                                        .value,
                                                })
                                            }
                                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                                        />
                                    </div>

                                    <div className="flex flex-wrap gap-3 pt-2">
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] disabled:opacity-50"
                                        >
                                            {saving
                                                ? "Saving..."
                                                : "Save Changes"}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={
                                                cancelEditing
                                            }
                                            className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                    <InfoCard
                                        label="Full Name"
                                        value={
                                            user?.full_name ||
                                            "—"
                                        }
                                    />

                                    <InfoCard
                                        label="Email"
                                        value={
                                            user?.email || "—"
                                        }
                                    />

                                    <InfoCard
                                        label="Role"
                                        value={
                                            user?.role || "—"
                                        }
                                    />

                                    <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5">
                                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                                            User ID
                                        </p>

                                        <button
                                            onClick={copyId}
                                            className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-blue-600"
                                        >
                                            <span className="font-mono">
                                                {user?.id
                                                    ? `${user.id.slice(
                                                          0,
                                                          8
                                                      )}...`
                                                    : "—"}
                                            </span>

                                            <SvgIcon path="M8 16H6a2 2 0 01-2-2V6" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* FAQ */}
                        <section className="rounded-[28px] border border-white/50 bg-white/80 p-6 shadow-lg shadow-slate-200/50 backdrop-blur-xl md:p-8">
                            <div className="mb-6">
                                <h2 className="text-lg font-bold text-slate-900">
                                    Frequently Asked Questions
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Common questions about the
                                    Evaluation System
                                </p>
                            </div>

                            <div className="space-y-3">
                                {FAQS.map((faq, i) => {
                                    const isOpen =
                                        openFaq === i;

                                    return (
                                        <div
                                            key={i}
                                            className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all"
                                        >
                                            <button
                                                onClick={() =>
                                                    setOpenFaq(
                                                        isOpen
                                                            ? null
                                                            : i
                                                    )
                                                }
                                                className={`flex w-full items-center justify-between px-5 py-4 text-left transition ${
                                                    isOpen
                                                        ? "bg-slate-50"
                                                        : "hover:bg-slate-50"
                                                }`}
                                            >
                                                <span className="pr-5 text-sm font-semibold text-slate-700">
                                                    {
                                                        faq.q
                                                    }
                                                </span>

                                                <SvgIcon
                                                    path="M19 9l-7 7-7-7"
                                                    className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
                                                        isOpen
                                                            ? "rotate-180"
                                                            : ""
                                                    }`}
                                                />
                                            </button>

                                            <div
                                                className={`grid transition-all duration-300 ${
                                                    isOpen
                                                        ? "grid-rows-[1fr]"
                                                        : "grid-rows-[0fr]"
                                                }`}
                                            >
                                                <div className="overflow-hidden">
                                                    <div className="border-t border-slate-100 px-5 py-4 text-sm leading-relaxed text-slate-500">
                                                        {
                                                            faq.a
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    </div>

                    {/* RIGHT SIDEBAR */}
                    <aside className="space-y-6">
                        {/* SECURITY */}
                        <div className="rounded-[28px] border border-white/50 bg-white/80 p-6 shadow-lg shadow-slate-200/50 backdrop-blur-xl">
                            <div className="flex items-start gap-4">
                                <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
                                    <SvgIcon path="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4" />
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">
                                        Security
                                    </h3>

                                    <p className="mt-1 text-sm leading-relaxed text-slate-500">
                                        Manage your password and
                                        account security settings.
                                    </p>
                                </div>
                            </div>

                            <Link
                                to="/forgot-password"
                                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                            >
                                <SvgIcon path="M15 7a2 2 0 012 2" />

                                Change Password
                            </Link>
                        </div>

                        {/* QUICK STATS */}
                        <div className="rounded-[28px] border border-white/50 bg-white/80 p-6 shadow-lg shadow-slate-200/50 backdrop-blur-xl">
                            <h3 className="text-lg font-bold text-slate-900">
                                Account Overview
                            </h3>

                            <div className="mt-5 space-y-4">
                                <QuickStat
                                    label="Role"
                                    value={
                                        user?.role ||
                                        "User"
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
                                />
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}

function InfoCard({ label, value }) {
    return (
        <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                {label}
            </p>

            <p className="mt-2 text-sm font-semibold text-slate-700">
                {value}
            </p>
        </div>
    );
}

function QuickStat({
    label,
    value,
    active = false,
}) {
    return (
        <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-3">
            <span className="text-sm text-slate-500">
                {label}
            </span>

            <div
                className={`flex items-center gap-2 text-sm font-semibold ${
                    active
                        ? "text-emerald-600"
                        : "text-slate-700"
                }`}
            >
                {active && (
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                )}

                {value}
            </div>
        </div>
    );
}