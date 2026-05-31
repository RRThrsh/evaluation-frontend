import {
  lazy,
  Suspense,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  AlertCircle,
} from "lucide-react";

import api from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";
import { PermissionProvider } from "../../../context/PermissionContext";

import AdminSidebar from "../../../components/admin/AdminSidebar";
import AdminHeader from "../../../components/admin/AdminHeader";
import ConfirmModal from "../../../components/common/ConfirmModal";

import { sanitizeInput } from "../../../utils/sanitize";

/* Lazy modules */
const DashboardOverview = lazy(
  () =>
    import(
      "../../../components/admin/DashboardOverview"
    )
);
const PendingUsers = lazy(
  () =>
    import(
      "../../../components/admin/PendingUsers"
    )
);
const DatabaseViewer = lazy(
  () =>
    import(
      "../../../components/admin/DatabaseViewer"
    )
);
const CourseManager = lazy(
  () =>
    import(
      "../../../components/admin/CourseManager"
    )
);
const SubjectManager = lazy(
  () =>
    import(
      "../../../components/admin/SubjectManager"
    )
);
const StudentManager = lazy(
  () =>
    import(
      "../../../components/admin/StudentManager"
    )
);
const AcademicConfigManager = lazy(
  () =>
    import(
      "../../../components/admin/AcademicConfigManager"
    )
);
const UserManager = lazy(
  () =>
    import(
      "../../../components/admin/UserManager"
    )
);
const AuditLogViewer = lazy(
  () =>
    import(
      "../../../components/admin/AuditLogViewer"
    )
);
const EvaluatorLogs = lazy(
  () =>
    import(
      "../../../components/admin/EvaluatorLogs"
    )
);
const SessionManager = lazy(
  () =>
    import(
      "../../../components/admin/SessionManager"
    )
);
const AdminPreEnrolled = lazy(
  () =>
    import(
      "../../../components/admin/AdminPreEnrolled"
    )
);

const PermissionManager = lazy(
  () =>
    import(
      "../../../components/admin/PermissionManager"
    )
);
const Snapshots = lazy(
  () =>
    import(
      "../../../components/admin/Snapshots"
    )
);
const AdminUndecided = lazy(
  () =>
    import(
      "../../../components/admin/AdminUndecided"
    )
);

const TABLE_GROUPS = [
  {
    name: "Academic",
    tables: [
      "students",
      "subjects",
      "student_subjects",
      "student_units",
    ],
  },
  {
    name: "System",
    tables: ["academic_config"],
  },
];

export default function AdminHome() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [activeTab, setActiveTab] =
    useState("overview");

  const [activeGroup, setActiveGroup] =
    useState(null);

  const [selectedTable, setSelectedTable] =
    useState(null);

  const [tableData, setTableData] =
    useState(null);

  const [tableLoading, setTableLoading] =
    useState(false);

  const [controls, setControls] =
    useState([]);

  const [broadcast, setBroadcast] =
    useState("");

  const [error, setError] = useState("");

  const [tables, setTables] = useState([]);

  const [toast, setToast] =
    useState(null);

  const [confirmAction, setConfirmAction] =
    useState(null);

  const [pendingUsers, setPendingUsers] =
    useState([]);

  const [
    pendingUsersLoading,
    setPendingUsersLoading,
  ] = useState(false);

  const [userPermissions, setUserPermissions] =
    useState([]);

  const [badgeCounts, setBadgeCounts] =
    useState({ pending_users: 0, pending_evaluations: 0, pre_enrolled: 0 });

  const isSuperAdmin =
    user?.role === "superadmin";

  /* badge counts */
  useEffect(() => {
    const fetch = () => {
      api.get("/api/admin/badge-counts")
        .then((r) => setBadgeCounts(r.data ?? { pending_users: 0, pending_evaluations: 0, pre_enrolled: 0 }))
        .catch(() => {});
    };
    fetch();
    const id = setInterval(fetch, 30000);
    return () => clearInterval(id);
  }, []);

  /* permissions */
  useEffect(() => {
    api.get("/api/admin/my-permissions")
      .then((r) =>
        setUserPermissions(
          r.data || []
        )
      )
      .catch(() => {});
  }, []);

  /* controls */
  useEffect(() => {
    api.get("/api/admin/controls")
      .then((d) =>
        setControls(
          d.data?.controls ?? []
        )
      )
      .catch(() => {});
  }, []);

  /* tables */
  useEffect(() => {
    if (
      activeTab !== "database" ||
      tables.length > 0
    )
      return;

    api.get("/api/admin/tables")
      .then((d) => {
        const tbls = d.data ?? [];
        setTables(tbls);

        const first =
          TABLE_GROUPS.find((g) =>
            g.tables.some((t) =>
              tbls.includes(t)
            )
          );

        if (first)
          setActiveGroup(first.name);
      })
      .catch(() => {});
  }, [activeTab]);

  /* users */
  useEffect(() => {
    if (activeTab !== "users") return;

    setPendingUsersLoading(true);

    api.get("/api/admin/pending-users")
      .then((data) =>
        setPendingUsers(
          data.data ?? []
        )
      )
      .catch((err) =>
        setError(err.message)
      )
      .finally(() =>
        setPendingUsersLoading(false)
      );
  }, [activeTab]);

  const handleApprove = async (id) => {
    try {
      await api.post(`/api/admin/users/${id}/approve`);
      setPendingUsers((prev) => prev.filter((u) => u.id !== id));
      showToast("User approved successfully");
    } catch (err) {
      showToast(err.message || "Failed to approve user", "error");
    }
  };

  const handleReject = async (id) => {
    try {
      await api.post(`/api/admin/users/${id}/reject`);
      setPendingUsers((prev) => prev.filter((u) => u.id !== id));
      showToast("User rejected");
    } catch (err) {
      showToast(err.message || "Failed to reject user", "error");
    }
  };

  /* helpers */
  const showToast = (
    message,
    type = "success"
  ) => {
    setToast({ message, type });

    setTimeout(
      () => setToast(null),
      3000
    );
  };

  const navigateTab = (key) => {
    setActiveTab(key);
    setSelectedTable(null);
    setSidebarOpen(false);
  };

  const loadTable = async (
    tableName
  ) => {
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

  const availableGroups =
    useMemo(
      () =>
        TABLE_GROUPS.filter((g) =>
          g.tables.some((t) =>
            tables.includes(t)
          )
        ),
      [tables]
    );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* overlay */}
      {sidebarOpen && (
        <div
          onClick={() =>
            setSidebarOpen(false)
          }
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
        />
      )}

      {/* sidebar */}
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
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          userPermissions={userPermissions}
          isSuperAdmin={isSuperAdmin}
          badgeCounts={badgeCounts}
        />

      {/* content */}
      <div className="md:ml-64">
        <AdminHeader
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activeTab={activeTab}
          error={error}
        />

        {/* toast */}
        {toast && (
          <div className="fixed right-5 top-5 z-50">
            <div
              className={`flex items-center gap-3 rounded-2xl border bg-white px-4 py-3 shadow-xl ${
                toast.type === "success"
                  ? "border-emerald-200 text-emerald-700"
                  : "border-red-200 text-red-700"
              }`}
            >
              {toast.type ===
              "success" ? (
                <CheckCircle size={18} />
              ) : (
                <AlertCircle size={18} />
              )}

              <span className="text-sm font-medium">
                {toast.message}
              </span>
            </div>
          </div>
        )}

        {/* main */}
        <main className="space-y-8 p-4 md:p-8">
          <Suspense
            fallback={
              <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
              </div>
            }
          >
            <PermissionProvider
              value={{
                userPermissions,
                isSuperAdmin,
              }}
            >
              {activeTab ===
                "overview" && (
                <DashboardOverview
                  onNavigate={navigateTab}
                />
              )}

              {activeTab ===
                "courses" && (
                <CourseManager />
              )}

              {activeTab ===
                "subjects" && (
                <SubjectManager />
              )}

              {activeTab ===
                "students" && (
                <StudentManager />
              )}

              {activeTab ===
                "users" && (
                <PendingUsers
                  users={pendingUsers}
                  loading={
                    pendingUsersLoading
                  }
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              )}

              {activeTab ===
                "all-users" && (
                <UserManager />
              )}

              {activeTab ===
                "audit-logs" && (
                <AuditLogViewer />
              )}

              {activeTab ===
                "evaluator-logs" && (
                <EvaluatorLogs />
              )}

              {activeTab ===
                "academic_config" && (
                <AcademicConfigManager />
              )}

              {activeTab ===
                "undecided" && (
                <AdminUndecided />
              )}

              {activeTab ===
                "pre-enrolled" && (
                <AdminPreEnrolled />
              )}

              {activeTab ===
                "sessions" && (
                <SessionManager />
              )}

              {activeTab ===
                "permissions" && (
                <PermissionManager />
              )}

              {activeTab ===
                "snapshots" && (
                <Snapshots />
              )}

              {activeTab ===
                "database" && (
                <DatabaseViewer
                  selectedTable={
                    selectedTable
                  }
                  tableData={tableData}
                  tableLoading={
                    tableLoading
                  }
                  onLoadTable={
                    loadTable
                  }
                />
              )}
            </PermissionProvider>
          </Suspense>
        </main>
      </div>

      {/* confirm */}
      {confirmAction?.action ===
        "shutdown" && (
        <ConfirmModal
          title="Emergency Shutdown"
          message="Shut down the entire system? This cannot be undone."
          confirmLabel="Shut Down"
          confirmVariant="danger"
          onConfirm={() => {
            setConfirmAction(null);
            // handleShutdown();
          }}
          onCancel={() =>
            setConfirmAction(null)
          }
        />
      )}
    </div>
  );
}