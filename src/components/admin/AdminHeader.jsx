import { Menu } from "lucide-react";
import NotificationBell from "../common/NotificationBell";
import ThemeSwitcher from "../common/ThemeSwitcher";

export default function AdminHeader({
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  error,
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/80 backdrop-blur-xl">
      <div className="flex items-center justify-between px-4 py-3 md:px-8">

        {/* LEFT SIDE */}
        <div className="flex items-center gap-3">

          {/* mobile menu */}
          <button
            onClick={() =>
              setSidebarOpen(true)
            }
            className="rounded-xl border border-border bg-surface p-2 text-text-secondary shadow-sm transition hover:bg-surface-muted md:hidden"
          >
            <Menu size={18} />
          </button>

          {/* title block */}
          <div className="leading-tight">
            <h2 className="text-lg font-bold text-text capitalize">
              {activeTab?.replace(
                /-/g,
                " "
              )}
            </h2>

            <div className="flex items-center gap-2">
              <p className="text-xs text-text-secondary">
                System administration
              </p>

              <span className="text-text-muted">
                •
              </span>

              <p className="text-xs text-text-muted">
                Control center
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">

          <ThemeSwitcher />

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