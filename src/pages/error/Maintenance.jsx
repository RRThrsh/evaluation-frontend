import React from "react";
import { Hammer, RefreshCw, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Maintenance = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden font-sans antialiased">
            
            {/* Background Decorative Element */}
            <div className="absolute inset-0 z-0 opacity-40">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100 blur-3xl"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-100 blur-3xl"></div>
            </div>

            <div className="relative z-10 text-center max-w-lg px-6">
                
                {/* Icon with Animated Pulse */}
                <div className="relative inline-flex items-center justify-center mb-8">
                    <div className="absolute inset-0 bg-blue-600/20 rounded-full animate-ping scale-75"></div>
                    <div className="relative w-20 h-20 bg-blue-600 text-white rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-200">
                        <Hammer size={36} className="animate-pulse" />
                    </div>
                </div>

                {/* Status Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-blue-50 border border-blue-100">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-700">
                        Scheduled Optimization
                    </span>
                </div>

                <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                    Improving the Portal
                </h1>

                <p className="text-slate-600 text-lg leading-relaxed mb-8">
                    The Student Evaluation System is currently undergoing routine maintenance 
                    to improve performance and security. We'll be back online shortly.
                </p>

                {/* Info Box */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-10 shadow-sm">
                    <div className="grid grid-cols-2 divide-x divide-slate-100">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1">Estimated Down-time</p>
                            <p className="font-bold text-slate-800 italic">~ 45 Minutes</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1">Current Status</p>
                            <p className="font-bold text-blue-600">Syncing Data</p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button 
                        onClick={() => window.location.reload()}
                        className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-200"
                    >
                        <RefreshCw size={18} />
                        Refresh Page
                    </button>
                    
                    <Link 
                        to="/"
                        className="w-full sm:w-auto px-8 py-4 bg-white text-slate-600 border border-slate-200 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-all active:scale-95"
                    >
                        <ChevronLeft size={18} />
                        Return Home
                    </Link>
                </div>

                {/* Footer Note */}
                <p className="mt-12 text-sm text-slate-400">
                    Need urgent access? Contact the <a href="mailto:it@university.edu" className="text-blue-500 hover:underline">IT Help Desk</a>.
                </p>
            </div>
        </div>
    );
};

export default Maintenance;