import React, { useEffect, useState } from "react";
import api from "../../../services/api";

export default function AdminHome() {
    const [broadcast, setBroadcast] = useState("");
    const [stats, setStats] = useState(null);
    const [logs, setLogs] = useState([]);
    const [controls, setControls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        Promise.all([
            api.get("/api/admin/stats"),
            api.get("/api/admin/logs"),
            api.get("/api/admin/controls"),
        ])
            .then(([statsData, logsData, controlsData]) => {
                setStats(statsData.data);
                setLogs(logsData.data?.logs ?? logsData.data ?? []);
                setControls(controlsData.data?.controls ?? controlsData.data ?? []);
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    const handleBroadcast = async () => {
        if (!broadcast.trim()) return;
        try {
            await api.post("/api/admin/broadcast", { message: broadcast });
            setBroadcast("");
            alert("Broadcast sent successfully.");
        } catch (err) {
            alert(err.message);
        }
    };

    const toggleControl = async (label, currentState) => {
        const newState = currentState === "Enabled" ? "Disabled" : "Enabled";
        try {
            await api.post("/api/admin/controls/toggle", { label, state: newState });
            setControls((prev) =>
                prev.map((c) =>
                    c.label === label ? { ...c, state: newState } : c
                )
            );
        } catch (err) {
            alert(err.message);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
                <p className="text-slate-400">Loading admin panel...</p>
            </div>
        );
    }

    const statItems = stats
        ? [
              { label: "Users", value: stats.users ?? "—" },
              { label: "Staff Online", value: stats.staffOnline ?? "—" },
              { label: "Pending Requests", value: stats.pendingRequests ?? "—" },
              { label: "System Load", value: stats.systemLoad ?? "—" },
          ]
        : [];

    const logItems = logs.length > 0 ? logs : [];
    const controlItems = controls.length > 0 ? controls : [];

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

            {error && (
                <div className="max-w-7xl mx-auto mt-4 px-6">
                    <div className="p-3 bg-rose-500/20 border border-rose-500/30 rounded-lg text-sm text-rose-400 font-medium">
                        {error}
                    </div>
                </div>
            )}

            <main className="max-w-7xl mx-auto p-6 space-y-8">

                {/* SYSTEM OVERVIEW */}
                <section className="grid grid-cols-1 md:grid-cols-4 gap-4">

                    {statItems.map((stat, i) => (
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
                            {logItems.length > 0 ? (
                                logItems.map((log, i) => (
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
                                ))
                            ) : (
                                <div className="p-6 text-center text-slate-500 text-sm">
                                    No logs available
                                </div>
                            )}
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

                            <button
                                onClick={handleBroadcast}
                                className="w-full mt-3 bg-white text-indigo-600 font-bold py-2 rounded-lg hover:bg-indigo-50 transition"
                            >
                                Send Broadcast
                            </button>
                        </div>

                        {/* SYSTEM CONTROLS */}
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                            <h3 className="text-xs uppercase tracking-widest text-slate-500 mb-4">
                                System Controls
                            </h3>

                            <div className="space-y-3">
                                {controlItems.length > 0 ? (
                                    controlItems.map((item, i) => (
                                        <div key={i} className="flex justify-between items-center">
                                            <span className="text-sm text-slate-300">
                                                {item.label}
                                            </span>

                                            <button
                                                onClick={() => toggleControl(item.label, item.state)}
                                                className={`text-[10px] px-2 py-1 rounded font-bold cursor-pointer hover:opacity-80 ${
                                                    item.state === "Enabled"
                                                        ? "bg-emerald-500/20 text-emerald-400"
                                                        : "bg-rose-500/20 text-rose-400"
                                                }`}
                                            >
                                                {item.state}
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-slate-500">No controls available</p>
                                )}
                            </div>
                        </div>

                        {/* EMERGENCY */}
                        <div className="border border-rose-500/30 bg-rose-500/10 rounded-xl p-5">
                            <h3 className="text-rose-400 font-bold text-xs uppercase">
                                Emergency Control
                            </h3>

                            <button
                                onClick={async () => {
                                    if (window.confirm("Are you sure you want to shutdown the system?")) {
                                        try {
                                            await api.post("/api/admin/shutdown");
                                            alert("System shutdown initiated.");
                                        } catch (err) {
                                            alert(err.message);
                                        }
                                    }
                                }}
                                className="w-full mt-3 bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 rounded-lg text-xs transition"
                            >
                                SHUTDOWN SYSTEM
                            </button>
                        </div>

                    </div>

                </section>
            </main>
        </div>
    );
}
