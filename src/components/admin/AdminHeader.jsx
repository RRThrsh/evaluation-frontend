import { Menu } from "lucide-react";
import NotificationBell from "../common/NotificationBell";

export default function AdminHeader({
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  error,
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
      <div className="flex items-center justify-between px-4 py-3 md:px-8">

        {/* LEFT SIDE */}
        <div className="flex items-center gap-3">

          {/* mobile menu */}
          <button
            onClick={() =>
              setSidebarOpen(true)
            }
            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 shadow-sm transition hover:bg-slate-50 md:hidden"
          >
            <Menu size={18} />
          </button>

          {/* title block */}
          <div className="leading-tight">
            <h2 className="text-lg font-bold text-slate-900 capitalize">
              {activeTab?.replace(
                /-/g,
                " "
              )}
            </h2>

            <div className="flex items-center gap-2">
              <p className="text-xs text-slate-500">
                System administration
              </p>

              <span className="text-slate-300">
                •
              </span>

              <p className="text-xs text-slate-400">
                Control center
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">

          <NotificationBell />

          {/* system status badge */}
          <div className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 md:flex">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            <span className="text-xs font-semibold text-emerald-700">
              System Online
            </span>
          </div>
        </div>
      </div>

      {/* ERROR BAR */}
      {error && (
        <div className="border-t border-red-100 bg-red-50/60 px-4 py-2 md:px-8">
          <div className="flex items-center gap-2 text-xs font-medium text-red-600">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            {error}
          </div>
        </div>
      )}
    </header>
  );
}