import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";
import DeleteModal from "../../../components/admin/DeleteModal";
import SkeletonRows from "../../../components/admin/SkeletonRows";
import CourseManager from "../../../components/admin/CourseManager";
import SubjectManager from "../../../components/admin/SubjectManager";
import StudentManager from "../../../components/admin/StudentManager";

const SENSITIVE_TABLES = ["users"];

const TABLE_GROUPS = [
    {
        name: "Users & Auth",
        tables: ["users", "roles", "permissions", "role_permissions"],
    },
    {
        name: "Academic",
        tables: ["students", "subjects", "student_subjects", "student_units", "subject_requests"],
    },
    {
        name: "System",
        tables: ["audit_logs", "refresh_tokens", "user_sessions", "password_resets", "email_verifications"],
    },
];

const STAT_META = [
    { key: "users", label: "Total Users", accent: "bg-blue-500", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" },
    { key: "staffOnline", label: "Staff Online", accent: "bg-indigo-500", icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
    { key: "pendingRequests", label: "Pending Requests", accent: "bg-amber-500", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
    { key: "systemLoad", label: "System Load", accent: "bg-emerald-500", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
];

const SvgIcon = ({ path, className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={path} />
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
    const [stats, setStats] = useState(null);
    const [controls, setControls] = useState([]);
    const [broadcast, setBroadcast] = useState("");
    const [error, setError] = useState("");
    const [tables, setTables] = useState([]);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
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

    const loadTable = async (tableName) => {
        setSelectedTable(tableName);
        setTableLoading(true);
        setTableData(null);
        try {
            const data = await api.get(`/api/admin/tables/${tableName}?limit=100`);
            setTableData(data.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setTableLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await api.delete(`/api/admin/tables/${deleteTarget.tableName}/${deleteTarget.rowId}`);
            showToast("Record deleted successfully", "success");
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
            await api.post("/api/admin/broadcast", { message: broadcast });
            showToast("Broadcast sent", "success");
            setBroadcast("");
        } catch (err) {
            showToast(err.message, "error");
        }
    };

    const toggleControl = async (label, state) => {
        const newState = state === "Enabled" ? "Disabled" : "Enabled";
        try {
            await api.post("/api/admin/controls/toggle", { label, state: newState });
            setControls((prev) =>
                prev.map((c) => (c.label === label ? { ...c, state: newState } : c))
            );
            showToast(`${label}: ${newState}`, "success");
        } catch (err) {
            showToast(err.message, "error");
        }
    };

    const handleShutdown = async () => {
        if (!window.confirm("Shut down the entire system? This cannot be undone.")) return;
        try {
            await api.post("/api/admin/shutdown");
            showToast("Shutdown initiated", "success");
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

    const availableGroups = TABLE_GROUPS.filter((g) =>
        g.tables.some((t) => tables.includes(t))
    );

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* SIDEBAR */}
            <aside className={`fixed left-0 top-0 bottom-0 w-60 bg-slate-900 flex flex-col z-50 transition-transform duration-200 ease-in-out ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } md:translate-x-0 md:z-40`}>
                {/* Brand */}
                <div className="flex items-center gap-3 px-5 pt-5 pb-4 border-b border-slate-800">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
                        <span className="text-white text-xs font-bold">A</span>
                    </div>
                    <div className="min-w-0 flex-1">
                        <h1 className="text-sm font-bold text-white">Admin Panel</h1>
                        <p className="text-[10px] text-slate-500 tracking-wider uppercase">Control Panel</p>
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white transition">
                        <SvgIcon path="M6 18L18 6M6 6l12 12" className="w-5 h-5" />
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 overflow-y-auto px-3 pt-4 space-y-1">
                    <NavItem
                        icon={<SvgIcon path="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />}
                        label="Overview"
                        active={activeTab === "overview"}
                        onClick={() => { setActiveTab("overview"); setSelectedTable(null); setSidebarOpen(false); }}
                    />
                    <NavItem
                        icon={<SvgIcon path="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />}
                        label="Database"
                        active={activeTab === "database"}
                        onClick={() => { setActiveTab("database"); setSidebarOpen(false); }}
                    />
                    <NavItem
                        icon={<SvgIcon path="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />}
                        label="Profile"
                        active={false}
                        onClick={() => { navigate("/profile"); setSidebarOpen(false); }}
                    />

                    <div className="pt-3 pb-1 px-3">
                        <p className="text-[10px] text-slate-600 uppercase tracking-widest font-semibold">Management</p>
                    </div>

                    <NavItem
                        icon={<SvgIcon path="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />}
                        label="Courses"
                        active={activeTab === "courses"}
                        onClick={() => { setActiveTab("courses"); setSelectedTable(null); setSidebarOpen(false); }}
                    />
                    <NavItem
                        icon={<SvgIcon path="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />}
                        label="Subjects"
                        active={activeTab === "subjects"}
                        onClick={() => { setActiveTab("subjects"); setSelectedTable(null); setSidebarOpen(false); }}
                    />
                    <NavItem
                        icon={<SvgIcon path="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />}
                        label="Students"
                        active={activeTab === "students"}
                        onClick={() => { setActiveTab("students"); setSelectedTable(null); setSidebarOpen(false); }}
                    />

                    {/* Table groups (only shown when Database is active) */}
                    {activeTab === "database" && (
                        <div className="mt-2 space-y-0.5">
                            {availableGroups.map((group) => {
                                const isExpanded = activeGroup === group.name;
                                return (
                                    <div key={group.name}>
                                        <button
                                            onClick={() => setActiveGroup(isExpanded ? null : group.name)}
                                            className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all ${
                                                isExpanded
                                                    ? "bg-slate-800 text-blue-400"
                                                    : "text-slate-400 hover:text-slate-300 hover:bg-slate-800/50"
                                            }`}
                                        >
                                            <SvgIcon
                                                path={isExpanded ? "M19 9l-7 7-7-7" : "M9 5l7 7-7 7"}
                                                className="w-3 h-3 shrink-0"
                                            />
                                            <span className="font-medium">{group.name}</span>
                                        </button>
                                        {isExpanded && (
                                            <div className="ml-4 mt-0.5 space-y-0.5 border-l border-slate-700 pl-2">
                                                {group.tables
                                                    .filter((t) => tables.includes(t))
                                                    .map((t) => (
                                                        <button
                                                            key={t}
                                                            onClick={() => { loadTable(t); setSidebarOpen(false); }}
                                                            className={`block w-full text-left px-3 py-1 rounded-md text-[11px] font-mono transition-all ${
                                                                selectedTable === t
                                                                    ? "bg-blue-600/20 text-blue-400"
                                                                    : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
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

                {/* Bottom */}
                <div className="px-3 pb-4 pt-3 border-t border-slate-800 hidden md:block">
                    <div className="flex items-center justify-between px-3 py-2 text-xs text-slate-500">
                        <div className="flex items-center gap-2 min-w-0">
                            <SvgIcon path="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{user?.full_name ?? "Admin"}</span>
                        </div>
                        <button onClick={logout} className="text-slate-500 hover:text-red-400 transition" title="Logout">
                            <SvgIcon path="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <div className="md:ml-60 flex-1 min-h-screen">
                {/* Top bar */}
                <header className="bg-white border-b border-slate-200 px-4 md:px-6 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                            <button onClick={() => setSidebarOpen(true)} className="md:hidden text-slate-500 hover:text-slate-700 transition -ml-1">
                                <SvgIcon path="M4 6h16M4 12h16M4 18h16" className="w-5 h-5" />
                            </button>
                            <span className="hidden sm:inline text-slate-400">Admin</span>
                            <span className="hidden sm:inline text-slate-300">/</span>
                            <span className="text-slate-900 font-medium capitalize truncate max-w-[160px] sm:max-w-none">{activeTab}</span>
                            {selectedTable && (
                                <>
                                    <span className="hidden sm:inline text-slate-300">/</span>
                                    <span className="text-blue-600 font-mono text-xs truncate max-w-[120px] sm:max-w-[200px]">{selectedTable}</span>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Toast */}
                {toast && (
                    <div className="fixed top-4 right-4 left-4 md:left-auto z-50 animate-in slide-in-from-top-2 duration-200">
                        <div
                            className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium md:max-w-sm ${
                                toast.type === "success"
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    : "bg-red-50 text-red-700 border border-red-200"
                            }`}
                        >
                            <SvgIcon
                                path={toast.type === "success" ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"}
                                className="w-4 h-4 shrink-0"
                            />
                            {toast.message}
                        </div>
                    </div>
                )}

                {/* Error banner */}
                {error && (
                    <div className="px-4 md:px-6 pt-4">
                        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-center gap-2">
                            <SvgIcon path="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" className="w-4 h-4 shrink-0" />
                            {error}
                        </div>
                    </div>
                )}

                <main className="p-4 md:p-6 space-y-6">
                    {/* STATS */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
                        {statItems.map((stat, i) => (
                            <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden">
                                <div className={`h-1 ${stat.accent}`} />
                                <div className="p-4">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">{stat.label}</p>
                                        <SvgIcon path={stat.icon} className={`w-4 h-4 ${stat.accent.replace("bg-", "text-")}`} />
                                    </div>
                                    <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* OVERVIEW */}
                    {activeTab === "overview" && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                            <div className="bg-white rounded-xl shadow-sm p-4 md:p-5">
                                <h3 className="text-sm font-bold text-slate-800">Broadcast</h3>
                                <p className="text-xs text-slate-400 mt-0.5 mb-4">Send message to all roles</p>
                                <div className="relative">
                                    <textarea
                                        value={broadcast}
                                        onChange={(e) => setBroadcast(e.target.value)}
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
                                    className="w-full mt-3 bg-blue-600 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    <SvgIcon path="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" className="w-4 h-4" />
                                    Send
                                </button>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm p-4 md:p-5">
                                <h3 className="text-sm font-bold text-slate-800 mb-4">Controls</h3>
                                <div className="space-y-4">
                                    {controls.map((item, i) => (
                                        <div key={i} className="flex items-center justify-between">
                                            <span className="text-sm text-slate-600">{item.label}</span>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={item.state === "Enabled"}
                                                    onChange={() => toggleControl(item.label, item.state)}
                                                />
                                                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border-l-4 border-red-400 p-4 md:p-5">
                                <h3 className="text-sm font-bold text-red-600">Emergency</h3>
                                <p className="text-xs text-slate-400 mt-0.5 mb-4">Immediate system-wide actions</p>
                                <button
                                    onClick={handleShutdown}
                                    className="w-full bg-red-50 text-red-600 text-sm font-semibold py-2.5 rounded-xl hover:bg-red-100 transition border border-red-200"
                                >
                                    Shutdown System
                                </button>
                            </div>
                        </div>
                    )}

                    {/* COURSES */}
                    {activeTab === "courses" && <CourseManager />}

                    {/* SUBJECTS */}
                    {activeTab === "subjects" && <SubjectManager />}

                    {/* STUDENTS */}
                    {activeTab === "students" && <StudentManager />}

                    {/* DATABASE */}
                    {activeTab === "database" && (
                        <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
                            {/* Table data */}
                            <div className="flex-1 min-w-0">
                                {!selectedTable ? (
                                    <div className="flex flex-col items-center justify-center py-16 md:py-24 text-center">
                                        <SvgIcon
                                            path="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
                                            className="w-12 h-12 text-slate-300 mb-4"
                                        />
                                        <p className="text-sm text-slate-400">Select a table from the sidebar</p>
                                    </div>
                                ) : tableLoading ? (
                                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                                        <div className="px-4 md:px-5 py-3 border-b border-slate-100">
                                            <div className="h-4 bg-slate-200 rounded w-32 animate-pulse" />
                                        </div>
                                        <table className="w-full text-left text-xs">
                                            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider">
                                                <tr>
                                                    {tableData?.columns ? tableData.columns.map((col) => (
                                                        <th key={col} className="px-3 md:px-5 py-3 font-semibold whitespace-nowrap">{col}</th>
                                                    )) : Array.from({ length: 5 }).map((_, i) => (
                                                        <th key={i} className="px-3 md:px-5 py-3"><div className="h-3 bg-slate-200 rounded w-16 animate-pulse" /></th>
                                                    ))}
                                                    <th className="px-3 md:px-5 py-3 w-20">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                <SkeletonRows columns={tableData?.columns?.length ?? 5} rows={6} />
                                            </tbody>
                                        </table>
                                    </div>
                                ) : tableData ? (
                                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                        {/* Toolbar */}
                                        <div className="px-4 md:px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-white">
                                            <div className="flex items-center gap-2 md:gap-3 min-w-0">
                                                <span className="text-sm font-semibold text-slate-800">{selectedTable}</span>
                                                <span className="text-xs text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full font-medium">
                                                    {tableData.totalRows} rows
                                                </span>
                                                {SENSITIVE_TABLES.includes(selectedTable) && (
                                                    <span className="text-[11px] text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full font-medium border border-amber-200">
                                                        Last admin protected
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Table */}
                                        <div className="overflow-x-auto max-h-[600px]">
                                            <table className="w-full text-left text-xs">
                                                <thead className="bg-white/80 backdrop-blur-md sticky top-0 text-slate-500 uppercase tracking-wider">
                                                    <tr>
                                                        {tableData.columns.map((col) => (
                                                            <th key={col} className="px-3 md:px-5 py-3 font-semibold whitespace-nowrap border-r border-slate-100 last:border-0">
                                                                {col}
                                                            </th>
                                                        ))}
                                                        <th className="px-3 md:px-5 py-3 font-semibold w-16">Act.</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {tableData.rows.map((row, i) => (
                                                        <tr key={row.id ?? i} className="group hover:bg-slate-50 transition-colors">
                                                            {tableData.columns.map((col) => (
                                                                <td key={col} className="px-3 md:px-5 py-2.5 max-w-[160px] md:max-w-[220px] truncate whitespace-nowrap border-r border-slate-50 last:border-0">
                                                                    {formatCell(row[col])}
                                                                </td>
                                                            ))}
                                                            <td className="px-3 md:px-5 py-2.5">
                                                                <button
                                                                    onClick={() =>
                                                                        SENSITIVE_TABLES.includes(selectedTable)
                                                                            ? setDeleteTarget({ tableName: selectedTable, rowId: row.id })
                                                                            : setDeleteTarget({ tableName: selectedTable, rowId: row.id })
                                                                    }
                                                                    className="text-red-400 hover:text-red-600 transition opacity-30 group-hover:opacity-100"
                                                                    title="Delete record"
                                                                >
                                                                    <SvgIcon path="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" className="w-3.5 h-3.5" />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                ) : null}
                            </div>
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
        </div>
    );
}

function formatCell(value) {
    if (value === null || value === undefined) return <span className="text-slate-300 italic">null</span>;
    if (typeof value === "boolean") return <span className="text-emerald-600 font-medium">{value ? "true" : "false"}</span>;
    if (typeof value === "number") return <span className="text-blue-600 font-medium">{value}</span>;
    if (typeof value === "object") return <span className="text-slate-400">{JSON.stringify(value).slice(0, 60)}</span>;
    return <span>{String(value)}</span>;
}

function NavItem({ icon, label, active, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                active
                    ? "bg-slate-800 text-white shadow-sm border-l-2 border-blue-500 rounded-l-none"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
        >
            <span className="shrink-0">{icon}</span>
            <span>{label}</span>
        </button>
    );
}
