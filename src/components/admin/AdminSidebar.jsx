import { useNavigate } from "react-router-dom";
import { GraduationCap, LayoutDashboard, Database, BookOpen, BookText, Users, UserCheck, FileText, Settings, LogOut, ChevronDown, ChevronRight, ClipboardCheck, ClipboardList, Layers, Award, UserCircle, Activity, X, Clipboard } from "lucide-react";
import { useState } from "react";

export function NavItem({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
        active
          ? "bg-primary-600 text-white shadow-sm"
          : "text-slate-300 hover:bg-slate-800 hover:text-white"
      }`}
    >
      {Icon && <Icon size={18} />}
      <span>{label}</span>
    </button>
  );
}

export function SidebarLabel({ title }) {
  return (
    <div className="px-3 pt-5 pb-1">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{title}</p>
    </div>
  );
}

const NAV_ITEMS = {
  navigation: [
    { key: "overview", label: "Admin Console", icon: LayoutDashboard },
    { key: "database", label: "Database Explorer", icon: Database },
  ],
  management: [
    { key: "courses", label: "Programs", icon: BookOpen },
    { key: "subjects", label: "Subjects", icon: BookText },
    { key: "students", label: "Student Records", icon: Users },
    { key: "pre-evaluate", label: "Pre-Evaluate", icon: ClipboardCheck },
    { key: "pre-enrolled", label: "Pre-Enrolled", icon: ClipboardList },
    { key: "enrolled", label: "Enrolled Students", icon: UserCheck },
    { key: "grading", label: "Grading", icon: Award },
    { key: "sections", label: "Sections", icon: Layers },
    { key: "instructors", label: "Instructors", icon: UserCircle },
    { key: "users", label: "Pending Approvals", icon: UserCheck },
    { key: "class-subjects", label: "Class Subjects", icon: Clipboard },
  ],
  system: [
    { key: "all-users", label: "All Users", icon: Users },
    { key: "audit-logs", label: "Audit Trail", icon: FileText },
    { key: "evaluator-logs", label: "Evaluator Logs", icon: Activity },
    { key: "academic_config", label: "Academic Config", icon: Settings },
    { key: "sessions", label: "Active Sessions", icon: Users },
  ],
};

const GRADING_PERIODS = [
  { key: "prelim", label: "Prelim" },
  { key: "midterm", label: "Midterm" },
  { key: "finals", label: "Finals" },
  { key: "general_average", label: "General Average" },
];

export default function AdminSidebar({ activeTab, onNavigate, availableGroups, activeGroup, setActiveGroup, selectedTable, onSelectTable, user, logout, gradingPeriod, sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState({});
  const [gradingOpen, setGradingOpen] = useState(activeTab === "grading");

  const handleNav = (key, period) => { onNavigate(key, period); setSidebarOpen?.(false); };

  const toggleGroup = (name) => {
    setActiveGroup(activeGroup === name ? null : name);
  };

  return (
    <aside className={`fixed top-0 left-0 z-40 h-screen w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
      <div className="px-4 h-16 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white">
            <GraduationCap size={16} />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white leading-tight">Academic Evaluation</h1>
            <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider">Admin Console</p>
          </div>
        </div>
        <button onClick={() => setSidebarOpen?.(false)} className="md:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition">
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <SidebarLabel title="Navigation" />
        {NAV_ITEMS.navigation.map((item) => (
          <NavItem key={item.key} icon={item.icon} label={item.label} active={activeTab === item.key} onClick={() => handleNav(item.key)} />
        ))}

        <SidebarLabel title="Management" />
        {NAV_ITEMS.management.map((item) =>
          item.key === "grading" ? (
            <div key="grading">
              <button
                onClick={() => { setGradingOpen((o) => !o); handleNav("grading"); }}
                className={`flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "grading" ? "bg-primary-600 text-white shadow-sm" : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <item.icon size={18} />
                <span className="flex-1 text-left">{item.label}</span>
                {gradingOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
              {gradingOpen && (
                <div className="ml-6 mt-1 space-y-0.5">
                  {GRADING_PERIODS.map((p) => (
                    <button
                      key={p.key}
                      onClick={() => handleNav("grading", p.key)}
                      className={`w-full rounded-md px-3 py-1.5 text-left text-xs font-medium transition ${
                        activeTab === "grading" && gradingPeriod === p.key
                          ? "bg-primary-500/30 text-white"
                          : "text-slate-400 hover:bg-slate-800 hover:text-white"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <NavItem key={item.key} icon={item.icon} label={item.label} active={activeTab === item.key} onClick={() => handleNav(item.key)} />
          )
        )}

        <SidebarLabel title="System" />
        {NAV_ITEMS.system.map((item) => (
          <NavItem key={item.key} icon={item.icon} label={item.label} active={activeTab === item.key} onClick={() => handleNav(item.key)} />
        ))}

        {activeTab === "database" && (
          <div className="mt-3 space-y-1">
            <SidebarLabel title="Tables" />
            {availableGroups.map((group) => {
              const expanded = activeGroup === group.name;
              return (
                <div key={group.name} className="rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleGroup(group.name)}
                    className="flex w-full items-center justify-between px-3 py-2 text-sm text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition"
                  >
                    <span className="font-medium">{group.name}</span>
                    {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </button>
                  {expanded && (
                    <div className="ml-2 mt-1 space-y-0.5">
                      {group.tables.map((t) => (
                        <button
                          key={t}
                          onClick={() => onSelectTable(t)}
                          className={`w-full rounded-md px-3 py-1.5 text-left text-xs font-mono transition ${selectedTable === t ? "bg-primary-600 text-white" : "text-slate-500 hover:bg-slate-800 hover:text-slate-300"}`}
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

      <div className="border-t border-slate-800 p-3">
        <div className="flex items-center justify-between rounded-lg bg-slate-800/50 px-3 py-2">
          <button onClick={() => navigate("/profile")} className="min-w-0 text-left">
            <p className="truncate text-sm font-medium text-white">{user?.full_name ?? "Admin"}</p>
            <p className="text-xs text-slate-500">Administrator</p>
          </button>
          <button onClick={logout} className="rounded-lg p-1.5 text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
