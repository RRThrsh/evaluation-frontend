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

import StatCard from "../../components/admin/StatCard";

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

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">

            <main className="mx-auto max-w-7xl">
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