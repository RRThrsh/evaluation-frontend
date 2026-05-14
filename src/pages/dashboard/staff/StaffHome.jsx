import React from "react";

export default function StaffHome() {
    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Main Content Area */}
            <main className="flex-1 p-8">

                {/* Header with Greeting & Date */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 border-b border-slate-200 pb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Staff Control Panel</h1>
                        <p className="text-slate-500">System Overview & Management</p>
                    </div>
                    <div className="mt-4 md:mt-0 flex gap-3">
                        <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition">
                            View Logs
                        </button>
                        <button className="px-4 py-2 bg-indigo-600 rounded-lg text-sm font-medium text-white hover:bg-indigo-700 transition shadow-sm">
                            + New Entry
                        </button>
                    </div>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
                    {[
                        { label: 'Pending Tasks', value: '24', color: 'text-amber-600' },
                        { label: 'Active Users', value: '1,204', color: 'text-indigo-600' },
                        { label: 'System Health', value: '99.9%', color: 'text-emerald-600' },
                        { label: 'Reports Due', value: '3', color: 'text-rose-600' },
                    ].map((stat, idx) => (
                        <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                            <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
                        </div>
                    ))}
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Activity Table (UX: Shows staff what happened while they were away) */}
                    <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="font-semibold text-slate-700">Recent System Activity</h2>
                            <a href="#" className="text-xs text-indigo-600 hover:underline">View All</a>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                                    <tr>
                                        <th className="px-6 py-3">User</th>
                                        <th className="px-6 py-3">Action</th>
                                        <th className="px-6 py-3">Time</th>
                                        <th className="px-6 py-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm divide-y divide-slate-100">
                                    {[
                                        { user: "Admin_Sarah", action: "Updated Database", time: "2m ago", status: "Success" },
                                        { user: "Staff_Mike", action: "Generated Payroll", time: "15m ago", status: "Success" },
                                        { user: "System", action: "Backup Created", time: "1h ago", status: "Processing" },
                                    ].map((row, i) => (
                                        <tr key={i} className="hover:bg-slate-50 transition">
                                            <td className="px-6 py-4 font-medium text-slate-700">{row.user}</td>
                                            <td className="px-6 py-4 text-slate-600">{row.action}</td>
                                            <td className="px-6 py-4 text-slate-400">{row.time}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                                                    row.status === 'Success' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                    {row.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                        
                  {/* Support/Internal Announcements (UX: Keeps staff informed) */}
                    <div className="space-y-6">
                        <div className="bg-indigo-900 text-white p-6 rounded-xl shadow-md">
                            <h3 className="font-bold text-lg mb-2">Staff Notice</h3>
                            <p className="text-indigo-200 text-sm leading-relaxed">
                                System maintenance scheduled for Saturday at 2:00 AM. Please ensure all active sessions are closed.
                            </p>
                            <button className="mt-4 text-xs font-bold bg-indigo-700 hover:bg-indigo-600 px-3 py-2 rounded transition">
                                Read Details
                            </button>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="font-semibold text-slate-700 mb-4">Quick Shortcuts</h3>
                            <ul className="space-y-3">
                                {['User Management', 'Inventory Settings', 'Billing Portal', 'API Access'].map((link) => (
                                    <li key={link}>
                                        <button className="w-full text-left text-sm text-slate-600 hover:text-indigo-600 flex justify-between group">
                                            {link}
                                            <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}