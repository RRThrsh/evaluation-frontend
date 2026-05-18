import { useNavigate } from "react-router-dom";
import SvgIcon from "../common/SvgIcon";

export function NavItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`group relative flex w-full items-center gap-3 overflow-hidden rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
        active
          ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20"
          : "text-slate-400 hover:bg-slate-800 hover:text-white"
      }`}
    >
      <span className="relative z-10 shrink-0">{icon}</span>
      <span className="relative z-10">{label}</span>
    </button>
  );
}

export function SidebarLabel({ title }) {
  return (
    <div className="px-3 pt-4 pb-1">
      <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-600">{title}</p>
    </div>
  );
}

const NAV_ITEMS = {
  navigation: [
    { key: "overview", label: "Overview", icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" },
    { key: "database", label: "Database", icon: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" },
  ],
  management: [
    { key: "courses", label: "Courses", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" },
    { key: "subjects", label: "Subjects", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13" },
    { key: "students", label: "Students", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1" },
    { key: "users", label: "Users", icon: "M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
    { key: "enrollment", label: "Evaluated", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
  ],
  system: [
    { key: "all-users", label: "All Users", icon: "M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
    { key: "audit-logs", label: "Audit Logs", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" },
    { key: "roles", label: "Roles", icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" },
    { key: "academic_config", label: "Academic Config", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" },
    { key: "enrollment-history", label: "Enrollment History", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" },
    { key: "completed-enrollments", label: "Pre Enroll", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
    { key: "moderator-courses", label: "Moderator Courses", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
  ],
};

export default function AdminSidebar({ activeTab, onNavigate, availableGroups, activeGroup, setActiveGroup, selectedTable, onSelectTable, user, logout }) {
  const navigate = useNavigate();
  return (
    <aside className="fixed top-0 left-0 z-50 h-screen w-72 bg-slate-950/95 backdrop-blur-xl border-r border-slate-800 flex flex-col">
      <div className="relative overflow-hidden border-b border-slate-800 px-5 py-5">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-cyan-500/5" />
        <div className="relative flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/20">
            <span className="text-sm font-black text-white">A</span>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="truncate text-sm font-bold text-white">Admin Dashboard</h1>
            <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500">Control Center</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-2">
        <SidebarLabel title="Navigation" />
        {NAV_ITEMS.navigation.map((item) => (
          <NavItem key={item.key} icon={<SvgIcon path={item.icon} />} label={item.label} active={activeTab === item.key} onClick={() => { onNavigate(item.key); }} />
        ))}

        <SidebarLabel title="Management" />
        {NAV_ITEMS.management.map((item) => (
          <NavItem key={item.key} icon={<SvgIcon path={item.icon} />} label={item.label} active={activeTab === item.key} onClick={() => { onNavigate(item.key); }} />
        ))}

        <SidebarLabel title="System" />
        {NAV_ITEMS.system.map((item) => (
          <NavItem key={item.key} icon={<SvgIcon path={item.icon} />} label={item.label} active={activeTab === item.key} onClick={() => { onNavigate(item.key); }} />
        ))}

        {activeTab === "database" && (
          <div className="pt-3 space-y-2">
            <SidebarLabel title="Tables" />
            {availableGroups.map((group) => {
              const expanded = activeGroup === group.name;
              return (
                <div key={group.name} className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/40">
                  <button
                    onClick={() => setActiveGroup(expanded ? null : group.name)}
                    className="flex w-full items-center justify-between px-4 py-3 text-sm text-slate-300 hover:bg-slate-800/60 transition"
                  >
                    <span className="font-medium">{group.name}</span>
                    <SvgIcon path={expanded ? "M19 9l-7 7-7-7" : "M9 5l7 7-7 7"} className="w-4 h-4" />
                  </button>
                  {expanded && (
                    <div className="border-t border-slate-800 p-2 space-y-1">
                      {group.tables.filter((t) => availableGroups.some((g) => g.tables.includes(t))).map((t) => (
                        <button
                          key={t}
                          onClick={() => onSelectTable(t)}
                          className={`w-full rounded-xl px-3 py-2 text-left text-xs font-mono transition ${selectedTable === t ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
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

      <div className="border-t border-slate-800 p-4">
        <div className="flex items-center justify-between rounded-2xl bg-slate-900 px-4 py-3">
          <button onClick={() => navigate("/profile")} className="min-w-0 text-left group">
            <p className="truncate text-sm font-medium text-white group-hover:text-blue-400 transition">{user?.full_name ?? "Admin"}</p>
            <p className="text-xs text-slate-500 group-hover:text-slate-300 transition">Administrator</p>
          </button>
          <button onClick={logout} className="rounded-xl p-2 text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition">
            <SvgIcon path="M17 16l4-4m0 0l-4-4m4 4H7" className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
