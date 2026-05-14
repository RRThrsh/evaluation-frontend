import React from "react";

export default function ModeratorHome() {
    return (
        <div className="min-h-screen bg-zinc-50 text-zinc-900">
            {/* Top Navigation Bar (Internal) */}
            <nav className="bg-white border-b border-zinc-200 px-6 py-3 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-rose-500 animate-pulse rounded-full"></div>
                    <span className="font-bold tracking-tight text-zinc-700">MODERATOR SHIFT</span>
                </div>
                <div className="flex items-center gap-4 text-sm font-medium text-zinc-500">
                    <span>Queue: 14 Pending</span>
                    <span className="h-4 w-px bg-zinc-300"></span>
                    <span>Reports: 3 Urgent</span>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto p-6 lg:p-10">

                {/* Urgent Alerts Section */}
                <div className="mb-8 flex gap-4 overflow-x-auto pb-2">
                    <div className="flex-none w-full md:w-auto bg-rose-50 border border-rose-200 p-4 rounded-xl flex items-center gap-4">
                        <div className="bg-rose-500 text-white p-2 rounded-lg">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        </div>
                        <div>
                            <h4 className="text-rose-800 font-bold text-sm">High Priority Report</h4>
                            <p className="text-rose-700 text-xs">Spam attack detected in "General Discussion"</p>
                        </div>
                        <button className="ml-4 bg-rose-600 text-white px-3 py-1.5 rounded-md text-xs font-bold hover:bg-rose-700 transition">Jump to Thread</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                    {/* Sidebar Tools */}
                    <div className="lg:col-span-1 space-y-6">
                        <section>
                            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4">Quick Filters</h3>
                            <div className="space-y-1">
                                {['All Reports', 'Hate Speech', 'Spam/Bot', 'Harassment', 'Resolved'].map((filter) => (
                                    <button key={filter} className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-zinc-600 hover:bg-zinc-200 transition">
                                        {filter}
                                    </button>
                                ))}
                            </div>
                        </section>
                        
                        <section className="bg-zinc-900 rounded-xl p-5 text-white">
                            <h3 className="text-xs font-bold text-zinc-400 uppercase mb-3">Mod Guidelines</h3>
                            <p className="text-xs leading-relaxed text-zinc-300">Remember: 3-strike rule applies to all spam accounts. Escalations go to Admin.</p>
                        </section>
                    </div>
                        
                    {/* Active Moderation Queue */}
                    <div className="lg:col-span-3">
                        <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                                <h2 className="font-bold text-zinc-800">Review Queue</h2>
                                <span className="text-xs text-zinc-500 italic">Last updated: Just now</span>
                            </div>

                            <div className="divide-y divide-zinc-100">
                                {[1, 2, 3].map((item) => (
                                    <div key={item} className="p-6 hover:bg-zinc-50 transition flex flex-col md:flex-row gap-6">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded text-[10px] font-bold">USER_ID_882</span>
                                                <span className="text-xs text-zinc-400">Flagged 12m ago</span>
                                            </div>
                                            <p className="text-sm text-zinc-800 leading-relaxed mb-3">
                                                "This is a placeholder for a reported comment or post content that violates community guidelines..."
                                            </p>
                                            <div className="flex gap-2">
                                                <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded font-bold uppercase">Potential Toxicity</span>
                                            </div>
                                        </div>
                                        <div className="flex md:flex-col gap-2 justify-center">
                                            <button className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition">Approve</button>
                                            <button className="flex-1 px-4 py-2 bg-zinc-100 text-zinc-700 rounded-lg text-xs font-bold hover:bg-zinc-200 transition">Remove</button>
                                            <button className="flex-1 px-4 py-2 bg-rose-100 text-rose-600 rounded-lg text-xs font-bold hover:bg-rose-200 transition">Ban User</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                </div>
            </main>
        </div>
    );
}