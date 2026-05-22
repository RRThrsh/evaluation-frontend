import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, CheckCircle, AlertCircle } from "lucide-react";
import api from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import AdminHeader from "../../../components/admin/AdminHeader";
import StatsCards from "../../../components/admin/StatsCards";
import ConfirmModal from "../../../components/common/ConfirmModal";
import { sanitizeInput } from "../../../utils/sanitize";

const DashboardOverview = lazy(() => import("../../../components/admin/DashboardOverview"));
const PendingUsers = lazy(() => import("../../../components/admin/PendingUsers"));
const DatabaseViewer = lazy(() => import("../../../components/admin/DatabaseViewer"));
const CourseManager = lazy(() => import("../../../components/admin/CourseManager"));
const SubjectManager = lazy(() => import("../../../components/admin/SubjectManager"));
const StudentManager = lazy(() => import("../../../components/admin/StudentManager"));
const AcademicConfigManager = lazy(() => import("../../../components/admin/AcademicConfigManager"));
const UserManager = lazy(() => import("../../../components/admin/UserManager"));
const AuditLogViewer = lazy(() => import("../../../components/admin/AuditLogViewer"));
const EvaluatorLogs = lazy(() => import("../../../components/admin/EvaluatorLogs"));
const SessionManager = lazy(() => import("../../../components/admin/SessionManager"));
const AdminPreEvaluate = lazy(() => import("../../../components/admin/AdminPreEvaluate"));
const AdminPreEnrolled = lazy(() => import("../../../components/admin/AdminPreEnrolled"));
const EnrolledStudents = lazy(() => import("../../../components/admin/EnrolledStudents"));
const Grading = lazy(() => import("../../../components/admin/Grading"));
const SectionManager = lazy(() => import("../../../components/admin/SectionManager"));
const InstructorManager = lazy(() => import("../../../components/admin/InstructorManager"));

const TABLE_GROUPS = [
  { name: "Academic", tables: ["students", "subjects", "student_subjects", "student_units"] },
  { name: "System", tables: ["academic_config"] },
];

export default function AdminHome() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [activeGroup, setActiveGroup] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const [gradingPeriod, setGradingPeriod] = useState(null);
  const [tableData, setTableData] = useState(null);
  const [tableLoading, setTableLoading] = useState(false);

  const [stats, setStats] = useState(null);
  const [controls, setControls] = useState([]);
  const [broadcast, setBroadcast] = useState("");
  const [error, setError] = useState("");
  const [tables, setTables] = useState([]);
  const [toast, setToast] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  const [pendingUsers, setPendingUsers] = useState([]);
  const [pendingUsersLoading, setPendingUsersLoading] = useState(false);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const navigateTab = (key, period) => {
    setActiveTab(key);
    setGradingPeriod(key === "grading" ? period || null : null);
    setSelectedTable(null);
    setSidebarOpen(false);
  };

  useEffect(() => {
    Promise.all([api.get("/api/admin/stats"), api.get("/api/admin/controls"), api.get("/api/admin/tables")])
      .then(([statsData, controlsData, tablesData]) => {
        setStats(statsData.data);
        setControls(controlsData.data?.controls ?? []);
        const tbls = tablesData.data ?? [];
        setTables(tbls);
        const first = TABLE_GROUPS.find((g) => g.tables.some((t) => tbls.includes(t)));
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

  const handleApprove = async (userId) => {
    try { await api.patch(`/api/admin/users/${userId}/status`, { status: "approved" }); setPendingUsers((prev) => prev.filter((u) => u.id !== userId)); showToast("User approved"); } catch (err) { showToast(err.message, "error"); }
  };

  const handleReject = async (userId) => {
    try { await api.patch(`/api/admin/users/${userId}/status`, { status: "rejected" }); setPendingUsers((prev) => prev.filter((u) => u.id !== userId)); showToast("User rejected"); } catch (err) { showToast(err.message, "error"); }
  };

  const loadTable = async (tableName) => {
    setSelectedTable(tableName);
    setTableLoading(true);
    setTableData(null);
    try { const data = await api.get(`/api/admin/tables/${tableName}?limit=100`); setTableData(data.data); } catch (err) { setError(err.message); } finally { setTableLoading(false); }
  };

  const handleBroadcast = async () => {
    if (!broadcast.trim()) return;
    try { await api.post("/api/admin/broadcast", { message: sanitizeInput(broadcast) }); showToast("Broadcast sent"); setBroadcast(""); } catch (err) { showToast(err.message, "error"); }
  };

  const toggleControl = async (key, state) => {
    const newState = state === "Enabled" ? "Disabled" : "Enabled";
    try { await api.post("/api/admin/controls/toggle", { key, state: newState }); setControls((prev) => prev.map((c) => c.key === key ? { ...c, state: newState } : c)); showToast(`${key}: ${newState}`); } catch (err) { showToast(err.message, "error"); }
  };

  const handleShutdown = async () => { try { await api.post("/api/admin/shutdown"); showToast("Shutdown initiated"); } catch (err) { showToast(err.message, "error"); } };

  const availableGroups = useMemo(() => TABLE_GROUPS.filter((g) => g.tables.some((t) => tables.includes(t))), [tables]);

  return (
    <div className="min-h-screen bg-slate-50">
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden" />}

      <AdminSidebar activeTab={activeTab} onNavigate={navigateTab} availableGroups={availableGroups} activeGroup={activeGroup} setActiveGroup={setActiveGroup} selectedTable={selectedTable} onSelectTable={loadTable} user={user} logout={logout} gradingPeriod={gradingPeriod} />

      <div className="md:ml-64">
        <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} activeTab={activeTab} error={error} />

        {toast && (
          <div className="fixed top-5 right-5 z-50">
            <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 shadow-xl bg-white ${toast.type === "success" ? "border-emerald-200 text-emerald-700" : "border-red-200 text-red-700"}`}>
              {toast.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              <span className="text-sm font-medium">{toast.message}</span>
            </div>
          </div>
        )}

        <main className="p-4 md:p-8 space-y-8">
          {stats && <StatsCards stats={stats} />}

          <Suspense fallback={<div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" /></div>}>
            {activeTab === "overview" && (
              <DashboardOverview broadcast={broadcast} setBroadcast={setBroadcast} onSend={handleBroadcast} controls={controls} onToggle={toggleControl} onShutdown={() => setConfirmAction({ action: "shutdown" })} />
            )}

            {activeTab === "courses" && <CourseManager />}
            {activeTab === "subjects" && <SubjectManager />}
            {activeTab === "students" && <StudentManager />}
            {activeTab === "users" && <PendingUsers users={pendingUsers} loading={pendingUsersLoading} onApprove={handleApprove} onReject={handleReject} />}
            {activeTab === "all-users" && <UserManager />}
            {activeTab === "audit-logs" && <AuditLogViewer />}
            {activeTab === "evaluator-logs" && <EvaluatorLogs />}
            {activeTab === "academic_config" && <AcademicConfigManager />}
            {activeTab === "pre-evaluate" && <AdminPreEvaluate />}
            {activeTab === "pre-enrolled" && <AdminPreEnrolled />}
            {activeTab === "enrolled" && <EnrolledStudents />}
            {activeTab === "grading" && <Grading defaultPeriod={gradingPeriod} />}
            {activeTab === "sections" && <SectionManager />}
            {activeTab === "instructors" && <InstructorManager />}
            {activeTab === "sessions" && <SessionManager />}
            {activeTab === "database" && <DatabaseViewer selectedTable={selectedTable} tableData={tableData} tableLoading={tableLoading} onLoadTable={loadTable} />}
          </Suspense>
        </main>
      </div>

      {confirmAction?.action === "shutdown" && (
        <ConfirmModal title="Emergency Shutdown" message="Shut down the entire system? This cannot be undone." confirmLabel="Shut Down" confirmVariant="danger" onConfirm={() => { setConfirmAction(null); handleShutdown(); }} onCancel={() => setConfirmAction(null)} />
      )}
    </div>
  );
}
