import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { MoveLeft, Home, Search, LifeBuoy } from "lucide-react";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col bg-white font-sans antialiased">
            {/* Main Content Area */}
            <main className="flex-grow flex items-center justify-center relative overflow-hidden px-6 py-20">
                
                {/* Decorative background "404" */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                    <span className="text-[20rem] lg:text-[30rem] font-black text-slate-50/50 leading-none">
                        404
                    </span>
                </div>

                <div className="relative z-10 text-center max-w-2xl">
                    
                    {/* Status Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full bg-red-50 border border-red-100">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-red-600">
                            Error: Destination Unreachable
                        </span>
                    </div>

                    <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
                        Lost in the system?
                    </h1>
                    
                    <p className="text-slate-500 text-lg lg:text-xl mb-10 leading-relaxed">
                        The page you’re looking for might have been moved, renamed, or 
                        perhaps it never existed in this academic term.
                    </p>

                    {/* Primary Actions */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                        <button 
                            onClick={() => navigate(-1)}
                            className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 border border-slate-200 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 shadow-sm"
                        >
                            <MoveLeft size={18} />
                            Go Back
                        </button>
                        
                        <Link 
                            to="/"
                            className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-all active:scale-95 shadow-xl shadow-blue-200"
                        >
                            <Home size={18} />
                            Return to Dashboard
                        </Link>
                    </div>

                    {/* Quick Help Links */}
                    <div className="pt-10 border-t border-slate-100">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 text-center">
                            Or try one of these resources
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <Link to="/grades" className="flex flex-col items-center p-4 rounded-2xl bg-slate-50 hover:bg-blue-50 hover:text-blue-600 transition-colors group">
                                <div className="p-3 bg-white rounded-xl shadow-sm mb-3 group-hover:text-blue-600">
                                    <Search size={20} />
                                </div>
                                <span className="text-sm font-bold text-slate-700 group-hover:text-blue-600">Find Grades</span>
                            </Link>

                            <Link to="/about" className="flex flex-col items-center p-4 rounded-2xl bg-slate-50 hover:bg-blue-50 hover:text-blue-600 transition-colors group">
                                <div className="p-3 bg-white rounded-xl shadow-sm mb-3 group-hover:text-blue-600">
                                    <Search size={20} />
                                </div>
                                <span className="text-sm font-bold text-slate-700 group-hover:text-blue-600">System Info</span>
                            </Link>

                            <Link to="/contact" className="flex flex-col items-center p-4 rounded-2xl bg-slate-50 hover:bg-blue-50 hover:text-blue-600 transition-colors group">
                                <div className="p-3 bg-white rounded-xl shadow-sm mb-3 group-hover:text-blue-600">
                                    <LifeBuoy size={20} />
                                </div>
                                <span className="text-sm font-bold text-slate-700 group-hover:text-blue-600">Contact Support</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default NotFound;