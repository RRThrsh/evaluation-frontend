import { useState } from "react";
import { Bell, Settings, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminNavbar() {
    const [showProfile, setShowProfile] = useState(false);

    const user =
        JSON.parse(localStorage.getItem("user")) || {};

    return (
        <header className="border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

                <div>
                    <h1 className="text-2xl font-bold">
                        Admin Dashboard
                    </h1>
                    <p className="text-sm text-slate-400">
                        Full system management and analytics
                    </p>
                </div>

                <div className="flex items-center gap-4">

                    {/* Bell */}
                    <button className="rounded-xl border border-white/10 bg-white/5 p-3 hover:bg-white/10">
                        <Bell size={20} />
                    </button>

                    {/* Profile */}
                    <div className="relative">

                        <button
                            onClick={() => setShowProfile(!showProfile)}
                            className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-2 hover:bg-white/10"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20 font-bold text-blue-400">
                                {user.full_name
                                    ?.split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .slice(0, 2)}
                            </div>

                            <div className="hidden md:block">
                                <p className="text-sm font-semibold">
                                    {user.full_name}
                                </p>
                                <p className="text-xs text-slate-400">
                                    Admin
                                </p>
                            </div>
                        </button>

                        {showProfile && (
                            <div className="absolute right-0 mt-3 w-72 rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">

                                <div className="border-b border-white/10 p-5">
                                    <h3 className="font-semibold">
                                        {user.full_name}
                                    </h3>
                                    <p className="text-sm text-slate-400">
                                        {user.email}
                                    </p>
                                </div>

                                <div className="p-2">

                                    <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 hover:bg-white/10">
                                        <Settings size={18} />
                                        Settings
                                    </button>

                                    <Link to="/">
                                        <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-400 hover:bg-red-500/10">
                                            <LogOut size={18} />
                                            Logout
                                        </button>
                                    </Link>

                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}