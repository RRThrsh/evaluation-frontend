import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import AdminHeader from "../../../components/admin/AdminHeader";
import StatsCards from "../../../components/admin/StatsCards";
import DashboardOverview from "../../../components/admin/DashboardOverview";
import PendingUsers from "../../../components/admin/PendingUsers";
import PendingEnrollments from "../../../components/admin/PendingEnrollments";
import DatabaseViewer from "../../../components/admin/DatabaseViewer";
import CourseManager from "../../../components/admin/CourseManager";
import SubjectManager from "../../../components/admin/SubjectManager";
import StudentManager from "../../../components/admin/StudentManager";
import AcademicConfigManager from "../../../components/admin/AcademicConfigManager";
import UserManager from "../../../components/admin/UserManager";
import AuditLogViewer from "../../../components/admin/AuditLogViewer";
import RoleManager from "../../../components/admin/RoleManager";
import EnrollmentHistory from "../../../components/admin/EnrollmentHistory";
import CompletedEnrollments from "../../../components/admin/CompletedEnrollments";
import EvaluatorCourses from "../../../components/admin/EvaluatorCourses";
import SessionManager from "../../../components/admin/SessionManager";
import EvaluatorEvaluations from "../../../components/admin/EvaluatorEvaluations";
import BulkImport from "../../../components/admin/BulkImport";
import GradeReports from "../../../components/admin/GradeReports";
import SvgIcon from "../../../components/common/SvgIcon";
import ConfirmModal from "../../../components/common/ConfirmModal";
import { sanitizeInput } from "../../../utils/sanitize";

const TABLE_GROUPS = [
  { name: "Academic", tables: ["students", "subjects", "student_subjects", "student_units", "subject_requests"] },
  { name: "System", tables: ["academic_config"] },
];

export default function AdminHome() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [activeGroup, setActiveGroup] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
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
  const [pendingEnrollments, setPendingEnrollments] = useState([]);
  const [pendingEnrollmentsLoading, setPendingEnrollmentsLoading] = useState(false);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const navigateTab = (key) => {
    setActiveTab(key);
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

  useEffect(() => {
    if (activeTab !== "enrollment") return;
    loadEnrollments();
  }, [activeTab]);

  const loadEnrollments = async () => {
    setPendingEnrollmentsLoading(true);
    try {
      const data = await api.get("/api/admin/enrollments/pending");
      setPendingEnrollments(data.data ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setPendingEnrollmentsLoading(false);
    }
  };

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
      const data = await api.get(`/api/admin/tables/${tableName}?limit=100`);
      setTableData(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setTableLoading(false);
    }
  };

  const handleBroadcast = async () => {
    if (!broadcast.trim()) return;
    try {
      await api.post("/api/admin/broadcast", { message: sanitizeInput(broadcast) });
      showToast("Broadcast sent");
      setBroadcast("");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const toggleControl = async (key, state) => {
    const newState = state === "Enabled" ? "Disabled" : "Enabled";
    try {
      await api.post("/api/admin/controls/toggle", { key, state: newState });
      setControls((prev) => prev.map((c) => c.key === key ? { ...c, state: newState } : c));
      showToast(`${key}: ${newState}`);
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleShutdown = async () => {
    try {
      await api.post("/api/admin/shutdown");
      showToast("Shutdown initiated");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const availableGroups = useMemo(() => TABLE_GROUPS.filter((g) => g.tables.some((t) => tables.includes(t))), [tables]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100">
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden" />}

      <AdminSidebar
        activeTab={activeTab}
        onNavigate={navigateTab}
        availableGroups={availableGroups}
        activeGroup={activeGroup}
        setActiveGroup={setActiveGroup}
        selectedTable={selectedTable}
        onSelectTable={loadTable}
        user={user}
        logout={logout}
      />

      <div className="md:ml-72">
        <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} activeTab={activeTab} error={error} />

        {toast && (
          <div className="fixed top-5 right-5 z-50">
            <div className={`flex items-center gap-3 rounded-2xl border px-5 py-4 shadow-2xl backdrop-blur-xl animate-in slide-in-from-top-3 ${toast.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}`}>
              <SvgIcon path={toast.type === "success" ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"} className="w-5 h-5" />
              <span className="text-sm font-medium">{toast.message}</span>
            </div>
          </div>
        )}

        <main className="p-4 md:p-8 space-y-8">
          {stats && <StatsCards stats={stats} />}

          {activeTab === "overview" && (
            <DashboardOverview
              broadcast={broadcast}
              setBroadcast={setBroadcast}
              onSend={handleBroadcast}
              controls={controls}
              onToggle={toggleControl}
              onShutdown={() => setConfirmAction({ action: "shutdown" })}
            />
          )}

          {activeTab === "courses" && <CourseManager />}
          {activeTab === "subjects" && <SubjectManager />}
          {activeTab === "students" && <StudentManager />}

          {activeTab === "users" && (
            <PendingUsers users={pendingUsers} loading={pendingUsersLoading} onApprove={handleApprove} onReject={handleReject} />
          )}

          {activeTab === "all-users" && <UserManager />}
          {activeTab === "audit-logs" && <AuditLogViewer />}
          {activeTab === "roles" && <RoleManager />}
          {activeTab === "enrollment-history" && <EnrollmentHistory />}

          {activeTab === "enrollment" && (
            <PendingEnrollments enrollments={pendingEnrollments} loading={pendingEnrollmentsLoading} onUpdate={loadEnrollments} />
          )}

          {activeTab === "academic_config" && <AcademicConfigManager />}
          {activeTab === "completed-enrollments" && <CompletedEnrollments />}
          {activeTab === "evaluator-courses" && <EvaluatorCourses />}

          {activeTab === "sessions" && <SessionManager />}
          {activeTab === "evaluator-evaluations" && <EvaluatorEvaluations />}
          {activeTab === "bulk-import" && <BulkImport />}
          {activeTab === "reports" && <GradeReports />}

          {activeTab === "database" && (
            <DatabaseViewer selectedTable={selectedTable} tableData={tableData} tableLoading={tableLoading} onLoadTable={loadTable} />
          )}
        </main>
      </div>

      {confirmAction?.action === "shutdown" && (
        <ConfirmModal
          title="⚠️ Emergency Shutdown"
          message="Shut down the entire system? This cannot be undone."
          confirmLabel="Shut Down"
          confirmColor="bg-red-600 hover:bg-red-700"
          onConfirm={() => { setConfirmAction(null); handleShutdown(); }}
          onCancel={() => setConfirmAction(null)}
        />
      )}
    </div>
  );
}
