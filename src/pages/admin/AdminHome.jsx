import { useMemo, useState } from "react";

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

// Reusable panel component
function AdminPanel({ icon: Icon, title, items, iconColor = "text-blue-400" }) {
    return (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="mb-5 flex items-center gap-3">
                <Icon className={iconColor} />
                <h2 className="text-xl font-bold">{title}</h2>
            </div>

            <div className="space-y-4">
                {items.map((item) => (
                    <button
                        key={item}
                        type="button"
                        className="w-full cursor-pointer rounded-2xl border border-white/10 bg-slate-900/50 px-5 py-4 text-left transition hover:bg-white/10"
                        onClick={() => console.log(`${title}:`, item)}
                    >
                        {item}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default function AdminHome() {
    const [query, setQuery] = useState("");

    const stats = useMemo(
        () => [
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
        ],
        []
    );

    const handleSearch = () => {
        if (!query.trim()) return;
        console.log("Searching:", query);
        // later: call API here
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">

            <AdminNavbar />

            <main className="mx-auto max-w-7xl px-6 py-10">

                {/* SEARCH */}
                <div className="mb-8 flex items-center overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                    <div className="pl-5 text-slate-500">
                        <Search size={20} />
                    </div>

                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSearch();
                        }}
                        placeholder="Search users, logs, settings..."
                        aria-label="Search admin panel"
                        className="w-full bg-transparent px-4 py-5 outline-none"
                    />

                    <button
                        type="button"
                        onClick={handleSearch}
                        className="m-2 rounded-xl bg-blue-500 px-6 py-3 font-semibold transition hover:bg-blue-600 disabled:opacity-50"
                        disabled={!query.trim()}
                    >
                        Search
                    </button>
                </div>

                {/* STATS */}
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                    {stats.map((stat) => (
                        <StatCard key={stat.title} {...stat} />
                    ))}
                </div>

                {/* PANELS */}
                <div className="mt-10 grid gap-6 md:grid-cols-2">

                    <AdminPanel
                        icon={UserCog}
                        title="User Management"
                        iconColor="text-blue-400"
                        items={[
                            "Manage Users",
                            "Assign Roles",
                            "Review Accounts",
                        ]}
                    />

                    <AdminPanel
                        icon={Server}
                        title="System Controls"
                        iconColor="text-green-400"
                        items={[
                            "Server Monitoring",
                            "Database Backups",
                            "System Logs",
                        ]}
                    />

                </div>
            </main>
        </div>
    );
}