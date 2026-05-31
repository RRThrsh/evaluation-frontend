import {
  useNavigate,
} from "react-router-dom";

import {
  GraduationCap,
  LayoutDashboard,
  Database,
  BookOpen,
  BookText,
  Users,
  UserCheck,
  FileText,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  ClipboardList,
  Activity,
  X,
  Shield,
  History,
} from "lucide-react";

import { useMemo } from "react";

/* ---------- Nav Item ---------- */
export function NavItem({
  icon: Icon,
  label,
  active,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
        active
          ? "bg-slate-100 text-slate-900 shadow-sm"
          : "text-slate-500 hover:bg-slate-800/40 hover:text-white"
      }`}
    >
      {/* active indicator */}
      {active && (
        <div className="absolute left-0 top-2 h-6 w-1 rounded-r-full bg-primary-600" />
      )}

      {Icon && (
        <Icon
          size={18}
          className={`transition ${
            active
              ? "text-primary-600"
              : "text-slate-500 group-hover:text-white"
          }`}
        />
      )}

      <span className="truncate">{label}</span>
    </button>
  );
}

/* ---------- Section Label ---------- */
export function SidebarLabel({ title }) {
  return (
    <div className="px-3 pt-5 pb-1">
      <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500">
        {title}
      </p>
    </div>
  );
}

/* ---------- NAV DATA ---------- */
const NAV_ITEMS = {
  navigation: [
    {
      key: "overview",
      label: "Admin Console",
      icon: LayoutDashboard,
    },
    {
      key: "database",
      label: "Database Explorer",
      icon: Database,
    },
  ],
  management: [
    {
      key: "courses",
      label: "Programs",
      icon: BookOpen,
    },
    {
      key: "subjects",
      label: "Subjects",
      icon: BookText,
    },
    {
      key: "students",
      label: "Student Records",
      icon: Users,
    },
    {
      key: "undecided",
      label: "Undecided",
      icon: ClipboardCheck,
    },
    {
      key: "pre-enrolled",
      label: "Pre-Enrolled",
      icon: ClipboardList,
    },
    {
      key: "users",
      label: "Pending Approvals",
      icon: UserCheck,
    },

  ],
  system: [
    {
      key: "all-users",
      label: "All Users",
      icon: Users,
    },
    {
      key: "audit-logs",
      label: "Audit Trail",
      icon: FileText,
    },
    {
      key: "evaluator-logs",
      label: "Evaluator Logs",
      icon: Activity,
    },
    {
      key: "academic_config",
      label: "Academic Config",
      icon: Settings,
    },
    {
      key: "sessions",
      label: "Sessions",
      icon: Users,
    },
    {
      key: "permissions",
      label: "Permissions",
      icon: Shield,
    },
    {
      key: "snapshots",
      label: "Snapshots",
      icon: History,
    },
  ],
};

/* ---------- PERMISSIONS ---------- */
const PERMISSION_MAP = {
  overview: "dashboard",
  database: "database.view",
  courses: "courses.view",
  subjects: "subjects.view",
  students: "students.view",
  "undecided": "undecided",
  "pre-enrolled": "pre-enrolled",
  "all-users": "user-management.view",
  "audit-logs": "audit-logs",
  "evaluator-logs": "evaluator-logs",
  academic_config: "academic-config",
  sessions: "sessions",
  permissions: "permissions",
  snapshots: "snapshots",
};

/* ---------- SIDEBAR ---------- */
export default function AdminSidebar({
  activeTab,
  onNavigate,
  availableGroups,
  activeGroup,
  setActiveGroup,
  selectedTable,
  onSelectTable,
  user,
  logout,
  sidebarOpen,
  setSidebarOpen,
  userPermissions = [],
  isSuperAdmin = false,
}) {
  const navigate = useNavigate();

  const handleNav = (key) => {
    onNavigate(key);
    setSidebarOpen?.(false);
  };

  const filteredNav = useMemo(() => {
    const filter = (items) =>
      items.filter(
        (item) =>
          isSuperAdmin ||
          userPermissions.includes(
            PERMISSION_MAP[item.key]
          )
      );

    return {
      navigation: filter(
        NAV_ITEMS.navigation
      ),
      management: filter(
        NAV_ITEMS.management
      ),
      system: filter(NAV_ITEMS.system),
    };
  }, [userPermissions, isSuperAdmin]);

  return (
    <aside
      className={`fixed left-0 top-0 z-40 flex h-screen w-72 flex-col border-r border-slate-200 bg-white transition-transform md:translate-x-0 ${
        sidebarOpen
          ? "translate-x-0"
          : "-translate-x-full"
      }`}
    >
      {/* HEADER */}
      <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-sm">
            <GraduationCap size={16} />
          </div>

          <div className="leading-tight">
            <p className="text-sm font-bold text-slate-900">
              Academic Evaluation
            </p>
            <p className="text-[10px] uppercase tracking-widest text-slate-400">
              Admin Console
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            setSidebarOpen?.(false)
          }
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 md:hidden"
        >
          <X size={18} />
        </button>
      </div>

      {/* NAV */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        <SidebarLabel title="Navigation" />
        {filteredNav.navigation.map(
          (item) => (
            <NavItem
              key={item.key}
              icon={item.icon}
              label={item.label}
              active={
                activeTab === item.key
              }
              onClick={() =>
                handleNav(item.key)
              }
            />
          )
        )}

        <SidebarLabel title="Management" />
        {filteredNav.management.map(
          (item) => (
            <NavItem
              key={item.key}
              icon={item.icon}
              label={item.label}
              active={
                activeTab === item.key
              }
              onClick={() =>
                handleNav(item.key)
              }
            />
          )
        )}

        <SidebarLabel title="System" />
        {filteredNav.system.map(
          (item) => (
            <NavItem
              key={item.key}
              icon={item.icon}
              label={item.label}
              active={
                activeTab === item.key
              }
              onClick={() =>
                handleNav(item.key)
              }
            />
          )
        )}

        {/* DATABASE */}
        {activeTab === "database" && (
          <div className="pt-3">
            <SidebarLabel title="Tables" />

            {availableGroups.map((g) => {
              const open =
                activeGroup === g.name;

              return (
                <div key={g.name}>
                  <button
                    onClick={() =>
                      setActiveGroup(
                        open
                          ? null
                          : g.name
                      )
                    }
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-100"
                  >
                    <span>{g.name}</span>
                    {open ? (
                      <ChevronDown size={14} />
                    ) : (
                      <ChevronRight
                        size={14}
                      />
                    )}
                  </button>

                  {open && (
                    <div className="ml-2 space-y-1">
                      {g.tables.map((t) => (
                        <button
                          key={t}
                          onClick={() =>
                            onSelectTable(t)
                          }
                          className={`w-full rounded-md px-3 py-1.5 text-left text-xs font-mono transition ${
                            selectedTable ===
                            t
                              ? "bg-slate-900 text-white"
                              : "text-slate-500 hover:bg-slate-100"
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
      <div className="border-t border-slate-200 p-3">
        <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
          <button
            onClick={() =>
              navigate("/profile")
            }
            className="min-w-0 text-left"
          >
            <p className="truncate text-sm font-semibold text-slate-900">
              {user?.full_name ??
                "Admin"}
            </p>
            <p className="text-xs capitalize text-slate-400">
              {user?.role ?? "Admin"}
            </p>
          </button>

          <button
            onClick={logout}
            className="rounded-lg p-1.5 text-slate-400 hover:text-red-500"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}