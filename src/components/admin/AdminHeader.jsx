import { Menu } from "lucide-react";
import NotificationBell from "../common/NotificationBell";

export default function AdminHeader({ sidebarOpen, setSidebarOpen, activeTab, error }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 md:px-8 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50">
            <Menu size={18} />
          </button>
          <div>
            <h2 className="text-lg font-bold text-slate-900 capitalize">{activeTab?.replace(/-/g, " ")}</h2>
            <p className="text-xs text-slate-500">System administration &amp; configuration</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <NotificationBell />
          <div className="hidden md:flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 shadow-xs">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-slate-600">System Online</span>
          </div>
        </div>
      </div>
      {error && (
        <div className="px-4 md:px-8 pb-3">
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</div>
        </div>
      )}
    </header>
  );
}
