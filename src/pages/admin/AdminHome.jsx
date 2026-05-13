import { useState } from "react";

import {
    Users,
    Shield,
    Database,
    Activity,
    Search,
    UserCog,
    Server,
} from "lucide-react";

import AdminNavbar from "../../components/admin/AdminNavbar";
import StatCard from "../../components/admin/StatCard";

export default function AdminHome() {
    const [query, setQuery] = useState("");

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

            {/* NAVBAR (now separate file) */}
            <AdminNavbar />

            <main className="mx-auto max-w-7xl px-6 py-10">

                {/* Search */}
                <div className="mb-8 flex items-center overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                    <div className="pl-5 text-slate-500">
                        <Search size={20} />
                    </div>

                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search users, logs, settings..."
                        className="w-full bg-transparent px-4 py-5 outline-none"
                    />

                    <button className="m-2 rounded-xl bg-blue-500 px-6 py-3 font-semibold hover:bg-blue-600">
                        Search
                    </button>
                </div>

                {/* Stats */}
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                    {stats.map((stat) => (
                        <StatCard key={stat.title} {...stat} />
                    ))}
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
                            {["Manage Users", "Assign Roles", "Review Accounts"].map((item) => (
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
                            {["Server Monitoring", "Database Backups", "System Logs"].map((item) => (
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