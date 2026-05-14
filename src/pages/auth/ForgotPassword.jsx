import React from "react";
import { Link } from "react-router-dom";
import { KeyRound, ArrowLeft, Mail } from "lucide-react";

const ForgotPassword = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans antialiased selection:bg-blue-100 px-6">
            
            {/* Soft background glow for focus */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-100/50 blur-[120px] rounded-full" />
            </div>

            <div className="relative z-10 w-full max-w-md bg-white rounded-[2rem] shadow-2xl shadow-blue-900/5 border border-slate-100 p-8 lg:p-10">
                
                {/* Visual Anchor */}
                <div className="flex justify-center mb-8">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
                        <KeyRound size={32} />
                    </div>
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
                        Forgot Password?
                    </h1>
                    <p className="text-slate-500 text-sm leading-relaxed">
                        No worries, it happens. Enter your institutional email and we'll send you a recovery link.
                    </p>
                </div>

                {/* Form */}
                <form className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">
                            Academic Email
                        </label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                <Mail size={18} />
                            </div>
                            <input
                                type="email"
                                required
                                placeholder="name@university.edu"
                                className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 active:scale-[0.98] transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2"
                    >
                        Send Reset Link
                    </button>
                </form>

                {/* Back to login */}
                <div className="mt-8 pt-6 border-t border-slate-50">
                    <Link
                        to="/login"
                        className="flex items-center justify-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Login
                    </Link>
                </div>
            </div>
            
            {/* Simple Help Text */}
            <p className="absolute bottom-8 text-xs text-slate-400">
                Having trouble? Contact <a href="#" className="underline">IT Support</a>
            </p>
        </div>
    );
};

export default ForgotPassword;