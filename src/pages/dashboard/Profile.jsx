import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const FAQS = [
    {
        q: "What is the Evaluation System?",
        a: "The Evaluation System allows staff to submit student evaluation requests, moderators to review them, and administrators to oversee the entire workflow. It streamlines academic evaluations within the college system.",
    },
    {
        q: "How do I submit an evaluation request?",
        a: "Staff members can submit an evaluation by entering the student number on the Staff Dashboard. The system checks the student's records and creates a request for moderator review.",
    },
    {
        q: "What happens after I submit?",
        a: "Once submitted, the request enters a 'Pending' state. A moderator reviews the submission and can either Approve or Reject it. You can check the status on your dashboard anytime.",
    },
    {
        q: "Can I delete my evaluation request?",
        a: "No, once submitted, evaluation requests cannot be deleted or withdrawn. Please ensure all details are correct before submitting.",
    },
    {
        q: "Who can review evaluations?",
        a: "Only users with the Moderator role can review and take action on evaluation requests. Moderators are appointed by administrators.",
    },
    {
        q: "What roles are available?",
        a: "The system supports four roles: User (view-only), Staff (submit evaluations), Moderator (review evaluations), and Admin (full system control including user management and database access).",
    },
    {
        q: "How do I change my role?",
        a: "Role changes can only be performed by an administrator. Contact your system admin if you need a role change.",
    },
    {
        q: "What if I forget my password?",
        a: "Use the 'Forgot Password' link on the login page. Enter your email and follow the instructions sent to your inbox to reset your password.",
    },
    {
        q: "Is my data secure?",
        a: "Yes. All API requests are authenticated using JWT tokens. Passwords are hashed and never stored in plain text. Role-based access control ensures users can only access permitted features.",
    },
    {
        q: "Can I access the database?",
        a: "Only administrators have access to the database browser, where they can view table contents and manage records. Other roles cannot access database features.",
    },
    {
        q: "How do I update my profile information?",
        a: "Click the 'Edit Information' button on your profile page to update your full name and email address. Changes are saved instantly and reflected across the system.",
    },
    {
        q: "Why can't I change my role?",
        a: "Role assignments are managed exclusively by administrators to ensure proper access control. If you believe your role needs to change, please contact your system administrator.",
    },
];

const SvgIcon = ({ path, className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={path} />
    </svg>
);

export default function Profile() {
    const { user, logout, updateProfile } = useAuth();
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ full_name: "", email: "" });
    const [saving, setSaving] = useState(false);
    const [editError, setEditError] = useState("");
    const [openFaq, setOpenFaq] = useState(null);
    const [saved, setSaved] = useState(false);

    const startEditing = () => {
        setForm({ full_name: user?.full_name || "", email: user?.email || "" });
        setEditError("");
        setEditing(true);
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
            await updateProfile({ full_name: form.full_name.trim(), email: form.email.trim() });
            setEditing(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            setEditError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const roleBadgeColor = {
        admin: "bg-purple-100 text-purple-700 border-purple-200",
        moderator: "bg-blue-100 text-blue-700 border-blue-200",
        staff: "bg-emerald-100 text-emerald-700 border-emerald-200",
        user: "bg-slate-100 text-slate-600 border-slate-200",
    };

    const dashboardLink = {
        admin: "/admin",
        moderator: "/moderator",
        staff: "/staff",
        user: "/users",
    };

    const copyId = () => {
        if (user?.id) {
            navigator.clipboard.writeText(user.id);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-4 md:px-6 py-3">
                <div className="max-w-3xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                        <Link to={dashboardLink[user?.role] || "/"} className="text-slate-400 hover:text-slate-600 transition">
                            Dashboard
                        </Link>
                        <span className="text-slate-300">/</span>
                        <span className="text-slate-900 font-medium">Profile</span>
                    </div>
                    <button
                        onClick={logout}
                        className="text-sm text-slate-400 hover:text-red-500 transition flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-red-50"
                    >
                        <SvgIcon path="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        Logout
                    </button>
                </div>
            </header>

            {/* Saved toast */}
            {saved && (
                <div className="max-w-3xl mx-auto px-4 md:px-6 pt-4">
                    <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm font-medium text-emerald-700">
                        <SvgIcon path="M5 13l4 4L19 7" />
                        Profile updated successfully
                    </div>
                </div>
            )}

            <main className="max-w-3xl mx-auto px-4 md:px-6 py-6 space-y-6">
                {/* Profile Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
                    <div className="flex flex-col sm:flex-row items-start gap-5">
                        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shrink-0">
                            {user?.full_name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-1">
                                <h1 className="text-xl font-bold text-slate-900">
                                    {user?.full_name || "User"}
                                </h1>
                                <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${roleBadgeColor[user?.role] || "bg-slate-100 text-slate-600 border-slate-200"} self-start`}>
                                    {user?.role || "user"}
                                </span>
                            </div>
                            <p className="text-sm text-slate-500">{user?.email}</p>
                            <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
                                <SvgIcon path="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" className="w-3 h-3" />
                                Member since {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Account Information with Edit */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-sm font-bold text-slate-800">Account Information</h2>
                            <p className="text-xs text-slate-400 mt-0.5">Manage your profile details</p>
                        </div>
                        {!editing && (
                            <button
                                onClick={startEditing}
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition"
                            >
                                <SvgIcon path="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                Edit Information
                            </button>
                        )}
                    </div>

                    {editError && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-center gap-2">
                            <SvgIcon path="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            {editError}
                        </div>
                    )}

                    {editing ? (
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1.5">Full Name</label>
                                <input
                                    type="text"
                                    value={form.full_name}
                                    onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1.5">Email</label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
                                >
                                    {saving ? "Saving..." : "Save Changes"}
                                </button>
                                <button
                                    type="button"
                                    onClick={cancelEditing}
                                    className="px-5 py-2 text-sm font-medium text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Full Name</p>
                                <p className="text-sm text-slate-700 mt-1">{user?.full_name || "—"}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Email</p>
                                <p className="text-sm text-slate-700 mt-1">{user?.email || "—"}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Role</p>
                                <p className="text-sm text-slate-700 mt-1 capitalize">{user?.role || "—"}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">User ID</p>
                                <button
                                    onClick={copyId}
                                    className="text-sm text-slate-700 mt-1 font-mono flex items-center gap-1.5 hover:text-blue-600 transition group"
                                    title="Click to copy"
                                >
                                    {user?.id ? `${user.id.slice(0, 8)}...` : "—"}
                                    <SvgIcon path="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-500 transition" />
                                </button>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Member Since</p>
                                <p className="text-sm text-slate-700 mt-1">
                                    {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Account Status</p>
                                <p className="text-sm text-emerald-600 mt-1 font-medium flex items-center gap-1.5">
                                    <SvgIcon path="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" className="w-3.5 h-3.5" />
                                    Active
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Account Security */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
                    <h2 className="text-sm font-bold text-slate-800 mb-1">Account Security</h2>
                    <p className="text-xs text-slate-400 mb-4">Manage your password and security settings</p>
                    <Link
                        to="/forgot-password"
                        className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 px-4 py-2 rounded-xl hover:bg-blue-50 transition"
                    >
                        <SvgIcon path="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        Change Password
                    </Link>
                </div>

                {/* FAQ */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
                    <h2 className="text-sm font-bold text-slate-800 mb-1">Frequently Asked Questions</h2>
                    <p className="text-xs text-slate-400 mb-6">Common questions about the Evaluation System</p>
                    <div className="space-y-2">
                        {FAQS.map((faq, i) => {
                            const isOpen = openFaq === i;
                            return (
                                <div key={i} className="border border-slate-100 rounded-xl overflow-hidden">
                                    <button
                                        onClick={() => setOpenFaq(isOpen ? null : i)}
                                        className="w-full flex items-center justify-between px-4 py-3.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
                                    >
                                        <span>{faq.q}</span>
                                        <SvgIcon
                                            path="M19 9l-7 7-7-7"
                                            className={`w-4 h-4 text-slate-400 shrink-0 ml-2 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                                        />
                                    </button>
                                    {isOpen && (
                                        <div className="px-4 pb-3.5 text-sm text-slate-500 leading-relaxed border-t border-slate-50 pt-3">
                                            {faq.a}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>
        </div>
    );
}
