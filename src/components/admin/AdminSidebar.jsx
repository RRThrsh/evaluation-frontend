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
  Palette,
  Bookmark,
} from "lucide-react";

import { useMemo, useState, useRef, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";

/* ---------- Nav Item ---------- */
export function NavItem({
  icon: Icon,
  label,
  active,
  onClick,
  badge,
}) {
  return (
    <button
      onClick={onClick}
      className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
        active
          ? "bg-surface-muted text-text shadow-sm"
          : "text-text-secondary hover:bg-surface-muted hover:text-text"
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
              : "text-text-secondary group-hover:text-text"
          }`}
        />
      )}

      <span className="truncate">{label}</span>

      {badge != null && badge > 0 && (
        <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-[11px] font-bold leading-none text-white">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </button>
  );
}

/* ---------- Section Label ---------- */
export function SidebarLabel({ title }) {
  return (
    <div className="px-3 pt-5 pb-1">
      <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-text-secondary">
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
    {
      key: "guides",
      label: "Guides",
      icon: Bookmark,
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
  "users": "users.view",
  "undecided": "undecided",
  "pre-enrolled": "pre-enrolled",
  "all-users": "user-management.view",
  "audit-logs": "audit-logs",
  "evaluator-logs": "evaluator-logs",
  academic_config: "academic-config",
  sessions: "sessions",
  permissions: "permissions",
  snapshots: "snapshots",
  guides: "guides.view",
};

/* ---------- SIDEBAR ---------- */
const BADGE_MAP = {
  "undecided": "undecided",
  "pre-enrolled": "pre_enrolled",
  "users": "pending_users",
};

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
  badgeCounts = {},
}) {
  const navigate = useNavigate();

  const handleNav = (key) => {
    onNavigate(key);
    setSidebarOpen?.(false);
  };

  const hasPerm = (item) => {
    const perm = PERMISSION_MAP[item.key];
    if (!perm) return false;
    if (userPermissions.includes(perm)) return true;
    if ((item.key === "undecided" || item.key === "pre-enrolled") && userPermissions.includes("enrolled-students.view")) return true;
    return false;
  };

  const filteredNav = useMemo(() => {
    const filter = (items) =>
      items.filter(
        (item) =>
          isSuperAdmin ||
          hasPerm(item)
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
      className={`fixed left-0 top-0 z-40 flex h-screen w-72 flex-col border-r border-border bg-surface transition-transform md:translate-x-0 ${
        sidebarOpen
          ? "translate-x-0"
          : "-translate-x-full"
      }`}
    >
      {/* HEADER */}
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-sm">
            <GraduationCap size={16} />
          </div>

          <div className="leading-tight">
            <p className="text-sm font-bold text-text">
              Academic Evaluation
            </p>
            <p className="text-[10px] uppercase tracking-widest text-text-muted">
              Admin Console
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            setSidebarOpen?.(false)
          }
          className="rounded-lg p-1.5 text-text-muted hover:bg-surface-muted md:hidden"
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
              active={activeTab === item.key}
              onClick={() => handleNav(item.key)}
              badge={badgeCounts[BADGE_MAP[item.key]]}
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
              active={activeTab === item.key}
              onClick={() => handleNav(item.key)}
              badge={badgeCounts[BADGE_MAP[item.key]]}
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
              active={activeTab === item.key}
              onClick={() => handleNav(item.key)}
              badge={badgeCounts[BADGE_MAP[item.key]]}
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
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-text-secondary hover:bg-surface-muted"
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
                              ? "bg-primary-600 text-white"
                              : "text-text-secondary hover:bg-surface-muted"
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
      <div className="border-t border-border p-3 space-y-1">
        <div className="flex items-center justify-between rounded-xl bg-surface-muted px-3 py-2">
          <button
            onClick={() =>
              navigate("/profile")
            }
            className="min-w-0 text-left"
          >
            <p className="truncate text-sm font-semibold text-text">
              {user?.full_name ??
                "Admin"}
            </p>
            <p className="text-xs capitalize text-text-muted">
              {user?.role ?? "Admin"}
            </p>
          </button>

          <div className="flex items-center gap-1">
            <ThemeToggle />
            <button
              onClick={logout}
              className="rounded-lg p-1.5 text-text-muted hover:text-red-500"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ---------- Theme Toggle (minified for sidebar) ---------- */
const THEME_LABELS = {
  default: "Default",
  dark: "Dark",
  neutral: "Neutral",
  minimalist: "Minimal",
};

function ThemeToggle() {
  const { theme, setTheme, themes } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const currentIdx = themes.indexOf(theme);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((p) => !p)}
        className="rounded-lg p-1.5 text-text-muted hover:text-text-secondary"
        title={`Theme: ${THEME_LABELS[theme]}`}
      >
        <Palette size={16} />
      </button>
      {open && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 min-w-[130px] bg-surface border border-border rounded-xl shadow-lg overflow-hidden">
          {themes.map((t, i) => (
            <button
              key={t}
              onClick={() => { setTheme(t); setOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-left transition hover:bg-surface-muted ${
                i === currentIdx ? "font-semibold text-text bg-surface-muted" : "text-text-secondary"
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${
                t === "default" ? "bg-indigo-500" :
                t === "dark" ? "bg-slate-800" :
                t === "neutral" ? "bg-slate-400" :
                "bg-gray-300"
              } ring-1 ring-border/50 shrink-0`} />
              <span>{THEME_LABELS[t]}</span>
              {i === currentIdx && <span className="ml-auto text-primary-500 text-[10px]">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}