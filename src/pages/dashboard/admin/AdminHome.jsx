import React, { useState } from "react";

export default function AdminHome() {
    const [broadcast, setBroadcast] = useState("");

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">

            {/* TOP BAR */}
            <nav className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse"></div>
                    <h1 className="font-bold tracking-wider uppercase text-sm">
                        Admin Control Hub
                    </h1>
                </div>

                <div className="text-xs text-slate-400">
                    System: <span className="text-emerald-400 font-bold">ONLINE</span>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto p-6 space-y-8">

                {/* SYSTEM OVERVIEW */}
                <section className="grid grid-cols-1 md:grid-cols-4 gap-4">

                    {[
                        { label: "Users", value: "1,204" },
                        { label: "Staff Online", value: "38" },
                        { label: "Pending Requests", value: "14" },
                        { label: "System Load", value: "42%" },
                    ].map((stat, i) => (
                        <div
                            key={i}
                            className="bg-slate-900 border border-slate-800 rounded-xl p-5"
                        >
                            <p className="text-xs text-slate-500 uppercase tracking-widest">
                                {stat.label}
                            </p>
                            <p className="text-2xl font-bold mt-2 text-indigo-400">
                                {stat.value}
                            </p>
                        </div>
                    ))}

                </section>

                {/* MAIN CONTROL GRID */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* LEFT: SYSTEM LOGS */}
                    <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">

                        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                            <h2 className="font-semibold">System Activity Logs</h2>

                            <input
                                placeholder="Search logs..."
                                className="bg-slate-950 border border-slate-800 px-3 py-1 rounded-md text-xs focus:outline-none focus:border-indigo-500"
                            />
                        </div>

                        <div className="divide-y divide-slate-800">

                            {[
                                { time: "23:10", user: "Admin", action: "USER_SUSPENDED" },
                                { time: "22:45", user: "Moderator", action: "REQUEST_APPROVED" },
                                { time: "21:12", user: "Staff", action: "REQUEST_SENT" },
                            ].map((log, i) => (
                                <div
                                    key={i}
                                    className="p-4 flex justify-between hover:bg-slate-800/50"
                                >
                                    <div>
                                        <p className="text-sm font-medium text-slate-200">
                                            {log.user}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {log.action}
                                        </p>
                                    </div>

                                    <span className="text-xs text-slate-500">
                                        {log.time}
                                    </span>
                                </div>
                            ))}

                        </div>
                    </div>

                    {/* RIGHT: CONTROL PANEL */}
                    <div className="space-y-6">

                        {/* BROADCAST PANEL */}
                        <div className="bg-indigo-600 rounded-xl p-5">
                            <h3 className="font-bold">System Broadcast</h3>
                            <p className="text-xs text-indigo-100 mt-1 mb-3">
                                Send message to all roles (Staff + Moderator)
                            </p>

                            <textarea
                                value={broadcast}
                                onChange={(e) => setBroadcast(e.target.value)}
                                className="w-full bg-indigo-700 text-white p-3 rounded-lg text-sm placeholder-indigo-200 focus:outline-none"
                                placeholder="Type announcement..."
                                rows={4}
                            />

                            <button className="w-full mt-3 bg-white text-indigo-600 font-bold py-2 rounded-lg hover:bg-indigo-50 transition">
                                Send Broadcast
                            </button>
                        </div>

                        {/* SYSTEM CONTROLS */}
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                            <h3 className="text-xs uppercase tracking-widest text-slate-500 mb-4">
                                System Controls
                            </h3>

                            <div className="space-y-3">

                                {[
                                    { label: "Staff Access", state: "Enabled" },
                                    { label: "Moderator Access", state: "Enabled" },
                                    { label: "Maintenance Mode", state: "Disabled" },
                                ].map((item, i) => (
                                    <div key={i} className="flex justify-between items-center">
                                        <span className="text-sm text-slate-300">
                                            {item.label}
                                        </span>

                                        <span
                                            className={`text-[10px] px-2 py-1 rounded font-bold ${
                                                item.state === "Enabled"
                                                    ? "bg-emerald-500/20 text-emerald-400"
                                                    : "bg-rose-500/20 text-rose-400"
                                            }`}
                                        >
                                            {item.state}
                                        </span>
                                    </div>
                                ))}

                            </div>
                        </div>

                        {/* EMERGENCY */}
                        <div className="border border-rose-500/30 bg-rose-500/10 rounded-xl p-5">
                            <h3 className="text-rose-400 font-bold text-xs uppercase">
                                Emergency Control
                            </h3>

                            <button className="w-full mt-3 bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 rounded-lg text-xs transition">
                                SHUTDOWN SYSTEM
                            </button>
                        </div>

                    </div>

                </section>
            </main>
        </div>
    );
}