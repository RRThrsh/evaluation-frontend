import { useState } from "react";
import {
    ShieldCheck,
    Bell,
    Search,
    AlertTriangle,
    Users,
    Ban,
    FileWarning,
    LogOut,
    Settings,
} from "lucide-react";

import { Link } from "react-router-dom";

export default function ModeratorHome() {
    const [query, setQuery] = useState("");
    const [showProfile, setShowProfile] = useState(false);

    const user =
        JSON.parse(localStorage.getItem("user")) || {};

    const stats = [
        {
            title: "Reported Cases",
            value: 14,
            icon: AlertTriangle,
            color: "text-red-400",
            bg: "bg-red-500/10",
        },
        {
            title: "Flagged Users",
            value: 8,
            icon: Ban,
            color: "text-yellow-400",
            bg: "bg-yellow-500/10",
        },
        {
            title: "Active Moderators",
            value: 5,
            icon: ShieldCheck,
            color: "text-blue-400",
            bg: "bg-blue-500/10",
        },
        {
            title: "Resolved Reports",
            value: 64,
            icon: FileWarning,
            color: "text-green-400",
            bg: "bg-green-500/10",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">

            {/* Navbar */}
            <header className="border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

                    <div>
                        <h1 className="text-2xl font-bold">
                            Moderator Dashboard
                        </h1>

                        <p className="text-sm text-slate-400">
                            Manage reports and maintain
                            platform integrity
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
                                        Moderator
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
                        placeholder="Search reports, users..."
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

                {/* Reports */}
                <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6">

                    <div className="mb-6 flex items-center justify-between">

                        <h2 className="text-xl font-bold">
                            Recent Reports
                        </h2>

                        <button className="text-blue-400">
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
                                            Report #
                                            {item}
                                        </h3>

                                        <p className="mt-1 text-sm text-slate-400">
                                            User
                                            misconduct
                                            reported
                                        </p>
                                    </div>

                                    <span className="rounded-full bg-red-500/20 px-3 py-1 text-xs text-red-300">
                                        High Priority
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}