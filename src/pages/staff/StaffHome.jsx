import { useState } from "react";
import {
    Search,
    Bell,
    ClipboardList,
    Users,
    FileCheck,
    Clock3,
    LogOut,
    User,
    Settings,
} from "lucide-react";

import { Link } from "react-router-dom";

export default function StaffHome() {
    const [query, setQuery] = useState("");
    const [showProfile, setShowProfile] = useState(false);

    // Logged in user
    const storedUser = JSON.parse(
        localStorage.getItem("user")
    );

    const user = storedUser || {
        full_name: "Staff User",
        email: "staff@example.com",
        role: "Staff",
    };

    // Dashboard stats
    const stats = [
        {
            title: "Pending Evaluations",
            value: 18,
            icon: Clock3,
            color: "text-yellow-400",
            bg: "bg-yellow-500/10",
        },
        {
            title: "Approved Requests",
            value: 42,
            icon: FileCheck,
            color: "text-green-400",
            bg: "bg-green-500/10",
        },
        {
            title: "Total Records",
            value: 128,
            icon: ClipboardList,
            color: "text-blue-400",
            bg: "bg-blue-500/10",
        },
        {
            title: "Active Staff",
            value: 12,
            icon: Users,
            color: "text-purple-400",
            bg: "bg-purple-500/10",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">

            {/* Navbar */}
            <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">

                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

                    {/* Logo */}
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Staff Dashboard
                        </h1>

                        <p className="text-sm text-slate-400">
                            Welcome back, {user.full_name}
                        </p>
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center gap-4">

                        {/* Notification */}
                        <button className="relative rounded-xl border border-white/10 bg-white/5 p-3 transition hover:bg-white/10">
                            <Bell size={20} />

                            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
                        </button>

                        {/* Profile */}
                        <div className="relative">

                            <button
                                onClick={() =>
                                    setShowProfile(
                                        !showProfile
                                    )
                                }
                                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-2 transition hover:bg-white/10"
                            >
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20 font-bold text-blue-400">
                                    {user.full_name
                                        ?.split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                        .slice(0, 2)
                                        .toUpperCase()}
                                </div>

                                <div className="hidden text-left md:block">
                                    <p className="text-sm font-semibold">
                                        {user.full_name}
                                    </p>

                                    <p className="text-xs text-slate-400">
                                        {user.role}
                                    </p>
                                </div>
                            </button>

                            {/* Dropdown */}
                            {showProfile && (
                                <div className="absolute right-0 mt-3 w-72 overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">

                                    {/* Header */}
                                    <div className="border-b border-white/10 p-5">

                                        <div className="flex items-center gap-4">

                                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/20 text-xl font-bold text-blue-400">
                                                {user.full_name
                                                    ?.split(
                                                        " "
                                                    )
                                                    .map(
                                                        (
                                                            n
                                                        ) =>
                                                            n[0]
                                                    )
                                                    .join("")
                                                    .slice(
                                                        0,
                                                        2
                                                    )
                                                    .toUpperCase()}
                                            </div>

                                            <div>
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
                                        </div>
                                    </div>

                                    {/* Menu */}
                                    <div className="p-2">

                                        <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-300 transition hover:bg-white/10">
                                            <User size={18} />
                                            Profile
                                        </button>

                                        <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-300 transition hover:bg-white/10">
                                            <Settings size={18} />
                                            Settings
                                        </button>

                                        <Link to="/">
                                            <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-400 transition hover:bg-red-500/10">
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

            {/* Main Content */}
            <main className="mx-auto max-w-7xl px-6 py-10">

                {/* Search */}
                <div className="mb-10">

                    <div className="flex items-center overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">

                        <div className="pl-5 text-slate-500">
                            <Search size={22} />
                        </div>

                        <input
                            type="text"
                            placeholder="Search records, evaluations, users..."
                            value={query}
                            onChange={(e) =>
                                setQuery(
                                    e.target.value
                                )
                            }
                            className="w-full bg-transparent px-4 py-5 text-white outline-none placeholder:text-slate-500"
                        />

                        <button className="m-2 rounded-xl bg-blue-500 px-6 py-3 font-semibold transition hover:bg-blue-600">
                            Search
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

                    {stats.map((stat) => {
                        const Icon = stat.icon;

                        return (
                            <div
                                key={stat.title}
                                className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition hover:bg-white/10"
                            >
                                <div className="flex items-start justify-between">

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
                                            className={
                                                stat.color
                                            }
                                            size={28}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Recent Activity */}
                <div className="mt-10 grid gap-6 lg:grid-cols-2">

                    {/* Recent Evaluations */}
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">

                        <div className="mb-6 flex items-center justify-between">

                            <h2 className="text-xl font-bold">
                                Recent Evaluations
                            </h2>

                            <button className="text-sm text-blue-400 hover:text-blue-300">
                                View All
                            </button>
                        </div>

                        <div className="space-y-4">

                            {[1, 2, 3].map((item) => (
                                <div
                                    key={item}
                                    className="rounded-2xl border border-white/10 bg-slate-900/50 p-5"
                                >
                                    <div className="flex items-center justify-between">

                                        <div>
                                            <h3 className="font-semibold">
                                                Evaluation #
                                                {
                                                    item
                                                }
                                            </h3>

                                            <p className="mt-1 text-sm text-slate-400">
                                                Submitted
                                                by Staff
                                                Member
                                            </p>
                                        </div>

                                        <span className="rounded-full bg-yellow-500/20 px-3 py-1 text-xs text-yellow-300">
                                            Pending
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">

                        <h2 className="mb-6 text-xl font-bold">
                            Quick Actions
                        </h2>

                        <div className="grid gap-4">

                            {[
                                "Create Evaluation",
                                "Manage Records",
                                "Review Requests",
                                "Generate Reports",
                            ].map((action) => (
                                <button
                                    key={action}
                                    className="rounded-2xl border border-white/10 bg-slate-900/50 px-5 py-4 text-left font-medium transition hover:bg-white/10"
                                >
                                    {action}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}