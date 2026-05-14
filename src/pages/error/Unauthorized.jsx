import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldAlert, Lock, ArrowLeft, LogOut } from "lucide-react";

const Unauthorized = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans antialiased selection:bg-blue-100">

            <main className="flex-grow flex items-center justify-center px-6 py-12 lg:py-20">
                <div className="max-w-lg w-full text-center">
                    
                    {/* Icon Imagery */}
                    <div className="relative mb-10 inline-block">
                        <div className="absolute inset-0 bg-red-100 rounded-[2.5rem] rotate-6 opacity-50"></div>
                        <div className="relative w-24 h-24 bg-white border border-red-100 rounded-[2.5rem] flex items-center justify-center text-red-500 shadow-xl shadow-red-900/5">
                            <Lock size={40} strokeWidth={2.5} />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-red-500 text-white rounded-full border-4 border-white flex items-center justify-center">
                            <ShieldAlert size={20} />
                        </div>
                    </div>

                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-red-50 border border-red-100">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-red-600">
                            Access Restricted: Error 403
                        </span>
                    </div>

                    <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                        Restricted Area
                    </h1>

                    <p className="text-slate-500 text-lg mb-10 leading-relaxed">
                        It looks like you don't have the necessary administrative 
                        clearance to view this resource. This area is reserved for 
                        authorized faculty and system administrators.
                    </p>

                    {/* Action Cards */}
                    <div className="grid gap-4 mb-10">
                        <Link 
                            to="/"
                            className="group flex items-center justify-between p-5 bg-white border border-slate-200 rounded-2xl hover:border-blue-300 hover:shadow-md transition-all text-left"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <ArrowLeft size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">Return to Safety</p>
                                    <p className="text-xs text-slate-500">Go back to your student dashboard</p>
                                </div>
                            </div>
                        </Link>

                        <button 
                            onClick={() => {/* Logic for logout/switch */}}
                            className="group flex items-center justify-between p-5 bg-white border border-slate-200 rounded-2xl hover:border-slate-300 hover:shadow-md transition-all text-left"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-slate-100 text-slate-600 rounded-xl group-hover:bg-slate-800 group-hover:text-white transition-colors">
                                    <LogOut size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">Switch Account</p>
                                    <p className="text-xs text-slate-500">Log in with a different institutional ID</p>
                                </div>
                            </div>
                        </button>
                    </div>

                    {/* Footer Contact */}
                    <p className="text-sm text-slate-400">
                        Think this is a mistake? <Link to="/contact" className="text-blue-600 font-semibold hover:underline">Contact the Registrar</Link>
                    </p>
                </div>
            </main>
        </div>
    );
};

export default Unauthorized;