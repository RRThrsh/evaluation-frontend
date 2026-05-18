import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";
import DeleteModal from "../../../components/admin/DeleteModal";
import SkeletonRows from "../../../components/admin/SkeletonRows";
import CourseManager from "../../../components/admin/CourseManager";
import SubjectManager from "../../../components/admin/SubjectManager";
import StudentManager from "../../../components/admin/StudentManager";
import AcademicConfigManager from "../../../components/admin/AcademicConfigManager";

const SENSITIVE_TABLES = ["users"];

const TABLE_GROUPS = [
    {
        name: "Users & Auth",
        tables: ["users", "roles", "permissions", "role_permissions"],
    },
    {
        name: "Academic",
        tables: [
            "students",
            "subjects",
            "student_subjects",
            "student_units",
            "subject_requests",
        ],
    },
    {
        name: "System",
        tables: [
            "audit_logs",
            "refresh_tokens",
            "user_sessions",
            "password_resets",
            "email_verifications",
        ],
    },
];

const STAT_META = [
    {
        key: "users",
        label: "Total Users",
        accent: "from-blue-500 to-cyan-400",
        icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z",
    },
    {
        key: "staffOnline",
        label: "Staff Online",
        accent: "from-indigo-500 to-violet-400",
        icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    },
    {
        key: "pendingRequests",
        label: "Pending Requests",
        accent: "from-amber-500 to-orange-400",
        icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    {
        key: "systemLoad",
        label: "System Load",
        accent: "from-emerald-500 to-green-400",
        icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
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

export default function AdminHome() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");
    const [activeGroup, setActiveGroup] = useState(null);
    const [selectedTable, setSelectedTable] = useState(null);

    const [tableData, setTableData] = useState(null);
    const [tableLoading, setTableLoading] = useState(false);

    const [deleting, setDeleting] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [editRow, setEditRow] = useState(null);
    const [editFormData, setEditFormData] = useState({});
    const [saving, setSaving] = useState(false);

    const [stats, setStats] = useState(null);
    const [controls, setControls] = useState([]);

    const [broadcast, setBroadcast] = useState("");
    const [error, setError] = useState("");
    const [tables, setTables] = useState([]);
    const [toast, setToast] = useState(null);
    const [pendingUsers, setPendingUsers] = useState([]);
    const [pendingUsersLoading, setPendingUsersLoading] = useState(false);
    const [pendingEnrollments, setPendingEnrollments] = useState([]);
    const [pendingEnrollmentsLoading, setPendingEnrollmentsLoading] = useState(false);
    const [enrollmentDetail, setEnrollmentDetail] = useState(null);
    const [enrollmentDetailLoading, setEnrollmentDetailLoading] = useState(false);

    const showToast = (message, type = "success") => {
        setToast({ message, type });

        setTimeout(() => {
            setToast(null);
        }, 3000);
    };

    useEffect(() => {
        Promise.all([
            api.get("/api/admin/stats"),
            api.get("/api/admin/controls"),
            api.get("/api/admin/tables"),
        ])
            .then(([statsData, controlsData, tablesData]) => {
                setStats(statsData.data);
                setControls(controlsData.data?.controls ?? []);

                const tbls = tablesData.data ?? [];

                setTables(tbls);

                const first = TABLE_GROUPS.find((g) =>
                    g.tables.some((t) => tbls.includes(t))
                );

                if (first) setActiveGroup(first.name);
            })
            .catch((err) => setError(err.message));
    }, []);

    useEffect(() => {
        if (activeTab !== "users") return;
        setPendingUsersLoading(true);
        api.get("/api/admin/pending-users")
            .then((data) => setPendingUsers(data.data ?? []))
            .catch((err) => setError(err.message))
            .finally(() => setPendingUsersLoading(false));
    }, [activeTab]);

    useEffect(() => {
        if (activeTab !== "enrollment") return;
        setPendingEnrollmentsLoading(true);
        api.get("/api/admin/enrollments/pending")
            .then((data) => setPendingEnrollments(data.data ?? []))
            .catch((err) => setError(err.message))
            .finally(() => setPendingEnrollmentsLoading(false));
    }, [activeTab]);

    const handleApprove = async (userId) => {
        try {
            await api.patch(`/api/admin/users/${userId}/status`, { status: "approved" });
            setPendingUsers((prev) => prev.filter((u) => u.id !== userId));
            showToast("User approved");
        } catch (err) {
            showToast(err.message, "error");
        }
    };

    const handleReject = async (userId) => {
        try {
            await api.patch(`/api/admin/users/${userId}/status`, { status: "rejected" });
            setPendingUsers((prev) => prev.filter((u) => u.id !== userId));
            showToast("User rejected");
        } catch (err) {
            showToast(err.message, "error");
        }
    };

    const loadTable = async (tableName) => {
        setSelectedTable(tableName);
        setTableLoading(true);
        setTableData(null);

        try {
            const data = await api.get(
                `/api/admin/tables/${tableName}?limit=100`
            );

            setTableData(data.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setTableLoading(false);
        }
    };

    const handleEditSave = async () => {
        if (!editRow) return;
        setSaving(true);
        try {
            const res = await api.put(
                `/api/admin/tables/${selectedTable}/${editRow.id}`,
                editFormData
            );
            showToast("Record updated successfully");
            setEditRow(null);
            await loadTable(selectedTable);
        } catch (err) {
            showToast(err.message, "error");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;

        setDeleting(true);

        try {
            await api.delete(
                `/api/admin/tables/${deleteTarget.tableName}/${deleteTarget.rowId}`
            );

            showToast("Record deleted successfully");

            setDeleteTarget(null);

            await loadTable(deleteTarget.tableName);
        } catch (err) {
            showToast(err.message, "error");
        } finally {
            setDeleting(false);
        }
    };

    const handleBroadcast = async () => {
        if (!broadcast.trim()) return;

        try {
            await api.post("/api/admin/broadcast", {
                message: broadcast,
            });

            showToast("Broadcast sent");
            setBroadcast("");
        } catch (err) {
            showToast(err.message, "error");
        }
    };

    const toggleControl = async (label, state) => {
        const newState = state === "Enabled" ? "Disabled" : "Enabled";

        try {
            await api.post("/api/admin/controls/toggle", {
                label,
                state: newState,
            });

            setControls((prev) =>
                prev.map((c) =>
                    c.label === label
                        ? { ...c, state: newState }
                        : c
                )
            );

            showToast(`${label}: ${newState}`);
        } catch (err) {
            showToast(err.message, "error");
        }
    };

    const handleShutdown = async () => {
        if (
            !window.confirm(
                "Shut down the entire system? This cannot be undone."
            )
        )
            return;

        try {
            await api.post("/api/admin/shutdown");

            showToast("Shutdown initiated");
        } catch (err) {
            showToast(err.message, "error");
        }
    };

    const statItems = stats
        ? STAT_META.map((s) => ({
              ...s,
              value: stats[s.key] ?? "—",
          }))
        : [];

    const availableGroups = useMemo(
        () =>
            TABLE_GROUPS.filter((g) =>
                g.tables.some((t) => tables.includes(t))
            ),
        [tables]
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100">
            {/* BACKDROP */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
                />
            )}

            {/* SIDEBAR */}
            <aside
                className={`fixed top-0 left-0 z-50 h-screen w-72 bg-slate-950/95 backdrop-blur-xl border-r border-slate-800 transition-transform duration-300 ${
                    sidebarOpen
                        ? "translate-x-0"
                        : "-translate-x-full"
                } md:translate-x-0`}
            >
                {/* BRAND */}
                <div className="relative overflow-hidden border-b border-slate-800 px-5 py-5">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-cyan-500/5" />

                    <div className="relative flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/20">
                            <span className="text-sm font-black text-white">
                                A
                            </span>
                        </div>

                        <div className="flex-1 min-w-0">
                            <h1 className="truncate text-sm font-bold text-white">
                                Admin Dashboard
                            </h1>

                            <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500">
                                Control Center
                            </p>
                        </div>

                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="md:hidden text-slate-500 hover:text-white"
                        >
                            <SvgIcon
                                path="M6 18L18 6M6 6l12 12"
                                className="w-5 h-5"
                            />
                        </button>
                    </div>
                </div>

                {/* NAVIGATION */}
                <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-2">
                    <SidebarLabel title="Navigation" />

                    <NavItem
                        icon={
                            <SvgIcon path="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        }
                        label="Overview"
                        active={activeTab === "overview"}
                        onClick={() => {
                            setActiveTab("overview");
                            setSelectedTable(null);
                            setSidebarOpen(false);
                        }}
                    />

                    <NavItem
                        icon={
                            <SvgIcon path="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                        }
                        label="Database"
                        active={activeTab === "database"}
                        onClick={() => {
                            setActiveTab("database");
                            setSidebarOpen(false);
                        }}
                    />

                    <NavItem
                        icon={
                            <SvgIcon path="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        }
                        label="Profile"
                        active={false}
                        onClick={() => navigate("/profile")}
                    />

                    <SidebarLabel title="Management" />

                    <NavItem
                        icon={
                            <SvgIcon path="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
                        }
                        label="Courses"
                        active={activeTab === "courses"}
                        onClick={() => {
                            setActiveTab("courses");
                            setSelectedTable(null);
                        }}
                    />

                    <NavItem
                        icon={
                            <SvgIcon path="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13" />
                        }
                        label="Subjects"
                        active={activeTab === "subjects"}
                        onClick={() => {
                            setActiveTab("subjects");
                            setSelectedTable(null);
                        }}
                    />

                    <NavItem
                        icon={
                            <SvgIcon path="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1" />
                        }
                        label="Students"
                        active={activeTab === "students"}
                        onClick={() => {
                            setActiveTab("students");
                            setSelectedTable(null);
                        }}
                    />

                    <NavItem
                        icon={
                            <SvgIcon path="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        }
                        label="Users"
                        active={activeTab === "users"}
                        onClick={() => {
                            setActiveTab("users");
                            setSelectedTable(null);
                        }}
                    />

                    <NavItem
                        icon={
                            <SvgIcon path="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13M3 21h18M3 10h18M3 16h18" />
                        }
                        label="Enrollment"
                        active={activeTab === "enrollment"}
                        onClick={() => {
                            setActiveTab("enrollment");
                            setSelectedTable(null);
                        }}
                    />

                    {/* ACADEMIC CONFIG */}
                    <NavItem
                        icon={
                            <SvgIcon path="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        }
                        label="Academic Config"
                        active={activeTab === "academic_config"}
                        onClick={() => {
                            setActiveTab("academic_config");
                            setSelectedTable(null);
                        }}
                    />

                    {/* DATABASE TABLES */}
                    {activeTab === "database" && (
                        <div className="pt-3 space-y-2">
                            <SidebarLabel title="Tables" />

                            {availableGroups.map((group) => {
                                const expanded =
                                    activeGroup === group.name;

                                return (
                                    <div
                                        key={group.name}
                                        className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/40"
                                    >
                                        <button
                                            onClick={() =>
                                                setActiveGroup(
                                                    expanded
                                                        ? null
                                                        : group.name
                                                )
                                            }
                                            className="flex w-full items-center justify-between px-4 py-3 text-sm text-slate-300 hover:bg-slate-800/60 transition"
                                        >
                                            <span className="font-medium">
                                                {group.name}
                                            </span>

                                            <SvgIcon
                                                path={
                                                    expanded
                                                        ? "M19 9l-7 7-7-7"
                                                        : "M9 5l7 7-7 7"
                                                }
                                                className="w-4 h-4"
                                            />
                                        </button>

                                        {expanded && (
                                            <div className="border-t border-slate-800 p-2 space-y-1">
                                                {group.tables
                                                    .filter((t) =>
                                                        tables.includes(t)
                                                    )
                                                    .map((t) => (
                                                        <button
                                                            key={t}
                                                            onClick={() =>
                                                                loadTable(
                                                                    t
                                                                )
                                                            }
                                                            className={`w-full rounded-xl px-3 py-2 text-left text-xs font-mono transition ${
                                                                selectedTable ===
                                                                t
                                                                    ? "bg-blue-600 text-white shadow"
                                                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                                            }`}
                                                        >
                                                            {t}
                                                        </button>
                                                    ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </nav>

                {/* FOOTER */}
                <div className="border-t border-slate-800 p-4">
                    <div className="flex items-center justify-between rounded-2xl bg-slate-900 px-4 py-3">
                        <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-white">
                                {user?.full_name ?? "Admin"}
                            </p>

                            <p className="text-xs text-slate-500">
                                Administrator
                            </p>
                        </div>

                        <button
                            onClick={logout}
                            className="rounded-xl p-2 text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition"
                        >
                            <SvgIcon
                                path="M17 16l4-4m0 0l-4-4m4 4H7"
                                className="w-4 h-4"
                            />
                        </button>
                    </div>
                </div>
            </aside>

            {/* MAIN */}
            <div className="md:ml-72">
                {/* HEADER */}
                <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
                    <div className="flex items-center justify-between px-4 md:px-8 py-4">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() =>
                                    setSidebarOpen(true)
                                }
                                className="md:hidden rounded-xl border border-slate-200 bg-white p-2 text-slate-600"
                            >
                                <SvgIcon
                                    path="M4 6h16M4 12h16M4 18h16"
                                    className="w-5 h-5"
                                />
                            </button>

                            <div>
                                <h2 className="text-lg font-bold text-slate-900 capitalize">
                                    {activeTab}
                                </h2>

                                <p className="text-xs text-slate-500">
                                    Manage and monitor your system
                                </p>
                            </div>
                        </div>

                        <div className="hidden md:flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs font-medium text-slate-600">
                                System Online
                            </span>
                        </div>
                    </div>
                </header>

                {/* TOAST */}
                {toast && (
                    <div className="fixed top-5 right-5 z-50">
                        <div
                            className={`flex items-center gap-3 rounded-2xl border px-5 py-4 shadow-2xl backdrop-blur-xl animate-in slide-in-from-top-3 ${
                                toast.type === "success"
                                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                    : "border-red-200 bg-red-50 text-red-700"
                            }`}
                        >
                            <SvgIcon
                                path={
                                    toast.type === "success"
                                        ? "M5 13l4 4L19 7"
                                        : "M6 18L18 6M6 6l12 12"
                                }
                                className="w-5 h-5"
                            />

                            <span className="text-sm font-medium">
                                {toast.message}
                            </span>
                        </div>
                    </div>
                )}

                {/* ERROR */}
                {error && (
                    <div className="px-4 md:px-8 pt-6">
                        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    </div>
                )}

                {/* CONTENT */}
                <main className="p-4 md:p-8 space-y-8">
                    {/* STATS */}
                    <section className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                        {statItems.map((stat) => (
                            <div
                                key={stat.key}
                                className="group relative overflow-hidden rounded-3xl border border-white/70 bg-white/90 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                            >
                                <div
                                    className={`absolute inset-0 bg-gradient-to-br opacity-[0.04] ${stat.accent}`}
                                />

                                <div className="relative flex items-start justify-between">
                                    <div>
                                        <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                                            {stat.label}
                                        </p>

                                        <h3 className="mt-3 text-3xl font-black text-slate-900">
                                            {stat.value}
                                        </h3>
                                    </div>

                                    <div
                                        className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg ${stat.accent}`}
                                    >
                                        <SvgIcon
                                            path={stat.icon}
                                            className="w-5 h-5"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </section>

                    {/* OVERVIEW */}
                    {activeTab === "overview" && (
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                            {/* BROADCAST */}
                            <div className="rounded-3xl border border-white/60 bg-white/90 p-6 shadow-sm">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900">
                                            Broadcast
                                        </h3>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Send announcement to all
                                            users
                                        </p>
                                    </div>

                                    <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
                                        <SvgIcon
                                            path="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                            className="w-5 h-5"
                                        />
                                    </div>
                                </div>

                                {/* INPUT NOT CHANGED */}
                                <div className="relative mt-5">
                                    <textarea
                                        value={broadcast}
                                        onChange={(e) =>
                                            setBroadcast(
                                                e.target.value
                                            )
                                        }
                                        className="w-full border border-slate-200 rounded-xl p-3 pr-12 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                                        placeholder="Type announcement..."
                                        rows={3}
                                        maxLength={500}
                                    />

                                    <span className="absolute bottom-3 right-3 text-[10px] text-slate-300">
                                        {broadcast.length}/500
                                    </span>
                                </div>

                                <button
                                    onClick={handleBroadcast}
                                    disabled={!broadcast.trim()}
                                    className="mt-5 w-full rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:scale-[1.01] disabled:opacity-40"
                                >
                                    Send Broadcast
                                </button>
                            </div>

                            {/* CONTROLS */}
                            <div className="rounded-3xl border border-white/60 bg-white/90 p-6 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900">
                                            Controls
                                        </h3>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Toggle system modules
                                        </p>
                                    </div>

                                    <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600">
                                        <SvgIcon
                                            path="M13 10V3L4 14h7v7l9-11h-7z"
                                            className="w-5 h-5"
                                        />
                                    </div>
                                </div>

                                <div className="mt-6 space-y-4">
                                    {controls.map((item, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3"
                                        >
                                            <div>
                                                <p className="text-sm font-medium text-slate-700">
                                                    {item.label}
                                                </p>

                                                <p className="text-xs text-slate-400">
                                                    {item.state}
                                                </p>
                                            </div>

                                            <label className="relative inline-flex cursor-pointer items-center">
                                                <input
                                                    type="checkbox"
                                                    className="peer sr-only"
                                                    checked={
                                                        item.state ===
                                                        "Enabled"
                                                    }
                                                    onChange={() =>
                                                        toggleControl(
                                                            item.label,
                                                            item.state
                                                        )
                                                    }
                                                />

                                                <div className="h-6 w-11 rounded-full bg-slate-200 transition peer-checked:bg-blue-600 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-full" />
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* EMERGENCY */}
                            <div className="overflow-hidden rounded-3xl border border-red-200 bg-gradient-to-br from-red-50 to-white p-6 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold text-red-600">
                                            Emergency
                                        </h3>

                                        <p className="mt-1 text-sm text-red-400">
                                            Critical system actions
                                        </p>
                                    </div>

                                    <div className="rounded-2xl bg-red-100 p-3 text-red-600">
                                        <SvgIcon
                                            path="M12 9v2m0 4h.01"
                                            className="w-5 h-5"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={handleShutdown}
                                    className="mt-8 w-full rounded-2xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-600 hover:text-white"
                                >
                                    Shutdown System
                                </button>
                            </div>
                        </div>
                    )}

                    {/* COURSES */}
                    {activeTab === "courses" && (
                        <CourseManager />
                    )}

                    {/* SUBJECTS */}
                    {activeTab === "subjects" && (
                        <SubjectManager />
                    )}

                    {/* STUDENTS */}
                    {activeTab === "students" && (
                        <StudentManager />
                    )}

                    {/* USERS */}
                    {activeTab === "users" && (
                        <div className="rounded-3xl border border-white/70 bg-white/90 shadow-sm p-6">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">
                                Pending User Approvals
                            </h3>

                            {pendingUsersLoading ? (
                                <div className="text-sm text-slate-400 py-8 text-center">Loading...</div>
                            ) : pendingUsers.length === 0 ? (
                                <div className="text-sm text-slate-400 py-8 text-center">
                                    No pending users
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {pendingUsers.map((u) => (
                                        <div key={u.id} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/50 px-5 py-4">
                                            <div>
                                                <p className="text-sm font-medium text-slate-800">{u.full_name}</p>
                                                <p className="text-xs text-slate-400">{u.email} &middot; {u.role}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleApprove(u.id)}
                                                    className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-600 transition"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleReject(u.id)}
                                                    className="rounded-xl border border-red-200 px-4 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 transition"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ENROLLMENT */}
                    {activeTab === "enrollment" && (
                        <div className="rounded-3xl border border-white/70 bg-white/90 shadow-sm p-6">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">
                                Pending Enrollments
                            </h3>

                            {pendingEnrollmentsLoading ? (
                                <div className="text-sm text-slate-400 py-8 text-center">Loading...</div>
                            ) : pendingEnrollments.length === 0 ? (
                                <div className="text-sm text-slate-400 py-8 text-center">
                                    No pending enrollment requests
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {pendingEnrollments.map((req) => (
                                        <div key={req.id} className="rounded-2xl border border-slate-100 bg-slate-50/50 px-5 py-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-slate-800">
                                                        {req.student_number} — {req.first_name} {req.last_name}
                                                    </p>
                                                    <p className="text-xs text-slate-400">
                                                        Year {req.year_level} &middot; Requested by: {req.requested_by_name}
                                                    </p>
                                                </div>
                                                <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase bg-blue-100 text-blue-700">
                                                    For Enrollment
                                                </span>
                                            </div>

                                            {enrollmentDetail === req.id ? (
                                                <div className="mt-4 pt-4 border-t border-slate-200">
                                                    {enrollmentDetailLoading ? (
                                                        <p className="text-sm text-slate-400">Loading evaluation data...</p>
                                                    ) : (
                                                        <>
                                                            <div className="text-sm text-slate-600 space-y-1 mb-4">
                                                                <p><span className="text-slate-400">Email:</span> {req.student_email}</p>
                                                                <p><span className="text-slate-400">Reviewed by:</span> {req.reviewed_by_name || "—"}</p>
                                                                {req.evaluation_result && (
                                                                    <div className="mt-3 p-3 bg-white rounded-xl border border-slate-200">
                                                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Evaluation Result</p>
                                                                        <p className="text-xs text-slate-600">
                                                                            Overall: <span className={`font-semibold ${req.evaluation_result.overall === "disqualified" ? "text-red-600" : req.evaluation_result.overall === "conditional" ? "text-amber-600" : "text-emerald-600"}`}>
                                                                                {req.evaluation_result.overall?.toUpperCase()}
                                                                            </span>
                                                                        </p>
                                                                        <p className="text-xs text-slate-600 mt-1">
                                                                            Current failed: {req.evaluation_result.summary?.current_failed || 0} &middot;
                                                                            Retakes: {req.evaluation_result.summary?.retake_subjects || 0} &middot;
                                                                            Next subjects: {req.evaluation_result.summary?.next_semester_subjects || 0}
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    onClick={async () => {
                                                                        try {
                                                                            await api.post(`/api/admin/enrollments/${req.id}/confirm`);
                                                                            setPendingEnrollments((prev) => prev.filter((r) => r.id !== req.id));
                                                                            setEnrollmentDetail(null);
                                                                            showToast("Student enrolled successfully");
                                                                        } catch (err) {
                                                                            showToast(err.message, "error");
                                                                        }
                                                                    }}
                                                                    className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-600 transition"
                                                                >
                                                                    Confirm Enrollment
                                                                </button>
                                                                <button
                                                                    onClick={async () => {
                                                                        try {
                                                                            await api.post(`/api/admin/enrollments/${req.id}/reject`);
                                                                            setPendingEnrollments((prev) => prev.filter((r) => r.id !== req.id));
                                                                            setEnrollmentDetail(null);
                                                                            showToast("Enrollment rejected");
                                                                        } catch (err) {
                                                                            showToast(err.message, "error");
                                                                        }
                                                                    }}
                                                                    className="rounded-xl border border-red-200 px-4 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 transition"
                                                                >
                                                                    Reject Enrollment
                                                                </button>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={async () => {
                                                        setEnrollmentDetail(req.id);
                                                        setEnrollmentDetailLoading(true);
                                                        try {
                                                            // Load fresh evaluation data
                                                            await api.get(`/api/moderator/students/${req.student_id}/evaluate`);
                                                        } catch (e) {
                                                            // Preview may fail if student data changed, that's ok
                                                        } finally {
                                                            setEnrollmentDetailLoading(false);
                                                        }
                                                    }}
                                                    className="mt-3 text-xs font-medium text-blue-600 hover:text-blue-700 transition"
                                                >
                                                    View Details →
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "academic_config" && (
                        <AcademicConfigManager />
                    )}

                    {/* DATABASE */}
                    {activeTab === "database" && (
                        <div className="rounded-3xl border border-white/70 bg-white/90 shadow-sm overflow-hidden">
                            {!selectedTable ? (
                                <div className="flex flex-col items-center justify-center py-24 text-center">
                                    <div className="rounded-3xl bg-slate-100 p-5">
                                        <SvgIcon
                                            path="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7"
                                            className="w-10 h-10 text-slate-400"
                                        />
                                    </div>

                                    <h3 className="mt-5 text-lg font-bold text-slate-700">
                                        No Table Selected
                                    </h3>

                                    <p className="mt-2 text-sm text-slate-400">
                                        Choose a table from the sidebar
                                    </p>
                                </div>
                            ) : tableLoading ? (
                                <div className="p-6">
                                    <table className="w-full">
                                        <tbody>
                                            <SkeletonRows
                                                columns={5}
                                                rows={8}
                                            />
                                        </tbody>
                                    </table>
                                </div>
                            ) : tableData ? (
                                <>
                                    {/* TABLE HEADER */}
                                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-2xl bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                                                {selectedTable}
                                            </div>

                                            <div className="rounded-2xl bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                                                {
                                                    tableData.totalRows
                                                }{" "}
                                                rows
                                            </div>

                                            {SENSITIVE_TABLES.includes(
                                                selectedTable
                                            ) && (
                                                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-600">
                                                    Protected
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* TABLE */}
                                    <div className="overflow-auto max-h-[650px]">
                                        <table className="w-full text-sm">
                                            <thead className="sticky top-0 z-10 bg-slate-50 backdrop-blur-xl">
                                                <tr>
                                                    {tableData.columns.map(
                                                        (
                                                            col
                                                        ) => (
                                                            <th
                                                                key={
                                                                    col
                                                                }
                                                                className="whitespace-nowrap border-b border-slate-200 px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500"
                                                            >
                                                                {
                                                                    col
                                                                }
                                                            </th>
                                                        )
                                                    )}

                                                    <th className="border-b border-slate-200 px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                                                        Action
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {tableData.rows.map(
                                                    (
                                                        row,
                                                        i
                                                    ) => (
                                                        <tr
                                                            key={
                                                                row.id ??
                                                                i
                                                            }
                                                            className="group border-b border-slate-100 transition hover:bg-slate-50"
                                                        >
                                                            {tableData.columns.map(
                                                                (
                                                                    col
                                                                ) => (
                                                                    <td
                                                                        key={
                                                                            col
                                                                        }
                                                                        className="max-w-[240px] truncate whitespace-nowrap px-5 py-4 text-slate-700"
                                                                    >
                                                                        {formatCell(
                                                                            row[
                                                                                col
                                                                            ]
                                                                        )}
                                                                    </td>
                                                                )
                                                            )}

                                                            <td className="px-5 py-4 text-right">
                                                                <div className="flex items-center justify-end gap-2">
                                                                     <button
                                                                        onClick={() => {
                                                                            setEditRow(
                                                                                row
                                                                            );
                                                                            setEditFormData(
                                                                                { ...row }
                                                                            );
                                                                        }}
                                                                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 hover:text-blue-600"
                                                                    >
                                                                        <SvgIcon
                                                                            path="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                                            className="w-3.5 h-3.5"
                                                                        />
                                                                        Edit
                                                                    </button>
                                                                    <button
                                                                        onClick={() =>
                                                                            setDeleteTarget(
                                                                                {
                                                                                    tableName:
                                                                                        selectedTable,
                                                                                    rowId:
                                                                                        row.id,
                                                                                }
                                                                            )
                                                                        }
                                                                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-50 hover:text-red-700"
                                                                    >
                                                                        <SvgIcon
                                                                            path="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                                            className="w-3.5 h-3.5"
                                                                        />
                                                                        Delete
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            ) : null}
                        </div>
                    )}
                </main>
            </div>

            {/* DELETE MODAL */}
            <DeleteModal
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                tableName={deleteTarget?.tableName}
                rowId={deleteTarget?.rowId}
                deleting={deleting}
            />

            {/* EDIT ROW MODAL */}
            {editRow && (
                <div
                    className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 backdrop-blur-sm pt-10 pb-10"
                    onClick={() => setEditRow(null)}
                >
                    <div
                        className="relative w-full max-w-2xl mx-4 rounded-3xl border border-white/60 bg-white shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                            <div className="flex items-center gap-3">
                                <div className="rounded-2xl bg-blue-50 p-2.5 text-blue-600">
                                    <SvgIcon
                                        path="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                        className="w-4 h-4"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900">
                                        Edit Row
                                    </h3>
                                    <p className="text-xs text-slate-400">
                                        {selectedTable}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setEditRow(null)}
                                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                            >
                                <SvgIcon
                                    path="M6 18L18 6M6 6l12 12"
                                    className="w-4 h-4"
                                />
                            </button>
                        </div>

                        <div className="px-6 py-5 space-y-3 max-h-[65vh] overflow-y-auto">
                            {tableData.columns
                                .filter((col) =>
                                    selectedTable === "users" && col === "password_hash"
                                        ? false
                                        : true
                                )
                                .map((col) => (
                                <div
                                    key={col}
                                    className="flex items-start gap-4 rounded-2xl bg-slate-50 px-4 py-3"
                                >
                                    <span className="w-40 shrink-0 text-xs font-bold uppercase tracking-wider text-slate-500 pt-0.5">
                                        {col === "role" && selectedTable === "users"
                                            ? "Role (Admin only)"
                                            : col}
                                    </span>
                                    {col === "id" || (selectedTable === "users" && col !== "role") ? (
                                        <span className="text-sm text-slate-800 break-all">
                                            {formatCell(editRow[col])}
                                        </span>
                                    ) : col === "role" && selectedTable === "users" ? (
                                        <select
                                            value={editFormData[col] ?? ""}
                                            onChange={(e) =>
                                                setEditFormData((prev) => ({
                                                    ...prev,
                                                    [col]: e.target.value,
                                                }))
                                            }
                                            className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                                        >
                                            <option value="user">user</option>
                                            <option value="staff">staff</option>
                                            <option value="moderator">moderator</option>
                                            <option value="admin">admin</option>
                                        </select>
                                    ) : (
                                        <input
                                            type="text"
                                            value={
                                                editFormData[col] ?? ""
                                            }
                                            onChange={(e) =>
                                                setEditFormData(
                                                    (prev) => ({
                                                        ...prev,
                                                        [col]:
                                                            e.target
                                                                .value,
                                                    })
                                                )
                                            }
                                            className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
                            <button
                                onClick={() => setEditRow(null)}
                                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                                disabled={saving}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEditSave}
                                disabled={saving}
                                className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:scale-[1.02] disabled:opacity-50"
                            >
                                {saving
                                    ? "Saving..."
                                    : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function formatCell(value) {
    if (value === null || value === undefined) {
        return (
            <span className="italic text-slate-300">
                null
            </span>
        );
    }

    if (typeof value === "boolean") {
        return (
            <span
                className={`rounded-full px-2 py-1 text-xs font-semibold ${
                    value
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-red-50 text-red-500"
                }`}
            >
                {value ? "true" : "false"}
            </span>
        );
    }

    if (typeof value === "number") {
        return (
            <span className="font-semibold text-blue-600">
                {value}
            </span>
        );
    }

    if (typeof value === "object") {
        return (
            <span className="text-slate-400">
                {JSON.stringify(value).slice(0, 60)}
            </span>
        );
    }

    return (
        <span className="text-slate-700">
            {String(value)}
        </span>
    );
}

function SidebarLabel({ title }) {
    return (
        <div className="px-3 pt-4 pb-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-600">
                {title}
            </p>
        </div>
    );
}

function NavItem({ icon, label, active, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`group relative flex w-full items-center gap-3 overflow-hidden rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
                active
                    ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
        >
            <span className="relative z-10 shrink-0">
                {icon}
            </span>

            <span className="relative z-10">
                {label}
            </span>
        </button>
    );
}