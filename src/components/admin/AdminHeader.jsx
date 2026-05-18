import SvgIcon from "../common/SvgIcon";
import NotificationBell from "../common/NotificationBell";

export default function AdminHeader({ sidebarOpen, setSidebarOpen, activeTab, error }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
      <div className="flex items-center justify-between px-4 md:px-8 py-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden rounded-xl border border-slate-200 bg-white p-2 text-slate-600">
            <SvgIcon path="M4 6h16M4 12h16M4 18h16" className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg font-bold text-slate-900 capitalize">{activeTab?.replace(/-/g, " ")}</h2>
            <p className="text-xs text-slate-500">Manage and monitor your system</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <NotificationBell />
          <div className="hidden md:flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-slate-600">System Online</span>
          </div>
        </div>
      </div>
      {error && (
        <div className="px-4 md:px-8 pb-4">
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        </div>
      )}
    </header>
  );
}
