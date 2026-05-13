import { useState } from "react";

import {
    Users,
    Shield,
    Database,
    Activity,
    Bell,
    Search,
    Settings,
    LogOut,
    Server,
    UserCog,
} from "lucide-react";

import { Link } from "react-router-dom";

export default function AdminHome() {
    const [query, setQuery] = useState("");
    const [showProfile, setShowProfile] = useState(false);

    const user =
        JSON.parse(localStorage.getItem("user")) || {};

    const stats = [
        {
            title: "Total Users",
            value: 1250,
            icon: Users,
            color: "text-blue-400",
            bg: "bg-blue-500/10",
        },
        {
            title: "Moderators",
            value: 14,
            icon: Shield,
            color: "text-green-400",
            bg: "bg-green-500/10",
        },
        {
            title: "System Logs",
            value: 3290,
            icon: Database,
            color: "text-purple-400",
            bg: "bg-purple-500/10",
        },
        {
            title: "Server Health",
            value: "99%",
            icon: Activity,
            color: "text-yellow-400",
            bg: "bg-yellow-500/10",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">

            {/* Navbar */}
            <header className="border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">

                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

                    <div>
                        <h1 className="text-2xl font-bold">
                            Admin Dashboard
                        </h1>

                        <p className="text-sm text-slate-400">
                            Full system management and
                            analytics
                        </p>
                    </div>

                    <div className="flex items-center gap-4">

                        <button className="rounded-xl border border-white/10 bg-white/5 p-3 hover:bg-white/10">
                            <Bell size={20} />
                        </button>

                        {/* Profile */}
                        <div className="relative">

                            <button
                                onClick={() =>
                                    setShowProfile(
                                        !showProfile
                                    )
                                }
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
                                        {
                                            user.full_name
                                        }
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
                                            {
                                                user.full_name
                                            }
                                        </h3>

                                        <p className="text-sm text-slate-400">
                                            {
                                                user.email
                                            }
                                        </p>
                                    </div>

                                    <div className="p-2">

                                        <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 hover:bg-white/10">
                                            <Settings
                                                size={
                                                    18
                                                }
                                            />
                                            Settings
                                        </button>

                                        <Link to="/">
                                            <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-400 hover:bg-red-500/10">
                                                <LogOut
                                                    size={
                                                        18
                                                    }
                                                />
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

            <main className="mx-auto max-w-7xl px-6 py-10">

                {/* Search */}
                <div className="mb-8 flex items-center overflow-hidden rounded-2xl border border-white/10 bg-white/5">

                    <div className="pl-5 text-slate-500">
                        <Search size={20} />
                    </div>

                    <input
                        type="text"
                        value={query}
                        onChange={(e) =>
                            setQuery(e.target.value)
                        }
                        placeholder="Search users, logs, settings..."
                        className="w-full bg-transparent px-4 py-5 outline-none"
                    />

                    <button className="m-2 rounded-xl bg-blue-500 px-6 py-3 font-semibold hover:bg-blue-600">
                        Search
                    </button>
                </div>

                {/* Stats */}
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

                    {stats.map((stat) => {
                        const Icon = stat.icon;

                        return (
                            <div
                                key={stat.title}
                                className="rounded-3xl border border-white/10 bg-white/5 p-6"
                            >
                                <div className="flex justify-between">

                                    <div>
                                        <p className="text-sm text-slate-400">
                                            {
                                                stat.title
                                            }
                                        </p>

                                        <h2 className="mt-3 text-4xl font-bold">
                                            {
                                                stat.value
                                            }
                                        </h2>
                                    </div>

                                    <div
                                        className={`rounded-2xl p-4 ${stat.bg}`}
                                    >
                                        <Icon
                                            size={26}
                                            className={
                                                stat.color
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Admin Panels */}
                <div className="mt-10 grid gap-6 md:grid-cols-2">

                    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                        <div className="mb-5 flex items-center gap-3">
                            <UserCog className="text-blue-400" />
                            <h2 className="text-xl font-bold">
                                User Management
                            </h2>
                        </div>

                        <div className="space-y-4">

                            {[
                                "Manage Users",
                                "Assign Roles",
                                "Review Accounts",
                            ].map((item) => (
                                <button
                                    key={item}
                                    className="w-full rounded-2xl border border-white/10 bg-slate-900/50 px-5 py-4 text-left hover:bg-white/10"
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                        <div className="mb-5 flex items-center gap-3">
                            <Server className="text-green-400" />
                            <h2 className="text-xl font-bold">
                                System Controls
                            </h2>
                        </div>

                        <div className="space-y-4">

                            {[
                                "Server Monitoring",
                                "Database Backups",
                                "System Logs",
                            ].map((item) => (
                                <button
                                    key={item}
                                    className="w-full rounded-2xl border border-white/10 bg-slate-900/50 px-5 py-4 text-left hover:bg-white/10"
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}