import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import {
  LogOut,
  ChevronRight,
  UserCircle2,
} from "lucide-react";

export default function ProfileHeader() {
  const { user, logout } = useAuth();

  const dashboardLink = {
    superadmin: "/admin",
    admin: "/admin",
    evaluator: "/evaluator",
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6 lg:px-8">
        {/* Left */}
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div className="hidden sm:flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-lg">
            <UserCircle2 size={22} />
          </div>

          {/* Breadcrumb */}
          <div>
            <div className="flex items-center gap-2 text-sm">
              <Link
                to={dashboardLink[user?.role] || "/"}
                className="font-medium text-slate-400 transition hover:text-slate-700"
              >
                Dashboard
              </Link>

              <ChevronRight
                size={14}
                className="text-slate-300"
              />

              <span className="font-semibold text-slate-900">
                Profile
              </span>
            </div>

            <p className="mt-1 hidden text-xs text-slate-500 sm:block">
              Manage your personal information and account settings.
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* User Badge */}
          <div className="hidden md:flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-2 shadow-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-bold text-white">
              {user?.full_name
                ? user.full_name.charAt(0).toUpperCase()
                : "U"}
            </div>

            <div className="leading-tight">
              <p className="text-sm font-semibold text-slate-800">
                {user?.full_name || "User"}
              </p>

              <p className="text-xs capitalize text-slate-500">
                {user?.role || "Member"}
              </p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            className="group flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-red-200 hover:bg-red-50 hover:text-red-600 hover:shadow-md"
          >
            <LogOut
              size={16}
              className="transition-transform duration-200 group-hover:-translate-x-0.5"
            />

            <span className="hidden sm:inline">
              Logout
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}