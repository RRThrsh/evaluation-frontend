import React from "react";

export default function AdminHome() {
    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
            {/* Top Admin Bar */}
            <nav className="bg-slate-800 border-b border-slate-700 px-8 py-4 flex justify-between items-center shadow-2xl">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-500 p-1.5 rounded-lg">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <h1 className="text-xl font-black tracking-tighter uppercase italic">Root Console</h1>
                </div>
                <div className="flex items-center gap-6">
                    <div className="hidden md:block text-right">
                        <p className="text-xs text-slate-400 font-mono">Server Status</p>
                        <p className="text-xs text-emerald-400 font-mono font-bold">● OPTIMAL</p>
                    </div>
                    <button className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-md text-xs font-bold transition-all border border-slate-600">
                        System Settings
                    </button>
                </div>
            </nav>

            <main className="p-8 max-w-[1600px] mx-auto">

                {/* Critical Metrics Layer */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {[
                        { label: "Revenue (MTD)", value: "$42,850", trend: "+12.5%", color: "text-emerald-400" },
                        { label: "Active Nodes", value: "18", trend: "Stable", color: "text-indigo-400" },
                        { label: "User Churn", value: "0.8%", trend: "-2.1%", color: "text-rose-400" },
                        { label: "Staff Actions", value: "842", trend: "Normal", color: "text-slate-100" },
                    ].map((stat, i) => (
                        <div key={i} className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 hover:border-indigo-500/50 transition-colors">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</span>
                            <div className="flex items-end justify-between mt-2">
                                <p className={`text-3xl font-mono font-bold ${stat.color}`}>{stat.value}</p>
                                <span className="text-[10px] bg-slate-700 px-2 py-1 rounded text-slate-300 font-mono">{stat.trend}</span>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                    {/* System Performance & Staff Logs */}
                    <div className="xl:col-span-2 space-y-8">
                        <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
                            <div className="p-6 border-b border-slate-700 flex justify-between items-center">
                                <h2 className="font-bold text-lg">Administrative Log</h2>
                                <input 
                                    type="text" 
                                    placeholder="Filter logs..." 
                                    className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-1.5 text-xs focus:outline-none focus:border-indigo-500" 
                                />
                            </div>
                            <div className="p-0">
                                <table className="w-full text-left text-sm font-mono">
                                    <thead className="bg-slate-700/30 text-slate-500 uppercase text-[10px]">
                                        <tr>
                                            <th className="px-6 py-4">Timestamp</th>
                                            <th className="px-6 py-4">Authority</th>
                                            <th className="px-6 py-4">Action</th>
                                            <th className="px-6 py-4">Object</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-700">
                                        {[
                                            { time: "2026-05-14 23:10", auth: "SuperAdmin_01", action: "DATABASE_FLUSH", obj: "Cache_Alpha" },
                                            { time: "2026-05-14 22:45", auth: "Mod_Elena", action: "PERMANENT_BAN", obj: "User_992" },
                                            { time: "2026-05-14 21:00", auth: "Staff_Kevin", action: "ROLE_CHANGE", obj: "User_104" },
                                        ].map((log, i) => (
                                            <tr key={i} className="hover:bg-slate-700/20 transition-colors">
                                                <td className="px-6 py-4 text-slate-500">{log.time}</td>
                                                <td className="px-6 py-4 font-bold text-indigo-400">{log.auth}</td>
                                                <td className="px-6 py-4 text-slate-300">{log.action}</td>
                                                <td className="px-6 py-4 text-slate-500 italic">{log.obj}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                            
                    {/* Quick Controls / Danger Zone */}
                    <div className="space-y-6">
                        <div className="bg-indigo-600 p-6 rounded-2xl shadow-lg shadow-indigo-500/20">
                            <h3 className="font-bold text-lg leading-tight">Global Broadcast</h3>
                            <p className="text-indigo-100 text-xs mt-2 mb-4">Send a system-wide notification to all active sessions.</p>
                            <textarea className="w-full bg-indigo-700 border-none rounded-lg p-3 text-sm text-white placeholder-indigo-300 focus:ring-2 focus:ring-white/20" placeholder="Type message..."></textarea>
                            <button className="mt-3 w-full bg-white text-indigo-600 font-bold py-2 rounded-lg text-sm hover:bg-indigo-50 transition">Transmit</button>
                        </div>
                                        
                        <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl">
                            <h3 className="font-bold text-slate-400 uppercase text-xs tracking-widest mb-4">Critical Toggles</h3>
                            <div className="space-y-4">
                                {[
                                    { label: "New Registrations", status: "ENABLED" },
                                    { label: "Public API Access", status: "ENABLED" },
                                    { label: "Maintenance Mode", status: "DISABLED" },
                                ].map((toggle, i) => (
                                    <div key={i} className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-slate-300">{toggle.label}</span>
                                        <button className={`text-[10px] font-black px-2 py-1 rounded ${
                                            toggle.status === 'ENABLED' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/50' : 'bg-slate-700 text-slate-500 border border-slate-600'
                                        }`}>
                                            {toggle.status}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="bg-rose-500/10 border border-rose-500/20 p-6 rounded-2xl">
                            <h3 className="text-rose-500 font-bold text-sm uppercase">Danger Zone</h3>
                            <button className="mt-4 w-full border border-rose-500/50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all py-2 rounded-lg text-xs font-black">
                                REBOOT PRODUCTION CLUSTER
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}